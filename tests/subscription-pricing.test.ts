import { describe, expect, it } from "vitest";
import {
  DEFAULT_TIERS,
  deliveryDatesFor,
  durationLabel,
  type Flavor,
  formatIDR,
  type Frequency,
  isoWeekday,
  packageLabel,
  quoteSubscription,
  type QuoteInput,
  roundToThousand,
  tierRate,
} from "@/lib/subscription-pricing";

// Retail prices from the owner's spec (same as the catalog).
const CP = (id: string, name: string, price: number, available = true): Flavor => ({ id, name, price, category: "cold_pressed", available });
const RJ = (id: string, name: string, price: number, available = true): Flavor => ({ id, name, price, category: "regular", available });
const FLAVORS: Flavor[] = [
  CP("beet", "Energy Beet", 35000),
  CP("glow", "Ever Glow", 40000),
  CP("pear", "Fiber Pear", 30000),
  CP("minty", "Minty Red", 25000),
  CP("citrus", "Power Citrus", 35000),
  CP("apple", "Revive Apple", 30000),
  CP("mato", "Vito Mato", 35000),
  CP("zesty", "Zesty Fresh", 35000),
  RJ("avo", "Avo Glow", 50000),
  RJ("thrombo", "Thromboost", 55000),
  RJ("mango", "Mango Tango", 55000),
];

const START = "2026-11-02"; // a Monday

/** Quote with dates generated from a frequency (default: daily). */
function quote(o: Partial<Omit<QuoteInput, "deliveryDates">> & { freq?: Frequency; weekdays?: number[]; deliveryDates?: string[] } = {}) {
  const { freq = "daily", weekdays, ...rest } = o;
  const days = rest.days ?? 5;
  const startDate = rest.startDate ?? START;
  return quoteSubscription({
    people: 1,
    bottlesPerDelivery: 1,
    category: "cold_pressed",
    flavors: FLAVORS,
    shippingPerDelivery: 10000,
    picks: {},
    ...rest,
    days,
    startDate,
    deliveryDates: rest.deliveryDates ?? deliveryDatesFor(freq, startDate, days, { weekdays }),
  });
}

describe("tierRate — every threshold", () => {
  it.each([
    [0, 0],
    [1, 0],
    [4, 0],
    [5, 0.03],
    [9, 0.03],
    [10, 0.05],
    [19, 0.05],
    [20, 0.07],
    [29, 0.07],
    [30, 0.08],
    [90, 0.08],
  ])("%i bottles → %f", (bottles, rate) => {
    expect(tierRate(bottles, DEFAULT_TIERS)).toBe(rate);
  });
});

describe("rounding to the nearest Rp1.000", () => {
  it.each([
    [169750, 170000],
    [169499, 169000],
    [169500, 170000],
    [100000, 100000],
  ])("%i → %i", (n, r) => expect(roundToThousand(n)).toBe(r));

  it("rounds the discounted product total, savings follow the rounded total", () => {
    // 5 × Energy Beet = 175.000; 3% = 5.250 → 169.750 → 170.000
    const q = quote({ picks: { beet: 5 } });
    expect(q.subtotal).toBe(175000);
    expect(q.rate).toBe(0.03);
    expect(q.discountAmount).toBe(5250);
    expect(q.productTotal).toBe(170000);
    expect(q.savings).toBe(5000);
    expect(q.errors).toEqual([]);
  });
});

describe("mixed flavours use each product's own price", () => {
  it("sums real retail prices, never an average", () => {
    // 10 bottles: 3 Ever Glow (120k) + 4 Minty Red (100k) + 3 Fiber Pear (90k) = 310k; 5% → 294.5k → 295k (round half up)
    const q = quote({ days: 10, picks: { glow: 3, minty: 4, pear: 3 } });
    expect(q.totalBottles).toBe(10);
    expect(q.subtotal).toBe(310000);
    expect(q.rate).toBe(0.05);
    expect(q.discountAmount).toBe(15500);
    expect(q.productTotal).toBe(295000);
    expect(q.savings).toBe(15000);
  });

  it("recalculates when the selection changes", () => {
    const a = quote({ picks: { minty: 5 } });
    const b = quote({ picks: { minty: 4, glow: 1 } });
    expect(a.subtotal).toBe(125000);
    expect(b.subtotal).toBe(140000);
  });
});

