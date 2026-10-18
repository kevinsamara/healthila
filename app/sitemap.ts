import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const pages = ["", "/katalog", "/artikel", "/tentang", "/faq", "/kontak", "/syarat-ketentuan", "/kebijakan-privasi"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const })),
    ...products.map((p) => ({ url: `${site.url}/produk/${p.slug}`, lastModified: p.updated_at, changeFrequency: "daily" as const })),
  ];
}
