"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { addItem } from "@/lib/cart";
import { qtyLabel, rupiah } from "@/lib/format";
import { waLink } from "@/lib/site";

type Option = { id: string | null; label: string; price: number | null; was: number | null };

export function AddToCart({ product }: { product: Product }) {
  const options: Option[] = product.packagings.length
    ? product.packagings.map((k) => ({
        id: k.id,
        label: k.name,
        price: k.promo_price ?? k.price,
        was: k.promo_price != null ? k.price : null,
      }))
    : [
        {
          id: null,
          label: product.unit ? `per ${product.unit}` : "",
          price: product.promo_price ?? product.price,
          was: product.promo_price != null ? product.price : null,
        },
      ];

  const [selected, setSelected] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const opt = options[selected];
  const unitWord = product.packagings.length ? "pcs" : product.unit;

  function add() {
    if (opt.price == null) return;
    addItem(
      {
        productId: product.id,
        packagingId: opt.id,
        slug: product.slug,
        name: product.name,
        variant: product.packagings.length ? opt.label : null,
        unitLabel: unitWord,
        price: opt.price,
        photo: product.photo_url,
      },
      qty,
    );
    setAdded(true);
  }

  return (
    <div className="mt-6">
      {product.price_note && <p className="text-sm font-semibold text-plum-700">{product.price_note}</p>}
      <p className="mt-1 text-3xl font-extrabold text-leaf-700">
        {opt.price != null ? rupiah(opt.price) : "Tanya harga"}
        {!product.packagings.length && product.unit && opt.price != null && (
          <span className="text-base font-medium text-muted"> / {product.unit}</span>
        )}
        {opt.was != null && <span className="ml-3 text-lg font-medium text-muted line-through">{rupiah(opt.was)}</span>}
      </p>

      {product.packagings.length > 1 && (
        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-ink">Pilih varian</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {options.map((o, i) => (
              <button
                key={o.id ?? i}
                type="button"
                onClick={() => {
                  setSelected(i);
                  setAdded(false);
                }}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ring-1 ${
                  i === selected ? "bg-leaf-700 text-white ring-leaf-700" : "bg-white text-ink ring-leaf-200 hover:ring-leaf-500"
                }`}
              >
                {o.label}
                {o.price != null && <span className="ml-2 font-normal opacity-80">{rupiah(o.price)}</span>}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {!product.in_stock && (
        <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-leaf-200">
          <p className="font-bold text-ink">Stok sedang habis</p>
          <p className="mt-1 text-sm text-muted">Stok buah datang hampir setiap hari. Tanyakan jadwal restock ke admin kami.</p>
          <a
            href={waLink(`Halo Healthila, apakah ${product.name} sudah tersedia lagi?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-12 items-center rounded-full bg-leaf-700 px-6 font-bold text-white hover:bg-leaf-900"
          >
            Tanya ketersediaan via WhatsApp
          </a>
        </div>
      )}

      {product.in_stock && opt.price != null && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex h-12 items-center rounded-full bg-white ring-1 ring-leaf-200">
            <button type="button" aria-label="Kurangi" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-12 w-12 text-xl text-leaf-700">
              −
            </button>
            <span className="min-w-16 text-center font-semibold">{qtyLabel(qty, unitWord)}</span>
            <button type="button" aria-label="Tambah" onClick={() => setQty((q) => q + 1)} className="h-12 w-12 text-xl text-leaf-700">
              +
            </button>
          </div>
          <button
            type="button"
            onClick={add}
            className="h-12 flex-1 rounded-full bg-leaf-700 px-6 font-bold text-white hover:bg-leaf-900 sm:flex-none"
          >
            Tambah ke keranjang
          </button>
        </div>
      )}

      {added && (
        <p className="mt-4 rounded-xl bg-leaf-50 px-4 py-3 text-sm text-leaf-900" role="status">
          Ditambahkan ke keranjang.{" "}
          <Link href="/keranjang" className="font-bold underline">
            Lihat keranjang
          </Link>
        </p>
      )}
      {product.made_to_order && (
        <p className="mt-4 text-sm text-muted">Dibuat sesuai pesanan — mohon pesan minimal H-1.</p>
      )}
    </div>
  );
}
