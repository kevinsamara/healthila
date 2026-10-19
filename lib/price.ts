import type { Packaging, Product } from "./catalog";
import { qtyLabel } from "./format";

/** Lowest price a shopper can actually pay, promo included. */
export function displayPrice(p: Product): { price: number | null; was: number | null } {
  const options = [
    { price: p.promo_price ?? p.price, was: p.promo_price != null ? p.price : null },
    ...p.packagings.map((k) => ({ price: k.promo_price ?? k.price, was: k.promo_price != null ? k.price : null })),
  ].filter((o) => o.price != null);
  if (!options.length) return { price: null, was: null };
  return options.reduce((a, b) => ((b.price as number) < (a.price as number) ? b : a));
}

/**
 * What one cart unit is called: "kg" for a 1 kg variant, "pack 500gr" for
 * web-only packs, "pack 0,5 kg" for a half-kilo variant, "pcs" as last resort.
 */
export function sellUnit(p: Product, k: Packaging | null): string | null {
  if (p.base_per_unit || !k) return p.unit;
  const unit = k.unit ?? "pcs";
  return k.quantity === 1 ? unit : `pack ${qtyLabel(k.quantity, unit)}`;
}

/** Unit to show next to a card price, when every option shares it. */
export function cardUnit(p: Product): string | null {
  if (!p.packagings.length) return p.unit;
  const units = new Set(p.packagings.map((k) => sellUnit(p, k)));
  return units.size === 1 ? [...units][0] : null;
}
