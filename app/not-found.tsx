import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Halaman tidak ditemukan", alternates: { canonical: null } };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-leaf-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-leaf-900">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-muted">Mungkin produknya sudah tidak tersedia atau tautannya berubah.</p>
      <Link href="/katalog" className="mt-8 inline-block rounded-full bg-leaf-700 px-6 py-3 font-bold text-white hover:bg-leaf-900">
        Lihat Katalog
      </Link>
    </div>
  );
}
