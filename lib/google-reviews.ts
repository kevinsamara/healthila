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
  /** Listing details for the Kontak page. */
  address: string | null;
  phone: string | null;
  /** e.g. ["Senin: 07.00–20.00", …] in Indonesian, Monday first. */
  hours: string[];
  openNow: boolean | null;
};

const API = "https://places.googleapis.com/v1";
// An hour, so a fix to the key/API setting shows up the same day.
const TTL = 60 * 60;

export type ReviewsStatus = {
  ok: boolean;
  step: "no_key" | "search" | "no_place" | "details" | "no_rating" | "ok";
  httpStatus?: number;
  message?: string;
  placeId?: string;
  data?: GoogleReviews;
};

type Fetch = { next?: { revalidate: number }; cache?: RequestCache };

async function googleError(res: Response) {
  const j = (await res.json().catch(() => null)) as {
    error?: { message?: string; status?: string };
  } | null;
  return j?.error?.message ?? j?.error?.status ?? res.statusText;
}

/** Full lookup with the step that failed — used by the page and the status route. */
export async function loadGoogleReviews(
  opts: Fetch = { next: { revalidate: TTL } },
): Promise<ReviewsStatus> {
  // Same name as the CRM works too (GOOGLE_MAPS_API_KEY); the key needs Places API (New).
  const key =
    process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!key)
    return {
      ok: false,
      step: "no_key",
      message: "GOOGLE_PLACES_API_KEY / GOOGLE_MAPS_API_KEY belum di-set",
    };
  try {
    let placeId = process.env.GOOGLE_PLACE_ID || null;
    if (!placeId) {
      const res = await fetch(`${API}/places:searchText`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "places.id,places.displayName",
        },
        body: JSON.stringify({
          textQuery: "Healthila Buah Fresh & Parcel Buah Malang",
          languageCode: "id",
        }),
        ...opts,
      });
      if (!res.ok)
        return {
          ok: false,
          step: "search",
          httpStatus: res.status,
          message: await googleError(res),
        };
      const json = (await res.json()) as { places?: { id: string }[] };
      placeId = json.places?.[0]?.id ?? null;
      if (!placeId)
        return {
          ok: false,
          step: "no_place",
          message: "Listing Healthila tidak ditemukan; set GOOGLE_PLACE_ID",
        };
    }
    const res = await fetch(`${API}/places/${placeId}?languageCode=id`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "rating,userRatingCount,googleMapsUri,reviews,formattedAddress,nationalPhoneNumber,regularOpeningHours,currentOpeningHours.openNow",
      },
      ...opts,
    });
    if (!res.ok)
      return {
        ok: false,
        step: "details",
        httpStatus: res.status,
        message: await googleError(res),
        placeId,
      };
    const p = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      formattedAddress?: string;
      nationalPhoneNumber?: string;
      regularOpeningHours?: { weekdayDescriptions?: string[] };
      currentOpeningHours?: { openNow?: boolean };
      reviews?: {
        rating?: number;
        relativePublishTimeDescription?: string;
        text?: { text?: string };
        originalText?: { text?: string };
        authorAttribution?: {
          displayName?: string;
          uri?: string;
          photoUri?: string;
        };
      }[];
    };
    if (!p.rating)
      return {
        ok: false,
        step: "no_rating",
        placeId,
        message: "Listing belum punya rating",
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
    return {
      ok: true,
      step: "ok",
      placeId,
      data: {
        rating: p.rating,
        count: p.userRatingCount ?? 0,
        mapsUri: p.googleMapsUri ?? null,
        reviews,
        address: p.formattedAddress ?? null,
        phone: p.nationalPhoneNumber ?? null,
        hours: p.regularOpeningHours?.weekdayDescriptions ?? [],
        openNow: p.currentOpeningHours?.openNow ?? null,
      },
    };
  } catch (e) {
    return {
      ok: false,
      step: "details",
      message: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  const r = await loadGoogleReviews();
  if (!r.ok)
    console.error(
      "[google-reviews]",
      r.step,
      r.httpStatus ?? "",
      r.message ?? "",
    );
  return r.data ?? null;
}
