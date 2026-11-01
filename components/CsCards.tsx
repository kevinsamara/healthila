"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import type { Bundle } from "@/lib/bundles";
import { addItem } from "@/lib/cart";
import type { Product } from "@/lib/catalog";
import { rupiah } from "@/lib/format";
import { cardUnit, displayPrice, sellUnit } from "@/lib/price";
import { AddBundle } from "./AddBundle";
import { bundleSummary, BundleVisual } from "./BundleVisual";
import { QuickAdd } from "./QuickAdd";
import { ScrollRow } from "./ScrollRow";

export type CsRef = { kind: "produk" | "bundling"; slug: string };
type Items = { products: Product[]; bundles: Bundle[] };

const cache = new Map<string, Items>();
const CARD = "flex w-40 shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-leaf-100";

/** Catalog cards under an AI answer, with the site's normal add-to-cart. */
export function CsCards({ refs }: { refs: CsRef[] }) {
  const query = new URLSearchParams({
    p: refs.filter((r) => r.kind === "produk").map((r) => r.slug).join(","),
    b: refs.filter((r) => r.kind === "bundling").map((r) => r.slug).join(","),
  }).toString();
  const [items, setItems] = useState<Items | null>(null);

  useEffect(() => {
    const hit = cache.get(query);
    if (hit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- cached answer, no request needed
      setItems(hit);
      return;
    }
    let live = true;
    void fetch(`/api/cs/items?${query}`)
      .then((r) => (r.ok ? (r.json() as Promise<Items>) : null))
      .then((d) => {
        if (!d) return;
        cache.set(query, d);
        if (live) setItems(d);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [query]);

  if (!items || items.products.length + items.bundles.length === 0) return null;
  return (
    <div className="mt-2 pl-10">
      <ScrollRow label="Produk yang disarankan" compact>
        {items.bundles.map((b) => (
          <BundleTile key={b.id} b={b} />
        ))}
        {items.products.map((p) => (
          <ProductTile key={p.id} p={p} />
        ))}
      </ScrollRow>
    </div>
  );
}

function ProductTile({ p }: { p: Product }) {
  const { price, was } = displayPrice(p);
  const unit = cardUnit(p);
  const [picking, setPicking] = useState(false);
  const hasVariants = p.in_stock && p.packagings.length > 1;
  return (
    <div className={CARD}>
      <Link href={`/produk/${p.slug}`} className="relative block aspect-square bg-leaf-50">
        {p.photo_url && <Image src={p.photo_url} alt="" fill sizes="160px" className="object-cover" />}
      </Link>
      <div className="flex flex-1 flex-col p-2.5">
        <Link href={`/produk/${p.slug}`} className="line-clamp-2 text-sm leading-tight font-semibold text-ink hover:text-leaf-700">
          {p.name}
        </Link>
        <p className="mt-auto pt-1.5 text-sm">
          {price != null ? (
            <>
              <b className="whitespace-nowrap text-leaf-700">{rupiah(price)}</b>
              {unit && <span className="text-xs text-muted"> / {unit}</span>}
              {was != null && <span className="block text-xs text-muted line-through">{rupiah(was)}</span>}
            </>
          ) : p.from_price ? (
            <b className="whitespace-nowrap text-leaf-700">mulai {rupiah(p.from_price)}</b>
          ) : (
            <span className="text-plum-700">Harga by request</span>
          )}
        </p>
        <div className="mt-2">
          {hasVariants ? (
            <button type="button" onClick={() => setPicking(true)} className="flex min-h-11 w-full items-center justify-center rounded-full bg-leaf-700 px-3 text-sm font-bold text-white hover:bg-leaf-900">
              Pilih varian
            </button>
          ) : (
            <QuickAdd product={p} />
          )}
        </div>
      </div>
      {picking && <VariantSheet p={p} onClose={() => setPicking(false)} />}
    </div>
  );
}

/** Variant popup over the chat: same cart line as the product page. */
function VariantSheet({ p, onClose }: { p: Product; onClose: () => void }) {
  const available = (k: Product["packagings"][number]) => (k.promo_price ?? k.price) != null && (k.stock_qty == null || k.stock_qty > 0);
  const [selectedId, setSelectedId] = useState(p.packagings.find(available)?.id ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const pkg = p.packagings.find((k) => k.id === selectedId) ?? null;
  const price = pkg ? (pkg.promo_price ?? pkg.price) : null;
  const maxQty = pkg?.stock_qty ?? null;
  const amount = maxQty != null && qty > maxQty ? Math.max(1, maxQty) : qty;

  function add() {
    if (!pkg || price == null) return;
    addItem(
      {
        productId: p.id,
        packagingId: pkg.id,
        slug: p.slug,
        name: p.name,
        variant: pkg.name,
        unitLabel: sellUnit(p, pkg),
        price,
        photo: p.photo_url,
        basePerUnit: p.base_per_unit,
        baseUnit: p.base_unit,
        maxQty,
      },
      amount,
    );
    setAdded(true);
    setTimeout(onClose, 900);
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div role="dialog" aria-label={`Pilih varian ${p.name}`} onClick={(e) => e.stopPropagation()} className="flex max-h-[85vh] w-full flex-col rounded-t-3xl bg-white sm:max-w-md sm:rounded-3xl">
        <div className="flex items-start gap-2 p-4 pb-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted">Pilih varian</p>
            <p className="font-bold text-ink">{p.name}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-leaf-50">
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-2">
          {p.packagings.map((k) => {
            const on = k.id === selectedId;
            const ok = available(k);
            return (
              <li key={k.id}>
                <button
                  type="button"
                  disabled={!ok}
                  aria-pressed={on}
                  onClick={() => {
                    setSelectedId(k.id);
                    setQty(1);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl p-2 text-left ring-1 disabled:opacity-50 ${on ? "bg-leaf-50 ring-2 ring-leaf-600" : "ring-leaf-100"}`}
                >
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-leaf-50">
                    {(k.photo_url || p.photo_url) && <Image src={(k.photo_url || p.photo_url)!} alt="" fill sizes="48px" className="object-cover" />}
                  </span>
                  <span className="min-w-0 flex-1 font-semibold text-ink">{k.name}</span>
                  <span className="text-right text-sm whitespace-nowrap">
                    {ok ? <b className="text-leaf-700">{rupiah(k.promo_price ?? k.price)}</b> : <span className="text-muted">Stok habis</span>}
                    {ok && k.promo_price != null && <span className="block text-xs text-muted line-through">{rupiah(k.price)}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-3 border-t border-leaf-100 p-4">
          <div className="flex h-11 items-center rounded-full ring-1 ring-leaf-200">
            <button type="button" aria-label="Kurangi" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-11 w-10 items-center justify-center">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center font-bold">{amount}</span>
            <button type="button" aria-label="Tambah" onClick={() => setQty((q) => (maxQty != null ? Math.min(maxQty, q + 1) : q + 1))} className="flex h-11 w-10 items-center justify-center">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            disabled={!pkg || price == null}
            onClick={add}
            className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-3 text-sm font-bold disabled:opacity-40 ${added ? "bg-lime-400 text-leaf-900" : "bg-leaf-700 text-white hover:bg-leaf-900"}`}
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            {added ? "Masuk keranjang" : `Tambah · ${rupiah((price ?? 0) * amount)}`}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function BundleTile({ b }: { b: Bundle }) {
  const saving = b.regular_price > b.bundle_price;
  return (
    <div className={CARD}>
      <Link href={`/bundling/${b.slug}`} className="relative block aspect-square bg-leaf-50">
        <BundleVisual bundle={b} sizes="160px" />
      </Link>
      <div className="flex flex-1 flex-col p-2.5">
        <Link href={`/bundling/${b.slug}`} className="line-clamp-2 text-sm leading-tight font-semibold text-ink hover:text-leaf-700">
          {b.name}
        </Link>
        <p className="mt-auto pt-1.5 text-sm">
          <b className="whitespace-nowrap text-leaf-700">{rupiah(b.bundle_price)}</b>
          {saving && <span className="block text-xs text-muted line-through">{rupiah(b.regular_price)}</span>}
        </p>
        <div className="mt-2 flex">
          <AddBundle
            compact
            bundle={{ id: b.id, slug: b.slug, name: b.name, bundle_price: b.bundle_price, photo: b.photo_url ?? b.items.find((i) => i.photo)?.photo ?? null, summary: bundleSummary(b), in_stock: b.in_stock }}
          />
        </div>
      </div>
    </div>
  );
}
