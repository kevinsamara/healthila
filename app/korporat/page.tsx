import type { Metadata } from "next";
import { CorporateForm } from "./CorporateForm";

export const metadata: Metadata = {
  title: "Parcel & Buah untuk Perusahaan — Pesanan Korporat Malang",
  description:
    "Pesanan korporat Healthila Malang: parcel buah untuk klien & karyawan, hampers hari raya jumlah banyak, buah rutin untuk kantor dan acara. Kirim ke banyak alamat, kartu custom logo.",
};

const PERKS = [
  ["📦", "Jumlah banyak", "Puluhan sampai ratusan paket dengan isi seragam."],
  ["🏷️", "Kartu custom", "Kartu ucapan dengan logo & nama perusahaan."],
  ["📍", "Banyak alamat", "Kami atur pengiriman ke tiap penerima di Malang."],
  ["🧾", "Invoice resmi", "Penawaran & invoice untuk kebutuhan administrasi."],
];

export default function KorporatPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-ink via-leaf-900 to-leaf-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <p className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide uppercase">Pesanan korporat</p>
          <h1 className="mt-3 text-5xl font-extrabold sm:text-6xl">Parcel & buah untuk perusahaan</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/85">
            Hampers hari raya untuk klien, apresiasi karyawan, snack buah untuk rapat & acara. Ceritakan kebutuhan Kakak — tim kami kirim penawaran via WhatsApp.
          </p>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_440px]">
        <div className="grid content-start gap-4 sm:grid-cols-2">
          {PERKS.map(([icon, title, text]) => (
            <div key={title} className="rounded-2xl bg-white p-5 ring-1 ring-leaf-100">
              <span className="text-3xl">{icon}</span>
              <p className="mt-2 font-bold text-ink">{title}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
        <CorporateForm />
      </div>
    </>
  );
}
