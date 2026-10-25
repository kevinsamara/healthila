import { NextResponse } from "next/server";
import { updateTag } from "next/cache";

/**
 * POST /api/revalidate — bust catalog cache after CRM edits.
 *
 * Dipakai setelah admin ubah harga/parcel di Healthila OS: tanpa ini,
 * perubahan baru tampil setelah TTL unstable_cache (5 menit, lihat
 * lib/catalog.ts). Panggil dari CRM atau tombol manual.
 *
 * Protected by REVALIDATE_SECRET env var. Tanpa secret di-set, endpoint
 * disabled supaya tidak jadi vektor untuk flooding Supabase.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "REVALIDATE_SECRET not set" }, { status: 503 });
  }
  const url = new URL(request.url);
  const token = url.searchParams.get("secret") ?? request.headers.get("x-revalidate-secret");
  if (token !== secret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const tag = url.searchParams.get("tag") ?? "catalog";
  // Next 16 renamed classic revalidateTag(tag) → updateTag(tag). The new
  // revalidateTag(tag, profile) is for cache-life profiles; we just want to
  // invalidate the tag so unstable_cache re-fetches on next request.
  updateTag(tag);
  return NextResponse.json({ ok: true, tag });
}

export async function GET(request: Request) {
  // GET juga diterima supaya admin bisa klik link langsung dari dashboard.
  return POST(request);
}
