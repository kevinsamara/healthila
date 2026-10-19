"use server";

import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";
import { getAccount, sessionToken } from "@/lib/session";
import { webRpc, WebRpcError, webSecret } from "@/lib/web-rpc";

/**
 * Saves the cart as an order in the CRM via web_place_order (healthila-crm
 * migrations 0094/0095). Prices are re-derived in the database; the browser
 * only says which product, packaging and how much. When the buyer is signed
 * in, the OTP-verified phone from the session wins over the form.
 */

const Line = z.object({
  productId: z.string().uuid(),
  packagingId: z.string().uuid().nullable(),
  quantity: z.number().positive().max(1000),
  label: z.string().max(80).nullable(),
});

const Input = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(120),
  phone: z.string().trim().min(1, "Nomor WhatsApp wajib diisi"),
  address: z.string().trim().min(5, "Alamat wajib diisi").max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  notes: z.string().max(500).nullable(),
  lines: z.array(Line).min(1).max(50),
  key: z.string().uuid(),
});

export type PlaceOrderInput = z.infer<typeof Input>;
export type PlaceOrderResult =
  | { ok: true; code: string; customerStatus: "new" | "existing" | null }
  | { ok: false; error: string; fallback?: boolean };

export async function placeOrder(raw: PlaceOrderInput): Promise<PlaceOrderResult> {
  const parsed = Input.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Data pesanan tidak valid" };
  const input = parsed.data;

  const phone = parsePhoneNumberFromString(input.phone, "ID");
  if (!phone || !phone.isValid()) return { ok: false, error: "Nomor WhatsApp tidak valid. Contoh: 0812 3456 7890" };

  if (!webSecret()) {
    console.error("[order] WEB_ORDER_SECRET is not set");
    // Not configured on this deployment: let the client fall back to a plain WhatsApp order.
    return { ok: false, error: "Sistem pesanan belum siap.", fallback: true };
  }

  try {
    const res = await webRpc<{ code: string; customer_status?: "new" | "existing" }>("web_place_order", {
      p_phone_e164: phone.number,
      p_name: input.name,
      p_address: input.address,
      p_delivery_date: input.date,
      p_notes: input.notes,
      p_lines: input.lines.map((l) => ({
        product_id: l.productId,
        packaging_id: l.packagingId,
        quantity: l.quantity,
        label: l.label,
      })),
      p_key: input.key,
      p_session_token: await sessionToken(),
    });
    return { ok: true, code: res.code, customerStatus: res.customer_status ?? null };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof WebRpcError && e.friendly ? e.message : "Pesanan gagal disimpan. Silakan coba lagi.",
    };
  }
}

/** Signed-in buyer's phone, name and saved addresses for prefilling checkout. */
export async function getCheckoutProfile() {
  const account = await getAccount();
  if (!account) return null;
  return {
    phone: account.phone,
    name: account.name,
    addresses: account.addresses.map((a) => ({ id: a.id, recipient: a.recipient, address: a.address })),
  };
}
