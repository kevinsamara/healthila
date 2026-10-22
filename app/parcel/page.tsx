import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPage, categoryParams } from "@/components/CategoryPage";
import { Testimonials } from "@/components/HomeSections";
import { OtherOccasions } from "@/components/OtherOccasions";
import { ParcelFaq, ParcelHero, ParcelPromises, ParcelSteps } from "@/components/parcel/ParcelLanding";
import { WhatsAppIcon } from "@/components/WhatsAppFab";
import { getProducts } from "@/lib/catalog";
import { waLink } from "@/lib/site";
import { ShoppingBasket } from "lucide-react";

export const metadata: Metadata = {
  title: "Parcel Buah & Hampers Malang",
  description:
    "Parcel buah & hampers di Malang — dirangkai elegan untuk ulang tahun, get well soon, lamaran, Lebaran, Natal & Imlek. Bisa custom, foto sebelum kirim, antar same-day se-Malang.",
};

export default async function ParcelPage({ searchParams }: PageProps<"/parcel">) {
  const parcels = (await getProducts()).filter((p) => p.section === "parcel" && p.in_stock);
  return (
    <CategoryPage
      {...categoryParams(await searchParams)}
      config={{
        path: "/parcel",
        sections: ["parcel"],
        title: "Parcel Buah & Hampers",
        subtitle: "",
        gradient: "",
        giftFilters: true,
        hero: <ParcelHero parcels={parcels} />,
        beforeGrid: (
          <>
            <ParcelPromises />
            <div className="mx-auto max-w-7xl px-4">
              <OtherOccasions />
            </div>
          </>
        ),
        gridTitle: "Koleksi parcel",
        extra: (
          <div className="mt-16 flex flex-col items-center gap-6 rounded-3xl bg-plum-700 p-8 text-center text-white sm:flex-row sm:p-10 sm:text-left">
            <ShoppingBasket className="h-16 w-16 shrink-0 text-sun-400" strokeWidth={1.4} />
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold">Belum ada yang pas?</h2>
              <p className="mt-2 text-white/85">
                Rancang sendiri — pilih wadah, buah favorit penerima, warna pita, dan budget. Lihat pratinjaunya langsung, tim kami yang merangkai.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <Link
                href="/parcel/custom"
                className="flex h-12 items-center justify-center rounded-full bg-sun-400 px-6 font-bold text-leaf-900 hover:bg-sun-300"
              >
                <ShoppingBasket className="mr-2 h-5 w-5" />
                Rancang Parcel Online
              </Link>
              <a
                href={waLink("Halo Healthila, saya mau pesan parcel custom")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white ring-1 ring-white/40 hover:bg-white/10"
              >
                <WhatsAppIcon className="h-4 w-4" /> Chat langsung
              </a>
            </div>
          </div>
        ),
        after: (
          <>
            <ParcelSteps />
            <Testimonials />
            <ParcelFaq />
          </>
        ),
      }}
    />
  );
}
