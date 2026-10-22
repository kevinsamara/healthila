import { createElement } from "react";
import {
  Apple,
  Banana,
  CakeSlice,
  Carrot,
  Cherry,
  Citrus,
  CupSoda,
  Gift,
  Grape,
  Leaf,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/**
 * Icons instead of emoji on the website (same lucide set as Healthila OS).
 * Fruit hints → the closest lucide fruit icon, for products without a photo.
 */
const FRUIT: [RegExp, LucideIcon][] = [
  [/jus|juice|cold-pressed/i, CupSoda],
  [/parsel|parcel|hampers/i, Gift],
  [/dessert|sago|puding|cake/i, CakeSlice],
  [/sayur|bayam|wortel/i, Carrot],
  [/anggur|muscat|grape|crimson|autumn royal|blueberry|berry/i, Grape],
  [/jeruk|murcot|orange|santang|lemon|mandarin|citrus/i, Citrus],
  [/pisang|banana/i, Banana],
  [/cherry|ceri|lengkeng|kelengkeng|leci|straw/i, Cherry],
  [/apel|apple|pear|pir/i, Apple],
];

export function fruitIcon(...hints: (string | null | undefined)[]): LucideIcon {
  const text = hints.filter(Boolean).join(" ");
  return FRUIT.find(([re]) => re.test(text))?.[1] ?? Apple;
}

/** Article covers still store an emoji chosen in the CRM; show an icon instead. */
const EMOJI: [RegExp, LucideIcon][] = [
  [/🧃|🥤|🍹|🥛/u, CupSoda],
  [/🧺|🎁|🎀/u, Gift],
  [/🍰|🍮|🧁|🎂/u, CakeSlice],
  [/🥬|🥕|🥦|🥗/u, Carrot],
  [/🍇|🫐/u, Grape],
  [/🍊|🍋/u, Citrus],
  [/🍌/u, Banana],
  [/🍒|🍓/u, Cherry],
  [/🍎|🍏|🍐/u, Apple],
];

export function iconForEmoji(emoji: string | null | undefined): LucideIcon {
  return EMOJI.find(([re]) => re.test(emoji ?? ""))?.[1] ?? Leaf;
}

/** Fruit icon for the given hints (product group, category, name…). */
export function FruitGlyph({ hints, ...props }: { hints: (string | null | undefined)[] } & LucideProps) {
  return createElement(fruitIcon(...hints), { "aria-hidden": true, ...props });
}

/** Icon for an article cover emoji. */
export function EmojiGlyph({ emoji, ...props }: { emoji: string | null | undefined } & LucideProps) {
  return createElement(iconForEmoji(emoji), { "aria-hidden": true, ...props });
}

/** Render a lucide icon chosen from data (keeps components static for React). */
export function DynIcon({ icon, ...props }: { icon: LucideIcon } & LucideProps) {
  return createElement(icon, { "aria-hidden": true, ...props });
}
