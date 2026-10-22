import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "Tentang Healthila — Toko Buah Malang",
  description: "Healthila — fruitful heart, eating smart. Toko buah segar, parcel buah, jus & dessert di Malang yang menyortir setiap buah sebelum dikirim.",
};

export default function AboutPage() {
  return (
    <ContentPage
      title="Tentang Healthila"
      intro="Fruitful heart, eating smart — kami percaya hidup sehat dimulai dari buah yang dipilih dengan hati."
    >
      <p>
        Healthila menghadirkan buah segar lokal dan impor, jus cold-pressed, dessert sehat, dan parcel buah untuk berbagai
        momen. Setiap buah kami pilih dan sortir setiap hari supaya yang sampai di tangan Anda dalam kondisi terbaik.
      </p>
      <h2>Yang kami tawarkan</h2>
      <ul>
        <li>Buah segar pilihan — dari apel, anggur, jeruk, hingga buah musiman.</li>
        <li>Jus cold-pressed tanpa gula tambahan.</li>
        <li>Dessert berbahan buah.</li>
        <li>Parcel & hampers buah, bisa custom sesuai budget dan momen.</li>
      </ul>
      <p>
        <Link href="/katalog" className="font-semibold text-leaf-700 underline">
          Lihat katalog lengkap →
        </Link>
      </p>
    </ContentPage>
  );
}
