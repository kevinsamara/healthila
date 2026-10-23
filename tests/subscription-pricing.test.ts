import { describe, expect, it } from "vitest";
import { DEFAULT_TIERS, deliveryDatesFor, type Flavor, formatIDR, isoWeekday, packageLabel, quoteSubscription, roundToThousand, tierRate } from "@/lib/subscription-pricing";

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

const base = {
  people: 1,
  bottlesPerDay: 1,
  days: 5,
  everyDays: 1,
  category: "cold_pressed",
  flavors: FLAVORS,
  shippingPerDelivery: 10000 as number | null,
  startDate: "2026-11-02",
};

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
    const q = quoteSubscription({ ...base, picks: { beet: 5 } });
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
    const q = quoteSubscription({ ...base, days: 10, picks: { glow: 3, minty: 4, pear: 3 } });
    expect(q.totalBottles).toBe(10);
    expect(q.subtotal).toBe(310000);
    expect(q.rate).toBe(0.05);
    expect(q.discountAmount).toBe(15500);
    expect(q.productTotal).toBe(295000);
    expect(q.savings).toBe(15000);
  });

  it("recalculates when the selection changes", () => {
    const a = quoteSubscription({ ...base, picks: { minty: 5 } });
    const b = quoteSubscription({ ...base, picks: { minty: 4, glow: 1 } });
    expect(a.subtotal).toBe(125000);
    expect(b.subtotal).toBe(140000);
  });
});

describe("people × bottles per day × days", () => {
  it("2 people × 2 bottles × 7 days = 28 bottles (7%)", () => {
    const q = quoteSubscription({ ...base, people: 2, bottlesPerDay: 2, days: 7, picks: { beet: 14, apple: 14 } });
    expect(q.totalBottles).toBe(28);
    expect(q.subtotal).toBe(14 * 35000 + 14 * 30000);
    expect(q.rate).toBe(0.07);
    expect(q.errors).toEqual([]);
  });

  it("3 people × 3 bottles × 30 days = 270 bottles (8%)", () => {
    const q = quoteSubscription({ ...base, people: 3, bottlesPerDay: 3, days: 30, everyDays: 3, picks: { citrus: 270 } });
    expect(q.totalBottles).toBe(270);
    expect(q.rate).toBe(0.08);
    expect(q.productTotal).toBe(roundToThousand(270 * 35000 * 0.92));
  });

  it("rejects a selection that doesn't match the total", () => {
    expect(quoteSubscription({ ...base, picks: { beet: 4 } }).errors.join()).toMatch(/kurang 1 botol/);
    expect(quoteSubscription({ ...base, picks: { beet: 6 } }).errors.join()).toMatch(/Kelebihan 1 botol/);
  });

  it("rejects invalid bottles per day", () => {
    expect(quoteSubscription({ ...base, bottlesPerDay: 4, picks: { beet: 20 } }).errors.length).toBeGreaterThan(0);
  });
});

