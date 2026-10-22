"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { addItem } from "@/lib/cart";
import { qtyLabel, rupiah } from "@/lib/format";
import { sellUnit } from "@/lib/price";
import { waLink } from "@/lib/site";
import { selectVariant, useSelectedVariant } from "@/lib/variant-store";

type Option = { id: string | null; label: string; price: number | null; was: number | null; photo?: string | null };

export function AddToCart({ product }: { product: Product }) {
  const options: Option[] = product.packagings.length
    ? product.packagings.map((k) => ({
        id: k.id,
        label: k.name,
        price: k.promo_price ?? k.price,
        was: k.promo_price != null ? k.price : null,
        photo: k.photo_url,
      }))
    : [
        {
          id: null,
          label: product.unit ? `per ${product.unit}` : "",
          price: product.promo_price ?? product.price,
          was: product.promo_price != null ? product.price : null,
        },
      ];

  // Shared with ProductGallery: picking a variant slides the gallery to its photo.
  const variantId = useSelectedVariant(product.id, options[0].id);
  const selected = Math.max(0, options.findIndex((o) => o.id === variantId));
  const setSelected = (i: number) => selectVariant(product.id, options[i].id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [note, setNote] = useState("");
  const opt = options[selected];
  const unitWord = sellUnit(product, opt.id ? (product.packagings.find((k) => k.id === opt.id) ?? null) : null);

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
        basePerUnit: product.base_per_unit,
        baseUnit: product.base_unit,
        note: note.trim() || null,
      },
      qty,
    );
    setAdded(true);
  }

  return (
    <div className="mt-6">
      {product.price_note && <p className="text-sm font-semibold text-plum-700">{product.price_note}</p>}
      <p className="mt-1 text-4xl font-extrabold text-leaf-700">
        {opt.price != null ? (
          rupiah(opt.price)
        ) : product.from_price ? (
          <>
            <span className="text-base font-semibold text-muted">mulai </span>
            {rupiah(product.from_price)}
          </>
        ) : (
          "Harga by request"
        )}
        {unitWord && opt.price != null && <span className="text-base font-medium text-muted"> / {unitWord}</span>}
        {opt.was != null && <span className="ml-3 text-lg font-medium text-muted line-through">{rupiah(opt.was)}</span>}
      </p>
      {product.base_per_unit && (
        <p className="mt-1 text-sm text-muted">Berat per pack ± {Math.round(product.base_per_unit * 1000)} gr</p>
      )}

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
                className={`flex items-center gap-2 rounded-xl py-2 text-sm font-semibold ring-1 ${o.photo ? "pr-4 pl-2" : "px-4"} ${
                  i === selected ? "bg-leaf-700 text-white ring-leaf-700" : "bg-white text-ink ring-leaf-200 hover:ring-leaf-500"
                }`}
              >
                {o.photo && (
                  <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                    <Image src={o.photo} alt="" fill sizes="32px" className="object-cover" />
                  </span>
                )}
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

      {product.in_stock && opt.price == null && (
        <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-black/5">
          <p className="text-sm text-muted">
            Harga menyesuaikan isi dan ukuran. Ceritakan budget & momennya, admin kami bantu rekomendasikan.
          </p>
          <a
            href={waLink(`Halo Healthila, saya mau pesan ${product.name}${opt.id ? ` (${opt.label})` : ""}. Boleh info harganya?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex h-13 w-full items-center justify-center rounded-full bg-[#25D366] text-base font-bold text-white hover:brightness-95"
          >
            Pesan via WhatsApp
          </a>
        </div>
      )}

      {product.in_stock && opt.price != null && (
        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm font-semibold text-ink">Jumlah</p>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex h-12 items-center rounded-full bg-white ring-1 ring-leaf-200">
                <button type="button" aria-label="Kurangi" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-12 w-12 text-xl text-leaf-700">
                  −
                </button>
                <span className="min-w-20 text-center font-semibold">{qtyLabel(qty, unitWord)}</span>
                <button type="button" aria-label="Tambah" onClick={() => setQty((q) => q + 1)} className="h-12 w-12 text-xl text-leaf-700">
                  +
                </button>
              </div>
              <p className="text-sm text-muted">
                Subtotal <span className="font-bold text-ink">{rupiah(opt.price * qty)}</span>
              </p>
            </div>
          </div>
          <label className="block text-sm font-semibold text-ink">
            Catatan untuk pesanan <span className="font-normal text-muted">(opsional)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 200))}
              rows={2}
              placeholder="Contoh: pilih yang matang, mohon disertakan kartu ucapan."
              className="mt-2 w-full rounded-2xl border border-leaf-200 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-leaf-700"
            />
          </label>
          <button
            type="button"
            onClick={add}
            className="h-13 w-full rounded-full bg-leaf-700 px-6 text-base font-bold text-white hover:bg-leaf-900"
          >
            Tambah ke Keranjang
          </button>
          <p className="text-center text-xs text-muted">Produk dapat ditinjau dan diubah kembali di halaman Keranjang.</p>
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
