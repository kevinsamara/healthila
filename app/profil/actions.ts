"use server";

import { revalidatePath } from "next/cache";
import { sessionToken } from "@/lib/session";
import { webRpc, WebRpcError } from "@/lib/web-rpc";

/** Birth date for the birthday voucher; "skip" only stops the first-login prompt. */
export async function saveBirthDate(date: string | null): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await sessionToken();
  if (!token) return { ok: false, error: "Silakan masuk dulu." };
  try {
    await webRpc("web_profile_manage", {
      p_session_token: token,
      p_action: date ? "set" : "skip",
      p: date ? { birth_date: date } : {},
    });
    revalidatePath("/akun");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof WebRpcError && e.friendly ? e.message : "Gagal menyimpan, coba lagi." };
  }
}
