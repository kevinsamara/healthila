/**
 * Whole fruit sold by weight (semangka, melon): one fruit is e.g. 5.5 kg or
 * half is 2.75 kg, so the kg a buyer types rarely matches what is cut and
 * weighed. These orders are confirmed by admin on WhatsApp first — no QRIS
 * (owner, Nov 2026). Matched on the product category so new melons follow.
 */
export const CONFIRM_ONLY_CATEGORIES = ["Semangka", "Melon"];

export const isConfirmOnly = (category: string | null | undefined) =>
  !!category && CONFIRM_ONLY_CATEGORIES.some((c) => c.toLowerCase() === category.trim().toLowerCase());

export const CONFIRM_ONLY_NOTE =
  "Dijual per buah utuh atau potong, jadi berat & total final dikonfirmasi admin dulu via WhatsApp. Pembayaran setelah konfirmasi (tidak bisa QRIS langsung).";

/**
 * Semangka is bought per fruit, not per kg: "1 buah utuh" or "½ buah". The
 * cart line is priced on the owner's average weight (merah ±5,5 kg, kuning
 * ±3,5 kg, Nov 2026); admin weighs and confirms the final total. A new
 * semangka product sells per kg until its weight is added here.
 */
const WHOLE_FRUIT_KG: Record<string, number> = {
  "54bdfc9a-4f62-4061-991e-b994ef4c13a9": 5.5, // Semangka Merah Seedless
  "b18cfc48-4fe2-44b6-baa4-1b899b38ae09": 3.5, // Semangka Kuning
};

export type FruitPortion = { key: "utuh" | "setengah"; label: string; unit: string; kg: number };

export function fruitPortions(productId: string): FruitPortion[] | null {
  const kg = WHOLE_FRUIT_KG[productId];
  if (!kg) return null;
  return [
    { key: "utuh", label: "1 buah utuh", unit: "buah utuh", kg },
    { key: "setengah", label: "½ buah", unit: "belahan (½ buah)", kg: kg / 2 },
  ];
}

export const kgLabel = (kg: number) => `±${String(kg).replace(".", ",")} kg`;
