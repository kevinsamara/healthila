export const site = {
  name: "Healthila",
  tagline: "fruitful heart, eating smart",
  description:
    "Buah segar pilihan, jus cold-pressed, dessert, dan parcel buah dari Healthila. Pesan online, konfirmasi lewat WhatsApp.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://healthila.id",
  // Customer-facing ordering number (Fonnte sender is a different number).
  whatsapp: "628123321229",
  whatsappDisplay: "+62 812-3321-229",
  instagram: "https://instagram.com/healthila.id",
  // Google Maps listing "Healthila (Buah Fresh & Parcel Buah Malang)", by CID.
  googleMaps: "https://maps.google.com/?cid=10950299846344208284",
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
  { href: "/lainnya", label: "Lainnya" },
  { href: "/artikel", label: "Artikel" },
  { href: "/tentang", label: "Tentang" },
  { href: "/faq", label: "FAQ" },
];

export function waLink(text?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
