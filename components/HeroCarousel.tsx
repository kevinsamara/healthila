"use client";

import Image from "next/image";
import Link from "next/link";
import { Snowflake } from "lucide-react";
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
  /** Falling-snow decoration (Natal). */
  snow?: boolean;
  /** Cut-out person (transparent PNG/WebP) standing on the slide's bottom edge; photos become small floating cards. */
  model?: { src: string; alt: string; width: number; height: number };
};

const PER_SLIDE = 4;
const AUTOPLAY_MS = 7000;

/**
 * Full-width hero slider, each slide with its own colours, copy and a 2×2 grid
 * of product photos. Every slide is in the HTML. Photos are shuffled in the
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
      <h1 className="sr-only">Toko buah & parcel buah Malang</h1>
      <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, si) => {
          const photos = s.photos.slice(0, PER_SLIDE);
          return (
            <div
              key={s.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${si + 1} dari ${count}`}
              inert={si !== index}
              className={`relative flex w-full shrink-0 flex-col ${s.bg}`}
            >
              <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-white/5" />
              {s.snow && <Snow />}
              {s.model && <Ornaments />}
              <div
                className={`relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 pt-16 md:grid-cols-2 md:pt-24 ${
                  s.model ? "pb-0 md:gap-6" : "pb-20 md:pb-28"
                }`}
              >
                <div className={s.model ? "md:pb-28" : undefined}>
                  <p className={`inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${s.badgeClass}`}>{s.badge}</p>
                  <h2 className="mt-5 text-5xl leading-[1.05] font-extrabold sm:text-7xl">{s.heading}</h2>
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

                {s.model ? (
                  <ModelScene model={s.model} photos={photos.slice(0, 2)} priority={si === 0} />
                ) : photos.length > 0 && (
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

/**
 * Right side of a slide with a model: the cut-out stands on the slide's bottom
 * edge (over the red circle), two product photos float beside as small cards.
 */
function ModelScene({ model, photos, priority }: { model: NonNullable<HeroSlide["model"]>; photos: HeroPhoto[]; priority: boolean }) {
  const spots = [
    // Clear spots around the cut-out: left of the head, above the raised hand.
    "left-0 top-8 w-24 -rotate-6 sm:w-32 md:top-12 md:w-36",
    "right-0 top-0 w-24 rotate-6 sm:w-28 md:w-32",
  ];
  return (
    <div className="relative mx-auto h-[440px] w-full max-w-lg self-end sm:h-[480px] md:mt-0 md:h-[600px] lg:h-[640px]">
      {photos.map((p, i) => (
        <Link
          key={p.id}
          href={`/produk/${p.slug}`}
          className={`group absolute z-0 aspect-square overflow-hidden rounded-3xl bg-white/10 shadow-xl ring-4 shadow-black/25 ring-white/90 ${spots[i]}`}
        >
          <Image src={p.photo} alt={p.name} fill sizes="160px" className="object-cover transition duration-500 group-hover:scale-105" />
        </Link>
      ))}
      <p className="absolute bottom-16 left-0 z-20 -rotate-6 rounded-2xl bg-[#f3c969] px-3 py-2 text-center text-xs leading-tight font-extrabold text-[#0a3b2c] shadow-lg ring-4 ring-white sm:text-sm md:bottom-24">
        Gratis kartu
        <br />
        ucapan Natal
      </p>
      <Image
        src={model.src}
        alt={model.alt}
        width={model.width}
        height={model.height}
        priority={priority}
        sizes="(min-width: 768px) 460px, 320px"
        className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-full w-auto max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]"
      />
    </div>
  );
}

/** [left % of the right column, string length px, ball size px, colour, kind, swing delay s] */
const BAUBLES: [number, number, number, string, "ball" | "star", number][] = [
  [6, 70, 26, "#e23a4f", "ball", 0],
  [16, 130, 34, "#f3c969", "ball", 0.6],
  [27, 46, 20, "#ffffff", "ball", 1.1],
  [72, 54, 22, "#f3c969", "star", 0.3],
  [84, 120, 30, "#e23a4f", "ball", 0.9],
  [95, 78, 24, "#ffffff", "ball", 1.4],
];

/** Christmas baubles hanging from the top edge over the right column (desktop). */
function Ornaments() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 mx-auto hidden max-w-7xl grid-cols-2 px-4 md:grid">
      <div />
      <div className="relative">
        {BAUBLES.map(([left, len, size, color, kind, delay]) => (
          <span key={left} className="hero-swing absolute top-0 flex flex-col items-center" style={{ left: `${left}%`, animationDelay: `${delay}s` }}>
            <span className="w-px bg-white/45" style={{ height: len }} />
            {kind === "star" ? (
              <svg viewBox="0 0 24 24" width={size} height={size} className="-mt-0.5 drop-shadow">
                <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7Z" fill={color} />
              </svg>
            ) : (
              <svg viewBox="0 0 32 36" width={size} height={size * 1.12} className="drop-shadow">
                <rect x="12" y="0" width="8" height="5" rx="1.5" fill="#d4a83c" />
                <circle cx="16" cy="20" r="15" fill={color} />
                <path d="M3 18q13 6 26 0" stroke={color === "#ffffff" ? "#e23a4f" : "#ffffff"} strokeOpacity=".55" strokeWidth="2.2" fill="none" />
                <ellipse cx="10.5" cy="13" rx="3.5" ry="5" fill="#fff" opacity=".35" />
              </svg>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

/** [left %, top %, size px, opacity]: scattered flakes that stay clear of the copy's centre line. */
const FLAKES = [
  [4, 12, 28, 0.2],
  [20, 8, 16, 0.28],
  [36, 16, 22, 0.16],
  [47, 6, 14, 0.3],
  [44, 84, 24, 0.18],
  [8, 88, 18, 0.26],
  [62, 4, 20, 0.2],
  [93, 14, 30, 0.2],
  [96, 62, 18, 0.26],
  [60, 92, 16, 0.24],
];

function Snow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden text-white">
      <span className="absolute -right-32 -bottom-40 h-[34rem] w-[34rem] rounded-full bg-[#a3162e] md:h-[46rem] md:w-[46rem]" />
      {FLAKES.map(([left, top, size, opacity]) => (
        <Snowflake key={`${left}-${top}`} className="absolute hidden md:block" style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, opacity }} />
      ))}
    </div>
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
