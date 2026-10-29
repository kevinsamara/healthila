"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Flame, Package, Zap } from "lucide-react";
import type { Bundle } from "@/lib/bundles";
import type { Product } from "@/lib/catalog";
import { BundleVisual } from "./BundleVisual";
import { SalesBadge } from "./SalesBadge";
import { rupiah } from "@/lib/format";

/**
 * Dua kolom di atas Produk Unggulan: Flash Sale (kiri) + Produk HOT (kanan).
 * Masing-masing kolom berisi 2x2 grid kartu compact (4 produk per kolom).
 * Harga ditampilkan sebagai "pil" oranye biar menonjol.
 * Section auto-hide kalau dua-duanya kosong; satu kosong → kolomnya hilang,
 * yang satunya tetap full-width.
 */
export function HotAndFlash({ hot, flash, bundles = [] }: { hot: Product[]; flash: Product[]; bundles?: Bundle[] }) {
  const hasHot = hot.length > 0;
  const hasFlash = flash.length > 0;
  const hasBundles = bundles.length > 0;
  const cols = Number(hasHot) + Number(hasFlash) + Number(hasBundles);
  if (!cols) return null;
  return (
    // #flash-sale: target of the sticky "Flash Sale" bar under the header (FlashStrip).
    <section id="flash-sale" className="mx-auto max-w-7xl scroll-mt-32 px-4 pt-12">
      {/* Flash Sale gets the wide column; HOT & Bundling share the rest.
          Tablet with 3 columns: Flash on its own row, the other two below. */}
      <div
        className={`grid gap-5 ${
          cols === 3
            ? hasFlash
              ? "md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr]"
              : "md:grid-cols-2 lg:grid-cols-3"
            : cols === 2
              ? hasFlash
                ? "md:grid-cols-[1.5fr_1fr]"
                : "md:grid-cols-2"
              : ""
        }`}
      >
        {hasFlash && (
          <div className={`min-w-0 ${cols === 3 ? "md:col-span-2 lg:col-span-1" : ""}`}>
            <FlashColumn products={flash} />
          </div>
        )}
        {hasHot && <HotColumn products={hot} />}
        {hasBundles && <BundleColumn bundles={bundles} />}
      </div>
    </section>
  );
}

/* ──────────────────────────────── BUNDLING ───────────────────────────────── */

