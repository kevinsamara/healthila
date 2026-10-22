import { getGoogleReviews } from "@/lib/google-reviews";
import type { Product } from "@/lib/catalog";
import { site } from "@/lib/site";

/** schema.org structured data so Google can show Healthila as a local store in Malang. */
export function JsonLd({ data }: { data: object }) {
  // "<" escaped so text from the CRM can't close the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hhmm = (h: number, m: number) => `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

export async function StoreJsonLd() {
  const place = await getGoogleReviews();
  const hours = (place?.periods ?? [])
    .filter((p) => p.close)
    .map((p) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${DAYS[p.open.day]}`,
      opens: hhmm(p.open.hour, p.open.minute),
      closes: hhmm(p.close!.hour, p.close!.minute),
    }));
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "GroceryStore",
        "@id": `${site.url}/#store`,
        name: "Healthila — Toko Buah & Parcel Buah Malang",
        alternateName: "Healthila",
        description: site.description,
        url: site.url,
        logo: `${site.url}/icon.png`,
        image: `${site.url}/healthila-logo.png`,
        telephone: `+${site.whatsapp}`,
        priceRange: "Rp",
        address: {
          "@type": "PostalAddress",
          streetAddress: place?.address ?? undefined,
          addressLocality: "Malang",
          addressRegion: "Jawa Timur",
          addressCountry: "ID",
        },
        geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
        areaServed: [
          { "@type": "City", name: "Kota Malang" },
          { "@type": "City", name: "Kota Batu" },
          { "@type": "AdministrativeArea", name: "Kabupaten Malang" },
        ],
        hasMap: site.googleMaps,
        sameAs: [site.instagram, site.googleMaps],
        ...(hours.length ? { openingHoursSpecification: hours } : {}),
      }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  const prices = [
    product.promo_price ?? product.price,
    ...product.packagings.map((k) => k.promo_price ?? k.price),
  ].filter((n): n is number => n != null && n > 0);
  const url = `${site.url}/produk/${product.slug}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description ?? `${product.name} — beli online di Healthila, toko buah Malang.`,
        image: product.photo_url ?? undefined,
        url,
        brand: { "@type": "Brand", name: "Healthila" },
        category: product.product_group ?? product.category ?? undefined,
        ...(prices.length
          ? {
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "IDR",
                lowPrice: Math.min(...prices),
                highPrice: Math.max(...prices),
                offerCount: prices.length,
                availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                url,
                seller: { "@id": `${site.url}/#store` },
                areaServed: "Malang",
              },
            }
          : {}),
      }}
    />
  );
}
