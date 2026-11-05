import Image from "next/image";
import Link from "next/link";
import type { Brand } from "@/lib/brands";

/**
 * Full-width strip of brand logos that scrolls endlessly (the list is drawn
 * twice so the loop has no gap). Pauses on hover; with reduced motion it is a
 * plain swipeable row.
 */
export function BrandMarquee({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;
  // Short lists are repeated so one copy is always wider than the screen.
  const copy = Array.from({ length: Math.max(1, Math.ceil(12 / brands.length)) }, () => brands).flat();
  const duration = `${Math.max(20, copy.length * 3)}s`;
  return (
    <div className="bg-white py-6">
      <p className="mb-4 text-center text-sm font-semibold text-leaf-900">Brand buah pilihan di Healthila</p>
      <div className="brand-marquee overflow-hidden motion-reduce:overflow-x-auto">
        <ul className="brand-marquee-track flex w-max" style={{ animationDuration: duration }}>
          {[0, 1].map((n) =>
            copy.map((b, i) => (
              <li key={`${n}-${i}`} aria-hidden={n === 1 || i >= brands.length || undefined} className="px-3 sm:px-5">
                <Link
                  href={`/brand/${b.slug}`}
                  tabIndex={n === 1 || i >= brands.length ? -1 : undefined}
                  className="relative flex h-[4.8rem] w-[9.6rem] items-center justify-center rounded-2xl ring-1 ring-black/5 transition hover:ring-leaf-500 sm:h-24 sm:w-48"
                  title={`Produk ${b.name}`}
                >
                  <span className="relative h-12 w-[7.2rem] sm:h-[3.6rem] sm:w-[8.4rem]">
                    <Image src={b.logo_url} alt={b.name} fill sizes="160px" className="object-contain" />
                  </span>
                </Link>
              </li>
            )),
          )}
        </ul>
      </div>
    </div>
  );
}
