import "server-only";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

/**
 * Bundles ticked "web" in Healthila OS › Bundling (healthila-crm 0123/0124).
 * Bought as one cart line; the order RPC expands it into the real items.
 */
export type BundleItem = {
  product_id: string;
  packaging_id: string | null;
  name: string;
  slug: string;
  variant: string | null;
  quantity: number;
  unit: string | null;
  price: number;
  photo: string | null;
};

export type Bundle = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  photo_url: string | null;
  ends_at: string | null;
  bundle_price: number;
  regular_price: number;
  in_stock: boolean;
  items: BundleItem[];
};

/** Saving shown only when the bundle is really cheaper than buying the items. */
export const bundleSaving = (b: Bundle) => Math.max(0, Math.round(b.regular_price - b.bundle_price));

export const getBundles = unstable_cache(
  async (): Promise<Bundle[]> => {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
    const { data, error } = await db.from("web_bundles_public").select("*").order("bundle_price");
    if (error) {
      console.error("[bundles]", error.message);
      return [];
    }
    return ((data ?? []) as Bundle[]).map((b) => ({
      ...b,
      bundle_price: Number(b.bundle_price),
      regular_price: Number(b.regular_price),
      items: (b.items ?? []).map((i) => ({ ...i, quantity: Number(i.quantity), price: Number(i.price) })),
    }));
  },
  ["web-bundles"],
  { revalidate: 300, tags: ["catalog"] },
);

export async function getBundle(slug: string) {
  return (await getBundles()).find((b) => b.slug === slug) ?? null;
}
