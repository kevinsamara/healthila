/**
 * Juice subscription pricing — the single source of truth for the website
 * (UI + server action). Healthila OS re-checks the same rules in SQL
 * (private.sub_tier_quote, migrations 0119–0121); keep both in step.
 *
 * Rules (owner's spec, Oct 2026; per-delivery counting confirmed by the owner):
 *  - total bottles = people × bottles per person per delivery × deliveries
 *    (e.g. 2 people × 2 bottles × 2× a week × 4 weeks = 32 bottles)
 *  - product subtotal = Σ retail price of every selected bottle (no averages)
 *  - one quantity discount on that subtotal, by total bottles (tiers)
 *  - discounted product total rounded to the nearest Rp1.000
 *  - shipping per delivery, added after the discount (never discounted)
 */

export type Tier = { min: number; rate: number };

/** 1–4: 0% · 5–9: 3% · 10–19: 5% · 20–29: 7% · 30+: 8% (owner-editable in Healthila OS). */
export const DEFAULT_TIERS: Tier[] = [
  { min: 1, rate: 0 },
  { min: 5, rate: 0.03 },
  { min: 10, rate: 0.05 },
  { min: 20, rate: 0.07 },
  { min: 30, rate: 0.08 },
];

export type Flavor = { id: string; name: string; price: number; category: string; available: boolean };

export type QuoteInput = {
  people: number;
  /** Bottles per person in every delivery (1–3). */
  bottlesPerDelivery: number;
  /** Subscription period in days (1 month = 28 days = 4 weeks). */
  days: number;
  category: string;
  /** flavor id → bottles over the whole subscription */
  picks: Record<string, number>;
  flavors: Flavor[];
  tiers?: Tier[];
  /** Ongkir for one delivery; null when it can't be estimated yet. */
  shippingPerDelivery: number | null;
  /** First delivery, YYYY-MM-DD. */
  startDate: string;
  /** Delivery dates (YYYY-MM-DD, first = startDate, all inside the period). */
  deliveryDates: string[];
};

/** How often the buyer wants deliveries; turned into dates by deliveryDatesFor(). */
export type Frequency = "daily" | "4x_week" | "3x_week" | "2x_week" | "weekly" | "biweekly" | "custom";

export const FREQUENCIES: { key: Frequency; label: string; perWeek?: number; minDays: number }[] = [
  { key: "daily", label: "Tiap hari", minDays: 1 },
  { key: "4x_week", label: "4× seminggu", perWeek: 4, minDays: 7 },
  { key: "3x_week", label: "3× seminggu", perWeek: 3, minDays: 7 },
  { key: "2x_week", label: "2× seminggu", perWeek: 2, minDays: 7 },
  { key: "weekly", label: "1× seminggu", minDays: 7 },
  { key: "biweekly", label: "2 minggu sekali", minDays: 28 },
  { key: "custom", label: "Atur tanggal sendiri", minDays: 1 },
];

/** Suggested weekdays (ISO 1 = Senin … 7 = Minggu) for the "N× seminggu" options. */
export const DEFAULT_WEEKDAYS: Record<number, number[]> = { 2: [1, 4], 3: [1, 3, 5], 4: [1, 2, 4, 5] };

/** "1 bulan" (28 days), "2 minggu" (14), otherwise "n hari". */
export function durationLabel(days: number) {
  if (days >= 28 && days % 28 === 0) return `${days / 28} bulan`;
  if (days % 7 === 0) return `${days / 7} minggu`;
  return `${days} hari`;
}

/** ISO weekday of a YYYY-MM-DD date (1 = Monday). */
export const isoWeekday = (date: string) => ((new Date(date + "T00:00:00Z").getUTCDay() + 6) % 7) + 1;

/**
 * Delivery dates for a frequency within `days` days. For "N× seminggu" the
 * subscription starts on the first chosen weekday on/after `from`; `custom`
 * keeps the buyer's dates (the start date is always included).
 */
export function deliveryDatesFor(freq: Frequency, from: string, days: number, opts: { weekdays?: number[]; custom?: string[] } = {}): string[] {
  const n = Math.max(1, Math.floor(days));
  const step = (k: number) => Array.from({ length: Math.ceil(n / k) }, (_, i) => addDays(from, i * k));
  switch (freq) {
    case "daily":
      return step(1);
    case "weekly":
      return step(7);
    case "biweekly":
      return step(14);
    case "custom": {
      const end = addDays(from, n);
      return [...new Set([from, ...(opts.custom ?? [])])].filter((d) => d >= from && d < end).sort();
    }
    default: {
      const wd = opts.weekdays?.length ? opts.weekdays : DEFAULT_WEEKDAYS[FREQUENCIES.find((f) => f.key === freq)?.perWeek ?? 2];
      let start = from;
      for (let i = 0; i < 7 && !wd.includes(isoWeekday(start)); i++) start = addDays(start, 1);
      return Array.from({ length: n }, (_, i) => addDays(start, i)).filter((d) => wd.includes(isoWeekday(d)));
    }
  }
}

export type Shipment = {
  date: string;
  bottles: number;
  items: { id: string; qty: number }[];
  normalSubtotal: number;
  productTotal: number;
};

export type Quote = {
  totalBottles: number;
  selectedBottles: number;
  subtotal: number;
  rate: number;
  discountAmount: number;
  productTotal: number;
  savings: number;
  deliveries: number;
  shipments: Shipment[];
  shippingPerDelivery: number | null;
  shippingTotal: number | null;
  payable: number;
  errors: string[];
};

export function tierRate(bottles: number, tiers: Tier[] = DEFAULT_TIERS): number {
  if (!(bottles > 0)) return 0;
  return [...tiers].sort((a, b) => a.min - b.min).reduce((rate, t) => (bottles >= t.min ? t.rate : rate), 0);
}

