import { NextResponse } from "next/server";
import { loadGoogleReviews } from "@/lib/google-reviews";

/**
 * GET /api/google-reviews — live check of the Google reviews setup (which step
 * fails and Google's error message). Never returns the API key.
 */
export async function GET() {
  const r = await loadGoogleReviews({ cache: "no-store" });
  return NextResponse.json(
    {
      ok: r.ok,
      step: r.step,
      httpStatus: r.httpStatus ?? null,
      message: r.message ?? null,
      placeId: r.placeId ?? null,
      rating: r.data?.rating ?? null,
      reviewCount: r.data?.count ?? null,
      reviewsReturned: r.data?.reviews.length ?? 0,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
