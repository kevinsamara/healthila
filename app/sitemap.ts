import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { getArticles } from "@/lib/articles";
import { getBundles } from "@/lib/bundles";
import { OCCASION_PAGES } from "@/lib/occasion-pages";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles, bundles] = await Promise.all([getProducts(), getArticles(), getBundles()]);
  const pages = ["", "/buah-segar", "/jus-dessert", "/parcel", "/lainnya", "/katalog", "/artikel", "/tentang", "/faq", "/kontak", "/garansi", "/korporat", "/acara", "/bundling", "/langganan", "/syarat-ketentuan", "/kebijakan-privasi"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const })),
    ...OCCASION_PAGES.map((o) => ({ url: `${site.url}/hampers/${o.key}`, changeFrequency: "weekly" as const })),
    ...articles.map((a) => ({ url: `${site.url}/artikel/${a.slug}`, lastModified: a.date, changeFrequency: "monthly" as const })),
    ...bundles.map((b) => ({ url: `${site.url}/bundling/${b.slug}`, changeFrequency: "weekly" as const })),
    ...products.map((p) => ({ url: `${site.url}/produk/${p.slug}`, lastModified: p.updated_at, changeFrequency: "daily" as const })),
  ];
}