export const roundToThousand = (n: number) => Math.round(n / 1000) * 1000;

export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

/** Suggested label only — every package uses the same pricing. */
export function packageLabel(people: number, bottlesPerDelivery: number): string {
  if (bottlesPerDelivery >= 2) return "Power Routine";
  if (people >= 3) return "Family Fresh";
  if (people === 2) return "Duo Routine";
  return "Daily Personal";
}

function addDays(date: string, n: number) {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Flavours interleaved one by one so every delivery gets a mix. */
function interleave(picks: [string, number][]) {
  const left = picks.map(([id, q]) => [id, q] as [string, number]);
  const out: string[] = [];
  while (left.some(([, q]) => q > 0)) {
    for (const p of left) {
      if (p[1] > 0) {
        out.push(p[0]);
        p[1]--;
      }
    }
  }
  return out;
}

export function quoteSubscription(input: QuoteInput): Quote {
  const errors: string[] = [];
  const tiers = input.tiers?.length ? input.tiers : DEFAULT_TIERS;
  const people = Math.floor(input.people);
  const per = Math.floor(input.bottlesPerDelivery);
  const days = Math.floor(input.days);
  if (!(people >= 1 && people <= 100)) errors.push("Jumlah orang tidak valid.");
  if (![1, 2, 3].includes(per)) errors.push("Botol per orang per kiriman harus 1, 2, atau 3.");
  if (!(days >= 1 && days <= 120)) errors.push("Durasi tidak valid.");

  // Delivery dates.
  const dates = [...input.deliveryDates];
  const end = days >= 1 ? addDays(input.startDate, days) : input.startDate;
  const sorted = [...new Set(dates)].sort();
  const before = errors.length;
  if (!dates.length) errors.push("Pilih tanggal kirim.");
  else if (sorted.length !== dates.length || sorted.some((d, i) => d !== dates[i]) || dates.some((d) => !/^\d{4}-\d{2}-\d{2}$/.test(d)))
    errors.push("Tanggal kirim tidak valid.");
  else if (dates[0] !== input.startDate) errors.push("Pengiriman pertama harus di tanggal mulai langganan.");
  else if (dates[dates.length - 1] >= end) errors.push("Ada tanggal kirim di luar masa langganan.");
  const datesOk = errors.length === before;
  const perShipment = people * per;
  const totalBottles = errors.length ? 0 : perShipment * dates.length;

  const byId = new Map(input.flavors.map((f) => [f.id, f]));
  // Catalog order (not click order) — the server builds the schedule the same way.
  const rank = new Map(input.flavors.map((f, i) => [f.id, i]));
  const picks = (Object.entries(input.picks).filter(([, q]) => q > 0) as [string, number][]).sort(
    (a, b) => (rank.get(a[0]) ?? Infinity) - (rank.get(b[0]) ?? Infinity),
  );
  let subtotal = 0;
  let selectedBottles = 0;
  for (const [id, q] of picks) {
    const f = byId.get(id);
    if (!Number.isInteger(q) || q < 0) {
      errors.push("Jumlah botol tidak valid.");
      continue;
    }
    if (!f) {
      errors.push("Ada rasa yang tidak tersedia lagi — silakan pilih pengganti.");
      continue;
    }
    if (!f.available) errors.push(`${f.name} sedang tidak tersedia — silakan pilih rasa lain.`);
    if (f.category !== input.category) errors.push(`${f.name} bukan bagian dari kategori yang dipilih.`);
    subtotal += q * f.price;
    selectedBottles += q;
  }
  if (selectedBottles === 0) errors.push("Pilih rasa untuk botol-botol langganan.");
  else if (totalBottles && selectedBottles !== totalBottles)
    errors.push(
      selectedBottles < totalBottles
        ? `Masih kurang ${totalBottles - selectedBottles} botol — total harus ${totalBottles} botol.`
        : `Kelebihan ${selectedBottles - totalBottles} botol — total langganan ${totalBottles} botol.`,
    );

  const rate = tierRate(selectedBottles, tiers);
  const discountAmount = subtotal * rate;
  const productTotal = roundToThousand(subtotal - discountAmount);
  const savings = subtotal - productTotal;

  // Schedule: the same number of bottles in every delivery, flavours mixed.
  const shipments: Shipment[] = [];
  if (totalBottles > 0 && selectedBottles === totalBottles) {
    const order = interleave(picks);
    dates.forEach((date, i) => {
      const counts = new Map<string, number>();
      for (const id of order.slice(i * perShipment, (i + 1) * perShipment)) counts.set(id, (counts.get(id) ?? 0) + 1);
      const items = [...counts].map(([id, qty]) => ({ id, qty }));
      const normalSubtotal = items.reduce((n, it) => n + it.qty * (byId.get(it.id)?.price ?? 0), 0);
      shipments.push({ date, bottles: perShipment, items, normalSubtotal, productTotal: 0 });
    });
    // Spread the (rounded) product total over deliveries by value; last takes the remainder.
    let allocated = 0;
    shipments.forEach((s, i) => {
      s.productTotal = i === shipments.length - 1 ? productTotal - allocated : Math.round((productTotal * s.normalSubtotal) / subtotal);
      allocated += s.productTotal;
    });
  }

  const deliveries = datesOk ? dates.length : 0;
  const shippingTotal = input.shippingPerDelivery == null ? null : input.shippingPerDelivery * deliveries;
  return {
    totalBottles,
    selectedBottles,
    subtotal,
    rate,
    discountAmount,
    productTotal,
    savings,
    deliveries,
    shipments,
    shippingPerDelivery: input.shippingPerDelivery,
    shippingTotal,
    payable: productTotal + (shippingTotal ?? 0),
    errors: [...new Set(errors)],
  };
}
