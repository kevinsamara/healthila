import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CtaBand, HowToOrder, SectionTitle, Testimonials, WhyHealthila } from "@/components/HomeSections";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/WhatsAppFab";
import { getArticles } from "@/lib/articles";
import { getProducts, type Product } from "@/lib/catalog";
import { waLink, type SectionKey } from "@/lib/site";

export const revalidate = 300;

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
      {/* Hero */}
      <section className="relative overflow-hidden bg-leaf-700 text-white">
        <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="inline-block rounded-full bg-lime-400 px-3 py-1 text-xs font-bold tracking-wide text-leaf-900 uppercase">
              fruitful heart, eating smart
            </p>
            <h1 className="mt-5 text-5xl leading-[1.05] font-extrabold sm:text-7xl">
              Buah segar pilihan, langsung ke rumah Kakak.
            </h1>
            <p className="mt-5 max-w-md text-lg text-leaf-100">
              Buah lokal & impor, jus cold-pressed, dessert, dan parcel buah. Pesan online, konfirmasi cepat via WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/katalog" className="flex h-13 items-center rounded-full bg-sun-400 px-7 font-bold text-leaf-900 hover:bg-sun-300">
                Order Sekarang
              </Link>
              <a
                href={waLink("Halo Healthila, saya mau tanya produk")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-13 items-center gap-2 rounded-full border border-white/40 px-6 font-semibold hover:bg-white/10"
              >
                <WhatsAppIcon className="h-5 w-5" /> Chat WhatsApp
              </a>
            </div>
          </div>
          <HeroCollage products={available.filter((p) => p.photo_url)} />
        </div>
      </section>

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

function HeroCollage({ products }: { products: Product[] }) {
  if (products.length < 4) {
    return (
      <div className="flex justify-center">
        <Image src="/healthila-logo.png" alt="Healthila" width={300} height={300} className="rounded-full" priority />
      </div>
    );
  }
  // Every in-stock product with a photo is a candidate; the carousel picks 12 at random.
  return <HeroCarousel pool={products.map((p) => ({ id: p.id, slug: p.slug, name: p.name, photo: p.photo_url! }))} />;
}
