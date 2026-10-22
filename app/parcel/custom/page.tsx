import type { Metadata } from "next";
import { ParcelBuilder, type FruitGroup } from "@/components/parcel/ParcelBuilder";
import { getProducts } from "@/lib/catalog";
import { fruitArt } from "@/lib/fruit-art";
import { getFruitArt, getParcelContainers } from "@/lib/parcel-visuals";

export const metadata: Metadata = {
  title: "Custom Parcel Buah & Hampers Malang",
  description: "Konsultasi parcel buah online: pilih bentuk, acara, budget, buah favorit, dan kartu ucapan — tim Healthila rangkaikan untuk Kakak.",
};

export const revalidate = 300;

export default async function ParcelCustomPage() {
  const [products, art] = await Promise.all([getProducts(), getFruitArt()]);

  // Fruit types in stock with their specific varieties; ops decide quantities.
  const byGroup = new Map<string, { id: string; name: string }[]>();
  for (const p of products) {
    if (p.section !== "buah" || !p.in_stock || !p.product_group || p.product_group === "Sayuran") continue;
    byGroup.set(p.product_group, [...(byGroup.get(p.product_group) ?? []), { id: p.id, name: p.name }]);
  }
  const fruits: FruitGroup[] = [...byGroup.entries()]
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], "id"))
    .map(([name, items]) => ({
      name,
      emoji: "",
      // Uploaded real PNG first, then the 3D illustration.
      art: art.byGroup.get(name.toLowerCase()) ?? fruitArt(name),
      items: items.sort((a, b) => a.name.localeCompare(b.name, "id")).map((i) => ({ ...i, art: art.byProduct.get(i.id) ?? null })),
    }));

  // Containers, prices and PNG layers from Healthila OS; static list as fallback
  // (with photos matched from the CRM parcel products).
  const parcels = products.filter((p) => p.section === "parcel" && p.photo_url);
  const containers = await getParcelContainers((c) => parcels.find((p) => c.crmMatch?.test(p.name))?.photo_url ?? null);

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
        <ParcelBuilder containers={containers} fruits={fruits} />
      </div>
    </>
  );
}
