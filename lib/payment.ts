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

/** Detail invoice preview sebelum QRIS — items, totals, voucher (crm 0131). */
export type BayarDetail = {
  code: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  unique_code: number;
  amount: number;
  expires_at: string;
  status: QrisPayment["status"];
  items: Array<{
    id: string; name: string; variant: string | null;
    quantity: number; unit: string | null;
    unit_price: number; line_total: number;
  }>;
  applied_vouchers: Array<{ code: string; name: string | null; discount: number }>;
  available_vouchers: Array<{
    code: string; name: string | null;
    kind: "nominal" | "percent" | string;
    amount: number;
    min_subtotal: number | null; max_discount: number | null;
    expires_at: string | null;
  }>;
  logged_in: boolean;
};

export async function getBayarDetail(code: string, key: string | null): Promise<BayarDetail | null> {
  if (!/^WEB-\d{6}-[0-9A-F]{4}$/.test(code) && !/^HLA-[0-9A-F]{6}$/.test(code)) return null;
  try {
    const d = await webRpc<BayarDetail | null>("web_bayar_detail", {
      p_code: code,
      p_key: key && key.length <= 64 ? key : null,
      p_session_token: await sessionToken(),
    });
    return d ? {
      ...d,
      subtotal: Number(d.subtotal),
      shipping: Number(d.shipping),
      discount: Number(d.discount),
      total: Number(d.total),
      amount: Number(d.amount),
      items: (d.items ?? []).map((it) => ({
        ...it,
        quantity: Number(it.quantity),
        unit_price: Number(it.unit_price),
        line_total: Number(it.line_total),
      })),
    } : null;
  } catch { return null; }
}

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
  // Accept WEB-YYMMDD-xxxx (website orders) + HLA-xxxxxx (CRM orders yg
  // di-init via web_pay_init_crm_order utk pay-via-QRIS lewat collect WA).
  if (!/^WEB-\d{6}-[0-9A-F]{4}$/.test(code) && !/^HLA-[0-9A-F]{6}$/.test(code)) return null;
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
