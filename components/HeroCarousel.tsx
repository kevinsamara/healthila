"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type HeroPhoto = { id: string; slug: string; name: string; photo: string };

const PER_SLIDE = 4;
const SLIDES = 3;

/**
 * Hero collage: 12 random product photos as 3 slides of a 2×2 grid,
 * auto-advancing. The page is cached, so the pick is shuffled in the browser —
 * a different set on every visit.
 */
export function HeroCarousel({ pool }: { pool: HeroPhoto[] }) {
  const [photos, setPhotos] = useState(() => pool.slice(0, PER_SLIDE * SLIDES));
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- shuffle once after hydration
    setPhotos(shuffle(pool).slice(0, PER_SLIDE * SLIDES));
  }, [pool]);

  const slides = chunk(photos, PER_SLIDE).filter((s) => s.length === PER_SLIDE);
  const count = slides.length;

  useEffect(() => {
    if (count <= 1 || paused) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % count), 4500);
    return () => clearInterval(id);
  }, [count, paused]);

  if (count === 0) return null;

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="overflow-hidden pb-8">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {slides.map((group, si) => (
            <div key={si} className="grid w-full shrink-0 grid-cols-2 gap-4 px-1" aria-hidden={si !== slide}>
              {group.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/produk/${p.slug}`}
                  tabIndex={si === slide ? 0 : -1}
                  className={`group relative aspect-square overflow-hidden rounded-3xl bg-leaf-500 shadow-xl shadow-black/20 ${
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
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all ${i === slide ? "w-7 bg-lime-400" : "w-2 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
