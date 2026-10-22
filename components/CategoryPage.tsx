import Link from "next/link";
import { getProducts, type Product } from "@/lib/catalog";
import { OCCASIONS, PRICE_BANDS } from "@/lib/occasions";
import { displayPrice } from "@/lib/price";
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
  /** Gift filters (occasion + price band) — parcel page. */
  giftFilters?: boolean;
  /** Replaces the default gradient hero (must contain the page's h1). */
  hero?: React.ReactNode;
  /** Full-width sections between the hero and the product grid. */
  beforeGrid?: React.ReactNode;
  /** Heading above the filters/grid, e.g. "Koleksi parcel". */
  gridTitle?: string;
  /** Full-width sections after the grid container. */
  after?: React.ReactNode;
};

type Filters = {
  jenis: string;
  tersedia: boolean;
  momen: string;
  harga: string;
};

const groupOf = (p: Product) => p.product_group ?? p.category ?? "Lainnya";

export async function CategoryPage({
  config,
  ...filters
}: { config: CategoryConfig } & Filters) {
  const { jenis, tersedia, momen, harga } = filters;
  const band = config.giftFilters
    ? PRICE_BANDS.find((b) => b.key === harga)
    : undefined;
  const all = (await getProducts()).filter((p) =>
    config.sections.includes(p.section),
  );
  const groups = [...new Set(all.map(groupOf))].sort((a, b) =>
    a.localeCompare(b, "id"),
  );
  // Available first, then items with a photo, keeping the CRM order otherwise.
  const products = all
    .filter(
      (p) => (!jenis || groupOf(p) === jenis) && (!tersedia || p.in_stock),
    )
    .filter((p) => !config.giftFilters || !momen || p.occasions.includes(momen))
    .filter((p) => {
      if (!band) return true;
      const price = displayPrice(p).price ?? p.from_price;
      return price != null && price >= band.min && price <= band.max;
    })
    .sort(
      (a, b) =>
        Number(b.in_stock) - Number(a.in_stock) ||
        Number(!!b.photo_url) - Number(!!a.photo_url),
    );

  // Occasions that at least one product in this section is tagged with.
  const occasions = config.giftFilters
    ? OCCASIONS.filter((o) => all.some((p) => p.occasions.includes(o.key)))
    : [];

  const href = (change: Partial<Filters>) => {
    const f = { ...filters, ...change };
    const q = new URLSearchParams();
    if (f.jenis) q.set("jenis", f.jenis);
    if (f.momen) q.set("momen", f.momen);
    if (f.harga) q.set("harga", f.harga);
    if (f.tersedia) q.set("tersedia", "1");
    const s = q.toString();
    return s ? `${config.path}?${s}` : config.path;
  };

  return (
    <>
      {config.hero ?? (
        <section className={`relative overflow-hidden ${config.gradient}`}>
          <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-white/10" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 text-center text-white sm:py-24">
            <h1 className="text-5xl font-extrabold sm:text-7xl">
              {config.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
              {config.subtitle}
            </p>
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
      )}
      {config.beforeGrid}

      <div id="koleksi" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10">
        {config.gridTitle && (
          <h2 className="mb-6 text-center text-3xl font-extrabold text-ink sm:text-4xl">
            {config.gridTitle}
          </h2>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {groups.length > 1 && (
            <>
              <Chip href={href({ jenis: "" })} active={!jenis}>
                Semua
              </Chip>
              {groups.map((g) => (
                <Chip key={g} href={href({ jenis: g })} active={jenis === g}>
                  {g}
                </Chip>
              ))}
            </>
          )}
          <Link
            href={href({ tersedia: !tersedia })}
            scroll={false}
            className={`ml-1 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
              tersedia
                ? "bg-lime-400 text-leaf-900 ring-lime-400"
                : "bg-white text-muted ring-black/10 hover:ring-leaf-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${tersedia ? "bg-leaf-700" : "bg-black/20"}`}
            />
            Hanya yang tersedia
          </Link>
        </div>

        {config.giftFilters && (
          <div className="mt-4 space-y-3">
            {occasions.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="mr-1 text-sm font-semibold text-muted">
                  Momen:
                </span>
                <Chip href={href({ momen: "" })} active={!momen} small>
                  Semua
                </Chip>
                {occasions.map((o) => (
                  <Chip
                    key={o.key}
                    href={href({ momen: momen === o.key ? "" : o.key })}
                    active={momen === o.key}
                    small
                  >
                    {o.emoji} {o.label}
                  </Chip>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="mr-1 text-sm font-semibold text-muted">
                Harga:
              </span>
              <Chip href={href({ harga: "" })} active={!band} small>
                Semua
              </Chip>
              {PRICE_BANDS.map((b) => (
                <Chip
                  key={b.key}
                  href={href({ harga: band?.key === b.key ? "" : b.key })}
                  active={band?.key === b.key}
                  small
                >
                  {b.label}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {products.length === 0 ? (
          <p className="mt-16 text-center text-muted">
            Belum ada produk di pilihan ini.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {config.extra}
      </div>
      {config.after}
    </>
  );
}

function Chip({
  href,
  active,
  small,
  children,
}: {
  href: string;
  active: boolean;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`rounded-full font-semibold transition ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} ${
        active
          ? "bg-leaf-700 text-white shadow-sm"
          : "bg-white text-leaf-700 ring-1 ring-leaf-700/40 hover:bg-leaf-50"
      }`}
    >
      {children}
    </Link>
  );
}

export function categoryParams(
  sp: Record<string, string | string[] | undefined>,
) {
  const one = (v: string | string[] | undefined) =>
    (Array.isArray(v) ? v[0] : v) ?? "";
  return {
    jenis: one(sp.jenis),
    tersedia: one(sp.tersedia) === "1",
    momen: one(sp.momen),
    harga: one(sp.harga),
  };
}
