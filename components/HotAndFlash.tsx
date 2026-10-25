"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Flame, Zap } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { rupiah } from "@/lib/format";

/**
 * Dua kolom di atas Produk Unggulan:
 *   A. Produk HOT — admin tag di CRM (products.catalog_is_hot).
 *   B. Flash Sale — product_promos aktif dengan expires_at atau daily_end_time
 *      (view compute `promo_ends_at` = whichever ends sooner).
 *
 * Section ini tidak di-render kalau dua kolomnya kosong (server component
 * yang panggil kita yang handle itu). Kalau satu kosong, kolom-nya hilang
 * (grid otomatis full-width yang tersisa).
 */
export function HotAndFlash({ hot, flash }: { hot: Product[]; flash: Product[] }) {
  const hasHot = hot.length > 0;
  const hasFlash = flash.length > 0;
  if (!hasHot && !hasFlash) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-16">
      <div className={`grid gap-6 ${hasHot && hasFlash ? "md:grid-cols-2" : ""}`}>
        {hasHot && <HotColumn products={hot} />}
        {hasFlash && <FlashColumn products={flash} />}
      </div>
    </section>
  );
}

function HotColumn({ products }: { products: Product[] }) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-coral-500 to-plum-700 p-4 ring-1 ring-plum-700/30">
      <div className="mb-3 flex items-center gap-2 px-2 pt-1">
        <Flame className="h-5 w-5 text-sun-400" strokeWidth={2.4} />
        <h3 className="text-lg font-extrabold tracking-tight text-white">Produk HOT</h3>
        <span className="ml-auto text-[11px] font-semibold uppercase tracking-wider text-white/70">Paling dicari</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {products.slice(0, 4).map((p) => (
          <HotCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}

function HotCard({ p }: { p: Product }) {
  return (
    <Link href={`/produk/${p.slug}`} className="group block overflow-hidden rounded-2xl bg-white ring-1 ring-white/20 hover:ring-sun-400">
      {p.photo_url && (
        <div className="relative aspect-square w-full overflow-hidden bg-leaf-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.photo_url} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-coral-500 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white shadow">
            <Flame className="h-3 w-3" /> HOT
          </span>
        </div>
      )}
      <div className="p-2.5">
        <p className="line-clamp-2 text-sm font-bold text-ink">{p.name}</p>
        {p.price != null && (
          <p className="mt-1 text-sm font-bold text-leaf-700">{rupiah(p.price)}<span className="text-xs text-muted">/{p.unit}</span></p>
        )}
      </div>
    </Link>
  );
}

function FlashColumn({ products }: { products: Product[] }) {
  const earliest = products.reduce<string | null>((min, p) => {
    if (!p.promo_ends_at) return min;
    if (!min) return p.promo_ends_at;
    return p.promo_ends_at < min ? p.promo_ends_at : min;
  }, null);
  return (
    <div className="rounded-3xl bg-gradient-to-br from-leaf-900 to-leaf-700 p-4 ring-1 ring-leaf-900/30">
      <div className="mb-3 flex flex-wrap items-center gap-2 px-2 pt-1">
        <Zap className="h-5 w-5 text-sun-400" strokeWidth={2.4} />
        <h3 className="text-lg font-extrabold tracking-tight text-white">Flash Sale</h3>
        {earliest && (
          <span className="ml-auto">
            <Countdown target={earliest} />
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {products.slice(0, 4).map((p) => (
          <FlashCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}

function FlashCard({ p }: { p: Product }) {
  const discountPct = p.price && p.promo_price ? Math.round((1 - p.promo_price / p.price) * 100) : 0;
  return (
    <Link href={`/produk/${p.slug}`} className="group block overflow-hidden rounded-2xl bg-white ring-1 ring-white/20 hover:ring-sun-400">
      {p.photo_url && (
        <div className="relative aspect-square w-full overflow-hidden bg-leaf-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.photo_url} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
          {discountPct > 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-sun-400 px-2 py-0.5 text-[10px] font-extrabold text-leaf-900 shadow">
              -{discountPct}%
            </span>
          )}
        </div>
      )}
      <div className="p-2.5">
        <p className="line-clamp-2 text-sm font-bold text-ink">{p.name}</p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-coral-500">{rupiah(p.promo_price ?? p.price ?? 0)}</span>
          {p.price != null && p.promo_price != null && p.promo_price < p.price && (
            <span className="text-[11px] text-muted line-through">{rupiah(p.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

/** Countdown to target ISO timestamp. Updates every second client-side.
 *  Format: "HH:MM:SS" if > 1 hour, else "MM:SS". Over 24h shows "N hari".
 *  Hides itself when expired to avoid flash of "00:00:00". */
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
  const label = d > 0 ? `${d} hari ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-500 px-3 py-1 text-xs font-extrabold tabular-nums text-white shadow">
      Berakhir <span className="rounded bg-white/20 px-1.5 py-0.5">{label}</span>
    </span>
  );
}
