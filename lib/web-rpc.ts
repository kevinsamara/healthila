import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Calls the storefront RPCs (web_place_order, web_otp_*, web_session_*) in the
 * shared CRM database. They all require WEB_ORDER_SECRET, which only exists on
 * the server — the browser never talks to these functions directly.
 */

export class WebRpcError extends Error {
  constructor(
    message: string,
    /** True when the message was written for shoppers and can be shown as-is. */
    readonly friendly: boolean,
  ) {
    super(message);
  }
}

export function webSecret(): string | null {
  return process.env.WEB_ORDER_SECRET || null;
}

const FRIENDLY = /habis|tidak valid|wajib|terlalu banyak|tidak tersedia|belum tersedia|kode|sesi|sibuk/i;

export async function webRpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const secret = webSecret();
  if (!secret) throw new WebRpcError("WEB_ORDER_SECRET is not set", false);
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
  const { data, error } = await db.rpc(fn, { p_secret: secret, ...args });
  if (error) {
    console.error(`[rpc] ${fn}`, error.message);
    const friendly = FRIENDLY.test(error.message);
    throw new WebRpcError(friendly ? error.message.charAt(0).toUpperCase() + error.message.slice(1) : "Terjadi kesalahan, silakan coba lagi.", friendly);
  }
  return data as T;
}
