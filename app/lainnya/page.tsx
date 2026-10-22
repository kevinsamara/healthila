import type { Metadata } from "next";
import { CategoryPage, categoryParams } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Camilan Sehat & Lainnya",
  description: "Camilan sehat dan produk pendamping buah dari Healthila, toko buah Malang. Pesan online bersama buah & parcel, diantar se-Malang.",
};

export default async function LainnyaPage({ searchParams }: PageProps<"/lainnya">) {
  return (
    <CategoryPage
      {...categoryParams(await searchParams)}
      config={{
        path: "/lainnya",
        sections: ["lainnya"],
        title: "Lainnya",
        subtitle: "Camilan sehat & pendamping buah favorit Kakak.",
        gradient: "bg-gradient-to-br from-sky-600 via-sky-500 to-cyan-300",
      }}
    />
  );
}
