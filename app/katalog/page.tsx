import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/catalog";
import { sectionLabel, sections } from "@/lib/site";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Katalog",
  description: "Katalog lengkap buah segar, jus, dessert, dan parcel buah Healthila.",
};

export default async function KatalogPage({ searchParams }: PageProps<"/katalog">) {
  const sp = await searchParams;
  const kategori = typeof sp.kategori === "string" ? sp.kategori : "";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  const all = await getProducts();
  const needle = q.toLowerCase();
  const products = all.filter(
    (p) =>
      (!kategori || p.section === kategori) &&
      (!needle ||
        p.name.toLowerCase().includes(needle) ||
        (p.product_group ?? "").toLowerCase().includes(needle)),
  );

  // Group fruit by its catalog group (Apel, Anggur, …) so the list reads like the printed catalog.
  const groups = new Map<string, typeof products>();
  for (const p of products) {
    const g = kategori === "buah" || !kategori ? (p.section === "buah" ? p.product_group ?? "Buah lainnya" : sectionLabel(p.section)) : sectionLabel(p.section);
    groups.set(g, [...(groups.get(g) ?? []), p]);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-leaf-900">
        {kategori ? sectionLabel(kategori) : "Katalog"}
      </h1>
      <p className="mt-2 text-muted">Harga dapat berubah mengikuti musim. Stok dikonfirmasi admin saat pemesanan.</p>

      <form action="/katalog" className="mt-6 flex gap-2">
        {kategori && <input type="hidden" name="kategori" value={kategori} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Cari apel, anggur, parcel…"
          className="h-11 w-full max-w-md rounded-full border border-leaf-200 bg-white px-5 text-sm outline-none focus:border-leaf-700"
        />
        <button className="h-11 rounded-full bg-leaf-700 px-5 text-sm font-semibold text-white hover:bg-leaf-900">Cari</button>
      </form>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        <Chip href={q ? `/katalog?q=${encodeURIComponent(q)}` : "/katalog"} active={!kategori}>
          Semua
        </Chip>
        {sections.map((s) => (
          <Chip
            key={s.key}
            href={`/katalog?kategori=${s.key}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            active={kategori === s.key}
          >
            {s.label}
          </Chip>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="mt-16 text-center text-muted">
          <p className="text-lg font-semibold text-ink">Produk tidak ditemukan</p>
          <p className="mt-1">Coba kata kunci lain, atau tanya admin lewat WhatsApp.</p>
        </div>
      ) : (
        [...groups.entries()].map(([group, items]) => (
          <section key={group} className="mt-10">
            <h2 className="text-lg font-bold text-leaf-900">
              {group} <span className="text-sm font-medium text-muted">({items.length})</span>
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
        active ? "bg-leaf-700 text-white" : "bg-white text-leaf-700 ring-1 ring-leaf-200 hover:bg-leaf-50"
      }`}
    >
      {children}
    </Link>
  );
}
