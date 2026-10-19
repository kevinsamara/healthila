import type { Product } from "@/lib/catalog";
import { displayPrice } from "@/lib/price";

export const priceRanges = [
  { key: "0-50000", label: "Di bawah Rp 50rb", min: 0, max: 50000 },
  { key: "50000-100000", label: "Rp 50rb – 100rb", min: 50000, max: 100000 },
  { key: "100000-200000", label: "Rp 100rb – 200rb", min: 100000, max: 200000 },
  { key: "200000-", label: "Di atas Rp 200rb", min: 200000, max: Infinity },
] as const;

export const sorts = [
  { key: "rekomendasi", label: "Rekomendasi" },
  { key: "termurah", label: "Harga terendah" },
  { key: "termahal", label: "Harga tertinggi" },
  { key: "terbaru", label: "Terbaru" },
  { key: "az", label: "Nama A–Z" },
] as const;

export type Filters = {
  kategori: string;
  jenis: string[];
  asal: string[];
  harga: string;
  tersedia: boolean;
  promo: boolean;
  urut: string;
  q: string;
};

type SP = Record<string, string | string[] | undefined>;

const list = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export function parseFilters(sp: SP): Filters {
  return {
    kategori: one(sp.kategori),
    jenis: list(sp.jenis),
    asal: list(sp.asal),
    harga: one(sp.harga),
    tersedia: one(sp.tersedia) === "1",
    promo: one(sp.promo) === "1",
    urut: one(sp.urut) || "rekomendasi",
    q: one(sp.q).trim(),
  };
}

export function toQuery(f: Filters): string {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.kategori) p.set("kategori", f.kategori);
  f.jenis.forEach((j) => p.append("jenis", j));
  f.asal.forEach((a) => p.append("asal", a));
  if (f.harga) p.set("harga", f.harga);
  if (f.tersedia) p.set("tersedia", "1");
  if (f.promo) p.set("promo", "1");
  if (f.urut && f.urut !== "rekomendasi") p.set("urut", f.urut);
  const s = p.toString();
  return s ? `/katalog?${s}` : "/katalog";
}

export const groupOf = (p: Product) => p.product_group ?? p.category ?? "Lainnya";
export const isPromo = (p: Product) => displayPrice(p).was != null;

/** Apply every filter except the ones named in `skip` (used for facet counts). */
export function applyFilters(all: Product[], f: Filters, skip: (keyof Filters)[] = []): Product[] {
  const needle = f.q.toLowerCase();
  const range = priceRanges.find((r) => r.key === f.harga);
  return all.filter((p) => {
    if (!skip.includes("kategori") && f.kategori && p.section !== f.kategori) return false;
    if (!skip.includes("jenis") && f.jenis.length && !f.jenis.includes(groupOf(p))) return false;
    if (!skip.includes("asal") && f.asal.length && !f.asal.includes(p.country_flag ?? "")) return false;
    if (!skip.includes("tersedia") && f.tersedia && !p.in_stock) return false;
    if (!skip.includes("promo") && f.promo && !isPromo(p)) return false;
    if (!skip.includes("harga") && range) {
      const price = displayPrice(p).price;
      if (price == null || price < range.min || price >= range.max) return false;
    }
    if (needle && !`${p.name} ${groupOf(p)}`.toLowerCase().includes(needle)) return false;
    return true;
  });
}

export function sortProducts(items: Product[], urut: string): Product[] {
  const price = (p: Product) => displayPrice(p).price ?? Infinity;
  const byStock = (a: Product, b: Product) => Number(b.in_stock) - Number(a.in_stock);
  const sorted = [...items];
  switch (urut) {
    case "termurah":
      return sorted.sort((a, b) => byStock(a, b) || price(a) - price(b));
    case "termahal": {
      const priceDesc = (p: Product) => displayPrice(p).price ?? -1; // unpriced last
      return sorted.sort((a, b) => byStock(a, b) || priceDesc(b) - priceDesc(a));
    }
    case "terbaru":
      return sorted.sort((a, b) => byStock(a, b) || Number(b.is_new) - Number(a.is_new) || b.updated_at.localeCompare(a.updated_at));
    case "az":
      return sorted.sort((a, b) => byStock(a, b) || a.name.localeCompare(b.name, "id"));
    default:
      return sorted; // already in-stock first, then CRM sort order
  }
}

/** Value → count, most common first. */
export function facet(items: Product[], key: (p: Product) => string | null) {
  const m = new Map<string, number>();
  for (const p of items) {
    const k = key(p);
    if (k) m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "id"));
}
