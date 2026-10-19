"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { addItem } from "@/lib/cart";
import { waLink } from "@/lib/site";

/** Card-level add button: one tap for single-option products, otherwise opens the product page. */
export function QuickAdd({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const base = "flex h-11 w-full items-center justify-center rounded-full text-sm font-bold transition";

  if (!product.in_stock) {
    return <span className={`${base} cursor-not-allowed bg-black/5 text-muted`}>Stok habis</span>;
  }

  const single = product.packagings.length <= 1;
  const pkg = product.packagings[0] ?? null;
  const price = pkg ? (pkg.promo_price ?? pkg.price) : (product.promo_price ?? product.price);

  if (price == null) {
    // No price in the CRM yet (e.g. parcels quoted per request): ask on WhatsApp.
    return (
      <a
        href={waLink(`Halo Healthila, saya mau pesan ${product.name}. Boleh info harganya?`)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} bg-[#25D366] text-white hover:brightness-95`}
      >
        Pesan via WhatsApp
      </a>
    );
  }

  if (!single) {
    return (
      <Link href={`/produk/${product.slug}`} className={`${base} bg-leaf-700 text-white hover:bg-leaf-900`}>
        Pilih varian
      </Link>
    );
  }

  function add() {
    addItem({
      productId: product.id,
      packagingId: pkg?.id ?? null,
      slug: product.slug,
      name: product.name,
      variant: pkg ? pkg.name : null,
      unitLabel: product.base_per_unit || !pkg ? product.unit : "pcs",
      price: price!,
      photo: product.photo_url,
      basePerUnit: product.base_per_unit,
      baseUnit: product.base_unit,
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
      {added ? "✓ Masuk keranjang" : "Tambah ke Keranjang"}
    </button>
  );
}
