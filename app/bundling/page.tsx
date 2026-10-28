import type { Metadata } from "next";
import Link from "next/link";
import { AddBundle } from "@/components/AddBundle";
import { BundleVisual, bundleSummary } from "@/components/BundleVisual";
import { bundleSaving, getBundles } from "@/lib/bundles";
import { rupiah } from "@/lib/format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Bundling Buah Hemat Malang",
  description: "Paket bundling buah Healthila Malang — beberapa produk pilihan dalam satu paket dengan harga lebih hemat.",
  alternates: { canonical: "/bundling" },
};

export default async function BundlingIndex() {
  const bundles = await getBundles();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Bundling hemat</h1>
      <p className="mt-2 text-muted">Beberapa produk pilihan dalam satu paket — lebih hemat dibanding beli satuan.</p>
      {bundles.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-leaf-50 p-8 text-center text-muted">Belum ada paket bundling saat ini.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {bundles.map((b) => {
            const saving = bundleSaving(b);
            return (
              <div key={b.id} className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
                <Link href={`/bundling/${b.slug}`} className="relative block aspect-square bg-leaf-50">
                  <BundleVisual bundle={b} sizes="(min-width: 1024px) 22vw, 50vw" />
                  {saving > 0 && (
                    <span className="absolute top-3 left-3 rounded-full bg-coral-500 px-2.5 py-0.5 text-xs font-extrabold text-white">
                      Hemat {Math.round((saving / b.regular_price) * 100)}%
                    </span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <Link href={`/bundling/${b.slug}`} className="font-display text-lg leading-tight font-bold text-ink hover:text-leaf-700">
                    {b.name}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{bundleSummary(b)}</p>
                  <p className="mt-auto flex flex-wrap items-baseline gap-x-1.5 pt-3">
                    <span className="text-lg font-extrabold whitespace-nowrap text-leaf-700">{rupiah(b.bundle_price)}</span>
                    {saving > 0 && <span className="text-xs whitespace-nowrap text-muted line-through">{rupiah(b.regular_price)}</span>}
                  </p>
                  <div className="mt-3">
                    <AddBundle
                      compact
                      bundle={{ id: b.id, slug: b.slug, name: b.name, bundle_price: b.bundle_price, photo: b.photo_url ?? b.items.find((i) => i.photo)?.photo ?? null, summary: bundleSummary(b), in_stock: b.in_stock }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
