import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/catalog";
import { sectionLabel, waLink } from "@/lib/site";
import { Badge } from "@/components/ProductCard";
import { AddToCart } from "./AddToCart";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/produk/[slug]">): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return { title: "Produk tidak ditemukan" };
  return {
    title: product.name,
    description: product.description?.slice(0, 160) ?? `${product.name} dari Healthila.`,
    openGraph: product.photo_url ? { images: [product.photo_url] } : undefined,
  };
}

export default async function ProductPage({ params }: PageProps<"/produk/[slug]">) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-muted">
        <Link href="/katalog" className="hover:text-leaf-700">
          Katalog
        </Link>{" "}
        /{" "}
        <Link href={`/katalog?kategori=${product.section}`} className="hover:text-leaf-700">
          {sectionLabel(product.section)}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-leaf-50">
          {product.photo_url ? (
            <Image src={product.photo_url} alt={product.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority />
          ) : (
            <div className="flex h-full items-center justify-center text-leaf-500">Foto segera hadir</div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap gap-1">
            {product.is_new && <Badge tone="lime">Baru</Badge>}
            {product.badges.map((b) => (
              <Badge key={b} tone="plum">
                {b}
              </Badge>
            ))}
          </div>
          <p className="mt-3 text-sm font-medium text-muted">
            {product.country_flag ? `${product.country_flag} ` : ""}
            {product.product_group ?? product.category}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-leaf-900">{product.name}</h1>

          <AddToCart product={product} />

          {product.description && (
            <div className="mt-8 border-t border-leaf-100 pt-6">
              <h2 className="font-bold text-ink">Deskripsi</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-muted">{product.description}</p>
            </div>
          )}

          <a
            href={waLink(`Halo Healthila, saya mau tanya tentang ${product.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm font-semibold text-leaf-700 hover:underline"
          >
            Ada pertanyaan? Tanya admin via WhatsApp →
          </a>
        </div>
      </div>
    </div>
  );
}
