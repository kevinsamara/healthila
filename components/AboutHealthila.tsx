import Link from "next/link";
import { getGoogleReviews } from "@/lib/google-reviews";
import { site } from "@/lib/site";

/**
 * Home "Kenapa Healthila ada" — Golden Circle (why → how → what) next to the
 * store map and Google Maps listing photos. Also carries the local-search
 * copy ("toko buah di Malang", "delivery buah se-Malang", "parcel Malang").
 */
export async function AboutHealthila() {
  const place = await getGoogleReviews();
  const photos = (place?.photos ?? []).filter((p) => p.width >= p.height * 0.6).slice(0, 4);

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        {/* Left: the real store */}
        <div className="space-y-3">
          <div className="overflow-hidden rounded-3xl ring-1 ring-leaf-100">
            <iframe
              title="Lokasi toko Healthila di Malang"
              src={site.mapEmbed}
              className="block h-64 w-full sm:h-72"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          {photos.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {photos.map((p) => (
                <figure key={p.name} className="group relative aspect-square overflow-hidden rounded-2xl bg-leaf-50">
                  {/* eslint-disable-next-line @next/next/no-img-element -- Google listing photo via /api/place-photo */}
                  <img
                    src={`/api/place-photo?n=${encodeURIComponent(p.name)}&w=500`}
                    alt="Foto toko Healthila di Google Maps"
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {p.author && (
                    <figcaption className="absolute inset-x-0 bottom-0 truncate bg-black/45 px-1.5 py-0.5 text-[9px] text-white">
                      {p.authorUri ? (
                        <a href={p.authorUri} target="_blank" rel="noopener noreferrer">
                          📷 {p.author}
                        </a>
                      ) : (
                        <>📷 {p.author}</>
                      )}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {place?.rating ? (
              <span className="font-semibold text-ink">
                ⭐ {place.rating.toFixed(1)} · {place.count} ulasan Google
              </span>
            ) : null}
            <a href={site.directions} target="_blank" rel="noopener noreferrer" className="font-semibold text-leaf-700 hover:underline">
              Petunjuk arah →
            </a>
            <Link href="/kontak" className="font-semibold text-leaf-700 hover:underline">
              Jam buka & kontak →
            </Link>
          </div>
        </div>

        {/* Right: why → how → what */}
        <div>
          <p className="text-sm font-bold tracking-wide text-leaf-500 uppercase">Toko buah online di Malang</p>
          <h2 className="mt-2 text-4xl font-extrabold text-ink sm:text-5xl">Kenapa Healthila ada</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink">
            Karena kami percaya buah yang <strong>pasti enak</strong>, <strong>bergaransi</strong>, <strong>sehat</strong> — termasuk yang{" "}
            <strong>unik dan eksotis</strong> — seharusnya bisa dinikmati lebih mudah dan oleh lebih banyak orang.
          </p>

          <ol className="mt-6 space-y-4">
            <Step n="Bagaimana" title="Dipilih, disortir, dijamin">
              Setiap buah kami pilih dan sortir sendiri sebelum dikirim, dilindungi{" "}
              <Link href="/garansi" className="font-semibold text-leaf-700 underline">
                Garansi Healthila
              </Link>
              . Pesannya semudah dari HP, dengan <strong>delivery buah se-Malang</strong> — Kota Malang, Batu, dan sebagian Kabupaten Malang,
              bisa same-day.
            </Step>
            <Step n="Apa" title="Healthier choice untuk tiap hari & tiap momen">
              <Link href="/buah-segar" className="font-semibold text-leaf-700 underline">
                Buah segar lokal & impor
              </Link>
              ,{" "}
              <Link href="/jus-dessert" className="font-semibold text-leaf-700 underline">
                jus cold-pressed & dessert
              </Link>
              , sampai{" "}
              <Link href="/parcel" className="font-semibold text-leaf-700 underline">
                parcel buah & hampers
              </Link>{" "}
              untuk ulang tahun, jenguk, lamaran, dan hari raya — semua dari <strong>toko buah di Malang</strong> yang sama.
            </Step>
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <li className="rounded-2xl bg-leaf-50/60 p-4">
      <p className="text-xs font-bold tracking-wide text-leaf-500 uppercase">{n}</p>
      <p className="mt-0.5 font-bold text-ink">{title}</p>
      <p className="mt-1 text-[15px] leading-relaxed text-muted">{children}</p>
    </li>
  );
}
