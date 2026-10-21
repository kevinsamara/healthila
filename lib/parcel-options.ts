import type { ShapeKey } from "@/components/parcel/ParcelVisual";

/**
 * Parcel containers for /parcel/custom with "start from" prices (Healthila
 * Gifts catalog + owner's price list, Oct 2026). `crmMatch` finds the CRM
 * parcel product whose photo is shown on the option. Fallback only — the live
 * list is edited in Healthila OS › Website › Parcel (web_parcel_containers).
 */
export type ParcelContainer = {
  key: string;
  label: string;
  group: string;
  desc: string;
  start: number;
  shape: ShapeKey;
  crmMatch?: RegExp;
};

export const PARCEL_CONTAINERS: ParcelContainer[] = [
  { key: "tas-medium", label: "Tas Jinjing Medium", group: "Tas Jinjing", desc: "Simpel untuk kunjungan", start: 100_000, shape: "tas", crmMatch: /tas jinjing/i },
  { key: "tas-coldpressed", label: "Tas Jinjing Coldpressed", group: "Tas Jinjing", desc: "Isi jus cold-pressed", start: 125_000, shape: "tas" },
  { key: "tas-large", label: "Tas Jinjing Large", group: "Tas Jinjing", desc: "Lebih lega, buah lebih banyak", start: 150_000, shape: "tas" },
  { key: "box-mika", label: "Box Mika Jinjing", group: "Box", desc: "Box bening dengan tali", start: 125_000, shape: "box", crmMatch: /box jinjing/i },
  { key: "besek", label: "Besek Jinjing", group: "Box", desc: "Anyaman bambu tradisional", start: 150_000, shape: "keranjang" },
  { key: "fruit-in-box", label: "Fruit in Box", group: "Box", desc: "Box 22×22 rapi & elegan", start: 200_000, shape: "box", crmMatch: /fruit in box/i },
  { key: "freshness", label: "Parcel Freshness", group: "Keranjang", desc: "Keranjang rotan ukuran kecil", start: 250_000, shape: "keranjang", crmMatch: /freshness/i },
  { key: "nutritious", label: "Parcel Nutritious", group: "Keranjang", desc: "Keranjang rotan sedang", start: 300_000, shape: "keranjang", crmMatch: /nutritious/i },
  { key: "balance", label: "Parcel Balance", group: "Keranjang", desc: "Keranjang besar, penuh warna", start: 400_000, shape: "keranjang", crmMatch: /balance/i },
  { key: "sweet-bloom", label: "Sweet Bloom", group: "Keranjang", desc: "Buah + rangkaian bunga", start: 550_000, shape: "keranjang", crmMatch: /sweet bloom/i },
  { key: "harmony", label: "Parcel Harmony", group: "Keranjang", desc: "Paling mewah untuk momen spesial", start: 700_000, shape: "keranjang", crmMatch: /harmony/i },
  { key: "platter-medium", label: "Fruit Platter Medium", group: "Platter & Cake", desc: "Buah potong siap santap", start: 200_000, shape: "plate", crmMatch: /fruit plate/i },
  { key: "platter-large", label: "Fruit Platter Large", group: "Platter & Cake", desc: "Untuk acara & meeting", start: 500_000, shape: "plate" },
  { key: "fruit-cake", label: "Fruit Cake 25–28cm", group: "Platter & Cake", desc: "Kue dari buah segar", start: 300_000, shape: "plate", crmMatch: /fruit cake/i },
  { key: "fruit-tower", label: "Fruit Tower 32–40cm", group: "Platter & Cake", desc: "Menara buah untuk perayaan", start: 450_000, shape: "tower", crmMatch: /fruit tower/i },
];

/** Add-ons: Healthila red ribbon and Healthila card are free. */
export const RIBBON_FREE = "Merah Healthila";
export const RIBBON_EXTRA = 5_000;
export const CARD_STYLES = [
  { key: "healthila", label: "Kartu Healthila", desc: "Desain kartu ucapan Healthila", price: 0 },
  { key: "custom", label: "Kartu Custom Desain", desc: "Desain khusus sesuai tema / logo", price: 5_000 },
  { key: "none", label: "Tanpa kartu", desc: "", price: 0 },
] as const;
