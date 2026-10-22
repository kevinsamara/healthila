import "server-only";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { DeliverySlot } from "./delivery";

/** Courier runs from the CRM dispatch schedule (web_delivery_slots), cached 10 min. */
export const getDeliverySlots = unstable_cache(
  async (): Promise<DeliverySlot[]> => {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: { persistSession: false },
    });
    const { data, error } = await db.from("web_delivery_slots").select("n, label, at, enabled").order("n");
    if (error) {
      console.error("[slots]", error.message);
      return [];
    }
    return (data ?? []) as DeliverySlot[];
  },
  ["web-delivery-slots"],
  { revalidate: 600 },
);
