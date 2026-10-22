import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { HeroCarousel, type HeroPhoto, type HeroSlide } from "@/components/HeroCarousel";
import { CtaBand, HowToOrder, SectionTitle, Testimonials, WhyHealthila } from "@/components/HomeSections";
import { ProductCard } from "@/components/ProductCard";
import { getArticles } from "@/lib/articles";
import { getProducts, type Product } from "@/lib/catalog";
import { waLink, type SectionKey } from "@/lib/site";

export const revalidate = 300;

// Root needs an explicit canonical: the layout's "./" resolves to "/index" here.
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [all, articles] = await Promise.all([getProducts(), getArticles()]);
  // Showcase only what can be ordered today; sold-out items still appear in the catalog.
  const available = all.filter((p) => p.in_stock);
  const promos = available.filter((p) => p.promo_price != null || p.packagings.some((k) => k.promo_price != null));
  const featured = pick(available.filter((p) => p.photo_url), promos, 8);
  const photoOf = (keys: SectionKey[]) => all.find((p) => keys.includes(p.section) && p.photo_url)?.photo_url ?? null;

  const categories = [
    {
      href: "/buah-segar",
      title: "Buah Segar",
      text: "Lokal & impor, disortir setiap pagi.",
      gradient: "from-sun-400 via-[#ff8a3d] to-coral-500",
      photo: photoOf(["buah"]),
      emoji: "🍊",
      cta: "Lihat Buah",
    },
    {
      href: "/jus-dessert",
      title: "Jus & Dessert",
      text: "Cold-pressed tanpa gula tambahan, dibuat fresh setiap hari.",
      gradient: "from-leaf-900 via-leaf-700 to-[#5fcf8f]",
      photo: photoOf(["jus", "dessert"]),
      emoji: "🧃",
      cta: "Lihat Jus",
    },
    {
      href: "/parcel",
      title: "Parcel & Hampers",
      text: "Dirangkai elegan, hadiah terbaik untuk orang tersayang.",
      gradient: "from-plum-700 via-[#b8245e] to-coral-500",
      photo: photoOf(["parcel"]),
      emoji: "🧺",
      cta: "Lihat Hampers",
    },
  ];

  return (
    <>
      <HeroCarousel slides={heroSlides(available)} />

      {/* Category banners */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`group relative flex min-h-64 flex-col overflow-hidden rounded-3xl bg-gradient-to-br p-7 text-white ${c.gradient}`}
            >
              <div className="absolute -right-8 -bottom-8 h-44 w-44 overflow-hidden rounded-full bg-white/20 ring-8 ring-white/10 transition duration-500 group-hover:scale-110">
                {c.photo ? (
                  <Image src={c.photo} alt="" fill sizes="176px" className="object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-7xl">{c.emoji}</span>
                )}
              </div>
              <h2 className="relative text-4xl font-extrabold">{c.title}</h2>
              <p className="relative mt-2 max-w-[60%] text-white/90">{c.text}</p>
              <span className="relative mt-auto w-fit rounded-full bg-sun-400 px-5 py-2.5 font-bold text-leaf-900 group-hover:bg-sun-300">
                {c.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20">
          <SectionTitle title="Produk Unggulan" subtitle="Pilihan terbaik yang siap dikirim hari ini" />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/katalog" className="inline-flex h-12 items-center rounded-full border-2 border-leaf-700 px-7 font-bold text-leaf-700 hover:bg-leaf-50">
              Lihat semua produk
            </Link>
          </div>
        </section>
      )}

      <WhyHealthila />
      <HowToOrder />
      <Testimonials />

      {/* Articles */}
      <section className="bg-leaf-50">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionTitle title="Artikel Edukasi" subtitle="Cerita & tips, supaya hidup sehat gak ribet" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {articles.slice(0, 3).map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </section>

      <LocalSeo />
      <CtaBand />
    </>
  );
}

function pick(base: Product[], priority: Product[], n: number) {
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of [...priority.filter((p) => p.photo_url), ...base]) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
    if (out.length === n) break;
  }
  return out;
}

