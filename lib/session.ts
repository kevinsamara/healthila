import "server-only";
import { cookies } from "next/headers";
import { webRpc } from "./web-rpc";

/** httpOnly session token; the database stores only its sha256. */
export const SESSION_COOKIE = "hl_session";
/** Readable hint so client components (header, cart) know someone is signed in. Carries no secret. */
export const AUTH_HINT_COOKIE = "hl_auth";

export type AccountOrder = {
  code: string;
  order_date: string;
  delivery_date: string | null;
  status: string;
  confirmed: boolean;
  payment_status: string;
  total: number;
  items: string | null;
  // Tracking (healthila-crm 0108); optional so an older RPC still renders.
  subtotal?: number | null;
  shipping_cost?: number | null;
  dispatched?: boolean;
  delivered_at?: string | null;
  slot?: number | null;
  previews?: string[];
  proofs?: string[];
};

export type Account = {
  phone: string;
  name: string | null;
  is_customer: boolean;
  addresses: { id: string; label: string | null; recipient: string | null; address: string }[];
  orders: AccountOrder[];
};

export async function sessionToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export async function getAccount(): Promise<Account | null> {
  const token = await sessionToken();
  if (!token) return null;
  try {
    return await webRpc<Account | null>("web_session_get", { p_token: token });
  } catch {
    return null;
  }
}

export async function startSession(token: string, maxAge: number) {
  const jar = await cookies();
  const secure = process.env.NODE_ENV === "production";
  jar.set(SESSION_COOKIE, token, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge });
  jar.set(AUTH_HINT_COOKIE, "1", { httpOnly: false, secure, sameSite: "lax", path: "/", maxAge });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(AUTH_HINT_COOKIE);
}
