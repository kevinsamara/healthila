const MAP: [RegExp, string][] = [
  [/anggur|muscat|grape|crimson|autumn royal/i, "🍇"],
  [/apel|apple/i, "🍎"],
  [/jeruk|murcot|orange|santang|lemon|mandarin/i, "🍊"],
  [/pear|pir/i, "🍐"],
  [/semangka|watermelon/i, "🍉"],
  [/melon|hami/i, "🍈"],
  [/mangga|mango/i, "🥭"],
  [/straw/i, "🍓"],
  [/blueberry|berry/i, "🫐"],
  [/kiwi/i, "🥝"],
  [/nanas|pineapple/i, "🍍"],
  [/alpukat|avocado|avo/i, "🥑"],
  [/cherry|ceri|lengkeng|kelengkeng|leci/i, "🍒"],
  [/pisang|banana/i, "🍌"],
  [/kelapa|coconut/i, "🥥"],
  [/peach|plum|nectarine/i, "🍑"],
  [/jus|juice/i, "🧃"],
  [/parsel|parcel|hampers/i, "🧺"],
  [/dessert|sago|puding/i, "🍮"],
  [/sayur|bayam/i, "🥬"],
];

/** Friendly stand-in for products without a photo. */
export function productEmoji(...hints: (string | null | undefined)[]): string {
  const text = hints.filter(Boolean).join(" ");
  return MAP.find(([re]) => re.test(text))?.[1] ?? "🍎";
}
