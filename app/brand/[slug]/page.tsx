import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryPage, categoryParams } from "@/components/CategoryPage";
import { getBrand } from "@/lib/brands";

export async function generateMetadata({ params }: PageProps<"/brand/[slug]">): Promise<Metadata> {
  const b = await getBrand((await params).slug);
  if (!b) return { title: "Brand tidak ditemukan", robots: { index: false } };
  return {
    title: `Produk ${b.name} di Malang`,
    description: `Belanja produk ${b.name} di Healthila Malang. Delivery se-Malang Raya, bayar QRIS atau konfirmasi lewat WhatsApp.`,
    alternates: { canonical: `/brand/${b.slug}` },
  };
}

/** Products of one brand; reached from the logo strip on the home page. */
export default async function BrandPage({ params, searchParams }: PageProps<"/brand/[slug]">) {
  const b = await getBrand((await params).slug);
  if (!b) notFound();
  return (
    <CategoryPage
      {...categoryParams(await searchParams)}
      config={{
        path: `/brand/${b.slug}`,
        sections: [],
        productIds: b.product_ids,
        title: b.name,
        subtitle: "",
        gradient: "",
        hero: (
          <section className="bg-sun-400">
            <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:py-16">
              <nav className="text-sm text-ink/70">
                <Link href="/" className="hover:text-ink">Home</Link> / <span className="text-ink">Brand</span>
              </nav>
              <div className="relative mx-auto mt-6 flex h-28 w-60 items-center justify-center rounded-3xl bg-white p-4 shadow-lg shadow-black/10">
                <span className="relative h-full w-full">
                  <Image src={b.logo_url} alt="" fill sizes="240px" className="object-contain" priority />
                </span>
              </div>
              <h1 className="mt-6 text-4xl font-extrabold text-ink sm:text-6xl">Produk {b.name}</h1>
              <p className="mx-auto mt-3 max-w-xl text-ink/80">
                Pilihan produk {b.name} di Healthila, diantar se-Malang Raya.
              </p>
            </div>
          </section>
        ),
      }}
    />
  );
}
