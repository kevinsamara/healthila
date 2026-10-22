"use server";

import { parsePhoneNumberFromString } from "libphonenumber-js";
import { after } from "next/server";
import { z } from "zod";
import { sendToStaffGroup } from "@/lib/notify";
import { rupiah } from "@/lib/format";
import { webRpc, WebRpcError } from "@/lib/web-rpc";

/**
 * Corporate / bulk inquiry → web_corporate_request (healthila-crm 0106) and a
 * heads-up in the staff group (SORTIR_GROUP_ID, like parcel consultations).
 */

const Input = z.object({
  company: z.string().trim().min(1, "Nama perusahaan / instansi wajib diisi").max(120),
  name: z.string().trim().min(1, "Nama wajib diisi").max(120),
  phone: z.string().trim().min(1, "Nomor WhatsApp wajib diisi"),
  email: z.string().trim().max(120).email("Email tidak valid").or(z.literal("")),
  needs: z.string().min(1, "Pilih kebutuhan").max(60),
  quantity: z.number().int().min(1).max(100_000).nullable(),
  budget: z.number().int().min(0).max(100_000_000).nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  notes: z.string().max(1000),
});

export type CorporateInput = z.infer<typeof Input>;

export async function submitCorporate(raw: CorporateInput): Promise<{ ok: true; code: string } | { ok: false; error: string }> {
  const parsed = Input.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Data belum lengkap" };
  const d = parsed.data;
  const phone = parsePhoneNumberFromString(d.phone, "ID");
  if (!phone || !phone.isValid()) return { ok: false, error: "Nomor WhatsApp tidak valid. Contoh: 0812 3456 7890" };

  try {
    const res = await webRpc<{ code: string }>("web_corporate_request", {
      p: {
        company: d.company,
        name: d.name,
        phone_e164: phone.number,
        email: d.email,
        needs: d.needs,
        quantity: d.quantity,
        budget_per_pack_idr: d.budget,
        needed_date: d.date,
        notes: d.notes,
      },
    });
    after(() => notifyStaff(res.code, phone.number, d));
    return { ok: true, code: res.code };
  } catch (e) {
    return { ok: false, error: e instanceof WebRpcError && e.friendly ? e.message : "Gagal mengirim. Silakan coba lagi." };
  }
}

async function notifyStaff(code: string, phone: string, d: CorporateInput) {
  const target = process.env.SORTIR_GROUP_ID;
  if (!target) return;
  const date = d.date ? new Date(d.date + "T00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" }) : "-";
  const msg = [
    "💼 *PERMINTAAN KORPORAT BARU*",
    `*${code}*`,
    "",
    `🏢 ${d.company}`,
    `👤 ${d.name} · 📱 ${phone}${d.email ? ` · ✉️ ${d.email}` : ""}`,
    `🎯 ${d.needs}${d.quantity ? ` · ${d.quantity} paket` : ""}${d.budget ? ` · ±${rupiah(d.budget)}/paket` : ""}`,
    `📅 Dibutuhkan: ${date}`,
    d.notes ? `\n📝 ${d.notes}` : null,
    "",
    "_Tindak lanjuti di Healthila OS › Website › Pesanan Korporat_",
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
  const r = await sendToStaffGroup(msg);
  if (!r.ok) console.error("[notify] corporate", code, r.detail);
}
