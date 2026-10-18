import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Artikel",
  description: "Tips memilih buah, resep, dan informasi gizi dari Healthila.",
};

// Articles will be stored in Supabase (web_articles) and managed from Healthila OS.
export default function ArtikelPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-leaf-900 sm:text-4xl">Artikel</h1>
      <p className="mt-4 text-lg text-muted">Tips memilih buah, resep sehat, dan info gizi.</p>
      <div className="mt-10 rounded-3xl bg-white p-10 text-center ring-1 ring-leaf-100">
        <p className="text-lg font-semibold text-ink">Artikel pertama segera hadir</p>
        <p className="mt-1 text-muted">Sementara itu, intip katalog buah segar kami.</p>
        <Link href="/katalog" className="mt-6 inline-block rounded-full bg-leaf-700 px-6 py-3 font-bold text-white hover:bg-leaf-900">
          Lihat Katalog
        </Link>
      </div>
    </div>
  );
}
