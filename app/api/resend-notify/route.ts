import { createHash, timingSafeEqual } from "node:crypto";
import { notifyNewWebOrder, type PlacedOrder } from "@/lib/notify";

/**
 * TEMPORARY (Nov 2026): resend one missed new-order notification to the staff
 * group after the switch to FONNTE_TOKEN_OPS. Guarded by a one-off random
 * token (only its sha256 is here). Delete this route after use.
 */
const TOKEN_SHA256 = "29c7dab3ca8a5d40a0c6ea5d8096d265bdb36a1f3c2930a74139bce2e4bc85b1";

export async function POST(req: Request) {
  const b = (await req.json().catch(() => null)) as { token?: string; order?: PlacedOrder } | null;
  const got = createHash("sha256").update(b?.token ?? "").digest();
  if (!timingSafeEqual(got, Buffer.from(TOKEN_SHA256, "hex")) || !b?.order?.code) return new Response("forbidden", { status: 403 });
  const res = await notifyNewWebOrder(b.order, "🔁 KIRIM ULANG (notifikasi sebelumnya tidak terkirim)\n\n");
  return Response.json({ ok: res.ok, detail: res.detail ?? null });
}
