"use server";

import { createClient } from "@supabase/supabase-js";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";

/**
 * Saves the cart as an order in the CRM via web_place_order (healthila-crm
 * migration 0094). Prices are re-derived in the database; the browser only
 * says which product, packaging and how much.
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
  | { ok: true; code: string; customerStatus: "new" | "existing" | null; phoneE164: string }
  | { ok: false; error: string; fallback?: boolean };

export async function placeOrder(raw: PlaceOrderInput): Promise<PlaceOrderResult> {
  const parsed = Input.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Data pesanan tidak valid" };
  const input = parsed.data;

  const phone = parsePhoneNumberFromString(input.phone, "ID");
  if (!phone || !phone.isValid()) return { ok: false, error: "Nomor WhatsApp tidak valid. Contoh: 0812 3456 7890" };

  const secret = process.env.WEB_ORDER_SECRET;
  if (!secret) {
    console.error("[order] WEB_ORDER_SECRET is not set");
    // Not configured on this deployment: let the client fall back to a plain WhatsApp order.
    return { ok: false, error: "Sistem pesanan belum siap.", fallback: true };
  }

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
  const { data, error } = await db.rpc("web_place_order", {
    p_secret: secret,
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
  });

  if (error) {
    console.error("[order] web_place_order", error.message);
    // Validation messages from the database are written for shoppers (stok habis, dll).
    const friendly = /habis|tidak valid|wajib|terlalu banyak|tidak tersedia|belum tersedia/i.test(error.message);
    return { ok: false, error: friendly ? capitalize(error.message) : "Pesanan gagal disimpan. Silakan coba lagi." };
  }

  const res = data as { code: string; customer_status?: "new" | "existing" };
  return { ok: true, code: res.code, customerStatus: res.customer_status ?? null, phoneE164: phone.number };
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
