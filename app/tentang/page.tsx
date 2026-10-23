import type { Metadata } from "next";
import Link from "next/link";
import {
  Apple,
  ArrowRight,
  BadgeCheck,
  CalendarHeart,
  Camera,
  CupSoda,
  ExternalLink,
  Gift,
  HeartHandshake,
  type LucideIcon,
  ScanSearch,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { DynIcon } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Tentang Healthila — Toko Buah Malang, Merek Terdaftar DJKI",
  description:
    "Kenalan sama Healthila: toko buah, jus, dessert & parcel buah di Malang yang menyortir setiap buah dan bergaransi. Merek terdaftar di DJKI (IDM001194628, IDM001214101).",
  alternates: { canonical: "/tentang" },
};

/** Trademark registrations at DJKI / DGIP (Direktorat Jenderal Kekayaan Intelektual). */
const TRADEMARKS = ["IDM001194628", "IDM001214101"];
const PDKI_URL = "https://pdki-indonesia.dgip.go.id/";

const HOW: [LucideIcon, string, string][] = [
  [ScanSearch, "Disortir dulu, baru dijual", "Buah kami cek satu per satu setiap hari. Yang kurang oke? Nggak lolos ke rak, apalagi sampai ke rumah Kakak."],
  [ShieldCheck, "Bergaransi, tanpa drama", "Ada buah yang kurang layak saat diterima? Kirim foto lewat WhatsApp maksimal 1×24 jam — kami ganti, tanpa ribet retur."],
  [Camera, "Parcel difoto sebelum berangkat", "Kakak bisa lihat dulu parcelnya sebelum diantar. Nggak ada lagi deg-degan “kira-kira jadinya kayak apa ya?”."],
  [Truck, "Antar se-Malang Raya", "Kota Malang, Batu, sampai Kabupaten Malang — pilih jam antar pagi, siang, atau sore. Kami yang jalan."],
];

const WHAT: [LucideIcon, string, string, string][] = [
  [Apple, "Buah segar", "Lokal sampai impor, dari yang manisnya aman sampai yang eksotis bikin penasaran.", "/buah-segar"],
  [CupSoda, "Jus & dessert", "Jus cold-pressed dan dessert berbahan buah buat teman ngemil yang nggak bikin nyesel.", "/jus-dessert"],
  [Gift, "Parcel & hampers", "Untuk ulang tahun, lebaran, jenguk, atau sekadar bilang “makasih ya” dengan cara yang manis.", "/parcel"],
  [CalendarHeart, "Langganan", "Buah & jus rutin diantar ke rumah, sekolah, atau kantor — atur sekali, tinggal terima beres.", "/langganan"],
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-leaf-900 via-leaf-700 to-[#5fcf8f] text-white">
        <span aria-hidden className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <span aria-hidden className="pointer-events-none absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-lime-300/20 blur-2xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <p className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide uppercase">Tentang kami</p>
          <h1 className="mt-4 text-5xl leading-tight font-extrabold sm:text-6xl">
            Halo, kami Healthila.
            <br />
            <span className="text-lime-200">Tukang pilih buah paling rewel di Malang.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/90">
            Kami bukan sekadar jualan buah. Kami yang mencium, menekan pelan, dan menimbang buah satu per satu — supaya Kakak tinggal menikmati
            manisnya. <em>Fruitful heart, eating smart.</em>
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/25">
            <BadgeCheck className="h-4 w-4 text-lime-200" /> Merek terdaftar di DJKI
          </span>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-3xl px-4 py-14 text-center">
        <p className="text-sm font-bold tracking-wide text-leaf-500 uppercase">Kenapa kami ada</p>
        <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">Hidup sehat itu harusnya gampang (dan enak)</h2>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
          <p>
            Pernah beli semangka yang ternyata hambar? Atau alpukat yang mulus di luar, tapi pas dibelah… ya sudahlah. Kesal, kan? Itu yang ingin
            kami hapus dari daftar keluhan orang Malang.
          </p>
          <p>
            Kami percaya buah yang <strong className="text-ink">pasti enak</strong>, <strong className="text-ink">bergaransi</strong>,{" "}
            <strong className="text-ink">sehat</strong>, sampai yang <strong className="text-ink">unik & eksotis</strong> harus bisa dinikmati lebih
            mudah oleh lebih banyak orang. Supaya memilih yang lebih sehat — buah, jus, dessert, sampai hampers — bukan lagi soal untung-untungan.
          </p>
        </div>
      </section>

      {/* How */}
      <section className="bg-leaf-50/60">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-center text-3xl font-extrabold text-ink">Cara kami menepati janji itu</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW.map(([icon, title, text]) => (
              <div key={title} className="rounded-3xl bg-white p-5 ring-1 ring-leaf-100">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-50 text-leaf-700">
                  <DynIcon icon={icon} className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <p className="mt-3 font-bold text-ink">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-sm">
            <Link href="/garansi" className="font-semibold text-leaf-700 hover:underline">
              Baca detail garansi kami →
            </Link>
          </p>
        </div>
      </section>

      {/* What */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-3xl font-extrabold text-ink">Yang bisa Kakak temukan di sini</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHAT.map(([icon, title, text, href]) => (
            <Link key={title} href={href} className="group rounded-3xl bg-white p-5 ring-1 ring-leaf-100 transition hover:-translate-y-0.5 hover:ring-leaf-300">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sun-300/40 text-leaf-900">
                <DynIcon icon={icon} className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <p className="mt-3 flex items-center gap-1 font-bold text-ink">
                {title} <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trademark */}
      <section id="merek" className="mx-auto max-w-4xl scroll-mt-24 px-4 pb-14">
        <div className="flex flex-col gap-5 rounded-3xl bg-white p-6 ring-1 ring-leaf-100 sm:flex-row sm:items-center sm:p-8">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-leaf-700 text-white">
            <ShieldCheck className="h-7 w-7" strokeWidth={1.8} />
          </span>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold text-ink">Healthila adalah merek dagang terdaftar</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Healthila terdaftar sebagai merek dagang di Direktorat Jenderal Kekayaan Intelektual (DJKI / DGIP) Republik Indonesia. Jadi kalau
              Kakak menemukan “Healthila” di luar kanal resmi kami, bisa jadi itu bukan kami — pesan saja langsung lewat website ini atau WhatsApp
              resmi kami.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TRADEMARKS.map((n) => (
                <span key={n} className="rounded-full bg-leaf-50 px-3 py-1 font-mono text-sm font-semibold text-leaf-900 ring-1 ring-leaf-100">
                  No. {n}
                </span>
              ))}
            </div>
            <a
              href={PDKI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-leaf-700 hover:underline"
            >
              Cek di Pangkalan Data Kekayaan Intelektual (PDKI) <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-20 text-center">
        <HeartHandshake className="mx-auto h-10 w-10 text-leaf-600" strokeWidth={1.6} />
        <h2 className="mt-3 text-3xl font-extrabold text-ink">Yuk, mulai dari satu buah dulu</h2>
        <p className="mt-2 text-muted">Pilih sendiri, atau ngobrol dulu sama tim kami — kami senang bantu.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/katalog" className="rounded-full bg-leaf-700 px-6 py-3 font-bold text-white hover:bg-leaf-900">
            Lihat katalog
          </Link>
          <Link href="/kontak" className="rounded-full bg-white px-6 py-3 font-bold text-leaf-700 ring-1 ring-leaf-200 hover:ring-leaf-500">
            Hubungi kami
          </Link>
        </div>
      </section>
    </>
  );
}
