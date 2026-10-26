import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPage, categoryParams } from "@/components/CategoryPage";
import { SeoBlock } from "@/components/SeoBlock";

export const metadata: Metadata = {
  title: "Toko Buah Malang — Buah Segar Online & Delivery",
  description:
    "Toko buah online di Malang: apel, anggur, jeruk, pear, melon & buah impor pilihan, disortir dan dicek manisnya. Delivery buah se-Malang Raya, free ongkir s.d. 10rb untuk pesanan pertama.",
  alternates: { canonical: "/buah-segar" },
};

const link = "font-semibold text-leaf-700 underline";

export default async function BuahSegarPage({ searchParams }: PageProps<"/buah-segar">) {
  return (
    <CategoryPage
      {...categoryParams(await searchParams)}
      config={{
        path: "/buah-segar",
        sections: ["buah"],
        title: "Buah Segar Malang",
        subtitle: "Buah segar pilihan, disortir setiap hari untuk menemani gaya hidup sehat Kakak.",
        gradient: "bg-gradient-to-br from-sun-400 via-[#ff8a3d] to-coral-500",
        after: (
          <SeoBlock
            title="Toko buah online di Malang, diantar sampai depan rumah"
            paragraphs={[
              <>
                Healthila adalah toko buah di Malang yang menjual buah lokal dan impor — apel, anggur, jeruk, pear, melon, kelengkeng, kiwi,
                blueberry, sampai buah musiman. Setiap buah kami kurasi: sampelnya dicicipi, dicek tingkat manisnya dengan brix meter, dan disortir
                supaya tidak ada yang memar atau busuk sebelum dikirim.
              </>,
              <>
                Pesan buah online langsung dari website ini, pilih jam antar pagi, siang, atau sore, lalu bayar dengan QRIS atau konfirmasi lewat
                WhatsApp. Kami melayani delivery buah se-Kota Malang, Kota Batu, dan Kabupaten Malang. Butuh untuk acara atau kantor? Lihat{" "}
                <Link href="/acara" className={link}>
                  buah untuk acara
                </Link>
                , atau langganan rutin di{" "}
                <Link href="/langganan" className={link}>
                  langganan buah
                </Link>
                .
              </>,
            ]}
            faq={[
              ["Apakah Healthila bisa antar buah di hari yang sama?", "Bisa, selama slot antar hari itu masih tersedia. Batas jam pesan untuk tiap slot (pagi, siang, sore) terlihat di halaman keranjang."],
              ["Berapa ongkir delivery buah di Malang?", "Ongkir dihitung otomatis dari alamat saat checkout. Untuk 2 pesanan pertama lewat website, ongkir gratis sampai Rp10.000."],
              ["Bagaimana kalau buah yang diterima kurang bagus?", "Kirim foto lewat WhatsApp maksimal 1×24 jam setelah diterima. Kami ganti di pengiriman berikutnya atau carikan solusi lain yang Kakak setujui."],
              ["Di mana lokasi toko buah Healthila?", "Toko kami ada di Malang — alamat, jam buka, dan petunjuk arah ada di halaman Kontak. Bisa datang langsung atau pesan online untuk diantar."],
            ]}
          />
        ),
      }}
    />
  );
}
