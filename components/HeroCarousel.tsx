"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "./WhatsAppFab";

export type HeroPhoto = { id: string; slug: string; name: string; photo: string };
export type HeroSlide = {
  key: string;
  /** Background classes for the whole block. */
  bg: string;
  badge: string;
  badgeClass: string;
  heading: string;
  text: string;
  textClass: string;
  cta: { href: string; label: string; className: string };
  secondary?: { href: string; label: string };
  whatsapp: string;
  photos: HeroPhoto[];
};

const PER_SLIDE = 4;
const AUTOPLAY_MS = 7000;

/**
 * Full-width hero slider: Buah → Jus & Dessert → Parcel, each with its own
 * colours, copy and a 2×2 grid of that section's product photos. Every slide
 * is in the HTML (first heading is the page's h1). Photos are shuffled in the
 * browser because the page itself is cached.
 */
export function HeroCarousel({ slides: initial }: { slides: HeroSlide[] }) {
  const [slides, setSlides] = useState(initial);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- shuffle once after hydration
    setSlides(initial.map((s) => ({ ...s, photos: shuffle(s.photos) })));
  }, [initial]);

  useEffect(() => {
    if (count <= 1 || paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count, paused]);

  const go = (i: number) => setIndex((i + count) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Kategori Healthila"
      className="relative overflow-clip text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        touchX.current = null;
        if (start == null) return;
        const dx = e.changedTouches[0].clientX - start;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, si) => {
          const Heading = si === 0 ? "h1" : "h2";
          const photos = s.photos.slice(0, PER_SLIDE);
          return (
            <div
              key={s.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${si + 1} dari ${count}`}
              inert={si !== index}
              className={`relative w-full shrink-0 ${s.bg}`}
            >
              <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-white/5" />
              <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pt-16 pb-20 md:grid-cols-2 md:pt-24 md:pb-28">
                <div>
                  <p className={`inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${s.badgeClass}`}>{s.badge}</p>
                  <Heading className="mt-5 text-5xl leading-[1.05] font-extrabold sm:text-7xl">{s.heading}</Heading>
                  <p className={`mt-5 max-w-md text-lg ${s.textClass}`}>{s.text}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={s.cta.href} className={`flex h-13 items-center rounded-full px-7 font-bold ${s.cta.className}`}>
                      {s.cta.label}
                    </Link>
                    {s.secondary ? (
                      <Link
                        href={s.secondary.href}
                        className="flex h-13 items-center rounded-full border border-white/50 px-6 font-semibold hover:bg-white/10"
                      >
                        {s.secondary.label}
                      </Link>
                    ) : (
                      <a
                        href={s.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-13 items-center gap-2 rounded-full border border-white/50 px-6 font-semibold hover:bg-white/10"
                      >
                        <WhatsAppIcon className="h-5 w-5" /> Chat WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                {photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 pb-8">
                    {photos.map((p, i) => (
                      <Link
                        key={p.id}
                        href={`/produk/${p.slug}`}
                        className={`group relative aspect-square overflow-hidden rounded-3xl bg-white/10 shadow-xl shadow-black/20 ${
                          i % 2 ? "translate-y-8" : ""
                        }`}
                      >
                        <Image
                          src={p.photo}
                          alt={p.name}
                          fill
                          sizes="(min-width: 768px) 25vw, 50vw"
                          priority={si === 0 && i < 2}
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <span className="absolute inset-x-2 bottom-2 translate-y-2 truncate rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                          {p.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <>
          <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.key}
                type="button"
                aria-label={`Slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-white" : "w-2 bg-white/45 hover:bg-white/75"}`}
              />
            ))}
          </div>
          <Arrow dir={-1} onClick={() => go(index - 1)} />
          <Arrow dir={1} onClick={() => go(index + 1)} />
        </>
      )}
    </section>
  );
}

function Arrow({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? "Sebelumnya" : "Berikutnya"}
      className={`absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl backdrop-blur transition hover:bg-white/30 xl:flex ${
        dir < 0 ? "left-4" : "right-4"
      }`}
    >
      {dir < 0 ? "‹" : "›"}
    </button>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
