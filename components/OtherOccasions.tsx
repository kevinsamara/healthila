import Link from "next/link";
import { OCCASION_PAGES } from "@/lib/occasion-pages";

/** Links to the occasion landing pages (/hampers/[momen]). */
export function OtherOccasions({ current }: { current?: string }) {
  return (
    <section className="mt-14">
      <h2 className="text-center text-lg font-bold text-ink">{current ? "Hampers untuk momen lainnya" : "Hampers per momen"}</h2>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {OCCASION_PAGES.filter((p) => p.key !== current).map((p) => (
          <Link
            key={p.key}
            href={`/hampers/${p.key}`}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-leaf-700 ring-1 ring-leaf-700/30 hover:bg-leaf-50"
          >
            {p.h1}
          </Link>
        ))}
      </div>
    </section>
  );
}
