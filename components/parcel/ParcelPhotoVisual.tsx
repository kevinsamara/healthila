"use client";

import { pileSlots, type FillArea } from "@/lib/parcel-composite";

/**
 * Parcel preview from real PNGs uploaded in Healthila OS › Website › Parcel:
 * container back → fruit pile inside the fill area → optional front layer.
 * Fruit counts are illustrative — operations decide the real quantities.
 */
export function ParcelPhotoVisual({
  back,
  front,
  fill,
  fruits,
  ribbon,
  card,
}: {
  back: string;
  front: string | null;
  fill: FillArea;
  fruits: { emoji: string; art: string | null }[];
  ribbon: string;
  card: string | null;
}) {
  const slots = pileSlots(fill);
  const placed = fruits.length ? slots.map((s, i) => ({ ...s, f: fruits[(i * 7 + Math.floor(i / fruits.length)) % fruits.length] })) : [];

  return (
    <div className="relative mx-auto aspect-square h-full max-w-full" role="img" aria-label="Pratinjau parcel">
      {/* eslint-disable-next-line @next/next/no-img-element -- layered PNGs need exact positioning */}
      <img src={back} alt="" className="absolute inset-0 h-full w-full object-contain drop-shadow-lg" />
      {placed.map((s, i) => (
        <span
          key={`${i}-${s.f.art ?? s.f.emoji}`}
          className="parcel-pop absolute flex items-center justify-center"
          style={{
            left: `${s.x - s.size / 2}%`,
            top: `${s.y - s.size / 2}%`,
            width: `${s.size}%`,
            height: `${s.size}%`,
            animationDelay: `${i * 25}ms`,
          }}
        >
          {s.f.art ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.f.art} alt="" className="h-full w-full object-contain drop-shadow" />
          ) : (
            <span className="h-4/5 w-4/5 rounded-full bg-gradient-to-br from-coral-500 to-sun-400 ring-2 ring-white" />
          )}
        </span>
      ))}
      {front && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={front} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-contain" />
      )}
      {/* Ribbon bow on the front of the container */}
      <svg
        viewBox="0 0 60 40"
        className="absolute w-[16%]"
        style={{ left: `${fill.fill_x + fill.fill_w / 2 - 8}%`, top: `${Math.min(88, fill.fill_y + fill.fill_h)}%` }}
        aria-hidden
      >
        <path d="M30 20 L6 6 Q0 20 6 34 Z" fill={ribbon} />
        <path d="M30 20 L54 6 Q60 20 54 34 Z" fill={ribbon} />
        <path d="M30 20 L24 40 M30 20 L36 40" stroke={ribbon} strokeWidth="4" />
        <circle cx="30" cy="20" r="6" fill={ribbon} stroke="#0002" />
      </svg>
      {card && (
        <div className="absolute right-[2%] bottom-[4%] max-w-[38%] rotate-3 rounded-md bg-white px-2 py-1.5 text-[10px] leading-snug text-ink shadow-md ring-1 ring-black/5 sm:text-xs">
          <span className="line-clamp-4 italic">{card}</span>
        </div>
      )}
    </div>
  );
}
