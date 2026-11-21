import "server-only";
import { webRpc } from "@/lib/web-rpc";

/** Order row for the /saas/demo pesanan list. Source: public.web_list_recent_orders. */
export type SaasOrderRow = {
  id: string;
  code: string;
  status: string;
  source: string | null;
  order_date: string | null;
  delivery_date: string | null;
  total: number | null;
  subtotal: number | null;
  shipping_cost: number | null;
  payment_status: string | null;
  payment_method: string | null;
  confirmed: boolean;
  recipient_name: string | null;
  recipient_phone: string | null;
  notes: string | null;
  created_at: string;
  delivered_at: string | null;
  customer_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  item_count: number;
};

export type SaasOrderItem = {
  id: string;
  raw_text: string | null;
  quantity: number | null;
  unit: string | null;
  unit_price: number | null;
  line_total: number | null;
  discount_idr: number | null;
  product_id: string | null;
  packaging_id: string | null;
  prep_instruction: string | null;
};

export type SaasOrderDetail = SaasOrderRow & {
  customer: { full_name: string | null; phone: string | null; phone_e164: string | null } | null;
  items: SaasOrderItem[];
};

export async function listRecentOrders(limit = 60): Promise<SaasOrderRow[]> {
  const rows = await webRpc<SaasOrderRow[]>("web_list_recent_orders", { p_limit: limit });
  return rows ?? [];
}

export async function getOrderDetail(id: string): Promise<SaasOrderDetail | null> {
  return webRpc<SaasOrderDetail>("web_get_order_detail", { p_order_id: id });
}

export type OrderItemOp =
  | { op: "update"; id: string; quantity?: number; unit_price?: number; line_total?: number; raw_text?: string }
  | { op: "delete"; id: string }
  | { op: "add"; raw_text: string; quantity: number; unit?: string; unit_price: number; line_total?: number };

export async function updateOrderItems(id: string, ops: OrderItemOp[]): Promise<SaasOrderDetail> {
  return webRpc<SaasOrderDetail>("web_update_order_items", { p_order_id: id, p_ops: ops });
}

export async function markOrderDelivered(id: string, note?: string): Promise<SaasOrderDetail> {
  return webRpc<SaasOrderDetail>("web_mark_delivered", { p_order_id: id, p_note: note ?? null });
}

export type SaasAudienceEntry = { customer_id: string; name: string | null; phone_e164: string };

export async function sampleAudience(limit: number, loyalOnly: boolean): Promise<SaasAudienceEntry[]> {
  const rows = await webRpc<SaasAudienceEntry[]>("web_sample_audience", {
    p_limit: limit,
    p_loyal_only: loyalOnly,
  });
  return rows ?? [];
}

export async function createBroadcast(name: string, message: string, audienceCount: number): Promise<string> {
  return webRpc<string>("web_create_broadcast", {
    p_name: name,
    p_message: message,
    p_audience_count: audienceCount,
    p_purpose: "promo",
  });
}

export async function recordBroadcastRecipient(
  broadcastId: string,
  entry: SaasAudienceEntry,
  rendered: string,
  status: "sent" | "failed",
  detail?: string,
): Promise<void> {
  await webRpc<null>("web_record_broadcast_recipient", {
    p_broadcast_id: broadcastId,
    p_customer_id: entry.customer_id,
    p_phone_e164: entry.phone_e164,
    p_name: entry.name,
    p_rendered_message: rendered,
    p_status: status,
    p_fonnte_message_id: null,
    p_send_result: detail ? { detail } : null,
  });
}

export async function finishBroadcast(id: string): Promise<void> {
  await webRpc<null>("web_finish_broadcast", { p_broadcast_id: id });
}
