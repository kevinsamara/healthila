import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { OtherOccasions } from "@/components/OtherOccasions";
import { WhatsAppIcon } from "@/components/WhatsAppFab";
import { getProducts } from "@/lib/catalog";
import { occasionPage, OCCASION_PAGES } from "@/lib/occasion-pages";
import { waLink } from "@/lib/site";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return OCCASION_PAGES.map((p) => ({ momen: p.key }));
}

export async function generateMetadata({ params }: PageProps<"/hampers/[momen]">): Promise<Metadata> {
  const page = occasionPage((await params).momen);
  return page ? { title: page.title, description: page.description } : {};
}

export default async function OccasionLanding({ params }: PageProps<"/hampers/[momen]">) {
  const page = occasionPage((await params).momen);
  if (!page) notFound();

  const parcels = (await getProducts()).filter((p) => p.section === "parcel" && p.in_stock);
  const tagged = parcels.filter((p) => p.occasions.includes(page.key));
  // Until parcels are tagged in Healthila OS, show the whole parcel range.
  const products = tagged.length ? tagged : parcels;
  const days = page.date ? daysUntil(page.date) : null;

  return (
    <>
      <section className={`bg-gradient-to-br ${page.gradient} text-white`}>
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:py-20">
          {days != null && days >= 0 && (
            <p className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold backdrop-blur">
              {days === 0 ? "Hari ini!" : `${days} hari lagi`}
              {page.dateNote ? ` · ${page.dateNote}` : ""}
            </p>
          )}
          <h1 className="mt-4 text-5xl font-extrabold sm:text-7xl">{page.h1}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">{page.intro}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/parcel/custom" className="flex h-12 items-center rounded-full bg-sun-400 px-7 font-bold text-leaf-900 hover:bg-sun-300">
              🧺 Rancang Parcel
            </Link>
            <a
              href={waLink(`Halo Healthila, saya mau pesan ${page.h1.toLowerCase()}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center gap-2 rounded-full px-6 font-semibold ring-1 ring-white/50 hover:bg-white/10"
            >
              <WhatsAppIcon className="h-5 w-5" /> Tanya via WhatsApp
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">Koleksi sedang disiapkan — silakan rancang parcel sendiri atau chat kami.</p>
        )}

        <section className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-ink">Pertanyaan seputar {page.h1.toLowerCase()}</h2>
          <div className="mt-4 space-y-3">
            {page.tips.map((t) => (
              <details key={t.q} className="rounded-2xl bg-white p-4 ring-1 ring-leaf-100">
                <summary className="cursor-pointer font-semibold text-ink">{t.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            Pesan untuk perusahaan atau jumlah banyak?{" "}
            <Link href="/korporat" className="font-semibold text-leaf-700 underline">
              Isi form Pesanan Korporat
            </Link>
            . Semua parcel dilindungi{" "}
            <Link href="/garansi" className="font-semibold text-leaf-700 underline">
              Garansi Healthila
            </Link>
            .
          </p>
        </section>

        <OtherOccasions current={page.key} />
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.tips.map((t) => ({ "@type": "Question", name: t.q, acceptedAnswer: { "@type": "Answer", text: t.a } })),
        }}
      />
    </>
  );
}

/** Whole days from today (Jakarta) to `date`. */
function daysUntil(date: string) {
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(date + "T00:00:00").getTime() - today.getTime()) / 86_400_000);
}
