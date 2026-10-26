import sharp from "sharp";

/**
 * Resized product/parcel/article photos for next/image (see lib/image-loader).
 * Only public Supabase Storage objects, only the widths next/image asks for;
 * responses are immutable (photo file names are unique per upload) so Vercel's
 * CDN serves repeats without running this function again.
 */
export const runtime = "nodejs";

const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://rkagmdyjikujenzxngmm.supabase.co"}/storage/v1/object/public/`;
const WIDTHS = new Set([16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]);
const BUCKETS = new Set(["product-photos", "web-parcel", "web-articles", "site-assets"]);
const MAX_WIDTH = 1600; // larger requests get this size (photos are ≤ ~1600px useful on the site)

export async function GET(req: Request) {
  const url = new URL(req.url);
  const path = url.searchParams.get("p") ?? "";
  const w = Number(url.searchParams.get("w"));
  const q = Math.min(90, Math.max(40, Number(url.searchParams.get("q")) || 75));
  const bucket = path.split("/")[0];
  if (!WIDTHS.has(w) || !BUCKETS.has(bucket) || !/^[^\0-\x1f?#]+\.(jpe?g|png|webp|gif|avif)$/i.test(path) || path.includes("..")) {
    return new Response("bad request", { status: 400 });
  }

  const src = await fetch(BASE + path.split("/").map(encodeURIComponent).join("/"), { cache: "no-store" });
  if (!src.ok) return new Response("not found", { status: src.status === 404 ? 404 : 502 });
  const input = Buffer.from(await src.arrayBuffer());

  try {
    const out = await sharp(input, { failOn: "none" })
      .rotate()
      .resize({ width: Math.min(w, MAX_WIDTH), withoutEnlargement: true })
      .webp({ quality: q })
      .toBuffer();
    return new Response(new Uint8Array(out), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "CDN-Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    // Not decodable by sharp: hand back the original bytes.
    return new Response(new Uint8Array(input), {
      headers: { "Content-Type": src.headers.get("content-type") ?? "image/jpeg", "Cache-Control": "public, max-age=86400" },
    });
  }
}
