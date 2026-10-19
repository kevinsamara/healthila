import "server-only";

/**
 * WhatsApp send via Fonnte (same device as the CRM). Server-only: the token
 * comes from FONNTE_TOKEN and never reaches the browser. Never throws.
 */
export async function sendWhatsApp(targetDigits: string, message: string): Promise<{ ok: boolean; detail?: string }> {
  const token = process.env.FONNTE_TOKEN;
  if (!token) return { ok: false, detail: "FONNTE_TOKEN not set" };
  try {
    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({ target: targetDigits, message }),
    });
    // Fonnte answers HTTP 200 even on logical failure: {status:false, reason}.
    const json = (await res.json().catch(() => null)) as { status?: boolean; reason?: string } | null;
    return { ok: res.ok && json?.status === true, detail: json?.reason };
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : "network error" };
  }
}
