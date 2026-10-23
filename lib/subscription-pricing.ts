/**
 * Juice subscription pricing — the single source of truth for the website
 * (UI + server action). Healthila OS re-checks the same rules in SQL
 * (web_subscriptions_manage, migration 0119); keep both in step.
 *
 * Rules (owner's spec, Oct 2026):
 *  - total bottles = people × bottles per person per day × days
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
  bottlesPerDay: number;
  days: number;
  /** Days covered by one delivery (1 = daily, 7 = weekly, ≥ days = once). */
  everyDays: number;
  category: string;
  /** flavor id → bottles over the whole subscription */
  picks: Record<string, number>;
  flavors: Flavor[];
  tiers?: Tier[];
  /** Ongkir for one delivery; null when it can't be estimated yet. */
  shippingPerDelivery: number | null;
  /** First delivery, YYYY-MM-DD. */
  startDate: string;
  /** Max days one delivery may cover (product storage); null = not configured. */
  shelfLifeDays?: number | null;
};

export type Shipment = {
  date: string;
  days: number;
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
export function packageLabel(people: number, bottlesPerDay: number): string {
  if (bottlesPerDay >= 2) return "Power Routine";
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
  const perDay = Math.floor(input.bottlesPerDay);
  const days = Math.floor(input.days);
  const every = Math.max(1, Math.min(Math.floor(input.everyDays), days || 1));
  if (!(people >= 1 && people <= 100)) errors.push("Jumlah orang tidak valid.");
  if (![1, 2, 3].includes(perDay)) errors.push("Botol per orang per hari harus 1, 2, atau 3.");
  if (!(days >= 1 && days <= 60)) errors.push("Durasi tidak valid.");
  if (input.shelfLifeDays && every > input.shelfLifeDays)
    errors.push(`Satu pengiriman maksimal untuk ${input.shelfLifeDays} hari (umur simpan produk). Pilih jadwal kirim lebih sering.`);
  const totalBottles = errors.length ? 0 : people * perDay * days;

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

  // Schedule: every delivery covers `every` days (the last one the rest).
  const shipments: Shipment[] = [];
  if (totalBottles > 0 && selectedBottles === totalBottles) {
    const order = interleave(picks);
    let cursor = 0;
    for (let start = 0; start < days; start += every) {
      const cover = Math.min(every, days - start);
      const bottles = people * perDay * cover;
      const slice = order.slice(cursor, cursor + bottles);
      cursor += bottles;
      const counts = new Map<string, number>();
      for (const id of slice) counts.set(id, (counts.get(id) ?? 0) + 1);
      const items = [...counts].map(([id, qty]) => ({ id, qty }));
      const normalSubtotal = items.reduce((n, i) => n + i.qty * (byId.get(i.id)?.price ?? 0), 0);
      shipments.push({ date: addDays(input.startDate, start), days: cover, bottles, items, normalSubtotal, productTotal: 0 });
    }
    // Spread the (rounded) product total over deliveries by value; last takes the remainder.
    let allocated = 0;
    shipments.forEach((s, i) => {
      s.productTotal = i === shipments.length - 1 ? productTotal - allocated : Math.round((productTotal * s.normalSubtotal) / subtotal);
      allocated += s.productTotal;
    });
    if (shipments.reduce((n, s) => n + s.bottles, 0) !== totalBottles) errors.push("Jadwal pengiriman tidak cocok dengan jumlah botol.");
  }

  const deliveries = days >= 1 ? Math.ceil(days / every) : 0;
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
