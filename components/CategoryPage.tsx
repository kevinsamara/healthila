import Link from "next/link";
import { getProducts, type Product } from "@/lib/catalog";
import type { SectionKey } from "@/lib/site";
import { ProductCard } from "./ProductCard";

export type CategoryConfig = {
  path: string;
  sections: SectionKey[];
  title: string;
  subtitle: string;
  /** Tailwind gradient classes for the hero. */
  gradient: string;
  extra?: React.ReactNode;
  /** Optional call-to-action under the hero subtitle. */
  heroCta?: { href: string; label: string };
};

const groupOf = (p: Product) => p.product_group ?? p.category ?? "Lainnya";

export async function CategoryPage({ config, jenis, tersedia }: { config: CategoryConfig; jenis: string; tersedia: boolean }) {
  const all = (await getProducts()).filter((p) => config.sections.includes(p.section));
  const groups = [...new Set(all.map(groupOf))].sort((a, b) => a.localeCompare(b, "id"));
  // Available first, then items with a photo, keeping the CRM order otherwise.
  const products = all
    .filter((p) => (!jenis || groupOf(p) === jenis) && (!tersedia || p.in_stock))
    .sort((a, b) => Number(b.in_stock) - Number(a.in_stock) || Number(!!b.photo_url) - Number(!!a.photo_url));

  const href = (j: string, t = tersedia) => {
    const q = new URLSearchParams();
    if (j) q.set("jenis", j);
    if (t) q.set("tersedia", "1");
    const s = q.toString();
    return s ? `${config.path}?${s}` : config.path;
  };

  return (
    <>
      <section className={`relative overflow-hidden ${config.gradient}`}>
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-white/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center text-white sm:py-24">
          <h1 className="text-5xl font-extrabold sm:text-7xl">{config.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 sm:text-lg">{config.subtitle}</p>
          {config.heroCta && (
            <Link
              href={config.heroCta.href}
              className="mt-7 inline-flex h-12 items-center rounded-full bg-sun-400 px-7 font-bold text-leaf-900 shadow-lg shadow-black/10 hover:bg-sun-300"
            >
              {config.heroCta.label}
            </Link>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {groups.length > 1 && (
            <>
              <Chip href={href("")} active={!jenis}>
                Semua
              </Chip>
              {groups.map((g) => (
                <Chip key={g} href={href(g)} active={jenis === g}>
                  {g}
                </Chip>
              ))}
            </>
          )}
          <Link
            href={href(jenis, !tersedia)}
            scroll={false}
            className={`ml-1 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
              tersedia ? "bg-lime-400 text-leaf-900 ring-lime-400" : "bg-white text-muted ring-black/10 hover:ring-leaf-500"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${tersedia ? "bg-leaf-700" : "bg-black/20"}`} />
            Hanya yang tersedia
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="mt-16 text-center text-muted">Belum ada produk di pilihan ini.</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {config.extra}
      </div>
    </>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-leaf-700 text-white shadow-sm" : "bg-white text-leaf-700 ring-1 ring-leaf-700/40 hover:bg-leaf-50"
      }`}
    >
      {children}
    </Link>
  );
}

export function categoryParams(sp: Record<string, string | string[] | undefined>) {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  return { jenis: one(sp.jenis), tersedia: one(sp.tersedia) === "1" };
}
