import type { Product } from "./catalog";

/** Lowest price a shopper can actually pay, promo included. */
export function displayPrice(p: Product): { price: number | null; was: number | null } {
  const options = [
    { price: p.promo_price ?? p.price, was: p.promo_price != null ? p.price : null },
    ...p.packagings.map((k) => ({ price: k.promo_price ?? k.price, was: k.promo_price != null ? k.price : null })),
  ].filter((o) => o.price != null);
  if (!options.length) return { price: null, was: null };
  return options.reduce((a, b) => ((b.price as number) < (a.price as number) ? b : a));
}
