import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { sectionLabel, sections } from "@/lib/site";
import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "./FilterSidebar";
import { applyFilters, facet, groupOf, isPromo, parseFilters, sortProducts, toQuery } from "./filters";

export const metadata: Metadata = {
  title: "Katalog",
  description: "Katalog lengkap buah segar, jus, dessert, dan parcel buah Healthila.",
};

export default async function KatalogPage({ searchParams }: PageProps<"/katalog">) {
  const f = parseFilters(await searchParams);
  const all = await getProducts();

  const products = sortProducts(applyFilters(all, f), f.urut);

  // Facet counts ignore their own filter so options stay selectable.
  const sectionCounts = Object.fromEntries(
    sections.map((s) => [s.key, applyFilters(all, f, ["kategori", "jenis"]).filter((p) => p.section === s.key).length]),
  );
  const groups = facet(applyFilters(all, f, ["jenis"]), groupOf);
  const origins = facet(applyFilters(all, f, ["asal"]), (p) => p.country_flag);
  const availableCount = applyFilters(all, f, ["tersedia"]).filter((p) => p.in_stock).length;
  const promoCount = applyFilters(all, f, ["promo"]).filter(isPromo).length;

  // Recommended order reads like the printed catalog: one heading per fruit group.
  const grouped = f.urut === "rekomendasi";
  const byGroup = new Map<string, typeof products>();
  if (grouped) for (const p of products) byGroup.set(groupOf(p), [...(byGroup.get(groupOf(p)) ?? []), p]);

  const sidebar = (
    <FilterSidebar
      filters={f}
      sectionCounts={sectionCounts}
      groups={groups}
      origins={origins}
      availableCount={availableCount}
      promoCount={promoCount}
    />
  );
  const activeCount =
    (f.kategori ? 1 : 0) + f.jenis.length + f.asal.length + (f.harga ? 1 : 0) + (f.tersedia ? 1 : 0) + (f.promo ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-5xl font-extrabold text-ink">
        {f.kategori ? sectionLabel(f.kategori) : "Katalog"}
      </h1>
      <p className="mt-2 text-muted">Harga dapat berubah mengikuti musim. Stok dikonfirmasi admin saat pemesanan.</p>

      <form action="/katalog" className="mt-6 flex max-w-xl gap-2">
        {/* Keep active filters when searching. */}
        {[...new URLSearchParams(toQuery({ ...f, q: "" }).split("?")[1] ?? "").entries()].map(([k, v], i) => (
          <input key={`${k}-${i}`} type="hidden" name={k} value={v} />
        ))}
        <input
          name="q"
          defaultValue={f.q}
          placeholder="Cari apel, anggur, parcel…"
          className="h-11 w-full rounded-full border border-leaf-200 bg-white px-5 text-sm outline-none focus:border-leaf-700"
        />
        <button className="h-11 rounded-full bg-leaf-700 px-5 text-sm font-semibold text-white hover:bg-leaf-900">Cari</button>
      </form>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">{sidebar}</div>
        </aside>

        <div>
          <details className="mb-6 rounded-3xl bg-white shadow-sm ring-1 ring-black/5 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold text-ink">
              Filter & urutkan{activeCount ? ` (${activeCount})` : ""}
              <span className="text-leaf-700">▾</span>
            </summary>
            <div className="border-t border-black/5 p-5">{sidebar}</div>
          </details>

          <p className="mb-4 text-sm text-muted">{products.length} produk</p>

          {products.length === 0 ? (
            <div className="mt-10 text-center text-muted">
              <p className="text-lg font-semibold text-ink">Produk tidak ditemukan</p>
              <p className="mt-1">Coba kurangi filter atau kata kunci lain, atau tanya admin lewat WhatsApp.</p>
            </div>
          ) : grouped ? (
            [...byGroup.entries()].map(([group, items]) => (
              <section key={group} className="mb-12">
                <h2 className="text-3xl font-bold text-ink">
                  {group} <span className="text-sm font-medium text-muted">({items.length})</span>
                </h2>
                <Grid items={items} />
              </section>
            ))
          ) : (
            <Grid items={products} />
          )}
        </div>
      </div>
    </div>
  );
}

function Grid({ items }: { items: Awaited<ReturnType<typeof getProducts>> }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
