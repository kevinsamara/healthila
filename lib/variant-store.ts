"use client";

import { useSyncExternalStore } from "react";

/**
 * Selected variant per product, shared by the product page's gallery and the
 * add-to-cart form (separate component trees on the same page).
 */
const selected = new Map<string, string | null>();
const listeners = new Set<() => void>();

export function selectVariant(productId: string, variantId: string | null) {
  if (selected.get(productId) === variantId) return;
  selected.set(productId, variantId);
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useSelectedVariant(productId: string, fallback: string | null) {
  return useSyncExternalStore(
    subscribe,
    () => (selected.has(productId) ? selected.get(productId)! : fallback),
    () => fallback,
  );
}
