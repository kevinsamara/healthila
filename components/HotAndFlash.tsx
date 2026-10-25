"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Flame, Zap } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { rupiah } from "@/lib/format";

/**
 * Dua strip horizontal mirip Shopee: Flash Sale di atas, Produk HOT di bawah.
 * Masing-masing compact row (horizontal scroll di mobile, grid di desktop).
 * Section auto-hide kalau dua-duanya kosong; satu kosong → strip-nya hilang,
 * yang satunya tetap full-width.
 */
export function HotAndFlash({ hot, flash }: { hot: Product[]; flash: Product[] }) {
  const hasHot = hot.length > 0;
  const hasFlash = flash.length > 0;
  if (!hasHot && !hasFlash) return null;
  return (
    <section className="mx-auto max-w-7xl space-y-4 px-4 pt-12">
      {hasFlash && <FlashStrip products={flash} />}
      {hasHot && <HotStrip products={hot} />}
    </section>
  );
}

/* ──────────────────────────────── FLASH SALE ─────────────────────────────── */

function FlashStrip({ products }: { products: Product[] }) {
  const earliest = products.reduce<string | null>((min, p) => {
    if (!p.promo_ends_at) return min;
    if (!min) return p.promo_ends_at;
    return p.promo_ends_at < min ? p.promo_ends_at : min;
  }, null);
  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-coral-500 via-coral-500 to-plum-700 shadow">
      {/* Header strip */}
      <div className="flex items-center gap-3 px-4 py-2.5">
        <Zap className="h-5 w-5 fill-sun-400 text-sun-400" strokeWidth={2.4} />
        <span className="text-lg font-extrabold tracking-tight text-white">Flash Sale</span>
        {earliest && (
          <>
            <span className="text-xs text-white/80">Berakhir dalam</span>
            <Countdown target={earliest} />
          </>
        )}
        <Link href="/katalog" className="ml-auto text-xs font-semibold text-white/90 hover:text-white">
          Lihat semua ›
        </Link>
      </div>
      {/* Products row */}
      <div className="bg-white">
        <ul className="flex gap-2 overflow-x-auto px-3 py-3 sm:gap-3" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {products.slice(0, 8).map((p) => (
            <li key={p.id} className="shrink-0 basis-[140px] sm:basis-[160px]">
              <FlashCard p={p} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FlashCard({ p }: { p: Product }) {
  const discountPct = p.price && p.promo_price ? Math.round((1 - p.promo_price / p.price) * 100) : 0;
  return (
    <Link href={`/produk/${p.slug}`} className="group block overflow-hidden rounded-xl ring-1 ring-black/5 transition hover:ring-coral-500">
      <div className="relative aspect-square w-full overflow-hidden bg-leaf-50">
        {p.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.photo_url} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-leaf-200">—</div>
        )}
        {discountPct > 0 && (
          <span className="absolute left-0 top-0 bg-coral-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
            -{discountPct}%
          </span>
        )}
      </div>
      <div className="p-2">
        <p className="line-clamp-2 text-[11px] leading-tight text-ink min-h-[26px]">{p.name}</p>
        <p className="mt-1 text-sm font-extrabold text-coral-500 leading-tight">{rupiah(p.promo_price ?? p.price ?? 0)}</p>
        {p.price != null && p.promo_price != null && p.promo_price < p.price && (
          <p className="text-[10px] text-muted line-through leading-tight">{rupiah(p.price)}</p>
        )}
      </div>
    </Link>
  );
}

/* ────────────────────────────────── HOT ──────────────────────────────────── */

function HotStrip({ products }: { products: Product[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-plum-700 via-[#b8245e] to-coral-500 shadow">
      <div className="flex items-center gap-3 px-4 py-2.5">
        <Flame className="h-5 w-5 fill-sun-400 text-sun-400" strokeWidth={2.4} />
        <span className="text-lg font-extrabold tracking-tight text-white">Produk HOT</span>
        <span className="text-xs text-white/80">Paling dicari</span>
        <Link href="/katalog" className="ml-auto text-xs font-semibold text-white/90 hover:text-white">
          Lihat semua ›
        </Link>
      </div>
      <div className="bg-white">
        <ul className="flex gap-2 overflow-x-auto px-3 py-3 sm:gap-3" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {products.slice(0, 8).map((p) => (
            <li key={p.id} className="shrink-0 basis-[140px] sm:basis-[160px]">
              <HotCard p={p} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function HotCard({ p }: { p: Product }) {
  return (
    <Link href={`/produk/${p.slug}`} className="group block overflow-hidden rounded-xl ring-1 ring-black/5 transition hover:ring-plum-700">
      <div className="relative aspect-square w-full overflow-hidden bg-leaf-50">
        {p.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.photo_url} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-leaf-200">—</div>
        )}
        <span className="absolute left-0 top-0 flex items-center gap-0.5 bg-plum-700 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
          <Flame className="h-2.5 w-2.5" /> HOT
        </span>
      </div>
      <div className="p-2">
        <p className="line-clamp-2 text-[11px] leading-tight text-ink min-h-[26px]">{p.name}</p>
        {p.price != null && (
          <p className="mt-1 text-sm font-extrabold text-leaf-700 leading-tight">{rupiah(p.price)}</p>
        )}
      </div>
    </Link>
  );
}

/* ──────────────────────────────── COUNTDOWN ──────────────────────────────── */

/** Countdown to target ISO timestamp. Updates every second client-side.
 *  Shopee-style boxed digits (HH : MM : SS). Hides when expired. */
function Countdown({ target }: { target: string }) {
  const [left, setLeft] = useState<number>(() => Math.max(0, new Date(target).getTime() - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, new Date(target).getTime() - Date.now())), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (left <= 0) return null;
  const sec = Math.floor(left / 1000);
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1 text-[11px] font-extrabold tabular-nums">
      {d > 0 && (
        <>
          <span className="rounded bg-leaf-900 px-1.5 py-0.5 text-white">{d}d</span>
          <span className="text-white/80">:</span>
        </>
      )}
      <span className="rounded bg-leaf-900 px-1.5 py-0.5 text-white">{pad(h)}</span>
      <span className="text-white/80">:</span>
      <span className="rounded bg-leaf-900 px-1.5 py-0.5 text-white">{pad(m)}</span>
      <span className="text-white/80">:</span>
      <span className="rounded bg-leaf-900 px-1.5 py-0.5 text-white">{pad(s)}</span>
    </div>
  );
}
