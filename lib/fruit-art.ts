/**
 * 3D fruit illustrations for the parcel preview: Microsoft Fluent Emoji
 * (MIT licence), served from jsDelivr. Fruits without a matching asset fall
 * back to their emoji.
 */

const BASE = "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets";
const asset = (dir: string, file: string) => `${BASE}/${encodeURIComponent(dir)}/3D/${file}_3d.png`;

const ART: [RegExp, string][] = [
  [/apel hijau|granny|green apple/i, asset("Green apple", "green_apple")],
  [/apel|apple/i, asset("Red apple", "red_apple")],
  [/anggur|grape|muscat/i, asset("Grapes", "grapes")],
  [/lemon/i, asset("Lemon", "lemon")],
  [/jeruk|orange|murcot|santang|mandarin|persimon|kesemek/i, asset("Tangerine", "tangerine")],
  [/pear|pir/i, asset("Pear", "pear")],
  [/kiwi/i, asset("Kiwi fruit", "kiwi_fruit")],
  [/semangka|watermelon/i, asset("Watermelon", "watermelon")],
  [/melon|hami/i, asset("Melon", "melon")],
  [/mangga|mango/i, asset("Mango", "mango")],
  [/straw/i, asset("Strawberry", "strawberry")],
  [/blueberry/i, asset("Blueberries", "blueberries")],
  [/nanas|pineapple/i, asset("Pineapple", "pineapple")],
  [/alpukat|avocado/i, asset("Avocado", "avocado")],
  [/cherry|ceri/i, asset("Cherries", "cherries")],
  [/pisang|banana/i, asset("Banana", "banana")],
  [/kelapa|coconut/i, asset("Coconut", "coconut")],
  [/peach|plum|nectarine/i, asset("Peach", "peach")],
];

export function fruitArt(name: string): string | null {
  return ART.find(([re]) => re.test(name))?.[1] ?? null;
}
