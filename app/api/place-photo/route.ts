import { NextResponse } from "next/server";
import { getGoogleReviews } from "@/lib/google-reviews";

/**
 * GET /api/place-photo?n=<photo name>&w=<px> — a photo of the Healthila Google
 * Maps listing. Resolves the short-lived Google image URL server-side (the
 * API key never reaches the browser) and redirects to it. Only photos of our
 * own listing are allowed.
 */
export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const name = sp.get("n") ?? "";
  const width = Math.min(1200, Math.max(200, Number(sp.get("w")) || 600));
  const key = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!key || !/^places\/[\w-]+\/photos\/[\w-]+$/.test(name)) return new NextResponse(null, { status: 404 });

  // Photo resource names change between Places responses, so check the
  // (stable) place id prefix rather than an exact name from our cache.
  const place = await getGoogleReviews();
  const placeId = place?.photos[0]?.name.split("/")[1];
  if (!placeId || !name.startsWith(`places/${placeId}/photos/`)) return new NextResponse(null, { status: 404 });

  const res = await fetch(`https://places.googleapis.com/v1/${name}/media?maxWidthPx=${width}&skipHttpRedirect=true`, {
    headers: { "X-Goog-Api-Key": key },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    console.error("[place-photo]", res.status, (await res.text()).slice(0, 300));
    return new NextResponse(null, { status: 404 });
  }
  const uri = ((await res.json()) as { photoUri?: string }).photoUri;
  if (!uri) return new NextResponse(null, { status: 404 });
  return NextResponse.redirect(uri, { status: 302, headers: { "Cache-Control": "public, s-maxage=3000, max-age=600" } });
}
