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
import { fruitPortions, kgLabel, type FruitPortion } from "@/lib/confirm-only";
import { isNatalCategory } from "@/lib/natal";
import { MessageCircle } from "lucide-react";

type Option = { id: string | null; label: string; price: number | null; was: number | null; photo?: string | null; soldOut?: boolean };

const BASE_PACKAGE = "Paket harga mulai";

/** "Harga mulai" of a Parcel Natal with no fixed price: buyable as the base package (crm 0150). */
const startPrice = (p: Product) => (isNatalCategory(p.category) && p.packagings.length === 0 ? p.from_price : null);

export function AddToCart({ product }: { product: Product }) {
  const portions = fruitPortions(product.id);
  if (portions) return <PortionAddToCart product={product} portions={portions} />;
  return <PackAddToCart product={product} />;
}

function PackAddToCart({ product }: { product: Product }) {
  const options: Option[] = product.packagings.length
    ? product.packagings.map((k) => ({
        id: k.id,
        label: k.name,
        price: k.promo_price ?? k.price,
        was: k.promo_price != null ? k.price : null,
        photo: k.photo_url,
        soldOut: k.stock_qty != null && k.stock_qty <= 0,
      }))
    : [
        {
          id: null,
          label: product.unit ? `per ${product.unit}` : "",
          price: product.promo_price ?? product.price ?? startPrice(product),
          was: product.promo_price != null ? product.price : null,
        },
      ];
  // Parcel Natal without a fixed price: the "harga mulai" base package (crm 0150).
  const basePackage = product.price == null && product.promo_price == null && startPrice(product) != null;

  // Shared with ProductGallery: picking a variant slides the gallery to its photo.
  const variantId = useSelectedVariant(product.id, (options.find((o) => !o.soldOut) ?? options[0]).id);
  const selected = Math.max(0, options.findIndex((o) => o.id === variantId));
  const setSelected = (i: number) => selectVariant(product.id, options[i].id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [note, setNote] = useState("");
  const opt = options[selected];
  const selectedPkg = opt.id ? (product.packagings.find((k) => k.id === opt.id) ?? null) : null;
  const unitWord = sellUnit(product, selectedPkg);
  const maxQty = selectedPkg ? selectedPkg.stock_qty : product.stock_qty;
  // Clamp qty state kalau user pilih varian dengan stok lebih kecil.
  const effectiveQty = maxQty != null && qty > maxQty ? Math.max(1, maxQty) : qty;

  function add() {
    if (opt.price == null) return;
    if (maxQty != null && maxQty <= 0) return;
    addItem(
      {
        productId: product.id,
        packagingId: opt.id,
        slug: product.slug,
        name: product.name,
        variant: product.packagings.length ? opt.label : basePackage ? BASE_PACKAGE : null,
        unitLabel: unitWord,
        price: opt.price,
        photo: product.photo_url,
        basePerUnit: product.base_per_unit,
        baseUnit: product.base_unit,
        note: note.trim() || null,
        maxQty,
      },
      effectiveQty,
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
      {basePackage && (
        <p className="mt-1 text-sm text-muted">
          Harga paket dasar. Mau isi, ukuran, atau budget lain? Konsultasikan dulu via WhatsApp.
        </p>
      )}
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
                disabled={o.soldOut}
                onClick={() => {
                  setSelected(i);
                  setAdded(false);
                }}
                className={`flex items-center gap-2 rounded-xl py-2 text-sm font-semibold ring-1 ${o.photo ? "pr-4 pl-2" : "px-4"} ${
                  o.soldOut
                    ? "cursor-not-allowed bg-black/5 text-muted ring-black/5"
                    : i === selected
                      ? "bg-leaf-700 text-white ring-leaf-700"
                      : "bg-white text-ink ring-leaf-200 hover:ring-leaf-500"
                }`}
              >
                {o.photo && (
                  <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                    <Image src={o.photo} alt="" fill sizes="32px" className="object-cover" />
                  </span>
                )}
                {o.label}
                {o.soldOut ? (
                  <span className="ml-2 font-normal">Habis</span>
                ) : (
                  o.price != null && <span className="ml-2 font-normal opacity-80">{rupiah(o.price)}</span>
                )}
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

      {product.in_stock && opt.soldOut && (
        <p className="mt-6 rounded-2xl bg-white p-4 text-sm text-muted ring-1 ring-leaf-200">
          <span className="font-bold text-ink">{opt.label} sedang habis.</span> Silakan pilih varian lain.
        </p>
      )}

      {product.in_stock && !opt.soldOut && opt.price != null && (
        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm font-semibold text-ink">Jumlah</p>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex h-12 items-center rounded-full bg-white ring-1 ring-leaf-200">
                <button type="button" aria-label="Kurangi" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-12 w-12 text-xl text-leaf-700">
                  −
                </button>
                <span className="min-w-20 text-center font-semibold">{qtyLabel(effectiveQty, unitWord)}</span>
                <button
                  type="button" aria-label="Tambah"
                  onClick={() => setQty((q) => (maxQty != null ? Math.min(maxQty, q + 1) : q + 1))}
                  disabled={maxQty != null && effectiveQty >= maxQty}
                  className="h-12 w-12 text-xl text-leaf-700 disabled:text-leaf-200 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              <div className="text-sm text-muted">
                <p>Subtotal <span className="font-bold text-ink">{rupiah(opt.price * effectiveQty)}</span></p>
                {maxQty != null && maxQty > 0 && (
                  <p className="mt-0.5 text-[11px] text-plum-700">Stok tersisa: {maxQty} {unitWord ?? ""}</p>
                )}
              </div>
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
          {isNatalCategory(product.category) && (
            // Natal parcels: checkout directly, or talk it through first.
            <a
              href={waLink(`Halo Healthila, saya mau konsultasi ${product.name}${opt.id ? ` (${opt.label})` : ""} untuk Natal`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-base font-bold text-[#128c4a] ring-1 ring-[#25D366] hover:bg-[#25D366]/10"
            >
              <MessageCircle className="h-5 w-5" /> Konsultasi via WhatsApp
            </a>
          )}
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

/**
 * Semangka: bought per fruit ("1 buah utuh" / "½ buah"), priced on the average
 * weight from lib/confirm-only; admin weighs and confirms the final total.
 */
function PortionAddToCart({ product, portions }: { product: Product; portions: FruitPortion[] }) {
  const perKg = product.promo_price ?? product.price;
  const wasKg = product.promo_price != null ? product.price : null;
  // Stock is tracked in kg; turn it into whole portions.
  const maxOf = (p: FruitPortion) => (product.stock_qty == null ? null : Math.floor(product.stock_qty / p.kg + 1e-9));
  const [pick, setPick] = useState<FruitPortion["key"]>(() => (portions.find((p) => maxOf(p) !== 0) ?? portions[0]).key);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [note, setNote] = useState("");
  const portion = portions.find((p) => p.key === pick) ?? portions[0];
  const maxQty = maxOf(portion);
  const amount = maxQty != null && qty > maxQty ? Math.max(1, maxQty) : qty;
  const price = perKg != null ? Math.round(perKg * portion.kg) : null;
  const soldOut = maxQty === 0;

  function add() {
    if (price == null || soldOut) return;
    addItem(
      {
        productId: product.id,
        packagingId: null,
        slug: product.slug,
        name: product.name,
        variant: null,
        unitLabel: portion.unit,
        price,
        photo: product.photo_url,
        basePerUnit: portion.kg,
        baseUnit: "kg",
        note: note.trim() || null,
        maxQty,
      },
      amount,
    );
    setAdded(true);
  }

  return (
    <div className="mt-6">
      <p className="mt-1 text-4xl font-extrabold text-leaf-700">
        {price != null ? rupiah(price) : "Harga by request"}
        {price != null && <span className="text-base font-medium text-muted"> / {portion.label}</span>}
      </p>
      {perKg != null && (
        <p className="mt-1 text-sm text-muted">
          {rupiah(perKg)}/kg{wasKg != null && <span className="ml-1 line-through">{rupiah(wasKg)}</span>} · perkiraan {kgLabel(portion.kg)}, total
          final sesuai timbangan
        </p>
      )}

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-ink">Pilih ukuran</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {portions.map((p) => {
            const out = maxOf(p) === 0;
            return (
              <button
                key={p.key}
                type="button"
                disabled={out}
                onClick={() => {
                  setPick(p.key);
                  setAdded(false);
                }}
                className={`rounded-xl px-4 py-2 text-left text-sm font-semibold ring-1 ${
                  out
                    ? "cursor-not-allowed bg-black/5 text-muted ring-black/5"
                    : p.key === pick
                      ? "bg-leaf-700 text-white ring-leaf-700"
                      : "bg-white text-ink ring-leaf-200 hover:ring-leaf-500"
                }`}
              >
                {p.label}
                <span className="ml-2 font-normal opacity-80">{out ? "Habis" : kgLabel(p.kg)}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {!product.in_stock || soldOut ? (
        <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-leaf-200">
          <p className="font-bold text-ink">Stok sedang habis</p>
          <a
            href={waLink(`Halo Healthila, apakah ${product.name} sudah tersedia lagi?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-12 items-center rounded-full bg-leaf-700 px-6 font-bold text-white hover:bg-leaf-900"
          >
            Tanya ketersediaan via WhatsApp
          </a>
        </div>
      ) : (
        price != null && (
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-ink">Jumlah</p>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex h-12 items-center rounded-full bg-white ring-1 ring-leaf-200">
                  <button type="button" aria-label="Kurangi" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-12 w-12 text-xl text-leaf-700">
                    −
                  </button>
                  <span className="min-w-24 text-center font-semibold">{qtyLabel(amount, portion.unit)}</span>
                  <button
                    type="button"
                    aria-label="Tambah"
                    onClick={() => setQty((q) => (maxQty != null ? Math.min(maxQty, q + 1) : q + 1))}
                    disabled={maxQty != null && amount >= maxQty}
                    className="h-12 w-12 text-xl text-leaf-700 disabled:cursor-not-allowed disabled:text-leaf-200"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-muted">
                  Perkiraan <span className="font-bold text-ink">{rupiah(price * amount)}</span>
                </p>
              </div>
            </div>
            <label className="block text-sm font-semibold text-ink">
              Catatan untuk pesanan <span className="font-normal text-muted">(opsional)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 200))}
                rows={2}
                placeholder="Contoh: pilih yang matang, mohon dipotong."
                className="mt-2 w-full rounded-2xl border border-leaf-200 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-leaf-700"
              />
            </label>
            <button type="button" onClick={add} className="h-13 w-full rounded-full bg-leaf-700 px-6 text-base font-bold text-white hover:bg-leaf-900">
              Tambah ke Keranjang
            </button>
          </div>
        )
      )}

      {added && (
        <p className="mt-4 rounded-xl bg-leaf-50 px-4 py-3 text-sm text-leaf-900" role="status">
          Ditambahkan ke keranjang.{" "}
          <Link href="/keranjang" className="font-bold underline">
            Lihat keranjang
          </Link>
        </p>
      )}
    </div>
  );
}
