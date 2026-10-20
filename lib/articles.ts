import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Articles are written in Healthila OS (/dashboard/articles) and read here
 * from the web_articles_public view (published only; healthila-crm migration
 * 0099). Body is plain text: blank line = paragraph, "## " = heading,
 * "- " lines = bullet list.
 */

export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string; // YYYY-MM-DD
  readMinutes: number;
  cover: { url: string | null; emoji: string; gradient: string };
  related: { label: string; href: string } | null;
  body: string[];
};

const THEMES: Record<string, string> = {
  leaf: "from-leaf-500 to-[#5fcf8f]",
  sun: "from-sun-300 to-sun-500",
  plum: "from-plum-500 to-coral-500",
  sky: "from-sky-500 to-cyan-300",
  coral: "from-coral-500 to-sun-400",
};

type Row = {
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  body: string;
  cover_url: string | null;
  cover_emoji: string;
  cover_theme: string;
  related_label: string | null;
  related_href: string | null;
  published_at: string;
};

function toArticle(r: Row): Article {
  const words = r.body.trim() ? r.body.trim().split(/\s+/).length : 0;
  return {
    slug: r.slug,
    title: r.title,
    category: r.category,
    excerpt: r.excerpt ?? "",
    date: r.published_at,
    readMinutes: Math.max(1, Math.round(words / 200)),
    cover: { url: r.cover_url, emoji: r.cover_emoji, gradient: THEMES[r.cover_theme] ?? THEMES.leaf },
    related: r.related_href ? { label: r.related_label || "Lihat produk", href: r.related_href } : null,
    body: r.body
      .split(/\n\s*\n/)
      .map((b) => b.trim())
      .filter(Boolean),
  };
}

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
}

export async function getArticles(): Promise<Article[]> {
  const { data, error } = await db().from("web_articles_public").select("*").order("published_at", { ascending: false });
  if (error) {
    console.error("[articles] list", error.message);
    return [];
  }
  return (data as Row[]).map(toArticle);
}

export async function getArticle(slug: string): Promise<Article | null> {
  const { data, error } = await db().from("web_articles_public").select("*").eq("slug", slug).maybeSingle();
  if (error) console.error("[articles] get", error.message);
  return data ? toArticle(data as Row) : null;
}

const TONES: Record<string, string> = {
  Kesehatan: "text-leaf-700",
  "Hadiah Sehat": "text-sun-500",
  "Tips Harian": "text-sky-600",
  Resep: "text-coral-500",
  Promo: "text-plum-700",
};

export const categoryTone = (c: string) => TONES[c] ?? "text-leaf-700";
