import type { Metadata } from "next";
import { CategoryPage, categoryParams } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Jus Buah & Dessert Malang",
  description: "Jus buah cold-pressed tanpa gula tambahan dan dessert buah di Malang. Dibuat fresh setiap hari, bisa delivery se-Malang.",
};

export default async function JusDessertPage({ searchParams }: PageProps<"/jus-dessert">) {
  return (
    <CategoryPage
      {...categoryParams(await searchParams)}
      config={{
        path: "/jus-dessert",
        sections: ["jus", "dessert"],
        title: "Jus & Dessert",
        subtitle: "Cold-pressed juice tanpa gula tambahan dan dessert berbahan buah yang ringan di tubuh. Dibuat fresh setiap hari.",
        gradient: "bg-gradient-to-br from-leaf-900 via-leaf-700 to-[#5fcf8f]",
      }}
    />
  );
}
