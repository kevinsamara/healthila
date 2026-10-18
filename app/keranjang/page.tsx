import type { Metadata } from "next";
import { CartView } from "./CartView";

export const metadata: Metadata = { title: "Keranjang", robots: { index: false } };

export default function KeranjangPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-leaf-900">Keranjang</h1>
      <CartView />
    </div>
  );
}
