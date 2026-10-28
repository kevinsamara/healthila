import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import { AddBundle } from "@/components/AddBundle";
import { BundleVisual, bundleSummary } from "@/components/BundleVisual";
import { bundleSaving, getBundle, getBundles } from "@/lib/bundles";
import { qtyLabel, rupiah } from "@/lib/format";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getBundles()).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/bundling/[slug]">): Promise<Metadata> {
  const b = await getBundle((await params).slug);
  if (!b) return { title: "Bundling tidak ditemukan", robots: { index: false } };
  return {
    title: `Bundling ${b.name} — ${rupiah(b.bundle_price)}`,
    description: (b.description || `Paket ${bundleSummary(b)} dalam satu bundling hemat dari Healthila Malang.`).slice(0, 160),
    alternates: { canonical: `/bundling/${b.slug}` },
  };
}

export default async function BundlePage({ params }: PageProps<"/bundling/[slug]">) {
  const b = await getBundle((await params).slug);
  if (!b) notFound();
  const saving = bundleSaving(b);
  const pct = saving ? Math.round((saving / b.regular_price) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/bundling" className="hover:text-ink">Bundling</Link> / <span className="text-ink">{b.name}</span>
      </nav>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-leaf-50 ring-1 ring-leaf-100">
          <BundleVisual bundle={b} sizes="(min-width: 1024px) 45vw, 100vw" />
          {pct > 0 && <span className="absolute top-4 left-4 rounded-full bg-coral-500 px-3 py-1 text-sm font-extrabold text-white">Hemat {pct}%</span>}
        </div>
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-sun-300/50 px-3 py-1 text-xs font-bold text-leaf-900 uppercase">
            <Package className="h-3.5 w-3.5" /> Bundling
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink sm:text-5xl">{b.name}</h1>
          <p className="mt-4 flex flex-wrap items-baseline gap-x-3">
            <span className="text-4xl font-extrabold text-leaf-700">{rupiah(b.bundle_price)}</span>
            {saving > 0 && <span className="text-lg text-muted line-through">{rupiah(b.regular_price)}</span>}
          </p>
          {saving > 0 && <p className="mt-1 text-sm font-semibold text-coral-500">Kamu hemat {rupiah(saving)} dibanding beli satuan</p>}
          {b.description && <p className="mt-4 leading-relaxed whitespace-pre-line text-muted">{b.description}</p>}
          <div className="mt-6">
            <AddBundle bundle={{ id: b.id, slug: b.slug, name: b.name, bundle_price: b.bundle_price, photo: b.photo_url ?? b.items.find((i) => i.photo)?.photo ?? null, summary: bundleSummary(b), in_stock: b.in_stock }} />
          </div>

          <h2 className="mt-10 text-xl font-extrabold text-ink">Isi paket ({b.items.length} produk)</h2>
          <ul className="mt-3 divide-y divide-leaf-100 rounded-2xl bg-white ring-1 ring-leaf-100">
            {b.items.map((i, n) => (
              <li key={`${i.product_id}-${n}`}>
                <Link href={`/produk/${i.slug}`} className="flex items-center gap-3 p-3 hover:bg-leaf-50/60">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-leaf-50">
                    {i.photo && <Image src={i.photo} alt="" fill sizes="56px" className="object-cover" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">{i.name}</span>
                    <span className="text-sm text-muted">
                      {qtyLabel(i.quantity, i.variant ?? i.unit)} · harga satuan {rupiah(Math.round(i.quantity * i.price))}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
