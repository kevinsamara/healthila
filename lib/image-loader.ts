/**
 * next/image loader. Vercel's built-in optimizer is quota-limited on our plan
 * (it answered 402 once the quota ran out, breaking new product photos), so
 * Supabase Storage photos are resized by our own /img route (sharp) and cached
 * on Vercel's CDN. Local files in /public are served as they are.
 */
const STORAGE = "/storage/v1/object/public/";

export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const i = src.indexOf(STORAGE);
  if (i === -1 || !/^https:\/\/[a-z0-9-]+\.supabase\.co\//.test(src)) return src;
  return `/img?p=${encodeURIComponent(src.slice(i + STORAGE.length))}&w=${width}&q=${quality ?? 75}`;
}
