import Link from "next/link";
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

export function Testimonials() {
  return (
    <section className="bg-[#f6f8fb]">
      <div className="mx-auto max-w-5xl px-4 py-20">
        <SectionTitle title="Kata Mereka" subtitle="Kirim sehat, bukan sekadar hadiah" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => {
            const c = toneCls[t.tone];
            return (
              <figure key={t.name} className={`relative overflow-hidden rounded-3xl p-8 ${c.card}`}>
                <span className={`absolute top-2 right-6 font-display text-[9rem] leading-none font-extrabold ${c.quote}`} aria-hidden>
                  “
                </span>
                <p className="text-xl tracking-widest text-sun-400" aria-label="5 dari 5 bintang">
                  ★★★★★
                </p>
                <blockquote className="relative mt-4 text-lg leading-relaxed text-ink/85 italic">“{t.quote}”</blockquote>
                <figcaption className="mt-6">
                  <span className={`block font-display text-xl font-bold ${c.name}`}>{t.name}</span>
                  <span className="text-sm text-muted">{t.city}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
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