describe("people × bottles per delivery × deliveries", () => {
  it("owner's example: 2 people × 2 bottles × 2× a week × 1 month = 32 bottles (8 per week)", () => {
    const dates = deliveryDatesFor("2x_week", START, 28);
    expect(dates.length).toBe(8);
    const q = quote({ people: 2, bottlesPerDelivery: 2, days: 28, freq: "2x_week", picks: { beet: 16, apple: 16 } });
    expect(q.totalBottles).toBe(32);
    expect(q.deliveries).toBe(8);
    expect(q.shipments.every((s) => s.bottles === 4)).toBe(true);
    expect(q.subtotal).toBe(16 * 35000 + 16 * 30000);
    expect(q.rate).toBe(0.08);
    expect(q.productTotal).toBe(roundToThousand(1040000 * 0.92));
    expect(q.errors).toEqual([]);
  });

  it("1 person × 1 bottle × daily × 1 week = 7 bottles (3%)", () => {
    const q = quote({ days: 7, picks: { beet: 7 } });
    expect(q.totalBottles).toBe(7);
    expect(q.rate).toBe(0.03);
  });

  it("3 people × 3 bottles × 3× a week × 3 months = 324 bottles (8%)", () => {
    const q = quote({ people: 3, bottlesPerDelivery: 3, days: 84, freq: "3x_week", picks: { citrus: 324 } });
    expect(q.deliveries).toBe(36);
    expect(q.totalBottles).toBe(324);
    expect(q.rate).toBe(0.08);
    expect(q.productTotal).toBe(roundToThousand(324 * 35000 * 0.92));
  });

  it("rejects a selection that doesn't match the total", () => {
    expect(quote({ picks: { beet: 4 } }).errors.join()).toMatch(/kurang 1 botol/);
    expect(quote({ picks: { beet: 6 } }).errors.join()).toMatch(/Kelebihan 1 botol/);
  });

  it("rejects invalid bottles per delivery", () => {
    expect(quote({ bottlesPerDelivery: 4, picks: { beet: 20 } }).errors.length).toBeGreaterThan(0);
  });
});

describe("delivery schedule", () => {
  it("daily: one delivery per day, bottles add up", () => {
    const q = quote({ people: 2, days: 5, picks: { beet: 5, minty: 5 } });
    expect(q.deliveries).toBe(5);
    expect(q.shipments.map((s) => s.bottles)).toEqual([2, 2, 2, 2, 2]);
    expect(q.shipments.map((s) => s.date)).toEqual(["2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06"]);
    expect(q.shipments.reduce((n, s) => n + s.bottles, 0)).toBe(q.totalBottles);
  });

  it("frequencies over 1 month (28 days)", () => {
    expect(deliveryDatesFor("daily", START, 28).length).toBe(28);
    expect(deliveryDatesFor("4x_week", START, 28).length).toBe(16);
    expect(deliveryDatesFor("3x_week", START, 28).length).toBe(12);
    expect(deliveryDatesFor("2x_week", START, 28).length).toBe(8);
    expect(deliveryDatesFor("weekly", START, 28)).toEqual(["2026-11-02", "2026-11-09", "2026-11-16", "2026-11-23"]);
    expect(deliveryDatesFor("biweekly", START, 28)).toEqual(["2026-11-02", "2026-11-16"]);
  });

  it("N× seminggu starts on the first chosen weekday", () => {
    // 2026-11-03 is a Tuesday → first Thursday 5th, then Monday 9th …
    expect(deliveryDatesFor("2x_week", "2026-11-03", 7, { weekdays: [1, 4] })).toEqual(["2026-11-05", "2026-11-09"]);
    expect(isoWeekday(START)).toBe(1);
  });

  it("custom dates always include the start and stay inside the period", () => {
    expect(deliveryDatesFor("custom", START, 7, { custom: ["2026-11-20", "2026-11-04", "2026-11-01"] })).toEqual(["2026-11-02", "2026-11-04"]);
    const q = quote({ people: 2, days: 7, freq: "custom", deliveryDates: ["2026-11-02", "2026-11-04"], picks: { beet: 4 } });
    expect(q.totalBottles).toBe(4);
    expect(q.errors).toEqual([]);
  });

  it("rejects dates that don't fit the subscription", () => {
    expect(quote({ days: 7, deliveryDates: ["2026-11-03"], picks: { beet: 1 } }).errors).toContain("Pengiriman pertama harus di tanggal mulai langganan.");
    expect(quote({ days: 7, deliveryDates: ["2026-11-02", "2026-11-09"], picks: { beet: 2 } }).errors).toContain("Ada tanggal kirim di luar masa langganan.");
    expect(quote({ days: 7, deliveryDates: ["2026-11-02", "2026-11-02"], picks: { beet: 2 } }).errors).toContain("Tanggal kirim tidak valid.");
    expect(quote({ days: 7, deliveryDates: [], picks: { beet: 2 } }).errors).toContain("Pilih tanggal kirim.");
  });

  it("mixes flavours across deliveries and keeps every flavour count", () => {
    const q = quote({ bottlesPerDelivery: 2, days: 3, picks: { beet: 3, minty: 3 } });
    for (const s of q.shipments) expect(s.items.map((i) => i.id).sort()).toEqual(["beet", "minty"]);
    const total = (id: string) => q.shipments.flatMap((s) => s.items).filter((i) => i.id === id).reduce((n, i) => n + i.qty, 0);
    expect(total("beet")).toBe(3);
    expect(total("minty")).toBe(3);
  });

  it("product total split over deliveries adds back up exactly", () => {
    const q = quote({ days: 7, picks: { glow: 3, minty: 4 } });
    expect(q.shipments.reduce((n, s) => n + s.productTotal, 0)).toBe(q.productTotal);
  });

  it("pricing depends only on the bottles, not on how they are spread", () => {
    const a = quote({ days: 28, freq: "weekly", bottlesPerDelivery: 2, picks: { beet: 8 } });
    const b = quote({ days: 28, freq: "2x_week", bottlesPerDelivery: 1, picks: { beet: 8 } });
    expect(a.productTotal).toBe(b.productTotal);
    expect(a.deliveries).toBe(4);
    expect(b.deliveries).toBe(8);
  });
});

