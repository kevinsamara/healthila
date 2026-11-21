"use server";

import { revalidatePath } from "next/cache";
import { sendWhatsApp } from "@/lib/fonnte";
import {
  createBroadcast,
  finishBroadcast,
  markOrderDelivered,
  recordBroadcastRecipient,
  sampleAudience,
  updateOrderItems,
  type OrderItemOp,
  type SaasAudienceEntry,
} from "@/lib/saas/orders";

/* ------- order item edits ------- */

export async function saveOrderItemsAction(orderId: string, ops: OrderItemOp[]) {
  if (!ops.length) return { ok: true as const, changed: 0 };
  try {
    await updateOrderItems(orderId, ops);
    revalidatePath(`/saas/demo/pesanan/${orderId}`);
    revalidatePath("/saas/demo/pesanan");
    return { ok: true as const, changed: ops.length };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "gagal menyimpan" };
  }
}

/* ------- send delivery notice ------- */

/** Send a WA notice to the customer and mark the order delivered.
 *  Sends FIRST; only marks delivered after WA send confirms. */
export async function sendDeliveryNoticeAction(input: {
  orderId: string;
  phone: string | null;
  customerName: string | null;
  code: string;
  message?: string;
}) {
  const phone = cleanPhone(input.phone);
  if (!phone) return { ok: false as const, error: "Nomor WA pelanggan tidak ada" };

  const body =
    input.message?.trim() ||
    `Halo ${input.customerName ?? "Kak"} 👋\n\nPesanan *${input.code}* sudah dikirim dan sebentar lagi sampai. Terima kasih sudah belanja di Healthila 🧡`;

  const res = await sendWhatsApp(phone, body);
  if (!res.ok) {
    return { ok: false as const, error: res.detail ?? "Fonnte gagal kirim" };
  }

  try {
    await markOrderDelivered(input.orderId, "Dikirim via /saas/demo");
  } catch (e) {
    return { ok: true as const, delivered: false, note: "WA terkirim tapi gagal update status: " + (e instanceof Error ? e.message : "") };
  }

  revalidatePath(`/saas/demo/pesanan/${input.orderId}`);
  revalidatePath("/saas/demo/pesanan");
  return { ok: true as const, delivered: true };
}

/* ------- broadcast ------- */

export async function previewBroadcastAction(limit: number, loyalOnly: boolean) {
  try {
    const rows = await sampleAudience(Math.min(Math.max(limit, 1), 100), loyalOnly);
    return { ok: true as const, rows };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "gagal mengambil audience" };
  }
}

/** Fire a real WA broadcast via Fonnte to the sampled audience. */
export async function sendBroadcastAction(input: {
  name: string;
  message: string;
  audience: SaasAudienceEntry[];
  confirm: string;
}) {
  if (input.confirm !== "KIRIM") {
    return { ok: false as const, error: "Ketik KIRIM untuk konfirmasi" };
  }
  if (!input.audience.length) {
    return { ok: false as const, error: "Tidak ada penerima" };
  }

  let bcId: string;
  try {
    bcId = await createBroadcast(input.name || "Broadcast tanpa nama", input.message, input.audience.length);
  } catch (e) {
    return { ok: false as const, error: "Gagal buat broadcast: " + (e instanceof Error ? e.message : "") };
  }

  let sent = 0;
  let failed = 0;
  for (const entry of input.audience) {
    const rendered = input.message.replace(/\{\{nama\}\}/g, entry.name ?? "Kak");
    const phone = cleanPhone(entry.phone_e164);
    if (!phone) {
      failed++;
      await safeRecord(bcId, entry, rendered, "failed", "no phone");
      continue;
    }
    const res = await sendWhatsApp(phone, rendered);
    if (res.ok) {
      sent++;
      await safeRecord(bcId, entry, rendered, "sent");
    } else {
      failed++;
      await safeRecord(bcId, entry, rendered, "failed", res.detail);
    }
    // small jitter to look more human and not spam Fonnte queue
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 400));
  }

  try {
    await finishBroadcast(bcId);
  } catch {
    // non-fatal
  }

  revalidatePath("/saas/demo/broadcast");
  return { ok: true as const, bcId, sent, failed };
}

async function safeRecord(
  bcId: string,
  entry: SaasAudienceEntry,
  rendered: string,
  status: "sent" | "failed",
  detail?: string,
) {
  try {
    await recordBroadcastRecipient(bcId, entry, rendered, status, detail);
  } catch {
    // ignore record failures so the broadcast keeps moving
  }
}

/** Normalize a phone to digits only (Fonnte expects something like 62812...). */
function cleanPhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return null;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("8")) return "62" + digits;
  return digits;
}
