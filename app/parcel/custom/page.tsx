import type { Metadata } from "next";
import { ParcelBuilder, type FruitOption } from "@/components/parcel/ParcelBuilder";
import { getProducts } from "@/lib/catalog";
import { productEmoji } from "@/lib/emoji";
import { fruitArt } from "@/lib/fruit-art";

export const metadata: Metadata = {
  title: "Rancang Parcel Custom",
  description: "Konsultasi parcel buah online: pilih bentuk, acara, budget, buah favorit, dan kartu ucapan — tim Healthila rangkaikan untuk Kakak.",
};

export const revalidate = 300;

export default async function ParcelCustomPage() {
  // Fruit types currently in stock; operations pick the actual varieties.
  const counts = new Map<string, number>();
  for (const p of await getProducts()) {
    if (p.section !== "buah" || !p.in_stock || !p.product_group || p.product_group === "Sayuran") continue;
    counts.set(p.product_group, (counts.get(p.product_group) ?? 0) + 1);
  }
  const fruits: FruitOption[] = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "id"))
    .map(([name, varieties]) => ({ name, varieties, emoji: productEmoji(name), art: fruitArt(name) }));

  return (
    <>
      <section className="bg-gradient-to-b from-plum-700 via-[#b8245e] to-coral-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <p className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide uppercase">Konsultasi parcel online</p>
          <h1 className="mt-3 text-5xl font-extrabold sm:text-6xl">Rancang Parcel Kakak</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/90">
            Pilih bentuk, acara, budget, dan buah favorit. Tim kami rangkaikan dengan komposisi terbaik — tanpa perlu hitung jumlah.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <ParcelBuilder fruits={fruits} />
      </div>
    </>
  );
}
