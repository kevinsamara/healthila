import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/ContentPage";
import { FREE_SHIPPING, site, waLink } from "@/lib/site";
import { rupiah } from "@/lib/format";

export const metadata: Metadata = {
  title: "Garansi Healthila — Buah Segar & Parcel Aman Sampai",
  description:
    "Garansi buah segar Healthila Malang: buah disortir sebelum dikirim, klaim cukup kirim foto via WhatsApp 1×24 jam, foto parcel sebelum berangkat, kartu ucapan gratis.",
};

const PROMISES = [
  {
    icon: "🍎",
    title: "Garansi buah segar",
    text: "Kalau ada buah yang kurang layak saat diterima, kirim foto lewat WhatsApp maksimal 1×24 jam. Kami ganti di pengiriman berikutnya atau carikan solusi lain yang Kakak setujui — tanpa ribet retur barang.",
  },
  {
    icon: "🔍",
    title: "Disortir sebelum dikirim",
    text: "Setiap pesanan dicek dan disortir tim kami di hari pengiriman — bukan diambil asal dari gudang.",
  },
  {
    icon: "📸",
    title: "Foto parcel sebelum berangkat",
    text: "Untuk parcel & hampers, Kakak menerima foto hasil rangkaian via WhatsApp sebelum dikirim, plus konfirmasi saat sudah sampai.",
  },
  {
    icon: "💌",
    title: "Kartu ucapan gratis",
    text: "Setiap parcel bisa disertai kartu ucapan Healthila tanpa biaya. Desain kartu custom juga tersedia.",
  },
  {
    icon: "🚚",
    title: `Free ongkir s.d. ${rupiah(FREE_SHIPPING.max)}`,
    text: `Untuk ${FREE_SHIPPING.orders} pembelian pertama lewat website, ongkir ditanggung Healthila sampai ${rupiah(FREE_SHIPPING.max)}.`,
  },
  {
    icon: "🕐",
    title: "Pilih jam antar",
    text: "Pilih pengantaran pagi, siang, atau sore saat checkout. Same-day untuk pesanan sebelum batas jam di halaman keranjang.",
  },
];

export default function GaransiPage() {
  return (
    <ContentPage
      title="Garansi Healthila"
      intro="Belanja buah & parcel online harus tenang. Ini janji kami untuk setiap pesanan."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {PROMISES.map((p) => (
          <div key={p.title} className="rounded-2xl bg-white p-5 ring-1 ring-leaf-100">
            <span className="text-3xl">{p.icon}</span>
            <h3 className="mt-2 text-lg font-bold text-ink">{p.title}</h3>
            <p className="mt-1! mb-0! text-sm">{p.text}</p>
          </div>
        ))}
      </div>
      <h2>Cara klaim garansi</h2>
      <ol>
        <li>Foto buah/parcel yang bermasalah (sertakan kode pesanan bila ada).</li>
        <li>
          Kirim ke WhatsApp{" "}
          <a href={waLink("Halo Healthila, saya mau klaim garansi untuk pesanan ")} className="font-semibold text-leaf-700 underline">
            {site.whatsappDisplay}
          </a>{" "}
          maksimal 1×24 jam setelah pesanan diterima.
        </li>
        <li>Tim kami cek dan menghubungi Kakak dengan solusinya di hari yang sama (jam operasional).</li>
      </ol>
      <p>
        Ketentuan lengkap ada di{" "}
        <Link href="/syarat-ketentuan" className="font-semibold text-leaf-700 underline">
          Syarat & Ketentuan
        </Link>
        .
      </p>
    </ContentPage>
  );
}
