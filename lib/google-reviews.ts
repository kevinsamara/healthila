import "server-only";

/**
 * Google reviews for the Healthila Maps listing via Places API (New).
 * Needs GOOGLE_PLACES_API_KEY (server-only, Places API enabled). The place is
 * GOOGLE_PLACE_ID when set, otherwise found once by text search. Google
 * returns at most 5 reviews; responses are cached for a day. Returns null when
 * not configured or on any error so the page falls back to static quotes.
 */

export type GoogleReview = {
  author: string;
  authorUri: string | null;
  photo: string | null;
  rating: number;
  text: string;
  when: string;
};

export type GoogleReviews = {
  rating: number;
  count: number;
  mapsUri: string | null;
  reviews: GoogleReview[];
};

const API = "https://places.googleapis.com/v1";
const DAY = 60 * 60 * 24;

async function resolvePlaceId(key: string): Promise<string | null> {
  if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;
  const res = await fetch(`${API}/places:searchText`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": "places.id" },
    body: JSON.stringify({ textQuery: "Healthila Buah Fresh & Parcel Buah Malang", languageCode: "id" }),
    next: { revalidate: DAY },
  });
  if (!res.ok) throw new Error(`searchText ${res.status}`);
  const json = (await res.json()) as { places?: { id: string }[] };
  return json.places?.[0]?.id ?? null;
}

export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return null;
  try {
    const id = await resolvePlaceId(key);
    if (!id) return null;
    const res = await fetch(`${API}/places/${id}?languageCode=id`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews" },
      next: { revalidate: DAY },
    });
    if (!res.ok) throw new Error(`details ${res.status}`);
    const p = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: {
        rating?: number;
        relativePublishTimeDescription?: string;
        text?: { text?: string };
        originalText?: { text?: string };
        authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
      }[];
    };
    const reviews = (p.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Pelanggan Healthila",
        authorUri: r.authorAttribution?.uri ?? null,
        photo: r.authorAttribution?.photoUri ?? null,
        rating: r.rating ?? 0,
        text: (r.originalText?.text ?? r.text?.text ?? "").trim(),
        when: r.relativePublishTimeDescription ?? "",
      }))
      .filter((r) => r.rating >= 4 && r.text.length > 0);
    if (!p.rating) return null;
    return { rating: p.rating, count: p.userRatingCount ?? 0, mapsUri: p.googleMapsUri ?? null, reviews };
  } catch (e) {
    console.error("[google-reviews]", e instanceof Error ? e.message : e);
    return null;
  }
}
