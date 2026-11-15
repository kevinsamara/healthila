import type { Metadata } from "next";
import { CsChat } from "@/components/CsChat";
import { Hila } from "@/components/Hila";

export const metadata: Metadata = {
  title: "CS 24 Jam Healthila",
  description: "Tanya soal produk, harga, parcel, langganan, pengiriman, dan layanan Healthila Malang. CS otomatis siap menjawab 24 jam, lengkap dengan katalog dan keranjang.",
  alternates: { canonical: "/cs" },
};

export default function CsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">CS 24 Jam</h1>
          <p className="mt-2 text-muted">
            Kenalan dengan <b className="text-ink">Hila</b>, CS otomatis Healthila. Tanya apa saja soal produk, harga, parcel, langganan, dan layanan — produknya bisa langsung masuk keranjang dari sini.
          </p>
        </div>
        <Hila pose="aku-hila" priority className="hidden w-44 shrink-0 sm:block" />
      </div>
      <CsChat />
    </div>
  );
}
