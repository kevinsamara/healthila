import Link from "next/link";
import { getGoogleReviews } from "@/lib/google-reviews";
import { site } from "@/lib/site";
import { testimonials } from "@/lib/testimonials";

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-extrabold text-ink sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted italic">{subtitle}</p>}
    </div>
  );
}

const features = [
  { icon: "🏅", title: "Quality Above All", text: "Setiap buah melewati quality check ketat sebelum sampai ke tangan Kakak.", bg: "bg-sky-50" },
  { icon: "🎁", title: "Premium Packaging", text: "Dikemas rapi dan elegan, siap jadi hadiah istimewa.", bg: "bg-sun-300/25" },
  { icon: "📱", title: "Effortless Order", text: "Pesan lewat website, konfirmasi cepat via WhatsApp. Simpel dan anti ribet.", bg: "bg-leaf-50" },
  { icon: "🚚", title: "Same-Day Delivery", text: "Dikirim fresh setiap hari untuk Kota Malang & sekitarnya.", bg: "bg-plum-50" },
];

export function WhyHealthila() {
  return (
    <section className="bg-[#f6f8fb]">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle title="Kenapa Healthila?" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className={`rounded-3xl p-7 ${f.bg}`}>
              <span className="text-4xl">{f.icon}</span>
              <h3 className="mt-4 font-display text-2xl font-bold text-ink">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-ink/80">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { title: "Pilih Produk", text: "Pilih buah, jus, atau parcel favoritmu dari katalog." },
  { title: "Isi Data", text: "Masukkan nomor WhatsApp, nama, dan alamat pengiriman." },
  { title: "Produk Dikirim", text: "Admin konfirmasi via WhatsApp, pesanan diproses & dikirim." },
];

export function HowToOrder() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <SectionTitle title="Cara Order" />
      <ol className="mt-14 grid gap-10 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="relative text-center">
            {i < steps.length - 1 && (
              <span className="absolute top-8 left-[calc(50%+3rem)] hidden w-[calc(100%-6rem)] border-t-2 border-dashed border-leaf-200 md:block" />
            )}
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf-700 font-display text-3xl font-bold text-white">
              {i + 1}
            </span>
            <h3 className="mt-5 font-display text-3xl font-bold text-ink">{s.title}</h3>
            <p className="mx-auto mt-2 max-w-xs text-muted">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

const toneCls = {
  coral: { card: "bg-[#fff1f3]", quote: "text-coral-500/25", name: "text-coral-500" },
  sky: { card: "bg-sky-50", quote: "text-sky-400/30", name: "text-sky-600" },
  leaf: { card: "bg-leaf-50", quote: "text-leaf-500/25", name: "text-leaf-700" },
};

export async function Testimonials() {
  const google = await getGoogleReviews();
  const tones = Object.keys(toneCls) as (keyof typeof toneCls)[];
  // Live Google reviews when configured; otherwise the quotes from the old site.
  const items = google?.reviews.length
    ? google.reviews.slice(0, 4).map((r, i) => ({
        quote: r.text,
        name: r.author,
        sub: r.when,
        rating: r.rating,
        href: r.authorUri,
        tone: tones[i % tones.length],
      }))
    : testimonials.map((t) => ({ quote: t.quote, name: t.name, sub: t.city, rating: 5, href: null, tone: t.tone }));
  const mapsHref = google?.mapsUri ?? site.googleMaps;

  return (
    <section className="bg-[#f6f8fb]">
      <div className="mx-auto max-w-5xl px-4 py-20">
        <SectionTitle title="Kata Mereka" subtitle="Kirim sehat, bukan sekadar hadiah" />
        {google && (
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-full bg-white px-5 py-2.5 shadow-sm ring-1 ring-black/5 hover:ring-leaf-500"
          >
            <GoogleG />
            <span className="font-display text-2xl font-bold text-ink">{google.rating.toFixed(1)}</span>
            <span className="text-sun-400">★★★★★</span>
            <span className="text-sm text-muted">{google.count} ulasan Google</span>
          </a>
        )}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {items.map((t) => {
            const c = toneCls[t.tone];
            return (
              <figure key={t.name + t.quote.slice(0, 20)} className={`relative flex flex-col overflow-hidden rounded-3xl p-8 ${c.card}`}>
                <span className={`absolute top-2 right-6 font-display text-[9rem] leading-none font-extrabold ${c.quote}`} aria-hidden>
                  “
                </span>
                <p className="text-xl tracking-widest text-sun-400" aria-label={`${t.rating} dari 5 bintang`}>
                  {"★".repeat(t.rating)}
                  <span className="text-black/10">{"★".repeat(5 - t.rating)}</span>
                </p>
                <blockquote className="relative mt-4 line-clamp-6 text-lg leading-relaxed text-ink/85 italic">“{t.quote}”</blockquote>
                <figcaption className="mt-auto flex items-end justify-between gap-3 pt-6">
                  <span>
                    {t.href ? (
                      <a href={t.href} target="_blank" rel="noopener noreferrer" className={`block font-display text-xl font-bold hover:underline ${c.name}`}>
                        {t.name}
                      </a>
                    ) : (
                      <span className={`block font-display text-xl font-bold ${c.name}`}>{t.name}</span>
                    )}
                    <span className="text-sm text-muted">{t.sub}</span>
                  </span>
                  {google && (
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <GoogleG small /> Google
                    </span>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>
        <p className="mt-8 text-center">
          <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-leaf-700 hover:underline">
            Lihat semua ulasan di Google Maps →
          </a>
        </p>
      </div>
    </section>
  );
}

function GoogleG({ small }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={small ? "h-3.5 w-3.5" : "h-6 w-6"} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export function CtaBand() {
  return (
    <section className="bg-sun-400">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-5xl font-extrabold text-ink sm:text-6xl">Siap hidup lebih sehat?</h2>
        <p className="mt-4 text-lg text-ink/80 italic">Pesan sekarang, buah segar dikirim langsung ke rumah Kakak.</p>
        <Link
          href="/katalog"
          className="mt-8 inline-flex h-14 items-center rounded-full bg-leaf-700 px-10 text-lg font-bold text-white hover:bg-leaf-900"
        >
          Order Sekarang
        </Link>
      </div>
    </section>
  );
}
