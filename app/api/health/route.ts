import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
/**
 * GET /api/health — which server settings are present on this deployment
 * (true/false only; values are never returned).
 */
export async function GET() {
  const has = (k: string) => !!process.env[k];
  return NextResponse.json(
    {
      supabase: has("NEXT_PUBLIC_SUPABASE_URL") && has("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      orders: has("WEB_ORDER_SECRET"),
      whatsappOtp: has("FONNTE_TOKEN"),
      newOrderNotification: has("FONNTE_TOKEN") && has("SORTIR_GROUP_ID"),
      googleReviews: has("GOOGLE_PLACES_API_KEY") || has("GOOGLE_MAPS_API_KEY"),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
