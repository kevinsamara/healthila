import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { getArticles } from "@/lib/articles";
import { OCCASION_PAGES } from "@/lib/occasion-pages";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([getProducts(), getArticles()]);
  const pages = ["", "/buah-segar", "/jus-dessert", "/parcel", "/lainnya", "/katalog", "/artikel", "/tentang", "/faq", "/kontak", "/garansi", "/korporat", "/syarat-ketentuan", "/kebijakan-privasi"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const })),
    ...OCCASION_PAGES.map((o) => ({ url: `${site.url}/hampers/${o.key}`, changeFrequency: "weekly" as const })),
    ...articles.map((a) => ({ url: `${site.url}/artikel/${a.slug}`, lastModified: a.date, changeFrequency: "monthly" as const })),
    ...products.map((p) => ({ url: `${site.url}/produk/${p.slug}`, lastModified: p.updated_at, changeFrequency: "daily" as const })),
  ];
}
