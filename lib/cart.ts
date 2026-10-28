"use client";

import { useSyncExternalStore } from "react";
import { trackEvent } from "./analytics";

/**
 * Cart lives in localStorage until checkout. Prices here are only for display;
 * the order is re-priced from the database when it is saved.
 */

export type CartItem = {
  key: string; // productId:packagingId
  productId: string;
  packagingId: string | null;
  slug: string;
  name: string;
  variant: string | null;
  unitLabel: string | null;
  price: number;
  photo: string | null;
  qty: number;
  /** Web-only packs: base units (kg) in one cart unit, for the order message. */
  basePerUnit?: number | null;
  baseUnit?: string | null;
  /** Free-text request for this line (pilih yang matang, kartu ucapan, …). */
  note?: string | null;
  /** Qty maksimum yg boleh ditambahkan — snapshot dari stock_qty saat
   *  tambah ke cart. Null = tidak dilacak (parcel/juice/MTO = unlimited).
   *  Checkout RPC tetap re-check di server, ini pencegahan di UI saja. */
  maxQty?: number | null;
  /** Bundling (healthila-crm 0123): productId holds the bundle id, slug the bundle page. */
  bundleId?: string | null;
};

const KEY = "healthila_cart_v2";
const EMPTY: CartItem[] = [];
let cache: CartItem[] | null = null;
const listeners = new Set<() => void>();

function read(): CartItem[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(items: CartItem[]) {
  cache = items;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // storage blocked (private mode) — keep the in-memory cart
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** Clamp qty ke [0, maxQty]. Null maxQty = unlimited. */
function clampQty(qty: number, max: number | null | undefined): number {
  if (qty <= 0) return 0;
  if (max == null) return qty;
  return Math.min(qty, max);
}

export function addItem(item: Omit<CartItem, "key" | "qty">, qty = 1) {
  trackEvent("add_to_cart", {
    currency: "IDR",
    value: Math.round(item.price * qty),
    items: [{ item_id: item.productId, item_name: item.name, price: item.price, quantity: qty }],
  });
  // Unit is part of the key so a per-kg line never merges with a per-pack one.
  const key = `${item.productId}:${item.packagingId ?? "base"}:${item.unitLabel ?? ""}`;
  const items = read();
  const existing = items.find((i) => i.key === key);
  const max = item.maxQty ?? existing?.maxQty ?? null;
  write(
    existing
      ? items.map((i) => (i.key === key ? { ...i, qty: clampQty(i.qty + qty, max), note: item.note || i.note, maxQty: max } : i))
      : [...items, { ...item, key, qty: clampQty(qty, max) }],
  );
}

export function setQty(key: string, qty: number) {
  const items = read();
  const target = items.find((i) => i.key === key);
  const clamped = clampQty(qty, target?.maxQty ?? null);
  write(clamped <= 0 ? items.filter((i) => i.key !== key) : items.map((i) => (i.key === key ? { ...i, qty: clamped } : i)));
}

export function clearCart() {
  write([]);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((n, i) => n + i.qty * i.price, 0);
}
