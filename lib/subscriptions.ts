import "server-only";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

/** Subscription plans edited in Healthila OS › Website › Langganan (healthila-crm 0115/0116). */
export type SubscriptionPlan = {
  kind: "buah_utuh" | "buah_potong" | "jus";
  title: string;
  description: string | null;
  pricing: "budget" | "per_unit" | "catalog" | "tier";
  unit_label: string;
  unit_price: number | null;
  options: number[];
  multi_day: boolean;
  sort: number;
  available: boolean;
  /** 'tier' plans (0119): quantity discount by total bottles, durations & delivery cadences. */
  tiers: { min: number; rate: number }[];
  durations: number[];
  frequencies: number[];
  shelf_life_days: number | null;
};

export const getSubscriptionPlans = unstable_cache(
  async (): Promise<SubscriptionPlan[]> => {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: { persistSession: false },
    });
    const { data, error } = await db.from("web_subscription_plans_public").select("*").order("sort");
    if (error) {
      console.error("[plans]", error.message);
      return [];
    }
    return ((data ?? []) as SubscriptionPlan[]).map((p) => ({
      ...p,
      tiers: (p.tiers ?? []).map((t) => ({ min: Number(t.min), rate: Number(t.rate) })),
      durations: p.durations ?? [],
      frequencies: p.frequencies ?? [],
    }));
  },
  ["web-subscription-plans"],
  { revalidate: 300 },
);

/** Catalog products offered in 'catalog' plans, with the bundling price. */
export type SubscriptionItem = {
  id: string;
  plan_kind: string;
  name: string;
  variant: string | null;
  photo: string | null;
  normal_price: number | null;
  /** Bundling price ('catalog' plans); null in 'tier' plans (retail price + tier discount). */
  sub_price: number | null;
  sort: number;
  category: "cold_pressed" | "regular" | null;
  in_stock: boolean;
};

export const getSubscriptionItems = unstable_cache(
  async (): Promise<SubscriptionItem[]> => {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: { persistSession: false },
    });
    const { data, error } = await db
      .from("web_subscription_items_public")
      .select("id, plan_kind, name, variant, photo, normal_price, sub_price, sort, category, in_stock")
      .order("sort");
    if (error) {
      console.error("[subscription-items]", error.message);
      return [];
    }
    return ((data ?? []) as SubscriptionItem[]).map((i) => ({ ...i, normal_price: i.normal_price == null ? null : Number(i.normal_price), sub_price: i.sub_price == null ? null : Number(i.sub_price) }));
  },
  ["web-subscription-items"],
  { revalidate: 300 },
);
