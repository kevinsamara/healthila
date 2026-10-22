"use server";

import { revalidatePath } from "next/cache";
import { sessionToken } from "@/lib/session";
import { webRpc, WebRpcError } from "@/lib/web-rpc";

/** Occasion reminders + subscriptions of the signed-in buyer (healthila-crm 0112). */

export type Reminder = { id: string; label: string; recipient: string | null; month: number; day: number; lead_days: number };
export type Subscription = {
  id: string;
  code: string;
  budget_idr: number;
  interval_weeks: number;
  weekday: number;
  slot: number | null;
  preferences: string | null;
  status: "active" | "paused" | "cancelled";
  next_date: string;
  address: string;
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
