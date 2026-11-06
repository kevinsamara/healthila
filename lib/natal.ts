import type { Product } from "./catalog";

/**
 * Christmas parcels: products in the "Parcel Natal" category (Healthila OS ›
 * Produk) or tagged with the Natal occasion. Drives /hampers/natal and the
 * Natal hero slide.
 */
export const isNatalParcel = (p: Product) =>
  /^parcel natal$/i.test(p.category?.trim() ?? "") || p.occasions.includes("natal");
