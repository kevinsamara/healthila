import type { Product } from "./catalog";

/**
 * Christmas parcels: products in the "Parcel Natal" category (Healthila OS ›
 * Produk) or tagged with the Natal occasion. Drives /hampers/natal and the
 * Natal hero slide.
 */
export const isNatalParcel = (p: Product) => isNatalCategory(p.category) || p.occasions.includes("natal");

/**
 * Free delivery Natal (healthila-crm 0149): an order with a "Parcel Natal"
 * product delivered 20 Nov – 25 Dec 2026 in Kota Malang gets ongkir covered up
 * to Rp 10.000 (same cap as FREEONGKIR, not stacked). Kota Malang = a web
 * ongkir estimate of at most Rp 15.000 (zones outside the city start at 20rb).
 * web_place_order applies it; this mirrors it for the cart preview.
 */
export const NATAL_FREE_DELIVERY = { from: "2026-11-20", to: "2026-12-25", max: 10_000, cityMaxFee: 15_000 } as const;

export const isNatalCategory = (category: string | null | undefined) => /^parcel natal$/i.test(category?.trim() ?? "");

/** Ongkir covered for a cart with a Natal parcel, given the delivery date (YYYY-MM-DD) and the ongkir estimate. */
export function natalShippingDiscount(deliveryDate: string, fee: number | null): number {
  const d = NATAL_FREE_DELIVERY;
  if (fee == null || fee > d.cityMaxFee || deliveryDate < d.from || deliveryDate > d.to) return 0;
  return Math.min(fee, d.max);
}
