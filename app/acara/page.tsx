import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { ScrollRow } from "@/components/ScrollRow";
import { BgCircles } from "@/components/HomeSections";
import { getProducts } from "@/lib/catalog";
import { EVENT_NEEDS, productsForNeeds, type EventNeedKey } from "@/lib/event-needs";
import { EventPicker } from "./EventPicker";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Buah untuk Acara & Kantor Malang — Fruit Platter, Fruit Tower, Parcel, Jus",
  description:
    "Pesan buah potong & fruit platter, fruit cake & fruit tower, parcel buah, serta jus cold-pressed untuk rapat, seminar, arisan, ulang tahun, dan acara kantor di Malang. Minta penawaran jumlah besar.",
  alternates: { canonical: "/acara" },
};

export default async function AcaraPage() {
  const byNeed = productsForNeeds(await getProducts());
  const panels = Object.fromEntries(
    EVENT_NEEDS.map((n) => [
      n.key,
      byNeed[n.key].length ? (
        <ScrollRow key={n.key} label={`Produk ${n.title}`}>
          {byNeed[n.key].map((p) => (
            <div key={p.id} className="w-[46%] shrink-0 snap-start sm:w-56 lg:w-64">
              <ProductCard product={p} />
            </div>
          ))}
        </ScrollRow>
      ) : (
        <p key={n.key} className="rounded-2xl bg-leaf-50 px-5 py-6 text-center text-muted">
          Dibuat sesuai pesanan — ceritakan jumlah tamu & budget di form di bawah, kami kirim contoh dan harganya.
        </p>
      ),
    ]),
  ) as Record<EventNeedKey, React.ReactNode>;
  const counts = Object.fromEntries(EVENT_NEEDS.map((n) => [n.key, byNeed[n.key].length])) as Record<EventNeedKey, number>;

  return (
    <>
      <section className="relative overflow-hidden bg-[#ff3e4c] text-white">
        <BgCircles />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <p className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide uppercase">Untuk acara & kantor</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-extrabold sm:text-6xl">Bikin acaramu lebih segar</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/90">
            Dari coffee break rapat, arisan, ulang tahun, sampai hampers untuk ratusan klien — pilih yang mau disajikan, lihat contohnya, lalu
            minta penawaran.
          </p>
        </div>
      </section>
      <EventPicker panels={panels} counts={counts} />
    </>
  );
}
