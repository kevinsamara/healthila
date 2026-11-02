import type { Metadata } from "next";
import { getDeliverySlots } from "@/lib/slots";
import { getBundles } from "@/lib/bundles";
import { CartView, type BundleRule } from "./CartView";

export const metadata: Metadata = { title: "Keranjang", robots: { index: false } };

export default async function KeranjangPage() {
  const [slots, bundles] = await Promise.all([getDeliverySlots(), getBundles()]);
  const bundleRules: Record<string, BundleRule> = {};
  for (const b of bundles) {
    bundleRules[b.id] = {
      max_qty_per_customer: b.max_qty_per_customer,
      min_companion_subtotal_idr: b.min_companion_subtotal_idr,
      min_companion_qty: b.min_companion_qty,
    };
  }
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-leaf-900">Keranjang</h1>
      <CartView slots={slots} bundleRules={bundleRules} />
    </div>
  );
}
