import Link from "next/link";
import { ArrowRight, CalendarHeart, PartyPopper } from "lucide-react";
import { BgCircles } from "./HomeSections";

/**
 * Home: big-order entry points — events/companies (/acara) and recurring
 * subscriptions (/langganan). Sits right before "Produk Unggulan".
 */
const CARDS = [
  {
    href: "/acara",
    icon: PartyPopper,
    eyebrow: "Untuk acara & kantor",
    title: "Butuh buah, dessert, atau jus untuk acaramu?",
    text: "Rapat, seminar, arisan, ulang tahun, sampai hampers untuk klien — dari belasan sampai ratusan porsi.",
    chips: ["Fruit platter", "Fruit tower", "Parcel & hampers", "Jus & cold-pressed"],
    cta: "Lihat pilihan untuk acara",
  },
  {
    href: "/langganan",
    icon: CalendarHeart,
    eyebrow: "Langganan",
    title: "Buah & jus diantar rutin, makin banyak makin hemat",
    text: "Untuk rumah, sekolah, atau kantor. Atur sekali — jadwal, jumlah, dan rasanya kamu yang pilih.",
    chips: ["Buah utuh", "Buah potong", "Jus", "Cold-pressed"],
    cta: "Atur langganan",
  },
];

export function BulkSection() {
  return (
    <section className="relative overflow-hidden bg-[#ff3e4c]">
      <BgCircles />
      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="text-center text-white">
          <h2 className="text-4xl font-extrabold sm:text-5xl">Pesan banyak? Atau rutin?</h2>
          <p className="mt-3 text-white/90 italic">Lebih praktis, lebih hemat — kami siapkan semuanya</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.href}
                href={c.href}
                className="group flex flex-col rounded-3xl bg-white p-7 shadow-xl shadow-black/10 transition hover:-translate-y-1 sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff3e4c]/10 text-[#ff3e4c]">
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <span className="text-sm font-bold tracking-wide text-[#ff3e4c] uppercase">{c.eyebrow}</span>
                </div>
                <h3 className="mt-4 text-3xl leading-tight font-extrabold text-ink">{c.title}</h3>
                <p className="mt-2 text-muted">{c.text}</p>
                <div className="mt-4 mb-6 flex flex-wrap gap-2">
                  {c.chips.map((t) => (
                    <span key={t} className="rounded-full bg-leaf-50 px-3 py-1 text-sm font-semibold text-leaf-900">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-sun-400 px-5 py-3 font-bold text-leaf-900 group-hover:bg-sun-300">
                  {c.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
