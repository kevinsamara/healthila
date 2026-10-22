"use server";

import { after } from "next/server";
import { sendWhatsApp } from "@/lib/fonnte";
import { rupiah } from "@/lib/format";
import { getQrisPayment } from "@/lib/payment";
import { webSecret } from "@/lib/web-rpc";

const CRM_URL = (process.env.CRM_URL || "https://crm.healthila.id").replace(/\/$/, "");

/** Buyer uploads the QRIS payment screenshot → Healthila OS (private bucket). */
export async function uploadPaymentProof(code: string, key: string | null, form: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
  const pay = await getQrisPayment(code, key);
  if (!pay) return { ok: false, error: "Pesanan tidak ditemukan." };
  if (pay.status !== "awaiting" && pay.status !== "submitted")
    return { ok: false, error: pay.status === "expired" ? "Batas waktu pembayaran sudah lewat. Silakan hubungi admin via WhatsApp." : "Pesanan ini tidak menunggu pembayaran." };

  const photo = form.get("photo");
  if (!(photo instanceof File) || photo.size === 0) return { ok: false, error: "Pilih foto/screenshot bukti bayar." };
  if (photo.size > 8 * 1024 * 1024) return { ok: false, error: "Ukuran foto maksimal 8MB." };
  if (!photo.type.startsWith("image/")) return { ok: false, error: "File harus berupa gambar." };

  const body = new FormData();
  body.append("code", code);
  body.append("photo", photo, photo.name || "bukti.jpg");
  try {
    const res = await fetch(`${CRM_URL}/api/public/payment-proof`, {
      method: "POST",
      headers: { Authorization: `Bearer ${webSecret() ?? ""}` },
      body,
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) {
      const d = (await res.json().catch(() => ({}))) as { error?: string };
      return { ok: false, error: d.error ?? "Upload gagal, coba lagi." };
    }
  } catch {
    return { ok: false, error: "Upload gagal, coba lagi." };
  }

  after(async () => {
    const target = process.env.SORTIR_GROUP_ID;
    if (!target) return;
    await sendWhatsApp(
      target,
      [
        "💳 *BUKTI BAYAR QRIS MASUK*",
        `*${code}* — ${rupiah(pay.amount)} (kode unik ${pay.unique_code})`,
        "",
        "Cek nominal persis di mutasi QRIS, lalu klik *Lunas* di Healthila OS › Website › Verifikasi QRIS.",
      ].join("\n"),
    );
  });
  return { ok: true };
}
