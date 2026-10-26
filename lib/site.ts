export const site = {
  name: "Healthila",
  tagline: "fruitful heart, eating smart",
  description:
    "Toko buah online di Malang: buah segar lokal & impor, parcel buah & hampers, jus cold-pressed. Delivery buah se-Kota Malang, pesan online konfirmasi via WhatsApp.",
  // Canonical host: the apex (www redirects there), so canonicals and the
  // sitemap never point at a redirect.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://healthila.id").replace(/\/$/, ""),
  city: "Malang",
  geo: { lat: -7.9653613, lng: 112.6084339 },
  // Customer-facing ordering number (Fonnte sender is a different number).
  whatsapp: "628123321229",
  whatsappDisplay: "+62 812-3321-229",
  instagram: "https://instagram.com/healthila.id",
  // Google Maps listing "Healthila (Buah Fresh & Parcel Buah Malang)", by CID.
  googleMaps: "https://maps.google.com/?cid=10950299846344208284",
  // Store pin (from the Maps listing) for the keyless embed on /kontak.
  mapEmbed:
    "https://maps.google.com/maps?q=Healthila%20(Buah%20Fresh%20%26%20Parcel%20Buah%20Malang)&ll=-7.9653613,112.6084339&z=16&output=embed",
  directions: "https://www.google.com/maps/dir/?api=1&destination=-7.9653613,112.6084339",
};

export type SectionKey = "buah" | "jus" | "dessert" | "parcel" | "lainnya";

export const sections: { key: SectionKey; label: string; blurb: string }[] = [
  { key: "buah", label: "Buah Segar", blurb: "Lokal & impor, dipilih tiap pagi" },
  { key: "jus", label: "Jus", blurb: "Cold-pressed tanpa gula tambahan" },
  { key: "dessert", label: "Dessert", blurb: "Manis yang tetap sehat" },
  { key: "parcel", label: "Parcel", blurb: "Hampers buah untuk setiap momen" },
  { key: "lainnya", label: "Lainnya", blurb: "Camilan sehat pendamping" },
];

export function sectionLabel(key: string) {
  return sections.find((s) => s.key === key)?.label ?? "Produk";
}

export const nav = [
  { href: "/buah-segar", label: "Buah Segar" },
  { href: "/jus-dessert", label: "Jus & Dessert" },
  { href: "/parcel", label: "Parcel" },
  { href: "/langganan", label: "Langganan" },
  { href: "/acara", label: "Acara" },
  { href: "/artikel", label: "Artikel" },
  { href: "/tentang", label: "Tentang" },
  { href: "/faq", label: "FAQ" },
];

export function waLink(text?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** FREEONGKIR: a phone's first 2 website orders, ongkir covered up to Rp10.000 (healthila-crm 0105). */
export const FREE_SHIPPING = { orders: 2, max: 10_000 } as const;
