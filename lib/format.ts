const idr = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export function rupiah(n: number | null | undefined) {
  return n == null ? "-" : idr.format(n).replace(/ /g, " ");
}

export function qtyLabel(quantity: number, unit: string | null) {
  const q = Number.isInteger(quantity) ? String(quantity) : String(quantity).replace(".", ",");
  return unit ? `${q} ${unit}` : q;
}
