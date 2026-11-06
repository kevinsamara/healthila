import Image from "next/image";
import Link from "next/link";
import { Building2, CalendarHeart, MapPin, Gift, PenLine, ShoppingBasket, Snowflake, Sparkles, Star, TreePine, Truck } from "lucide-react";
import type { Product } from "@/lib/catalog";
import type { OccasionPage } from "@/lib/occasion-pages";
import { waLink } from "@/lib/site";
import { ProductCard } from "@/components/ProductCard";
import { OtherOccasions } from "@/components/OtherOccasions";
import { WhatsAppIcon } from "@/components/WhatsAppFab";

const GOLD = "#f3c969";

// Only promises already made elsewhere on the site (occasion copy, parcel page).
const PERKS = [
  { icon: Gift, title: "Kartu ucapan Natal gratis", text: "Tulis ucapan Kakak, kami cetak & selipkan." },
  { icon: Sparkles, title: "Pita merah atau hijau", text: "Sentuhan Natal di setiap rangkaian." },
  { icon: Truck, title: "Free delivery selama masa Natal", text: "Untuk kirim 24–25 Desember, pesan minimal H-3." },
  { icon: MapPin, title: "Antar se-Malang", text: "Bisa custom isi & budget." },
];

const STEPS = [
  { icon: ShoppingBasket, title: "Pilih parcel", text: "Pilih dari koleksi Natal atau rancang sendiri isi dan budget-nya." },
  { icon: PenLine, title: "Tulis ucapan Natal", text: "Isi catatan pesanan: ucapan untuk kartu dan pilihan pita merah atau hijau." },
  { icon: CalendarHeart, title: "Pilih tanggal kirim", text: "Atur tanggal & jam antar di keranjang. Untuk 24–25 Desember, pesan minimal H-3." },
];

