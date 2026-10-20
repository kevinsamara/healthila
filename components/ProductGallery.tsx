"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/catalog";
import { productEmoji } from "@/lib/emoji";
import { selectVariant, useSelectedVariant } from "@/lib/variant-store";

type Slide = { url: string; label: string | null; variantId: string | null };

/** Product photo + one slide per variant photo; follows the selected variant. */
export function ProductGallery({ product }: { product: Product }) {
  const slides: Slide[] = [];
  const seen = new Set<string>();
  const push = (url: string | null, label: string | null, variantId: string | null) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    slides.push({ url, label, variantId });
  };
  push(product.photo_url, null, null);
  for (const k of product.packagings) push(k.photo_url, k.name, k.id);

  const defaultVariant = product.packagings[0]?.id ?? null;
  const variant = useSelectedVariant(product.id, defaultVariant);
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  // Variant picked in the form → slide to its photo (if it has one). Only on a
  // real change, so the page opens on the main product photo.
  const lastVariant = useRef(variant);
  useEffect(() => {
    if (variant === lastVariant.current) return;
    lastVariant.current = variant;
    const i = slides.findIndex((s) => s.variantId === variant);
    if (i >= 0) go(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- slides derive from props; react to variant only
  }, [variant]);

  function go(i: number) {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  function onScroll() {
    const el = track.current;
    if (!el) return;
    // Only track position here; selecting a variant from intermediate scroll
    // positions would fight the slide animation.
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  }

  const dim = product.in_stock ? "" : "opacity-50 grayscale";

  if (slides.length === 0) {
    return (
      <div className={`flex aspect-square items-center justify-center rounded-[2rem] bg-leaf-50 ring-1 ring-black/5 ${dim}`}>
        <span className="flex aspect-square w-1/2 items-center justify-center rounded-full bg-leaf-100/70 text-8xl">
          {productEmoji(product.product_group, product.category, product.name)}
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="group relative overflow-hidden rounded-[2rem] bg-leaf-50 shadow-sm ring-1 ring-black/5">
        <div
          ref={track}
          onScroll={onScroll}
          className="flex aspect-square snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((s, i) => (
            <div key={s.url} className="relative aspect-square w-full shrink-0 snap-center">
              <Image
                src={s.url}
                alt={s.label ? `${product.name} — ${s.label}` : product.name}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                priority={i === 0}
                className={`object-cover ${dim}`}
              />
              {s.label && (
                <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-ink shadow-sm">
                  {s.label}
                </span>
              )}
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <>
            <Arrow dir="prev" disabled={index === 0} onClick={() => go(index - 1)} />
            <Arrow dir="next" disabled={index === slides.length - 1} onClick={() => go(index + 1)} />
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 sm:hidden">
              {slides.map((s, i) => (
                <span key={s.url} className={`h-2 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-2 bg-white/60"}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-3 hidden gap-2 sm:flex">
          {slides.map((s, i) => (
            <button
              key={s.url}
              type="button"
              onClick={() => {
                go(i);
                if (s.variantId) selectVariant(product.id, s.variantId);
              }}
              aria-label={s.label ?? "Foto utama"}
              className={`relative h-20 w-20 overflow-hidden rounded-2xl ring-2 transition ${
                i === index ? "ring-leaf-700" : "opacity-70 ring-transparent hover:opacity-100"
              }`}
            >
              <Image src={s.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Arrow({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Foto sebelumnya" : "Foto berikutnya"}
      className={`absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-ink shadow-md transition hover:bg-white disabled:opacity-0 sm:flex ${
        dir === "prev" ? "left-3" : "right-3"
      }`}
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}