/** Hero slides: Parcel first (main focus), then Buah and Jus & Dessert, each with its own photos. */
function heroSlides(available: Product[]): HeroSlide[] {
  const photos = (keys: SectionKey[]): HeroPhoto[] =>
    available
      .filter((p) => keys.includes(p.section) && p.photo_url)
      .map((p) => ({ id: p.id, slug: p.slug, name: p.name, photo: p.photo_url! }));
  const slides: HeroSlide[] = [
    {
      key: "parcel",
      bg: "bg-gradient-to-br from-plum-700 via-[#b8245e] to-coral-500",
      badge: "Parcel & hampers buah",
      badgeClass: "bg-sun-400 text-plum-700",
      heading: "Parcel buah & hampers Malang untuk setiap momen.",
      text: "Ulang tahun, jenguk, lamaran, hari raya — dirangkai elegan, bisa custom isi dan budget.",
      textClass: "text-white/90",
      cta: { href: "/parcel", label: "Lihat Parcel", className: "bg-sun-400 text-leaf-900 hover:bg-sun-300" },
      secondary: { href: "/parcel/custom", label: "Rancang Parcel" },
      whatsapp: waLink("Halo Healthila, saya mau tanya parcel"),
      photos: photos(["parcel"]),
    },
    {
      key: "buah",
      bg: "bg-leaf-700",
      badge: "fruitful heart, eating smart",
      badgeClass: "bg-lime-400 text-leaf-900",
      heading: "Buah segar pilihan, diantar ke rumah Kakak di Malang.",
      text: "Buah lokal & impor, disortir setiap pagi. Pesan online, konfirmasi cepat via WhatsApp.",
      textClass: "text-leaf-100",
      cta: { href: "/buah-segar", label: "Order Sekarang", className: "bg-sun-400 text-leaf-900 hover:bg-sun-300" },
      whatsapp: waLink("Halo Healthila, saya mau tanya produk"),
      photos: photos(["buah"]),
    },
    {
      key: "jus",
      bg: "bg-gradient-to-br from-sun-400 via-[#ff8a3d] to-coral-500",
      badge: "Dibuat fresh setiap hari",
      badgeClass: "bg-white text-coral-500",
      heading: "Jus cold-pressed & dessert buah, tanpa gula tambahan.",
      text: "Diperas dari buah segar pilihan, plus dessert buah yang ringan untuk teman santai. Siap diantar se-Malang.",
      textClass: "text-white/90",
      cta: { href: "/jus-dessert", label: "Lihat Jus & Dessert", className: "bg-leaf-900 text-white hover:bg-leaf-700" },
      whatsapp: waLink("Halo Healthila, saya mau pesan jus / dessert"),
      photos: photos(["jus", "dessert"]),
    },
  ];
  // Parcel leads (it carries the h1); drop other slides without photos.
  return slides.filter((sl, i) => i === 0 || sl.photos.length >= 2);
}

/** Plain-language copy for "toko buah malang", "parcel malang" & co. searches. */
function LocalSeo() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">Toko Buah Online di Malang</h2>
      <div className="mt-5 grid gap-6 text-[15px] leading-relaxed text-muted md:grid-cols-2">
        <div className="space-y-3">
          <p>
            Healthila adalah <strong className="text-ink">toko buah di Malang</strong> yang menyediakan buah segar lokal dan impor — apel,
            anggur, jeruk, pear, melon, kiwi, hingga buah musiman. Setiap buah disortir sebelum dikirim, jadi Kakak bisa{" "}
            <strong className="text-ink">beli buah online di Malang</strong> tanpa khawatir kualitas.
          </p>
          <p>
            Kami melayani <strong className="text-ink">delivery buah se-Malang</strong>: Kota Malang, Kota Batu, dan sebagian Kabupaten
            Malang, bisa <em>same-day</em>. Pesan lewat website, konfirmasi ongkir dan pembayaran lewat WhatsApp.
          </p>
        </div>
        <div className="space-y-3">
          <p>
            Butuh hadiah? <Link href="/parcel" className="font-semibold text-leaf-700 underline">Parcel buah dan hampers Malang</Link> dari
            Healthila dirangkai untuk ulang tahun, jenguk orang sakit, lamaran, syukuran, Lebaran, Natal, dan Imlek. Mau isi dan budget
            sendiri? Coba <Link href="/parcel/custom" className="font-semibold text-leaf-700 underline">rancang parcel custom</Link>.
          </p>
          <p>
            Ada juga <Link href="/jus-dessert" className="font-semibold text-leaf-700 underline">jus buah cold-pressed dan dessert</Link>{" "}
            yang dibuat fresh setiap hari. Pesanan pertama via website dapat <strong className="text-ink">free ongkir s.d. Rp10.000</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
