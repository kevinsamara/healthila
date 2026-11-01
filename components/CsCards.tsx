"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Bundle } from "@/lib/bundles";
import type { Product } from "@/lib/catalog";
import { rupiah } from "@/lib/format";
import { cardUnit, displayPrice } from "@/lib/price";
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
          <QuickAdd product={p} />
        </div>
      </div>
    </div>
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
