"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Zap } from "lucide-react";

/**
 * Thin bar right under the sticky header on the home page (sticky too, so it
 * stays visible while scrolling). Tapping it scrolls to the Flash Sale / HOT /
 * Bundling section; without a flash sale it names what is there instead.
 */
export function FlashStrip({ count, maxPct, endsAt, fallback }: { count: number; maxPct: number; endsAt: string | null; fallback: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    if (!endsAt) return;
    const tick = () => setLeft(Math.max(0, new Date(endsAt).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const pad = (n: number) => String(n).padStart(2, "0");
  const time =
    left != null && left > 0
      ? (() => {
          const s = Math.floor(left / 1000);
          const d = Math.floor(s / 86400);
          return `${d ? `${d}h ` : ""}${pad(Math.floor((s % 86400) / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
        })()
      : null;

  return (
    <button
      type="button"
      onClick={() => document.getElementById("flash-sale")?.scrollIntoView({ behavior: "smooth", block: "start" })}
      className="sticky top-16 z-30 flex w-full items-center justify-center gap-2 bg-gradient-to-r from-coral-500 via-[#ff3e4c] to-plum-700 px-4 py-2 text-white shadow-md md:top-[72px]"
    >
      <Zap className="h-4 w-4 shrink-0 fill-sun-400 text-sun-400" />
      <span className="text-sm font-extrabold">{count > 0 ? "Flash Sale" : fallback}</span>
      {count > 0 && (
        <span className="hidden text-sm text-white/90 sm:inline">
          · {count} produk diskon{maxPct > 0 ? ` s.d. ${maxPct}%` : ""}
        </span>
      )}
      {time && (
        <span className="rounded bg-leaf-900 px-1.5 py-0.5 font-mono text-xs font-bold tabular-nums" suppressHydrationWarning>
          {time}
        </span>
      )}
      <span className="ml-1 inline-flex items-center text-xs font-bold text-sun-300">
        Lihat <ChevronRight className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}
