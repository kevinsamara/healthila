"use server";

import { parsePhoneNumberFromString } from "libphonenumber-js";
import { redirect } from "next/navigation";
import { sendWhatsApp } from "@/lib/fonnte";
import { clearSession, sessionToken, startSession } from "@/lib/session";
import { webRpc, WebRpcError } from "@/lib/web-rpc";

type Result = { ok: true; phone: string } | { ok: false; error: string };

function normalize(raw: string) {
  const p = parsePhoneNumberFromString(raw.trim(), "ID");
  return p && p.isValid() ? p.number : null;
}

export async function requestOtp(rawPhone: string): Promise<Result> {
  const phone = normalize(rawPhone);
  if (!phone) return { ok: false, error: "Nomor WhatsApp tidak valid. Contoh: 0812 3456 7890" };
  try {
    const { code } = await webRpc<{ code: string }>("web_otp_request", { p_phone_e164: phone });
    const sent = await sendWhatsApp(
      phone.replace(/^\+/, ""),
      `Kode masuk Healthila: *${code}*\n\nBerlaku 5 menit. Jangan bagikan kode ini kepada siapa pun, termasuk yang mengaku dari Healthila.`,
    );
    if (!sent.ok) {
      console.error("[otp] send failed", sent.detail);
      return { ok: false, error: "Kode gagal dikirim ke WhatsApp. Pastikan nomor aktif di WhatsApp, lalu coba lagi." };
    }
    return { ok: true, phone };
  } catch (e) {
    return { ok: false, error: e instanceof WebRpcError ? e.message : "Terjadi kesalahan, silakan coba lagi." };
  }
}

export async function verifyOtp(phone: string, code: string): Promise<{ ok: false; error: string } | { ok: true; askBirthDate: boolean }> {
  if (!/^\+[1-9]\d{7,14}$/.test(phone) || !/^\d{6}$/.test(code.trim())) {
    return { ok: false, error: "Masukkan 6 digit kode dari WhatsApp." };
  }
  try {
    const { token, expires_in } = await webRpc<{ token: string; expires_in: number }>("web_otp_verify", {
      p_phone_e164: phone,
      p_code: code.trim(),
    });
    await startSession(token, expires_in);
    // First login: ask the birth date once (birthday voucher).
    const profile = await webRpc<{ birth_date: string | null; asked: boolean }>("web_profile_manage", {
      p_session_token: token,
      p_action: "get",
      p: {},
    }).catch(() => null);
    return { ok: true, askBirthDate: !!profile && !profile.asked && !profile.birth_date };
  } catch (e) {
    return { ok: false, error: e instanceof WebRpcError ? e.message : "Terjadi kesalahan, silakan coba lagi." };
  }
}

export async function logout() {
  const token = await sessionToken();
  if (token) await webRpc("web_session_end", { p_token: token }).catch(() => undefined);
  await clearSession();
  redirect("/");
}
