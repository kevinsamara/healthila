import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPage, categoryParams } from "@/components/CategoryPage";
import { SeoBlock } from "@/components/SeoBlock";

export const metadata: Metadata = {
  title: "Jus Buah & Cold-Pressed Juice Malang",
  description: "Jus buah dan cold-pressed juice tanpa gula tambahan, plus dessert buah di Malang. Dibuat fresh setiap hari, delivery se-Malang Raya.",
  alternates: { canonical: "/jus-dessert" },
};

export default async function JusDessertPage({ searchParams }: PageProps<"/jus-dessert">) {
  return (
    <CategoryPage
      {...categoryParams(await searchParams)}
      config={{
        path: "/jus-dessert",
        sections: ["jus", "dessert"],
        title: "Jus & Dessert Malang",
        subtitle: "Cold-pressed juice tanpa gula tambahan dan dessert berbahan buah yang ringan di tubuh. Dibuat fresh setiap hari.",
        gradient: "bg-gradient-to-br from-leaf-900 via-leaf-700 to-[#5fcf8f]",
        after: (
          <SeoBlock
            title="Jus cold-pressed & jus buah segar di Malang"
            paragraphs={[
              <>
                Jus Healthila dibuat fresh setiap hari dari buah pilihan yang sama dengan yang kami jual di toko. Ada cold-pressed juice dengan
                banyak varian rasa, dan jus buah 500ml seperti alpukat, jambu merah, dan mangga — tanpa gula tambahan.
              </>,
              <>
                Mau minum rutin? Atur{" "}
                <Link href="/langganan" className="font-semibold text-leaf-700 underline">
                  langganan jus
                </Link>{" "}
                — pilih jumlah orang, botol, jadwal kirim, dan rasanya; makin banyak botol, makin besar diskonnya. Untuk seminar, snack box, atau
                welcome drink, lihat{" "}
                <Link href="/acara?pilih=jus" className="font-semibold text-leaf-700 underline">
                  jus untuk acara
                </Link>
                .
              </>,
            ]}
            faq={[
              ["Apa bedanya cold-pressed juice dengan jus biasa?", "Cold-pressed juice diperas dengan tekanan tanpa panas dari blender, sehingga rasanya lebih segar. Jus Healthila tidak memakai gula tambahan."],
              ["Apakah jus bisa diantar di Malang?", "Bisa, delivery se-Kota Malang, Batu, dan Kabupaten Malang dengan pilihan jam antar pagi, siang, atau sore."],
              ["Apakah ada langganan jus?", "Ada. Di halaman Langganan, pilih jumlah orang, botol per kiriman, frekuensi (mis. 2× seminggu), durasi 1 minggu sampai 3 bulan, dan rasanya. Diskon langganan sampai 8% sesuai total botol."],
            ]}
          />
        ),
      }}
    />
  );
}