describe("delivery reconciliation", () => {
  it("daily: one delivery per day, bottles add up", () => {
    const q = quoteSubscription({ ...base, people: 2, days: 5, everyDays: 1, picks: { beet: 5, minty: 5 } });
    expect(q.deliveries).toBe(5);
    expect(q.shipments.map((s) => s.bottles)).toEqual([2, 2, 2, 2, 2]);
    expect(q.shipments.map((s) => s.date)).toEqual(["2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06"]);
    expect(q.shipments.reduce((n, s) => n + s.bottles, 0)).toBe(q.totalBottles);
  });

  it("every 3 days over 7 days: 3 + 3 + 1 days", () => {
    const q = quoteSubscription({ ...base, days: 7, everyDays: 3, picks: { glow: 7 } });
    expect(q.deliveries).toBe(3);
    expect(q.shipments.map((s) => [s.days, s.bottles])).toEqual([
      [3, 3],
      [3, 3],
      [1, 1],
    ]);
    expect(q.shipments.map((s) => s.date)).toEqual(["2026-11-02", "2026-11-05", "2026-11-08"]);
  });

  it("mixes flavours across deliveries and keeps every flavour count", () => {
    const q = quoteSubscription({ ...base, people: 1, bottlesPerDay: 2, days: 3, everyDays: 1, picks: { beet: 3, minty: 3 } });
    for (const s of q.shipments) expect(s.items.map((i) => i.id).sort()).toEqual(["beet", "minty"]);
    const total = (id: string) => q.shipments.flatMap((s) => s.items).filter((i) => i.id === id).reduce((n, i) => n + i.qty, 0);
    expect(total("beet")).toBe(3);
    expect(total("minty")).toBe(3);
  });

  it("product total split over deliveries adds back up exactly", () => {
    const q = quoteSubscription({ ...base, days: 7, everyDays: 3, picks: { glow: 3, minty: 4 } });
    expect(q.shipments.reduce((n, s) => n + s.productTotal, 0)).toBe(q.productTotal);
  });

  it("blocks schedules longer than the configured shelf life", () => {
    const q = quoteSubscription({ ...base, days: 7, everyDays: 7, shelfLifeDays: 3, picks: { beet: 7 } });
    expect(q.errors.join()).toMatch(/umur simpan/);
  });

  it("no shelf-life limit when not configured", () => {
    expect(quoteSubscription({ ...base, days: 7, everyDays: 7, picks: { beet: 7 } }).errors).toEqual([]);
  });
});

describe("shipping", () => {
  it("is charged per delivery and never discounted", () => {
    const q = quoteSubscription({ ...base, days: 7, everyDays: 3, shippingPerDelivery: 12000, picks: { beet: 7 } });
    expect(q.shippingTotal).toBe(36000);
    expect(q.payable).toBe(q.productTotal + 36000);
  });

  it("unknown shipping is reported as null, payable is the product total", () => {
    const q = quoteSubscription({ ...base, shippingPerDelivery: null, picks: { beet: 5 } });
    expect(q.shippingTotal).toBeNull();
    expect(q.payable).toBe(q.productTotal);
  });
});

