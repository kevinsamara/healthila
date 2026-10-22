import "server-only";
import { rupiah } from "./format";
import { sendWhatsApp } from "./fonnte";

/**
 * "Pesanan website baru" post to the sortir/ops WhatsApp group
 * (SORTIR_GROUP_ID, same value as the CRM). No fallback to another group:
 * without the env nothing is sent. The message is marked BELUM DIKONFIRMASI
 * so the team doesn't prep it before admin confirms over WhatsApp.
 */

export type PlacedOrder = {
  code: string;
  customer_status: "new" | "existing";
  prev_orders: number;
  verified: boolean;
  subtotal: number;
  free_shipping_max: number | null;
  web_order_number: number | null;
  slot: string | null;
  payment: string | null;
  pay_amount: number | null;
  pay_expires_at: string | null;
  name: string;
  phone: string;
  address: string;
  delivery_date: string;
  notes: string | null;
  items: { name: string; quantity: number; unit: string | null; total: number }[] | null;
};

/**
 * Marker the Healthila OS WhatsApp importer skips (lib/import/ingest.ts
 * looksLikeRecap, same as its own sortir recaps). Without it the importer
 * turned this notification into a second, garbled order.
 */
export function noImportTag(date = new Date()) {
  const d = date.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  return `[HLTHOS-WEB-${d}]`;
}

/** Post to the staff/sortir group (SORTIR_GROUP_ID), always tagged. */
export async function sendToStaffGroup(message: string) {
  const target = process.env.SORTIR_GROUP_ID;
  if (!target) return { ok: false as const, detail: "SORTIR_GROUP_ID not set" };
  return sendWhatsApp(target, `${message}

${noImportTag()}`);
}

export async function notifyNewWebOrder(o: PlacedOrder) {
  const target = process.env.SORTIR_GROUP_ID;
  if (!target) {
    console.warn("[notify] SORTIR_GROUP_ID not set — skipping new-order notification");
    return;
  }
  const res = await sendToStaffGroup(formatMessage(o));
  if (!res.ok) console.error("[notify] new order", o.code, res.detail);
}

function formatMessage(o: PlacedOrder) {
  const qty = (n: number) => (Number.isInteger(n) ? String(n) : String(n).replace(".", ","));
  // Packaging units carry their own size ("1 kg") → "2 × 1 kg"; base units read "1,5 kg".
  const amount = (n: number, unit: string | null) =>
    !unit ? qty(n) : /^\d/.test(unit) ? `${qty(n)} × ${unit}` : `${qty(n)} ${unit}`;
  const customer =
    o.customer_status === "new"
      ? "🆕 Customer BARU"
      : o.prev_orders > 0
        ? `🔁 Customer LAMA (${o.prev_orders} order sebelumnya)`
        : "🔁 Customer LAMA (belum pernah order)";
  const date = new Date(o.delivery_date + "T00:00").toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return [
    "🌐 *PESANAN WEBSITE BARU*",
    o.payment === "qris"
      ? `💳 _Pembeli memilih BAYAR QRIS ${rupiah(Number(o.pay_amount))} — tunggu bukti bayar & verifikasi (batas ${new Date(o.pay_expires_at ?? "").toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit" })} WIB)_`
      : "⚠️ _BELUM DIKONFIRMASI — tunggu admin konfirmasi ongkir & pembayaran sebelum disiapkan_",
    "",
    `*${o.code}*`,
    `${customer}${o.verified ? " · ✅ nomor terverifikasi" : ""}`,
    "",
    `👤 ${o.name}`,
    `📱 ${o.phone}`,
    `📍 ${o.address}`,
    `📅 Kirim ${date}${o.slot ? ` · 🕐 ${o.slot}` : ""}`,
    "",
    ...(o.items ?? []).map((i) => `• ${i.name} — ${amount(i.quantity, i.unit)} = ${rupiah(i.total)}`),
    "",
    o.payment === "qris" ? `*Total bayar: ${rupiah(Number(o.pay_amount))}* (sudah termasuk ongkir)` : `*Subtotal: ${rupiah(o.subtotal)}* (belum ongkir)`,
    o.free_shipping_max
      ? `🚚 *FREEONGKIR* (pembelian website ke-${o.web_order_number}) — ongkir ditanggung s.d. ${rupiah(o.free_shipping_max)}`
      : null,
    o.notes ? `\n📝 ${o.notes}` : null,
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}
