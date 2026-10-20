"use server";

import { parsePhoneNumberFromString } from "libphonenumber-js";
import { after } from "next/server";
import { z } from "zod";
import { sendWhatsApp } from "@/lib/fonnte";
import { rupiah } from "@/lib/format";
import { sessionToken } from "@/lib/session";
import { webRpc, WebRpcError } from "@/lib/web-rpc";

/**
 * Saves a parcel consultation to the CRM (web_parcel_request, healthila-crm
 * migration 0101) and posts it to the same staff WhatsApp group as new web
 * orders. It is a lead: no prices, staff follow up on WhatsApp.
 */

const Input = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(120),
  phone: z.string().trim().min(1, "Nomor WhatsApp wajib diisi"),
  shape: z.string().min(1).max(40),
  occasion: z.string().max(60).nullable(),
  budget: z.number().int().min(100_000).max(100_000_000).nullable(),
  fruits: z.array(z.string().min(1).max(80)).min(1, "Pilih minimal satu buah").max(40),
  ribbon: z.string().max(40).nullable(),
  cardStyle: z.string().max(40),
  addons: z.number().int().min(0).max(1_000_000),
  minPrice: z.number().int().min(0).max(100_000_000),
  cardTo: z.string().max(120),
  cardFrom: z.string().max(120),
  cardMessage: z.string().max(300),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  notes: z.string().max(500),
});

export type ParcelRequestInput = z.infer<typeof Input>;

export async function submitParcelRequest(
  raw: ParcelRequestInput,
): Promise<{ ok: true; code: string } | { ok: false; error: string }> {
  const parsed = Input.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Data belum lengkap" };
  const d = parsed.data;
  const phone = parsePhoneNumberFromString(d.phone, "ID");
  if (!phone || !phone.isValid()) return { ok: false, error: "Nomor WhatsApp tidak valid. Contoh: 0812 3456 7890" };

  try {
    const res = await webRpc<{ code: string; customer: boolean; verified: boolean; phone: string }>("web_parcel_request", {
      p_session_token: await sessionToken(),
      p: {
        phone_e164: phone.number,
        name: d.name,
        shape: d.shape,
        occasion: d.occasion,
        budget_idr: d.budget,
        fruits: d.fruits,
        ribbon: d.ribbon,
        card_style: d.cardStyle,
        addons_idr: d.addons,
        min_price_idr: d.minPrice,
        card_to: d.cardTo,
        card_from: d.cardFrom,
        card_message: d.cardMessage,
        needed_date: d.date,
        notes: d.notes,
      },
    });
    after(() => notifyStaff(res, d));
    return { ok: true, code: res.code };
  } catch (e) {
    return { ok: false, error: e instanceof WebRpcError && e.friendly ? e.message : "Gagal menyimpan konsultasi. Silakan coba lagi." };
  }
}

async function notifyStaff(res: { code: string; customer: boolean; verified: boolean; phone: string }, d: ParcelRequestInput) {
  const target = process.env.SORTIR_GROUP_ID;
  if (!target) return;
  const date = d.date
    ? new Date(d.date + "T00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })
    : "-";
  const msg = [
    "🧺 *KONSULTASI PARCEL BARU* (dari website)",
    "_Belum order — admin hubungi untuk rekomendasi & harga_",
    "",
    `*${res.code}*`,
    `${res.customer ? "🔁 Customer LAMA" : "🆕 Belum terdaftar"}${res.verified ? " · ✅ nomor terverifikasi" : ""}`,
    "",
    `👤 ${d.name}`,
    `📱 ${res.phone}`,
    `🧺 ${d.shape} · 🎉 ${d.occasion ?? "-"}`,
    `💰 Budget ${d.budget ? rupiah(d.budget) : "-"}`,
    `🍇 ${d.fruits.join(", ")}`,
    `🎀 Pita: ${d.ribbon ?? "-"} · 💌 ${d.cardStyle}`,
    d.addons ? `➕ Add-on: ${rupiah(d.addons)} · estimasi mulai ${rupiah(d.minPrice)}` : `Estimasi mulai ${rupiah(d.minPrice)}`,
    `📅 Dibutuhkan: ${date}`,
    d.cardMessage.trim() ? `💌 "${d.cardMessage.trim()}"${d.cardTo ? ` — untuk ${d.cardTo}` : ""}${d.cardFrom ? `, dari ${d.cardFrom}` : ""}` : null,
    d.notes.trim() ? `📝 ${d.notes.trim()}` : null,
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
  const sent = await sendWhatsApp(target, msg);
  if (!sent.ok) console.error("[notify] parcel request", res.code, sent.detail);
}
