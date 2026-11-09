/**
 * next/image loader. Vercel's built-in optimizer is quota-limited on our plan
 * (it answered 402 once the quota ran out, breaking new product photos), so
 * Supabase Storage photos are resized by our own /img route (sharp) and cached
 * on Vercel's CDN. Local files in /public are served as they are.
 *
 * Accepts two URL shapes (both from the shared Supabase project):
 *   - Legacy: https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
 *   - CDN:    https://cdn.healthila.id/<bucket>/<path>  (Cloudflare Worker)
 * Both map to /img?p=<bucket>/<path>&w=…&q=… so the same sharp resizer
 * handles them.
 */
const STORAGE = "/storage/v1/object/public/";
const CDN_PREFIX = "https://cdn.healthila.id/";

export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith(CDN_PREFIX)) {
    return `/img?p=${encodeURIComponent(src.slice(CDN_PREFIX.length))}&w=${width}&q=${quality ?? 75}`;
  }
  const i = src.indexOf(STORAGE);
  if (i === -1 || !/^https:\/\/[a-z0-9-]+\.supabase\.co\//.test(src)) return src;
  return `/img?p=${encodeURIComponent(src.slice(i + STORAGE.length))}&w=${width}&q=${quality ?? 75}`;
}
