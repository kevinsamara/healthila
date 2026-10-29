import "server-only";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { PARCEL_CONTAINERS } from "./parcel-options";
import type { SectionKey } from "./site";

/**
 * Read-only access to the CRM catalog through the `web_products` view
 * (healthila-crm migration 0090). The view is the whole public contract —
 * never query base tables from the storefront.
 */

export type Packaging = {
  id: string;
  name: string;
  quantity: number;
  price: number | null;
  promo_price: number | null;
  /** Timestamp terdekat promo varian ini akan tutup (least of expires_at vs today daily_end). */
  promo_ends_at: string | null;
  is_default: boolean;
  /** Selling unit of the variant in the CRM (kg, pcs, …). */
  unit: string | null;
  photo_url: string | null;
  /** Stok tersedia dalam satuan varian ini (pack, botol). Null = tidak dilacak. */
  stock_qty: number | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  photo_url: string | null;
  section: SectionKey;
  product_group: string | null;
  category: string | null;
  unit: string | null;
  price: number | null;
  promo_price: number | null;
  price_note: string | null;
  badges: string[];
  is_new: boolean;
  country_flag: string | null;
  sort_order: number;
  made_to_order: boolean;
  packagings: Packaging[];
  updated_at: string;
  in_stock: boolean;
  /** Set when the site sells per pack while the CRM sells per kg: kg in one pack. */
  base_per_unit: number | null;
  base_unit: string | null;
  /** Gift occasions (lib/occasions keys), set in Healthila OS. */
  occasions: string[];
  /** Parcels priced per order: the matching container's "mulai dari" price. */
  from_price: number | null;
  /** Automatic sales label (healthila-crm 0125): top sellers 30 days / fastest this week. */
  sales_badge: "best_seller" | "favorite" | null;
  /** Admin-flagged "HOT" di CRM — tampil di section Produk HOT homepage. */
  is_hot: boolean;
  /** Timestamp terdekat promo publik akan tutup; least(expires_at, today's daily_end at WIB). */
  promo_ends_at: string | null;
  /** Stok tersedia dalam base unit produk (kg, pcs). Null = tidak dilacak (parcel/juice/MTO). */
  stock_qty: number | null;
};

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
}

function normalize(row: Record<string, unknown>): Product {
  const num = (v: unknown) => (v == null ? null : Number(v));
  const product: Product = {
    ...(row as unknown as Product),
    price: num(row.price),
    promo_price: num(row.promo_price),
    badges: (row.badges as string[] | null) ?? [],
    occasions: (row.occasions as string[] | null) ?? [],
    from_price: null,
    sales_badge: null,
    is_hot: !!row.is_hot,
    promo_ends_at: (row.promo_ends_at as string | null) ?? null,
    stock_qty: row.stock_qty == null ? null : Number(row.stock_qty),
    in_stock: row.in_stock !== false,
    base_per_unit: null,
    base_unit: null,
    packagings: ((row.packagings as Packaging[] | null) ?? []).map((p) => ({
      ...p,
      quantity: Number(p.quantity),
      price: num(p.price),
      promo_price: num(p.promo_price),
      promo_ends_at: (p.promo_ends_at as string | null) ?? null,
      stock_qty: p.stock_qty == null ? null : Number(p.stock_qty),
    })),
  };
  product.product_group = canonicalGroup(product.product_group ?? product.category);
  // Fallback flash-sale: kalau product-level promo kosong, tapi salah satu
  // varian punya promo aktif, pakai varian dengan saving terbesar sebagai
  // display promo di homepage. Dengan ini Mangga Gadung Klonal (promo di
  // varian "Super") bisa muncul di flash sale strip.
  if (product.promo_price == null) {
    let best: Packaging | null = null;
    let bestSaving = 0;
    for (const k of product.packagings) {
      if (k.promo_price == null || k.price == null || k.promo_price >= k.price) continue;
      const saving = k.price - k.promo_price;
      if (saving > bestSaving) { best = k; bestSaving = saving; }
    }
    if (best) {
      // Hanya override price/promo untuk display homepage; packagings[] tetap
      // utuh supaya PDP tampil varian lengkap.
      product.price = best.price;
      product.promo_price = best.promo_price;
      product.promo_ends_at = best.promo_ends_at;
    }
  }
  return toPack(product, num(row.pack_grams) ?? DEFAULT_PACK_GRAMS[(product.product_group ?? "").toLowerCase()] ?? null);
}

