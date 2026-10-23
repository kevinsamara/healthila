"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Horizontal snap slider with arrow buttons (children are the slides). */
export function ScrollRow({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="relative">
      <div ref={ref} role="region" aria-label={label} className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-3 [scrollbar-width:thin]">
        {children}
      </div>
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Sebelumnya"
        className="absolute top-1/3 -left-3 hidden h-10 w-10 items-center justify-center rounded-full bg-white text-leaf-900 shadow-lg ring-1 ring-black/5 sm:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Berikutnya"
        className="absolute top-1/3 -right-3 hidden h-10 w-10 items-center justify-center rounded-full bg-white text-leaf-900 shadow-lg ring-1 ring-black/5 sm:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
