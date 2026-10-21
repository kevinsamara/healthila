import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Curated testimonials written in Healthila OS (/dashboard/testimonials),
 * read from web_testimonials_public (healthila-crm migration 0103).
 */
export type Testimonial = {
  id: string;
  name: string;
  quote: string;
  rating: number;
  source: "google" | "instagram" | "whatsapp" | "langsung";
  city: string | null;
  review_date: string | null;
  link: string | null;
};

export async function getTestimonials(): Promise<Testimonial[]> {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
  const { data, error } = await db.from("web_testimonials_public").select("*");
  if (error) {
    console.error("[testimonials]", error.message);
    return [];
  }
  return data as Testimonial[];
}
