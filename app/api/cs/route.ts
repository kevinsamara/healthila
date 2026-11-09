import { headers } from "next/headers";
import { csSystemPrompt } from "@/lib/knowledge";
import { site, waLink } from "@/lib/site";
import { webSecret } from "@/lib/web-rpc";

export const maxDuration = 60;

const CRM_URL = (process.env.CRM_URL || "https://crm.healthila.id").replace(/\/$/, "");
const MAX_TURNS = 12; // messages sent to the model per conversation
const MAX_CHARS = 500;
const LIMIT = 20; // questions per visitor per window
const WINDOW_MS = 10 * 60_000;
const hits = new Map<string, number[]>();

const text = (body: string, status = 200) => new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
const SORRY = `Maaf, CS otomatis sedang tidak bisa menjawab. Silakan chat admin kami di WhatsApp ${site.whatsappDisplay} ya, Kak.`;

/** Every answer costs money: per-instance limit, enough to stop one visitor looping. */
function allowed(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) return false;
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return true;
}

/** POST { messages } from the /cs page → streamed plain-text answer (through Healthila OS, which holds the AI key). */
export async function POST(req: Request) {
  const h = await headers();
  const origin = h.get("origin");
  if (origin && new URL(origin).host !== h.get("host")) return text("forbidden", 403);
  if (!allowed(h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown")) {
    return text(`Pertanyaannya sudah banyak nih, Kak. Coba lagi beberapa menit lagi, atau chat admin: ${waLink()}`, 429);
  }

  const b = (await req.json().catch(() => null)) as { messages?: { role?: string; content?: string }[] } | null;
  const messages = (b?.messages ?? []).slice(-MAX_TURNS);
  while (messages[0]?.role === "assistant") messages.shift();
  const valid =
    messages.length > 0 &&
    messages.every((m, i) => m.role === (i % 2 ? "assistant" : "user") && typeof m.content === "string" && m.content.trim()) &&
    messages[messages.length - 1]!.role === "user" &&
    messages[messages.length - 1]!.content!.length <= MAX_CHARS;
  if (!valid) return text("Pertanyaannya belum bisa dibaca, Kak. Coba tulis ulang ya.", 422);

  // Forward visitor IP ke webapp supaya rate limit per-IP di sana (0164:
  // cs_chat_rate_limits) beneran per-visitor, bukan satu bucket "unknown".
  // Storefront sudah punya in-memory limit sendiri; ini jadi defense berikutnya.
  const visitorIp = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  try {
    const res = await fetch(`${CRM_URL}/api/public/cs-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${webSecret() ?? ""}`,
        "X-Visitor-IP": visitorIp,
      },
      body: JSON.stringify({ system: await csSystemPrompt(), messages }),
      signal: AbortSignal.timeout(55_000),
    });
    if (!res.ok || !res.body) {
      console.error("[cs]", res.status);
      return text(SORRY, 502);
    }
    return new Response(res.body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[cs]", e instanceof Error ? e.message : e);
    return text(SORRY, 502);
  }
}
