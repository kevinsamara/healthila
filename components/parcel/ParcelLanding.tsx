import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppIcon } from "@/components/WhatsAppFab";
import type { Product } from "@/lib/catalog";
import { rupiah } from "@/lib/format";
import { getGoogleReviews } from "@/lib/google-reviews";
import { waLink } from "@/lib/site";

/**
 * /parcel landing sections — built to answer what a gift buyer worries about
 * before ordering: will it look good, will the fruit be good, will it arrive
 * on time, and can someone help me choose.
 */

export async function ParcelHero({ parcels }: { parcels: Product[] }) {
  const place = await getGoogleReviews();
  const shots = parcels.filter((p) => p.photo_url).slice(0, 3);
  const from = Math.min(...parcels.map((p) => p.from_price ?? Infinity));

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-plum-700 via-[#a51f55] to-coral-500 text-white">
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
        <div>
          <p className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide uppercase">Parcel & hampers buah · Malang</p>
          <h1 className="mt-4 text-5xl leading-[1.05] font-extrabold sm:text-6xl">Parcel buah yang bikin momen lebih berkesan</h1>
          <p className="mt-4 max-w-xl text-lg text-white/90">
            Buah premium pilihan, dirangkai rapi oleh tim kami, lengkap dengan kartu ucapan. Kakak lihat fotonya dulu sebelum parcel dikirim.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#koleksi" className="flex h-12 items-center rounded-full bg-sun-400 px-7 font-bold text-leaf-900 hover:bg-sun-300">
              Lihat koleksi
            </a>
            <Link href="/parcel/custom" className="flex h-12 items-center rounded-full bg-white px-6 font-bold text-plum-700 hover:bg-white/90">
              🧺 Rancang sendiri
            </Link>
            <a
              href={waLink("Halo Healthila, saya mau konsultasi parcel. Momennya: … budget: …")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center gap-2 rounded-full px-5 font-semibold ring-1 ring-white/50 hover:bg-white/10"
            >
              <WhatsAppIcon className="h-5 w-5" /> Konsultasi gratis
            </a>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
            {place?.rating ? (
              <li>
                ⭐ <b className="text-white">{place.rating.toFixed(1)}</b> dari {place.count} ulasan Google
              </li>
            ) : null}
            {Number.isFinite(from) && (
              <li>
                Mulai <b className="text-white">{rupiah(from)}</b>
              </li>
            )}
            <li>Antar same-day se-Malang</li>
          </ul>
        </div>

        {shots.length > 0 && (
          <div className="relative mx-auto aspect-square w-full max-w-md">
            {shots.map((p, i) => (
              <Link
                key={p.id}
                href={`/produk/${p.slug}`}
                className={`absolute overflow-hidden rounded-3xl bg-white/10 shadow-2xl ring-4 ring-white/80 transition hover:z-10 hover:scale-[1.03] ${
                  ["top-0 left-0 h-[62%] w-[62%] -rotate-3", "top-[8%] right-0 h-[48%] w-[46%] rotate-3", "bottom-0 left-[22%] h-[50%] w-[52%] rotate-1"][i]
                }`}
              >
                <Image src={p.photo_url!} alt={p.name} fill sizes="(min-width: 768px) 25vw, 60vw" priority={i === 0} className="object-cover" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const PROMISES = [
  ["💬", "Dibantu memilih", "Ceritakan momen dan budget, tim kami rekomendasikan isi dan ukuran yang pas — gratis."],
  ["🍇", "Buah terjamin", "Disortir sebelum dirangkai. Ada yang kurang layak? Kirim foto, kami ganti."],
  ["📸", "Lihat dulu sebelum dikirim", "Foto parcel jadi dikirim ke WhatsApp Kakak sebelum kurir berangkat."],
  ["🕐", "Tiba sesuai jadwal", "Pilih tanggal & jam antar. Same-day se-Malang, kartu ucapan gratis."],
] as const;

export function ParcelPromises() {
  return (
    <section className="mx-auto -mt-8 max-w-7xl px-4">
      <div className="relative grid gap-3 rounded-3xl bg-white p-4 shadow-xl shadow-black/5 ring-1 ring-black/5 sm:grid-cols-2 lg:grid-cols-4">
        {PROMISES.map(([icon, title, text]) => (
          <div key={title} className="flex gap-3 rounded-2xl p-3">
            <span className="text-3xl">{icon}</span>
            <div>
              <p className="font-bold text-ink">{title}</p>
              <p className="mt-0.5 text-sm leading-snug text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-muted">
        Semua parcel dilindungi{" "}
        <Link href="/garansi" className="font-semibold text-leaf-700 underline">
          Garansi Healthila
        </Link>
        .
      </p>
    </section>
  );
}

const STEPS = [
  ["1", "Pilih atau rancang", "Ambil dari koleksi, atau rancang sendiri: wadah, buah favorit, warna pita, dan budget."],
  ["2", "Atur pengiriman", "Tanggal, jam antar, alamat penerima, dan isi kartu ucapan. Bayar QRIS atau konfirmasi via WhatsApp."],
  ["3", "Cek foto, lalu dikirim", "Kami kirim foto parcel jadi ke WhatsApp Kakak, lalu kurir mengantar — bukti sampai juga dikirim."],
] as const;

export function ParcelSteps() {
  return (
    <section className="bg-plum-50/60">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-extrabold text-ink sm:text-4xl">Pesan parcel dalam 3 langkah</h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map(([n, title, text]) => (
            <li key={n} className="rounded-3xl bg-white p-6 ring-1 ring-plum-100">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-plum-700 text-lg font-extrabold text-white">{n}</span>
              <p className="mt-4 text-lg font-bold text-ink">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const FAQ = [
  ["Berapa lama sebelumnya harus pesan parcel?", "Parcel dari koleksi bisa same-day selama slot antar masih tersedia (lihat batas jam di keranjang). Untuk parcel custom, jumlah banyak, atau mendekati hari raya, pesan 2–7 hari sebelumnya."],
  ["Bisa kirim ke alamat orang lain?", "Bisa. Isi nama dan alamat penerima saat checkout. Foto sebelum kirim dikirim ke Kakak (pemesan), bukan ke penerima, jadi kejutannya tetap aman."],
  ["Isi parcelnya boleh diganti?", "Boleh. Tulis permintaan di catatan, atau pakai Rancang Parcel untuk memilih buah favorit — tim kami menyesuaikan dengan stok terbaik hari itu."],
  ["Kartu ucapannya bagaimana?", "Kartu ucapan Healthila gratis untuk setiap parcel. Mau desain khusus (mis. logo perusahaan)? Pilih Kartu Custom saat merancang parcel."],
] as const;

export function ParcelFaq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h2 className="text-center text-3xl font-extrabold text-ink">Pertanyaan seputar parcel</h2>
      <div className="mt-6 space-y-3">
        {FAQ.map(([q, a]) => (
          <details key={q} className="rounded-2xl bg-white p-4 ring-1 ring-leaf-100">
            <summary className="cursor-pointer font-semibold text-ink">{q}</summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">{a}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }}
      />
    </section>
  );
}
