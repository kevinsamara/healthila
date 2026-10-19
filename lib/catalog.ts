import "server-only";
import { createClient } from "@supabase/supabase-js";
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
  is_default: boolean;
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
    in_stock: row.in_stock !== false,
    base_per_unit: null,
    base_unit: null,
    packagings: ((row.packagings as Packaging[] | null) ?? []).map((p) => ({
      ...p,
      quantity: Number(p.quantity),
      price: num(p.price),
      promo_price: num(p.promo_price),
    })),
  };
  return toPack(product, num(row.pack_grams));
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

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await db()
    .from("web_products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) {
    console.error("[catalog] getProducts", error.message);
    return [];
  }
  // Sold-out items stay listed (product pages remain indexed) but sink to the end.
  return (data ?? []).map(normalize).sort((a, b) => Number(b.in_stock) - Number(a.in_stock));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await db().from("web_products").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("[catalog] getProductBySlug", error.message);
    return null;
  }
  return data ? normalize(data) : null;
}

/** Lowest price a shopper can actually pay, promo included. */
export function displayPrice(p: Product): { price: number | null; was: number | null } {
  const options = [
    { price: p.promo_price ?? p.price, was: p.promo_price != null ? p.price : null },
    ...p.packagings.map((k) => ({ price: k.promo_price ?? k.price, was: k.promo_price != null ? k.price : null })),
  ].filter((o) => o.price != null);
  if (!options.length) return { price: null, was: null };
  return options.reduce((a, b) => ((b.price as number) < (a.price as number) ? b : a));
}
