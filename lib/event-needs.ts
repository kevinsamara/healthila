import { CakeSlice, CupSoda, Gift, type LucideIcon, Salad } from "lucide-react";
import type { Product } from "./catalog";

/**
 * "Untuk acara" (/acara): what a host can serve, each with matching catalog
 * products. Matching is by section + product name so new catalog items show up
 * without extra setup in Healthila OS.
 */
export type EventNeedKey = "platter" | "cake" | "parcel" | "jus";

export type EventNeed = {
  key: EventNeedKey;
  title: string;
  tagline: string;
  description: string;
  fits: string[];
  icon: LucideIcon;
  /** Value sent as "Kebutuhan" in the quote form. */
  formNeed: string;
  tone: string;
};

export const EVENT_NEEDS: EventNeed[] = [
  {
    key: "platter",
    title: "Buah potong & fruit platter",
    tagline: "Suguhan segar untuk rapat sampai prasmanan",
    description:
      "Buah dipotong dan ditata rapi, siap langsung disajikan. Bisa per porsi untuk tiap tamu, atau platter besar di tengah meja untuk dinikmati bersama.",
    fits: ["Rapat & seminar", "Coffee break", "Arisan", "Pengajian"],
    icon: Salad,
    formNeed: "Buah potong / fruit platter",
    tone: "from-sun-400 to-[#ff8a3d]",
  },
  {
    key: "cake",
    title: "Fruit cake & fruit tower",
    tagline: "Jadi pusat perhatian di meja",
    description:
      "Buah segar yang dirangkai seperti kue atau menara — alternatif kue ulang tahun yang lebih sehat, atau centerpiece meja prasmanan yang bikin tamu berhenti untuk foto.",
    fits: ["Ulang tahun", "Syukuran", "Pernikahan", "Peresmian"],
    icon: CakeSlice,
    formNeed: "Fruit cake / fruit tower",
    tone: "from-coral-500 to-[#ff3e4c]",
  },
  {
    key: "parcel",
    title: "Parcel & hampers buah",
    tagline: "Untuk klien, karyawan, dan tamu istimewa",
    description:
      "Parcel buah dengan kartu ucapan — bisa puluhan sampai ratusan paket dengan isi seragam, kartu dengan logo perusahaan, dan diantar ke banyak alamat sekaligus.",
    fits: ["Hari raya", "Apresiasi karyawan", "Hadiah klien", "Jenguk"],
    icon: Gift,
    formNeed: "Parcel / hampers (jumlah banyak)",
    tone: "from-plum-700 to-[#b8245e]",
  },
  {
    key: "jus",
    title: "Jus & cold-pressed juice",
    tagline: "Minuman sehat yang praktis dibagikan",
    description:
      "Jus segar dan cold-pressed dalam botol — tinggal dibagikan per orang. Cocok untuk snack box, welcome drink, sampai acara olahraga. Bisa ditemani dessert buah.",
    fits: ["Seminar & workshop", "Snack box", "Welcome drink", "Event olahraga"],
    icon: CupSoda,
    formNeed: "Jus / cold-pressed juice",
    tone: "from-leaf-900 to-leaf-600",
  },
];

const PLATTER = /platter|fruit plate|piring|buah potong|fruit cup|mini cup/i;
const CAKE = /fruit cake|fruit tower|tower|\bcake\b/i;

/** Catalog products for each need (in-stock first, then catalog order). */
export function productsForNeeds(all: Product[]): Record<EventNeedKey, Product[]> {
  const sorted = [...all].sort((a, b) => Number(b.in_stock) - Number(a.in_stock));
  return {
    platter: sorted.filter((p) => PLATTER.test(p.name)),
    cake: sorted.filter((p) => CAKE.test(p.name)),
    parcel: sorted.filter((p) => p.section === "parcel" && !PLATTER.test(p.name) && !CAKE.test(p.name)),
    jus: sorted.filter((p) => p.section === "jus" || p.section === "dessert"),
  };
}