/**
 * Groups always sold per pack on the website even when the CRM sells per kg
 * and no pack size is set (owner, Oct 2026: every grape = pack 500gr). A pack
 * size set in Healthila OS (web_pack_grams) still wins.
 */
const DEFAULT_PACK_GRAMS: Record<string, number> = { anggur: 500 };

// The CRM mixes catalog_group and category spellings for the same fruit.
const GROUP_ALIASES: Record<string, string> = { pir: "Pear", lengkeng: "Kelengkeng", parsel: "Parcel" };

function canonicalGroup(g: string | null): string | null {
  if (!g) return null;
  const t = g.trim();
  return GROUP_ALIASES[t.toLowerCase()] ?? t;
}

/**
 * Web-only pack pricing (products.web_pack_grams): the CRM keeps selling per
 * kg, the site shows e.g. "Rp 50.000 / pack 500gr" derived from the kg price.
 * Orders still state the kg equivalent so admins fulfil in kg.
 */
function toPack(p: Product, grams: number | null): Product {
  if (!grams || p.unit !== "kg") return p;
  const kg = grams / 1000;
  const scale = (v: number | null, perKg = 1) => (v == null ? null : Math.round((v / perKg) * kg / 100) * 100);
  return {
    ...p,
    unit: `pack ${grams}gr`,
    base_per_unit: kg,
    base_unit: "kg",
    price: scale(p.price),
    promo_price: scale(p.promo_price),
    packagings: p.packagings.map((k) => ({
      ...k,
      quantity: kg,
      price: scale(k.price, k.quantity || 1),
      promo_price: scale(k.promo_price, k.quantity || 1),
    })),
  };
}

/**
 * Whole catalog, cached for 5 minutes across requests. Category pages render
 * per request (filters in the URL), so without this every visit re-queried
 * Supabase and pages took 1–2 s.
 */
export const getProducts = unstable_cache(loadProducts, ["web-products"], { revalidate: 300, tags: ["catalog"] });

async function loadProducts(): Promise<Product[]> {
  const [{ data, error }, containers, salesBadges] = await Promise.all([
    db().from("web_products").select("*").order("sort_order", { ascending: true }).order("name", { ascending: true }),
    db().from("web_parcel_containers_public").select("key, start_price"),
    db().from("web_product_badges").select("product_id, badge"),
  ]);
  const badgeOf = new Map(
    ((salesBadges.data ?? []) as { product_id: string; badge: Product["sales_badge"] }[]).map((b) => [b.product_id, b.badge]),
  );
  if (error) {
    console.error("[catalog] getProducts", error.message);
    return [];
  }
  const startByKey = new Map<string, number>(
    ((containers.data ?? []) as { key: string; start_price: number }[]).map((c) => [c.key, Number(c.start_price)]),
  );
  // Keep the raw rows alongside the normalized product so we can read the
  // admin-set start_from_price (web_products.start_from_price) which is
  // dropped during normalize().
  const rows = (data ?? []) as Array<Record<string, unknown>>;
  const products = rows.map(normalize);
  for (const p of products) p.sales_badge = badgeOf.get(p.id) ?? null;
  for (let i = 0; i < products.length; i++) {
    const p = products[i]!;
    if (p.section !== "parcel") continue;
    // Admin-set "mulai dari" wins — tiap produk parcel bisa punya harga start
    // sendiri yang di-set langsung di CRM (products.catalog_start_from_price),
    // tidak bergantung pada container-match heuristic.
    const admin = rows[i]!["start_from_price"];
    const adminPrice = admin == null ? null : Number(admin);
    if (adminPrice != null && Number.isFinite(adminPrice)) {
      p.from_price = adminPrice;
      continue;
    }
    // Fallback: container-based (existing behavior).
    const prices = PARCEL_CONTAINERS.filter((c) => c.crmMatch?.test(p.name)).map((c) => startByKey.get(c.key) ?? c.start);
    p.from_price = prices.length ? Math.min(...prices) : null;
  }
  // Sold-out items stay listed (product pages remain indexed) but sink to the end.
  return products.sort((a, b) => Number(b.in_stock) - Number(a.in_stock));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}