describe("shipping", () => {
  it("is charged per delivery and never discounted", () => {
    const q = quote({ days: 28, freq: "weekly", shippingPerDelivery: 12000, picks: { beet: 4 } });
    expect(q.shippingTotal).toBe(48000);
    expect(q.payable).toBe(q.productTotal + 48000);
  });

  it("unknown shipping is reported as null, payable is the product total", () => {
    const q = quote({ shippingPerDelivery: null, picks: { beet: 5 } });
    expect(q.shippingTotal).toBeNull();
    expect(q.payable).toBe(q.productTotal);
  });
});

describe("empty and unavailable selections", () => {
  it("empty selection", () => {
    const q = quote({ picks: {} });
    expect(q.errors.join()).toMatch(/Pilih rasa/);
    expect(q.subtotal).toBe(0);
    expect(q.shipments).toEqual([]);
  });

  it("out-of-stock flavour asks for a replacement", () => {
    const flavors = FLAVORS.map((f) => (f.id === "glow" ? { ...f, available: false } : f));
    expect(quote({ flavors, picks: { glow: 5 } }).errors.join()).toMatch(/Ever Glow sedang tidak tersedia/);
  });

  it("flavour that disappeared from the list", () => {
    expect(quote({ picks: { gone: 5 } }).errors.join()).toMatch(/pilih pengganti/);
  });

  it("flavour from the other category", () => {
    expect(quote({ picks: { mango: 5 } }).errors.join()).toMatch(/bukan bagian dari kategori/);
  });
});

describe("labels & formatting", () => {
  it("package label is only a suggestion", () => {
    expect(packageLabel(1, 1)).toBe("Daily Personal");
    expect(packageLabel(2, 1)).toBe("Duo Routine");
    expect(packageLabel(4, 1)).toBe("Family Fresh");
    expect(packageLabel(1, 2)).toBe("Power Routine");
  });

  it("formats Rupiah with id-ID", () => {
    expect(formatIDR(170000).replace(/\s/g, " ")).toBe("Rp 170.000");
  });
});

describe("labels & formatting", () => {
  it("package label is only a suggestion", () => {
    expect(packageLabel(1, 1)).toBe("Daily Personal");
    expect(packageLabel(2, 1)).toBe("Duo Routine");
    expect(packageLabel(4, 1)).toBe("Family Fresh");
    expect(packageLabel(1, 2)).toBe("Power Routine");
  });

  it("durations in weeks / months", () => {
    expect([7, 14, 28, 56, 84].map(durationLabel)).toEqual(["1 minggu", "2 minggu", "1 bulan", "2 bulan", "3 bulan"]);
    expect(durationLabel(5)).toBe("5 hari");
  });

  it("formats Rupiah with id-ID", () => {
    expect(formatIDR(170000).replace(/\s/g, " ")).toBe("Rp 170.000");
  });
});

describe("parity with the database quote (private.sub_tier_quote, migration 0121)", () => {
  it("2 people × 2 bottles, 2× a week (Mon & Thu), 1 month — same as the SQL result", () => {
    const q = quote({ people: 2, bottlesPerDelivery: 2, days: 28, freq: "2x_week", shippingPerDelivery: 12000, picks: { minty: 16, beet: 16 } });
    expect(q.errors).toEqual([]);
    expect(q.totalBottles).toBe(32);
    expect(q.subtotal).toBe(960000);
    expect(q.rate).toBe(0.08);
    expect(q.productTotal).toBe(883000);
    expect(q.shipments.map((s) => s.productTotal)).toEqual(Array(8).fill(110375));
    expect(q.shippingTotal).toBe(96000);
    expect(q.payable).toBe(979000);
  });
});
