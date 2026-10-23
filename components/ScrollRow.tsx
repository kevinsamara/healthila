"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";

/**
 * Horizontal snap slider. Floating arrows on every screen size (each hides at
 * its end) plus a "geser" hint, so it reads as a slider on phones too. Slides
 * stretch to the tallest one — give the slide content `h-full`.
 */
export function ScrollRow({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const go = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  const arrow =
    "absolute top-[30%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-leaf-900 shadow-lg ring-1 ring-black/10 transition hover:scale-105 sm:h-11 sm:w-11";

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={update}
        role="region"
        aria-label={label}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      {!edge.start && (
        <button type="button" onClick={() => go(-1)} aria-label="Sebelumnya" className={`${arrow} left-1 sm:-left-4`}>
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {!edge.end && (
        <button type="button" onClick={() => go(1)} aria-label="Berikutnya" className={`${arrow} right-1 sm:-right-4`}>
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
      {!(edge.start && edge.end) && (
        <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted">
          <MoveHorizontal className="h-3.5 w-3.5" /> Geser untuk lihat pilihan lainnya
        </p>
      )}
    </div>
  );
}
