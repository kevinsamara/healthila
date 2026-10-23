"use server";

import { revalidatePath } from "next/cache";
import { fetchOngkir } from "@/lib/ongkir";
import { sessionToken } from "@/lib/session";
import { webRpc, WebRpcError } from "@/lib/web-rpc";

/** Occasion reminders + subscriptions of the signed-in buyer (healthila-crm 0112). */

export type Reminder = { id: string; label: string; recipient: string | null; month: number; day: number; lead_days: number };
export type Subscription = {
  id: string;
  code: string;
  kind: string;
  title: string | null;
  unit_label: string | null;
  quantity: number | null;
  items: { name: string; qty: number; price: number }[] | null;
  weekdays: number[];
  audience: string | null;
  pax: number | null;
  budget_idr: number;
  interval_weeks: number;
  weekday: number;
  slot: number | null;
  preferences: string | null;
  status: "active" | "paused" | "cancelled";
  next_date: string;
  address: string;
  /** Fixed-duration juice subscriptions (tier pricing, healthila-crm 0119). */
  quote: TierQuote | null;
  schedule: { date: string; days: number; bottles: number; product_total: number; order_id?: string }[] | null;
};

export type TierQuote = {
  people: number;
  bottles_per_day: number;
  duration_days: number;
  every_days: number;
  total_bottles: number;
  subtotal: number;
  rate: number;
  product_total: number;
  savings: number;
  deliveries: number;
  shipping_per_delivery: number | null;
  shipping_total: number | null;
  payable: number;
};

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function call<T>(fn: string, action: string, p: Record<string, unknown> = {}): Promise<Result<T>> {
  const token = await sessionToken();
  if (!token) return { ok: false, error: "Silakan masuk dulu." };
  try {
    const data = await webRpc<T>(fn, { p_session_token: token, p_action: action, p });
    if (action !== "list") revalidatePath("/akun");
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e instanceof WebRpcError && e.friendly ? e.message : "Gagal menyimpan, coba lagi." };
  }
}

export async function manageReminders(action: "list" | "add" | "delete", p: Record<string, unknown> = {}) {
  return call<Reminder[]>("web_reminders_manage", action, p);
}

export async function manageSubscriptions(action: "list" | "create" | "pause" | "resume" | "cancel", p: Record<string, unknown> = {}) {
  return call<Subscription[]>("web_subscriptions_manage", action, p);
}

/**
 * Juice subscription with quantity tiers. Ongkir is estimated here from the
 * address (never trusted from the browser); the database recomputes the whole
 * quote and the delivery schedule (private.sub_tier_quote).
 */
export async function createJuiceSubscription(p: {
  kind: string;
  audience: string | null;
  people: number;
  bottles_per_day: number;
  duration_days: number;
  every_days: number;
  category: string;
  items: { item_id: string; qty: number }[];
  start_date: string;
  slot: string;
  name: string;
  address: string;
  preferences: string;
}) {
  const ongkir = await fetchOngkir(String(p.address ?? "").slice(0, 500));
  const shipping = ongkir.state === "calculated" ? Math.round(ongkir.fee) : null;
  return call<{ id: string; code: string; quote: TierQuote }[]>("web_subscriptions_manage", "create", {
    ...p,
    shipping_per_delivery: shipping,
  });
}
