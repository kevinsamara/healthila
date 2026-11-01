import "server-only";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

/** Keys and order of the home carousel slides set in Healthila OS › Carousel Beranda (healthila-crm 0137). */
export const getHeroSlideKeys = unstable_cache(
  async (): Promise<string[]> => {
    const fallback = ["parcel", "buah", "jus"];
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
    const { data, error } = await db.from("web_hero_slides_public").select("key").order("sort_order");
    if (error) {
      console.error("[hero-slides]", error.message);
      return fallback;
    }
    return data?.length ? data.map((s) => s.key as string) : fallback;
  },
  ["web-hero-slides"],
  { revalidate: 300, tags: ["catalog"] },
);
