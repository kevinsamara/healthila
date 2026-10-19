import type { Metadata } from "next";
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
        extra: (
          <div className="mt-16 flex flex-col items-center gap-6 rounded-3xl bg-plum-700 p-8 text-center text-white sm:flex-row sm:p-10 sm:text-left">
            <span className="text-6xl">🧺</span>
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold">Mau parcel custom?</h2>
              <p className="mt-2 text-white/85">
                Ceritakan budget, momen, dan buah favorit penerima — tim kami rangkaikan khusus, lengkap dengan kartu ucapan.
              </p>
            </div>
            <a
              href={waLink("Halo Healthila, saya mau pesan parcel custom")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-sun-400 px-6 font-bold text-leaf-900 hover:bg-sun-300"
            >
              <WhatsAppIcon className="h-5 w-5" /> Konsultasi via WhatsApp
            </a>
          </div>
        ),
      }}
    />
  );
}
