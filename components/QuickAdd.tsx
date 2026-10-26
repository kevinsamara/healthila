"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { addItem } from "@/lib/cart";
import { sellUnit } from "@/lib/price";
import { waLink } from "@/lib/site";
import { Check, MessageCircle } from "lucide-react";

/** Card-level add button: one tap for single-option products, otherwise opens the product page. */
export function QuickAdd({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  // min-h + text-center: a label that wraps on narrow cards (or enlarged in-app browser text) stays centred and inside the pill.
  const base = "flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-center text-sm leading-tight font-bold transition";

  if (!product.in_stock) {
    return <span className={`${base} cursor-not-allowed bg-black/5 text-muted`}>Stok habis</span>;
  }

  const single = product.packagings.length <= 1;
  const pkg = product.packagings[0] ?? null;
  const price = pkg ? (pkg.promo_price ?? pkg.price) : (product.promo_price ?? product.price);

  if (price == null) {
    // No price in the CRM yet (e.g. parcels quoted per request): ask on WhatsApp.
    return (
      // Label follows the button's own width (cards are ~126px wide on phones).
      <div className="@container w-full">
        <a
          href={waLink(`Halo Healthila, saya mau pesan ${product.name}. Boleh info harganya?`)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} bg-[#25D366] text-white hover:brightness-95`}
        >
          <MessageCircle className="hidden h-4 w-4 shrink-0 @[170px]:block" />
          <span className="@[200px]:hidden">Pesan via WA</span>
          <span className="hidden @[200px]:inline">Pesan via WhatsApp</span>
        </a>
      </div>
    );
  }

  if (!single) {
    return (
      <Link href={`/produk/${product.slug}`} className={`${base} bg-leaf-700 text-white hover:bg-leaf-900`}>
        Pilih varian
      </Link>
    );
  }

  // Qty maksimum = stock varian (kalau pilih packaging) atau stock produk
  // (kalau beli dalam base unit). Null = tidak dilacak = unlimited.
  const maxQty = pkg ? pkg.stock_qty : product.stock_qty;

  function add() {
    addItem({
      productId: product.id,
      packagingId: pkg?.id ?? null,
      slug: product.slug,
      name: product.name,
      variant: pkg ? pkg.name : null,
      unitLabel: sellUnit(product, pkg),
      price: price!,
      photo: product.photo_url,
      basePerUnit: product.base_per_unit,
      baseUnit: product.base_unit,
      maxQty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={add}
      className={`${base} ${added ? "bg-lime-400 text-leaf-900" : "bg-leaf-700 text-white hover:bg-leaf-900"}`}
    >
      {added && <Check className="mr-1 inline h-4 w-4 align-[-3px]" strokeWidth={3} />}
      {added ? "Masuk keranjang" : "Tambah ke Keranjang"}
    </button>
  );
}
