import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPage, categoryParams } from "@/components/CategoryPage";
import { WhatsAppIcon } from "@/components/WhatsAppFab";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Parcel & Hampers Buah",
  description: "Parcel dan hampers buah premium dari Healthila — dirangkai elegan untuk ulang tahun, get well soon, Lebaran, dan momen spesial.",
};

export default async function ParcelPage({ searchParams }: PageProps<"/parcel">) {
  return (
    <CategoryPage
      {...categoryParams(await searchParams)}
      config={{
        path: "/parcel",
        sections: ["parcel"],
        title: "Hampers Healthila",
        subtitle: "Buah premium, dirangkai elegan, siap jadi hadiah istimewa untuk orang tersayang. Karena setiap momen berharga, pantas dikenang.",
        gradient: "bg-gradient-to-b from-plum-700 via-[#b8245e] to-coral-500",
        heroCta: { href: "/parcel/custom", label: "🧺 Rancang Parcel Sendiri" },
        extra: (
          <div className="mt-16 flex flex-col items-center gap-6 rounded-3xl bg-plum-700 p-8 text-center text-white sm:flex-row sm:p-10 sm:text-left">
            <span className="text-6xl">🧺</span>
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold">Mau parcel custom?</h2>
              <p className="mt-2 text-white/85">
                Pilih bentuk, acara, budget, dan buah favorit penerima, lihat pratinjaunya langsung — tim kami rangkaikan khusus, lengkap dengan kartu ucapan.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <Link
                href="/parcel/custom"
                className="flex h-12 items-center justify-center rounded-full bg-sun-400 px-6 font-bold text-leaf-900 hover:bg-sun-300"
              >
                🧺 Rancang Parcel Online
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
      }}
    />
  );
}
