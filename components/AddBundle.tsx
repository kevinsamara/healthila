"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { addItem } from "@/lib/cart";
import { rupiah } from "@/lib/format";

/** Bundling → one cart line (priced and expanded into its items at checkout). */
export function AddBundle({
  bundle,
  compact = false,
}: {
  bundle: { id: string; slug: string; name: string; bundle_price: number; photo: string | null; summary: string; in_stock: boolean };
  compact?: boolean;
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  if (!bundle.in_stock)
    return <span className="flex min-h-11 w-full items-center justify-center rounded-full bg-black/5 text-sm font-bold text-muted">Stok habis</span>;

  function add() {
    addItem(
      {
        productId: bundle.id,
        packagingId: null,
        bundleId: bundle.id,
        slug: bundle.slug,
        name: `Bundling ${bundle.name}`,
        variant: bundle.summary,
        unitLabel: "paket",
        price: bundle.bundle_price,
        photo: bundle.photo,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  const button = (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        add();
      }}
      className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition ${
        added ? "bg-lime-400 text-leaf-900" : "bg-leaf-700 text-white hover:bg-leaf-900"
      }`}
    >
      {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
      {added ? "Masuk keranjang" : compact ? "Keranjang" : `Tambah ke keranjang · ${rupiah(bundle.bundle_price * qty)}`}
    </button>
  );
  if (compact) return button;
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 items-center rounded-full ring-1 ring-leaf-200">
        <button type="button" aria-label="Kurangi" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center">
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-6 text-center font-bold">{qty}</span>
        <button type="button" aria-label="Tambah" onClick={() => setQty((q) => Math.min(20, q + 1))} className="flex h-11 w-11 items-center justify-center">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {button}
    </div>
  );
}
