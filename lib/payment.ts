import "server-only";
import { sessionToken } from "./session";
import { webRpc } from "./web-rpc";

/** QRIS payment of a website order (healthila-crm 0109) or a prepaid juice subscription (0122). */
export type QrisPayment = {
  code: string;
  /** Subscriptions only: number of deliveries the shipping covers. */
  deliveries?: number;
  subtotal: number;
  shipping: number;
  unique_code: number;
  amount: number;
  expires_at: string;
  proof_at: string | null;
  status: "awaiting" | "submitted" | "verified" | "expired" | "rejected" | "cancelled";
};

/** Visible with the checkout key (buyer's browser) or the buyer's own session. */
export const isSubscriptionCode = (code: string) => /^SUB-[0-9A-F]{6}$/.test(code);

export async function getQrisPayment(code: string, key: string | null): Promise<QrisPayment | null> {
  if (isSubscriptionCode(code)) {
    // Subscriptions belong to a signed-in buyer: the session is the only key.
    const token = await sessionToken();
    if (!token) return null;
    try {
      const p = await webRpc<QrisPayment | null>("web_sub_qris_get", { p_code: code, p_session_token: token });
      return p ? { ...p, subtotal: Number(p.subtotal), shipping: Number(p.shipping), amount: Number(p.amount) } : null;
    } catch {
      return null;
    }
  }
  if (!/^WEB-\d{6}-[0-9A-F]{4}$/.test(code)) return null;
  try {
    const p = await webRpc<QrisPayment | null>("web_qris_get", {
      p_code: code,
      p_key: key && key.length <= 64 ? key : null,
      p_session_token: await sessionToken(),
    });
    return p ? { ...p, subtotal: Number(p.subtotal), shipping: Number(p.shipping), amount: Number(p.amount) } : null;
  } catch {
    return null;
  }
}
