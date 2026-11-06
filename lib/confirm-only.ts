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
