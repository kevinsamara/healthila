import "server-only";
import { sessionToken } from "./session";
import { webRpc } from "./web-rpc";

/** QRIS payment of a website order (healthila-crm 0109). */
export type QrisPayment = {
  code: string;
  subtotal: number;
  shipping: number;
  unique_code: number;
  amount: number;
  expires_at: string;
  proof_at: string | null;
  status: "awaiting" | "submitted" | "verified" | "expired" | "rejected" | "cancelled";
};

/** Visible with the checkout key (buyer's browser) or the buyer's own session. */
export async function getQrisPayment(code: string, key: string | null): Promise<QrisPayment | null> {
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
