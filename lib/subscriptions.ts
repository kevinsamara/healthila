import "server-only";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

/** Subscription plans edited in Healthila OS › Website › Langganan (healthila-crm 0115/0116). */
export type SubscriptionPlan = {
  kind: "buah_utuh" | "buah_potong" | "jus";
  title: string;
  description: string | null;
  pricing: "budget" | "per_unit";
  unit_label: string;
  unit_price: number | null;
  options: number[];
  multi_day: boolean;
  sort: number;
  available: boolean;
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
    return (data ?? []) as SubscriptionPlan[];
  },
  ["web-subscription-plans"],
  { revalidate: 300 },
);
