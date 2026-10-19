import type { Metadata } from "next";
import { CategoryPage, categoryParams } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Buah Segar",
  description: "Buah segar lokal & impor pilihan dari Healthila — apel, anggur, jeruk, pear, melon, dan buah musiman.",
};

export default async function BuahSegarPage({ searchParams }: PageProps<"/buah-segar">) {
  return (
    <CategoryPage
      {...categoryParams(await searchParams)}
      config={{
        path: "/buah-segar",
        sections: ["buah"],
        title: "Buah Segar",
        subtitle: "Buah segar pilihan, disortir setiap hari untuk menemani gaya hidup sehat Kakak.",
        gradient: "bg-gradient-to-br from-sun-400 via-[#ff8a3d] to-coral-500",
      }}
    />
  );
}
