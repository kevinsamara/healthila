"use client";

import { useSyncExternalStore } from "react";

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

export function addItem(item: Omit<CartItem, "key" | "qty">, qty = 1) {
  // Unit is part of the key so a per-kg line never merges with a per-pack one.
  const key = `${item.productId}:${item.packagingId ?? "base"}:${item.unitLabel ?? ""}`;
  const items = read();
  const existing = items.find((i) => i.key === key);
  write(
    existing
      ? items.map((i) => (i.key === key ? { ...i, qty: i.qty + qty, note: item.note || i.note } : i))
      : [...items, { ...item, key, qty }],
  );
}

export function setQty(key: string, qty: number) {
  write(qty <= 0 ? read().filter((i) => i.key !== key) : read().map((i) => (i.key === key ? { ...i, qty } : i)));
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
