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

/** Screenshots of customer chats/reviews (healthila-crm migration 0145). */
export type TestimonialShot = {
  id: string;
  image_url: string;
  caption: string | null;
  source: Testimonial["source"];
};

export async function getTestimonialShots(): Promise<TestimonialShot[]> {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
  const { data, error } = await db
    .from("web_testimonial_shots_public")
    .select("id, image_url, caption, source")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[testimonial shots]", error.message);
    return [];
  }
  return data as TestimonialShot[];
}
