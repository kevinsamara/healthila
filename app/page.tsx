import Image from "next/image";
import Link from "next/link";
import { getProducts, type Product } from "@/lib/catalog";
import { sections, waLink } from "@/lib/site";
import { ProductCard } from "@/components/ProductCard";

export const revalidate = 300;

export default async function Home() {
  const products = await getProducts();
  const promos = products.filter((p) => p.promo_price != null || p.packagings.some((k) => k.promo_price != null));
  const featured = pick(products.filter((p) => p.photo_url && p.section === "buah"), promos, 8);
  const parcels = products.filter((p) => p.section === "parcel" && p.photo_url).slice(0, 4);
  const counts = Object.fromEntries(sections.map((s) => [s.key, products.filter((p) => p.section === s.key).length]));

  return (
    <>
      <section className="relative overflow-hidden bg-leaf-700 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="inline-block rounded-full bg-lime-400 px-3 py-1 text-xs font-bold tracking-wide text-leaf-900 uppercase">
              fruitful heart, eating smart
            </p>
            <h1 className="mt-5 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
              Buah segar pilihan, langsung ke rumah Anda.
            </h1>
            <p className="mt-4 max-w-md text-lg text-leaf-100">
              Buah lokal & impor, jus cold-pressed, dessert, dan parcel buah. Pilih di sini, konfirmasi lewat WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/katalog"
                className="rounded-full bg-lime-400 px-6 py-3 font-bold text-leaf-900 hover:bg-lime-300"
              >
                Lihat Katalog
              </Link>
              <a
                href={waLink("Halo Healthila, saya mau tanya produk")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white/10"
              >
                Chat WhatsApp
              </a>
            </div>
          </div>
          <HeroCollage products={featured.slice(0, 4)} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-extrabold tracking-tight text-leaf-900">Belanja per kategori</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sections
            .filter((s) => s.key !== "lainnya")
            .map((s, i) => (
              <Link
                key={s.key}
                href={`/katalog?kategori=${s.key}`}
                className={`rounded-2xl p-5 transition hover:-translate-y-0.5 ${
                  ["bg-leaf-100", "bg-lime-300", "bg-plum-100", "bg-white border border-leaf-100"][i]
                }`}
              >
                <p className="text-lg font-bold text-leaf-900">{s.label}</p>
                <p className="mt-1 text-sm text-muted">{s.blurb}</p>
                <p className="mt-4 text-xs font-semibold text-leaf-700">{counts[s.key] ?? 0} produk →</p>
              </Link>
            ))}
        </div>
      </section>

      {featured.length > 0 && (
        <ProductRow title="Pilihan minggu ini" href="/katalog?kategori=buah" products={featured} />
      )}

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-3xl bg-white p-8 ring-1 ring-leaf-100 md:p-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-leaf-900">Cara pesan</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["Pilih produk", "Masukkan buah, jus, atau parcel ke keranjang. Pilih ukuran kemasan bila ada."],
              ["Isi detail pengiriman", "Nama, alamat, dan tanggal kirim yang diinginkan."],
              ["Konfirmasi via WhatsApp", "Pesanan terkirim ke admin kami. Ongkir & pembayaran dikonfirmasi di chat."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-plum-700 font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-ink">{t}</p>
                  <p className="mt-1 text-sm text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {parcels.length > 0 && (
        <ProductRow title="Parcel & hampers" href="/katalog?kategori=parcel" products={parcels} />
      )}
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

function ProductRow({ title, href, products }: { title: string; href: string; products: Product[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-extrabold tracking-tight text-leaf-900">{title}</h2>
        <Link href={href} className="text-sm font-semibold text-leaf-700 hover:underline">
          Lihat semua →
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function HeroCollage({ products }: { products: Product[] }) {
  if (products.length < 4) {
    return (
      <div className="flex justify-center">
        <Image src="/healthila-logo.png" alt="Healthila" width={280} height={280} className="rounded-full" priority />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((p, i) => (
        <div
          key={p.id}
          className={`relative aspect-square overflow-hidden rounded-3xl bg-leaf-500 ${i % 2 ? "translate-y-6" : ""}`}
        >
          <Image src={p.photo_url!} alt={p.name} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" priority={i < 2} />
        </div>
      ))}
    </div>
  );
}
