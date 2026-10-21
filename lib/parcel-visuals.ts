import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { ContainerOption } from "@/components/parcel/ParcelBuilder";
import type { ShapeKey } from "@/components/parcel/ParcelVisual";
import { PARCEL_CONTAINERS } from "./parcel-options";

/**
 * Parcel builder containers & fruit PNGs managed in Healthila OS › Website ›
 * Parcel (healthila-crm migration 0104). Falls back to the static list.
 */
const db = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });

type Row = {
  key: string;
  label: string;
  grp: string;
  description: string | null;
  start_price: number;
  shape: ShapeKey;
  back_url: string | null;
  front_url: string | null;
  sample_url: string | null;
  fill_x: number;
  fill_y: number;
  fill_w: number;
  fill_h: number;
};

const DEFAULT_FILL = { fill_x: 15, fill_y: 20, fill_w: 70, fill_h: 40 };

export async function getParcelContainers(fallbackPhoto: (c: (typeof PARCEL_CONTAINERS)[number]) => string | null): Promise<ContainerOption[]> {
  const { data, error } = await db().from("web_parcel_containers_public").select("*").order("sort");
  if (error || !data?.length) {
    if (error) console.error("[parcel-containers]", error.message);
    // RegExp can't cross to the client component, so it's dropped here.
    return PARCEL_CONTAINERS.map(({ crmMatch, ...c }) => ({
      ...c,
      photo: crmMatch ? fallbackPhoto({ ...c, crmMatch }) : null,
      back: null,
      front: null,
      fill: DEFAULT_FILL,
    }));
  }
  return (data as Row[]).map((r) => ({
    key: r.key,
    label: r.label,
    group: r.grp,
    desc: r.description ?? "",
    start: Number(r.start_price),
    shape: r.shape,
    photo: r.sample_url,
    back: r.back_url,
    front: r.front_url,
    fill: { fill_x: Number(r.fill_x), fill_y: Number(r.fill_y), fill_w: Number(r.fill_w), fill_h: Number(r.fill_h) },
  }));
}

/** Uploaded fruit PNGs: per product id and per fruit type (lower-cased). */
export async function getFruitArt(): Promise<{ byProduct: Map<string, string>; byGroup: Map<string, string> }> {
  const byProduct = new Map<string, string>();
  const byGroup = new Map<string, string>();
  const { data, error } = await db().from("web_fruit_art_public").select("product_group, product_id, image_url");
  if (error) console.error("[fruit-art]", error.message);
  for (const a of (data ?? []) as { product_group: string | null; product_id: string | null; image_url: string }[]) {
    if (a.product_id) byProduct.set(a.product_id, a.image_url);
    else if (a.product_group) byGroup.set(a.product_group.toLowerCase(), a.image_url);
  }
  return { byProduct, byGroup };
}
