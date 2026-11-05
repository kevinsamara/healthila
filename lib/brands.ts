import "server-only";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

/**
 * Brand logos set in Healthila OS › Produk › Brand, read from
 * web_brands_public (healthila-crm migrations 0145/0146): brands with a logo
 * that are switched on; product_ids may be empty (page shows the empty state).
 */
export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  product_ids: string[];
};

async function loadBrands(): Promise<Brand[]> {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
  const { data, error } = await db
    .from("web_brands_public")
    .select("id, name, slug, logo_url, product_ids")
    .order("web_sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) {
    console.error("[brands]", error.message);
    return [];
  }
  return (data ?? []) as Brand[];
}

export const getBrands = unstable_cache(loadBrands, ["web-brands"], { revalidate: 300, tags: ["catalog"] });

export async function getBrand(slug: string): Promise<Brand | null> {
  return (await getBrands()).find((b) => b.slug === slug) ?? null;
}