function BundleColumn({ bundles }: { bundles: Bundle[] }) {
  return (
    <div className="h-full min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-leaf-900 via-leaf-700 to-[#5fcf8f] shadow">
      <div className="flex min-h-[52px] flex-wrap items-center gap-2.5 px-4 py-2">
        <Package className="h-5 w-5 text-sun-400" strokeWidth={2.4} />
        <span className="text-base font-extrabold tracking-tight text-white">Bundling</span>
        <span className="text-[11px] text-white/80">Paket lebih hemat</span>
        <Link href="/bundling" className="ml-auto text-[11px] font-semibold text-white/90 hover:text-white">
          Lihat semua ›
        </Link>
      </div>
      <div className="bg-white p-3">
        <ul className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollSnapType: "x mandatory" }}>
          {bundles.slice(0, 8).map((b) => (
            <li key={b.id} className="shrink-0 basis-[46%] sm:basis-[150px]" style={{ scrollSnapAlign: "start" }}>
              <BundleCard b={b} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BundleCard({ b }: { b: Bundle }) {
  const saving = Math.max(0, Math.round(b.regular_price - b.bundle_price));
  const pct = saving ? Math.round((saving / b.regular_price) * 100) : 0;
  return (
    <Link href={`/bundling/${b.slug}`} className="group flex h-full flex-col overflow-hidden rounded-xl ring-1 ring-black/5 transition hover:ring-leaf-600">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-leaf-50">
        <BundleVisual bundle={b} sizes="160px" />
        <span className="absolute top-0 left-0 bg-leaf-700 px-1.5 py-0.5 text-[10px] font-extrabold text-white">{pct > 0 ? `-${pct}%` : "PAKET"}</span>
      </div>
      {/* Dimensi sama persis dengan FlashCard / HotCard. */}
      <div className="flex flex-col gap-1 overflow-hidden p-2">
        <p className="line-clamp-2 h-8 overflow-hidden text-[12px] leading-tight text-ink">{b.name}</p>
        <div className="flex h-8 items-center justify-between gap-1 overflow-hidden">
          <PriceButton>{rupiah(b.bundle_price)}</PriceButton>
          {saving > 0 && <span className="shrink-0 whitespace-nowrap text-[10px] text-muted line-through">{rupiah(b.regular_price)}</span>}
        </div>
      </div>
    </Link>
  );
}

/* ──────────────────────────────── FLASH SALE ─────────────────────────────── */

function FlashColumn({ products }: { products: Product[] }) {
  const earliest = products.reduce<string | null>((min, p) => {
    if (!p.promo_ends_at) return min;
    if (!min) return p.promo_ends_at;
    return p.promo_ends_at < min ? p.promo_ends_at : min;
  }, null);
  return (
    <div className="h-full min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-coral-500 via-coral-500 to-plum-700 shadow">
      {/* Header strip */}
      <div className="flex min-h-[52px] flex-wrap items-center gap-2.5 px-4 py-2">
        <Zap className="h-5 w-5 fill-sun-400 text-sun-400" strokeWidth={2.4} />
        <span className="text-base font-extrabold tracking-tight text-white">Flash Sale</span>
        {earliest && (
          // "Berakhir dalam" with the timer underneath: narrower than one long row.
          <span className="ml-auto flex flex-col items-end gap-0.5">
            <span className="text-[10px] leading-none text-white/80">Berakhir dalam</span>
            <Countdown target={earliest} />
          </span>
        )}
      </div>
      {/* Horizontal strip — kartu berbaris memanjang ke samping, bukan 2 row.
          Scroll horizontal kalau lebih dari muat; 2 kartu + sedikit teaser
          kartu ketiga di viewport sempit biar user tahu bisa scroll. */}
      <div className="bg-white p-3">
        <ul
          className="flex gap-3 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollSnapType: "x mandatory" }}
        >
          {products.slice(0, 8).map((p) => (
            <li key={p.id} className="shrink-0 basis-[46%] sm:basis-[150px]" style={{ scrollSnapAlign: "start" }}>
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
    <Link
      href={`/produk/${p.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl ring-1 ring-black/5 transition hover:ring-coral-500"
    >
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-leaf-50">
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
        <span className="absolute bottom-1 left-1">
          <SalesBadge badge={p.sales_badge} size="xs" />
        </span>
      </div>
      {/* Fixed-height body — HARUS sama persis di Flash & HOT. Mobile text
          berisiko wrap, jadi: name block fix 32px, price row fix 32px, dua
          baris strikethrough disembunyikan via overflow-hidden. */}
      <div className="flex flex-col gap-1 overflow-hidden p-2">
        <p className="line-clamp-2 h-8 overflow-hidden text-[12px] leading-tight text-ink">{p.name}</p>
        <div className="flex h-8 items-center justify-between gap-1 overflow-hidden">
          <PriceButton>{rupiah(p.promo_price ?? p.price ?? 0)}</PriceButton>
          {p.price != null && p.promo_price != null && p.promo_price < p.price && (
            <span className="shrink-0 whitespace-nowrap text-[10px] text-muted line-through">{rupiah(p.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────── HOT ──────────────────────────────────── */

function HotColumn({ products }: { products: Product[] }) {
  return (
    <div className="h-full min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-plum-700 via-[#b8245e] to-coral-500 shadow">
      <div className="flex min-h-[52px] flex-wrap items-center gap-2.5 px-4 py-2">
        <Flame className="h-5 w-5 fill-sun-400 text-sun-400" strokeWidth={2.4} />
        <span className="text-base font-extrabold tracking-tight text-white">Produk HOT</span>
        <span className="text-[11px] text-white/80">Paling dicari</span>
        <Link href="/katalog" className="ml-auto text-[11px] font-semibold text-white/90 hover:text-white">
          Lihat semua ›
        </Link>
      </div>
      <div className="bg-white p-3">
        <ul
          className="flex gap-3 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollSnapType: "x mandatory" }}
        >
          {products.slice(0, 8).map((p) => (
            <li key={p.id} className="shrink-0 basis-[46%] sm:basis-[150px]" style={{ scrollSnapAlign: "start" }}>
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
    <Link
      href={`/produk/${p.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl ring-1 ring-black/5 transition hover:ring-plum-700"
    >
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-leaf-50">
        {p.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.photo_url} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-leaf-200">—</div>
        )}
        <span className="absolute left-0 top-0 flex items-center gap-0.5 bg-plum-700 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
          <Flame className="h-2.5 w-2.5" /> HOT
        </span>
        <span className="absolute bottom-1 left-1">
          <SalesBadge badge={p.sales_badge} size="xs" />
        </span>
      </div>
      {/* Dimensi sama persis dengan FlashCard. */}
      <div className="flex flex-col gap-1 overflow-hidden p-2">
        <p className="line-clamp-2 h-8 overflow-hidden text-[12px] leading-tight text-ink">{p.name}</p>
        <div className="flex h-8 items-center overflow-hidden">
          {p.price != null && <PriceButton>{rupiah(p.price)}</PriceButton>}
        </div>
      </div>
    </Link>
  );
}

/* ──────────────────────────────── UI PARTS ───────────────────────────────── */

/** Pil oranye untuk harga — biar menonjol seperti tombol CTA.
 *  whitespace-nowrap + shrink-0: pil tidak boleh wrap atau menyusut sehingga
 *  text "Rp250.000" tetap satu baris di dalam pill. Mencegah card ikut
 *  tinggi karena isi pil wrap. */
function PriceButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-sun-400 px-2.5 py-1 text-[12px] font-extrabold tabular-nums text-leaf-900 shadow-sm">
      {children}
    </span>
  );
}

/** Countdown Shopee-style boxed digits (HH : MM : SS). Hides when expired. */
function Countdown({ target }: { target: string }) {
  // Starts empty and ticks on the client only: the server's clock would not match (hydration error).
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, new Date(target).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  if (left == null || left <= 0) return null;
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
