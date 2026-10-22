import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductJsonLd } from "@/components/JsonLd";
import { WhatsAppIcon } from "@/components/WhatsAppFab";
import { getProductBySlug, getProducts, type Product } from "@/lib/catalog";
import { sectionLabel, waLink } from "@/lib/site";
import { AddToCart } from "./AddToCart";
import { Gift, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { DynIcon } from "@/lib/icons";

export const revalidate = 300;

// Pre-render every product (ISR) instead of rendering on each visit.
export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

const SECTION_PAGE: Record<Product["section"], string> = {
  buah: "/buah-segar",
  jus: "/jus-dessert",
  dessert: "/jus-dessert",
  lainnya: "/lainnya",
  parcel: "/parcel",
};

/** Product copy + local context, one line, ≤160 chars (short CRM blurbs got thin snippets). */
function productDescription(name: string, desc: string | null) {
  const own = (desc ?? "").replace(/\s+/g, " ").trim().replace(/[.!]?$/, ".");
  const local = `Beli ${name} di Healthila, toko buah Malang — disortir sebelum dikirim, delivery se-Malang.`;
  const text = own.length > 1 ? `${own} ${local}` : local;
  return text.length <= 160 ? text : text.slice(0, 157).replace(/\s+\S*$/, "") + "…";
}

export async function generateMetadata({ params }: PageProps<"/produk/[slug]">): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return { title: "Produk tidak ditemukan", alternates: { canonical: null } };
  return {
    title: `Jual ${product.name} di Malang`,
    description: productDescription(product.name, product.description),
    openGraph: product.photo_url ? { images: [product.photo_url] } : undefined,
  };
}

export default async function ProductPage({ params }: PageProps<"/produk/[slug]">) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();

  // Same fruit first, then the rest of the section; available items only.
  const related = (await getProducts())
    .filter((p) => p.id !== product.id && p.section === product.section && p.in_stock)
    .sort((a, b) => Number(b.product_group === product.product_group) - Number(a.product_group === product.product_group))
    .slice(0, 4);
  const sectionHref = SECTION_PAGE[product.section];
  const group = product.product_group ?? product.category;

  return (
    <>
      <ProductJsonLd product={product} />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav className="flex flex-wrap gap-1 text-sm text-muted">
          <Link href="/" className="hover:text-leaf-700">
            Home
          </Link>
          <span>/</span>
          <Link href={sectionHref} className="hover:text-leaf-700">
            {sectionLabel(product.section)}
          </Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery product={product} />
            {(product.is_new || product.badges.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {product.is_new && <Badge tone="lime">Baru</Badge>}
                {product.badges.map((b) => (
                  <Badge key={b} tone="sun">
                    {b}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Link
              href={`${sectionHref}${group ? `?jenis=${encodeURIComponent(group)}` : ""}`}
              className="inline-block rounded-full bg-leaf-50 px-3 py-1 text-sm font-semibold text-leaf-700 hover:bg-leaf-100"
            >
              {product.country_flag ? `${product.country_flag} ` : ""}
              {group}
            </Link>
            <h1 className="mt-3 text-4xl leading-tight font-extrabold text-ink sm:text-5xl">{product.name}</h1>

            <AddToCart product={product} />

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {([
                [ShieldCheck, "Garansi segar", "Klaim cukup kirim foto"],
                [Truck, "Same-day", "Malang & sekitarnya"],
                [Gift, "Free ongkir s.d. 10rb", "2 pembelian pertama via website"],
              ] as [LucideIcon, string, string][]).map(([icon, title, text]) => (
                <li key={title} className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-50 text-leaf-700"><DynIcon icon={icon} className="h-5 w-5" strokeWidth={1.8} /></span>
                  <p className="mt-1 text-sm font-bold text-ink">{title}</p>
                  <p className="text-xs text-muted">{text}</p>
                </li>
              ))}
            </ul>
            <Link href="/garansi" className="mt-2 inline-block text-xs font-semibold text-leaf-700 hover:underline">
              Lihat Garansi Healthila →
            </Link>

            {product.description && (
              <div className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-black/5">
                <h2 className="text-2xl font-bold text-ink">Tentang produk ini</h2>
                <p className="mt-3 leading-relaxed whitespace-pre-line text-muted">{product.description}</p>
              </div>
            )}

            <a
              href={waLink(`Halo Healthila, saya mau tanya tentang ${product.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-leaf-700 hover:underline"
            >
              <WhatsAppIcon className="h-4 w-4" /> Ada pertanyaan? Tanya admin via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10 bg-[#f6f8fb]">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-4xl font-extrabold text-ink">{sectionLabel(product.section)} Lainnya</h2>
              <Link href={sectionHref} className="shrink-0 font-semibold text-leaf-700 hover:underline">
                Lihat semua →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