/** /hampers/natal: festive landing for Christmas parcels. */
export function NatalLanding({
  page,
  natal,
  parcels,
  days,
}: {
  page: OccasionPage;
  /** Products in "Parcel Natal" or tagged Natal. */
  natal: Product[];
  /** All parcels in stock, shown while the Natal collection is empty. */
  parcels: Product[];
  days: number | null;
}) {
  const products = natal.length ? natal : parcels;
  const photos = [...natal, ...parcels.filter((p) => !natal.includes(p))].filter((p) => p.photo_url).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a3b2c] via-[#0f5a3f] to-[#0a3b2c] text-white">
        <NatalSky />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-20 md:grid-cols-2 md:pt-20 md:pb-28">
          <div className="text-center md:text-left">
            {days != null && days >= 0 && (
              <p className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold text-[#0a3b2c]" style={{ background: GOLD }}>
                <TreePine className="h-4 w-4" />
                {days === 0 ? "Selamat Natal!" : `${days} hari lagi menuju Natal`}
              </p>
            )}
            <h1 className="mt-5 text-5xl leading-[1.05] font-extrabold sm:text-7xl">
              Parcel <span style={{ color: GOLD }}>Natal</span>
              <span className="block text-3xl font-bold text-white/90 sm:text-4xl">penuh buah segar & doa baik</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/85 md:mx-0">{page.intro}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <a href="#koleksi" className="flex h-12 items-center rounded-full px-7 font-bold text-[#0a3b2c] hover:brightness-105" style={{ background: GOLD }}>
                Lihat koleksi Natal
              </a>
              <Link href="/parcel/custom" className="flex h-12 items-center rounded-full bg-[#b3202f] px-6 font-bold text-white hover:bg-[#c92838]">
                <ShoppingBasket className="mr-2 h-5 w-5" />
                Rancang Parcel
              </Link>
              <a
                href={waLink("Halo Healthila, saya mau pesan parcel Natal")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center gap-2 rounded-full px-5 font-semibold ring-1 ring-white/40 hover:bg-white/10"
              >
                <WhatsAppIcon className="h-5 w-5" /> Tanya via WhatsApp
              </a>
            </div>
          </div>

          {photos.length > 0 ? (
            <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4">
              {photos.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/produk/${p.slug}`}
                  className={`group relative aspect-square overflow-hidden rounded-[2rem] shadow-2xl shadow-black/30 ring-4 transition hover:-translate-y-1 ${
                    ["-rotate-3", "rotate-2 translate-y-6", "rotate-2 -translate-y-2", "-rotate-2 translate-y-4"][i]
                  }`}
                  style={{ ["--tw-ring-color" as string]: i % 2 ? "#b3202f" : GOLD }}
                >
                  <Image src={p.photo_url!} alt={p.name} fill sizes="(min-width: 768px) 220px, 45vw" className="object-cover transition duration-500 group-hover:scale-105" priority={i < 2} />
                </Link>
              ))}
              <Star className="absolute -top-6 -left-4 h-10 w-10 rotate-12 fill-current" style={{ color: GOLD }} aria-hidden />
            </div>
          ) : (
            <TreePine className="mx-auto h-56 w-56 text-[#2f8a5f]" aria-hidden />
          )}
        </div>
        {/* Scalloped edge into the perks band. */}
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-6 w-full" aria-hidden>
          <path d="M0 40V20Q30 0 60 20T120 20T180 20T240 20T300 20T360 20T420 20T480 20T540 20T600 20T660 20T720 20T780 20T840 20T900 20T960 20T1020 20T1080 20T1140 20T1200 20T1260 20T1320 20T1380 20T1440 20V40Z" fill={GOLD} />
        </svg>
      </section>

      {/* Perks */}
      <section style={{ background: GOLD }} className="text-[#0a3b2c]">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-8 lg:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0a3b2c] text-[#f3c969]">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-bold leading-tight">{title}</span>
                <span className="mt-0.5 block text-sm text-[#0a3b2c]/75">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Collection */}
      <section id="koleksi" className="scroll-mt-28 bg-[#fbf6ec]">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <Ornament />
          <h2 className="mt-3 text-center text-4xl font-extrabold text-[#0a3b2c] sm:text-5xl">Koleksi Parcel Natal</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted">
            {natal.length
              ? "Dirangkai dengan buah segar pilihan dan sentuhan merah-hijau."
              : "Koleksi Natal sedang kami siapkan. Sementara itu, semua parcel bisa diberi pita & kartu ucapan Natal."}
          </p>
          {products.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center text-muted">Silakan rancang parcel sendiri atau chat kami.</p>
          )}
          <div className="mt-10 flex justify-center">
            <Link href="/parcel/custom" className="flex h-12 items-center rounded-full bg-[#0a3b2c] px-7 font-bold text-white hover:bg-[#0f5a3f]">
              <ShoppingBasket className="mr-2 h-5 w-5" />
              Mau isi & budget sendiri? Rancang Parcel
            </Link>
          </div>
        </div>
      </section>

      {/* How to order */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-center text-3xl font-extrabold text-[#0a3b2c] sm:text-4xl">Cara pesan parcel Natal</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className={`relative rounded-3xl p-6 ${i === 1 ? "bg-[#fdecee]" : "bg-[#e9f6ef]"}`}>
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${i === 1 ? "bg-[#b3202f]" : "bg-[#0f5a3f]"}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="absolute top-5 right-6 font-display text-5xl font-extrabold text-black/5">{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Corporate */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#7a1220] to-[#b3202f] text-white">
        <Snowflake className="absolute -top-6 right-10 h-32 w-32 text-white/10" aria-hidden />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-12 text-center md:flex-row md:text-left">
          <Building2 className="h-12 w-12 shrink-0" style={{ color: GOLD }} />
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold">Kirim parcel Natal ke klien & rekan kerja?</h2>
            <p className="mt-1 text-white/85">Untuk jumlah banyak atau banyak alamat, tim kami bantu atur isi, kartu ucapan, dan jadwal kirimnya.</p>
          </div>
          <Link href="/korporat" className="flex h-12 shrink-0 items-center rounded-full px-7 font-bold text-[#0a3b2c] hover:brightness-105" style={{ background: GOLD }}>
            Pesanan Korporat
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <div className="mx-auto max-w-7xl px-4 py-14">
        <section className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold text-ink">Pertanyaan seputar parcel Natal</h2>
          <div className="mt-4 space-y-3">
            {page.tips.map((t) => (
              <details key={t.q} className="rounded-2xl bg-white p-4 ring-1 ring-leaf-100">
                <summary className="cursor-pointer font-semibold text-ink">{t.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            Semua parcel dilindungi{" "}
            <Link href="/garansi" className="font-semibold text-leaf-700 underline">
              Garansi Healthila
            </Link>
            .
          </p>
        </section>
        <OtherOccasions current={page.key} />
      </div>
    </>
  );
}

/** Night-sky decoration: red glow, gold sparkles and slowly falling snow. */
function NatalSky() {
  const flakes = [
    [6, 10, 18], [16, 62, 12], [27, 28, 22], [38, 78, 14], [48, 8, 12], [57, 50, 18],
    [66, 18, 14], [74, 70, 24], [83, 36, 12], [91, 12, 20], [95, 58, 14], [3, 84, 16],
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute -top-40 -right-40 h-[36rem] w-[36rem] rounded-full bg-[#b3202f]/45 blur-3xl" />
      <span className="absolute -bottom-48 -left-32 h-[30rem] w-[30rem] rounded-full bg-[#f3c969]/15 blur-3xl" />
      {flakes.map(([left, top, size], i) => (
        <Snowflake
          key={i}
          className="natal-snow absolute text-white/50"
          style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${-i * 1.7}s`, animationDuration: `${9 + (i % 4) * 2}s` }}
        />
      ))}
    </div>
  );
}

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden>
      <span className="h-px w-16 bg-[#b3202f]/40" />
      <Star className="h-4 w-4 fill-[#b3202f] text-[#b3202f]" />
      <TreePine className="h-6 w-6 text-[#0f5a3f]" />
      <Star className="h-4 w-4 fill-[#b3202f] text-[#b3202f]" />
      <span className="h-px w-16 bg-[#b3202f]/40" />
    </div>
  );
}
