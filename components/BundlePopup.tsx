"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Package, X } from "lucide-react";
import { rupiah } from "@/lib/format";
import { AddBundle } from "./AddBundle";

export type PopupBundle = {
  id: string;
  slug: string;
  name: string;
  price: number;
  regular: number;
  photo: string | null;
  summary: string;
};

const FIRST_MS = 25_000; // first popup after 25 s on the site
const EVERY_MS = 120_000; // then every 2 minutes
const SHOW_MS = 12_000; // hides itself after 12 s (unless hovered)
const MAX_PER_VISIT = 3;
const SNOOZE_MS = 30 * 60_000; // × closes it for 30 minutes
const SNOOZE_KEY = "hl_bundle_popup_snooze";
const COUNT_KEY = "hl_bundle_popup_count";
const QUIET = /^\/(keranjang|bayar|masuk|akun|profil)/;

const read = (store: () => Storage, key: string) => {
  try {
    return store().getItem(key);
  } catch {
    return null;
  }
};
const write = (store: () => Storage, key: string, v: string) => {
  try {
    store().setItem(key, v);
  } catch {
    // storage blocked: the popup just behaves as a fresh visit
  }
};

/** Recurring, non-blocking card promoting bundles ("lagi bundling"). */
export function BundlePopup({ bundles }: { bundles: PopupBundle[] }) {
  const pathname = usePathname();
  const [current, setCurrent] = useState<PopupBundle | null>(null);
  const hovered = useRef(false);
  const shown = useRef(0);

  useEffect(() => {
    if (!bundles.length || QUIET.test(pathname)) return;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const show = () => {
      if (Number(read(() => localStorage, SNOOZE_KEY) ?? 0) > Date.now()) return;
      const count = Number(read(() => sessionStorage, COUNT_KEY) ?? 0);
      if (count >= MAX_PER_VISIT) return;
      // Never on top of another dialog (e.g. the login prompt).
      if (document.querySelector('[role="dialog"]')) return;
      const next = bundles[(count + shown.current) % bundles.length]!;
      shown.current += 1;
      write(() => sessionStorage, COUNT_KEY, String(count + 1));
      setCurrent(next);
      hideTimer = setTimeout(function hide() {
        if (hovered.current) hideTimer = setTimeout(hide, 3000);
        else setCurrent(null);
      }, SHOW_MS);
    };
    const first = setTimeout(show, FIRST_MS);
    const every = setInterval(show, EVERY_MS);
    return () => {
      clearTimeout(first);
      clearInterval(every);
      clearTimeout(hideTimer);
    };
  }, [bundles, pathname]);

  if (!current || QUIET.test(pathname)) return null;
  const saving = Math.max(0, Math.round(current.regular - current.price));
  const pct = saving ? Math.round((saving / current.regular) * 100) : 0;

  return (
    <aside
      aria-label="Promo bundling"
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => (hovered.current = false)}
      className="fixed bottom-24 left-3 z-40 w-[calc(100%-1.5rem)] max-w-sm animate-[hl-pop_.35s_ease-out] rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-black/10 sm:bottom-6 sm:left-6"
    >
      <style>{"@keyframes hl-pop{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}"}</style>
      <button
        type="button"
        aria-label="Tutup"
        onClick={() => {
          write(() => localStorage, SNOOZE_KEY, String(Date.now() + SNOOZE_MS));
          setCurrent(null);
        }}
        className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white shadow"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex gap-3">
        <Link href={`/bundling/${current.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-leaf-50">
          {current.photo && <Image src={current.photo} alt="" fill sizes="80px" className="object-cover" />}
          {pct > 0 && <span className="absolute top-0 left-0 bg-coral-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white">-{pct}%</span>}
        </Link>
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wide text-leaf-700 uppercase">
            <Package className="h-3.5 w-3.5" /> Lagi bundling
          </p>
          <Link href={`/bundling/${current.slug}`} className="block truncate font-bold text-ink hover:text-leaf-700">
            {current.name}
          </Link>
          <p className="truncate text-xs text-muted">{current.summary}</p>
          <p className="mt-0.5 flex items-baseline gap-1.5">
            <span className="font-extrabold whitespace-nowrap text-leaf-700">{rupiah(current.price)}</span>
            {saving > 0 && <span className="text-xs whitespace-nowrap text-muted line-through">{rupiah(current.regular)}</span>}
          </p>
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <Link
          href={`/bundling/${current.slug}`}
          className="flex min-h-11 flex-1 items-center justify-center rounded-full text-sm font-bold text-leaf-700 ring-1 ring-leaf-200 hover:bg-leaf-50"
        >
          Lihat paket
        </Link>
        <div className="flex flex-1">
          <AddBundle
            compact
            bundle={{ id: current.id, slug: current.slug, name: current.name, bundle_price: current.price, photo: current.photo, summary: current.summary, in_stock: true }}
          />
        </div>
      </div>
    </aside>
  );
}