describe("empty and unavailable selections", () => {
  it("empty selection", () => {
    const q = quoteSubscription({ ...base, picks: {} });
    expect(q.errors.join()).toMatch(/Pilih rasa/);
    expect(q.subtotal).toBe(0);
    expect(q.shipments).toEqual([]);
  });

  it("out-of-stock flavour asks for a replacement", () => {
    const flavors = FLAVORS.map((f) => (f.id === "glow" ? { ...f, available: false } : f));
    expect(quoteSubscription({ ...base, flavors, picks: { glow: 5 } }).errors.join()).toMatch(/Ever Glow sedang tidak tersedia/);
  });

  it("flavour that disappeared from the list", () => {
    expect(quoteSubscription({ ...base, picks: { gone: 5 } }).errors.join()).toMatch(/pilih pengganti/);
  });

  it("flavour from the other category", () => {
    expect(quoteSubscription({ ...base, picks: { mango: 5 } }).errors.join()).toMatch(/bukan bagian dari kategori/);
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

describe("parity with the database quote (private.sub_tier_quote, migration 0119)", () => {
  it("2 people × 1 bottle × 7 days, every 3 days — same split as the SQL result", () => {
    // Values observed from the RPC in a rolled-back transaction.
    const q = quoteSubscription({ ...base, people: 2, days: 7, everyDays: 3, shippingPerDelivery: 12000, picks: { minty: 7, beet: 7 } });
    expect(q.errors).toEqual([]);
    expect(q.subtotal).toBe(420000);
    expect(q.rate).toBe(0.05);
    expect(q.productTotal).toBe(399000);
    expect(q.shipments.map((s) => s.bottles)).toEqual([6, 6, 2]);
    expect(q.shipments.map((s) => s.productTotal)).toEqual([171000, 171000, 57000]);
    expect(q.shipments.map((s) => s.date)).toEqual(["2026-11-02", "2026-11-05", "2026-11-08"]);
    expect(q.shippingTotal).toBe(36000);
    expect(q.payable).toBe(435000);
  });
});

describe("buyer-chosen delivery dates", () => {
  const juice = { ...base, people: 2, days: 7, everyDays: 1, shippingPerDelivery: 12000, picks: { minty: 7, beet: 7 }, startDate: "2026-10-26" };

  it("2× seminggu (Senin & Kamis) — each delivery covers the days until the next (parity with SQL)", () => {
    const dates = deliveryDatesFor("2x_week", "2026-10-26", 7, { weekdays: [1, 4] });
    expect(dates).toEqual(["2026-10-26", "2026-10-29"]);
    const q = quoteSubscription({ ...juice, deliveryDates: dates });
    expect(q.errors).toEqual([]);
    expect(q.shipments.map((s) => [s.days, s.bottles])).toEqual([[3, 6], [4, 8]]);
    expect(q.shipments.map((s) => s.productTotal)).toEqual([171000, 228000]);
    expect(q.deliveries).toBe(2);
    expect(q.shippingTotal).toBe(24000);
    expect(q.payable).toBe(399000 + 24000);
  });

  it("pricing does not depend on the schedule", () => {
    const a = quoteSubscription({ ...juice, deliveryDates: deliveryDatesFor("daily", "2026-10-26", 7) });
    const b = quoteSubscription({ ...juice, deliveryDates: deliveryDatesFor("once", "2026-10-26", 7) });
    expect(a.productTotal).toBe(b.productTotal);
    expect(a.deliveries).toBe(7);
    expect(b.deliveries).toBe(1);
    expect(a.shipments.reduce((n, s) => n + s.bottles, 0)).toBe(14);
  });

  it("N× seminggu starts on the first chosen weekday", () => {
    // 2026-10-27 is a Tuesday → first Thursday 29th, then Monday 2nd …
    expect(deliveryDatesFor("2x_week", "2026-10-27", 7, { weekdays: [1, 4] })).toEqual(["2026-10-29", "2026-11-02"]);
    expect(deliveryDatesFor("3x_week", "2026-10-26", 14).length).toBe(6);
    expect(deliveryDatesFor("weekly", "2026-10-26", 30)).toEqual(["2026-10-26", "2026-11-02", "2026-11-09", "2026-11-16", "2026-11-23"]);
    expect(deliveryDatesFor("biweekly", "2026-10-26", 30)).toEqual(["2026-10-26", "2026-11-09", "2026-11-23"]);
    expect(isoWeekday("2026-10-26")).toBe(1);
  });

  it("custom dates always include the start and stay inside the period", () => {
    expect(deliveryDatesFor("custom", "2026-10-26", 7, { custom: ["2026-11-10", "2026-10-28", "2026-10-25"] })).toEqual(["2026-10-26", "2026-10-28"]);
  });

  it("rejects dates that don't fit the subscription", () => {
    expect(quoteSubscription({ ...juice, deliveryDates: ["2026-10-27"] }).errors).toContain("Pengiriman pertama harus di tanggal mulai langganan.");
    expect(quoteSubscription({ ...juice, deliveryDates: ["2026-10-26", "2026-11-02"] }).errors).toContain("Ada tanggal kirim di luar masa langganan.");
    expect(quoteSubscription({ ...juice, deliveryDates: ["2026-10-26", "2026-10-26"] }).errors).toContain("Tanggal kirim tidak valid.");
  });

  it("shelf life limits the gap between deliveries", () => {
    const q = quoteSubscription({ ...juice, shelfLifeDays: 3, deliveryDates: ["2026-10-26", "2026-10-29"] });
    expect(q.errors.some((e) => e.includes("maksimal untuk 3 hari"))).toBe(true);
    expect(quoteSubscription({ ...juice, shelfLifeDays: 4, deliveryDates: ["2026-10-26", "2026-10-29"] }).errors).toEqual([]);
  });
});
