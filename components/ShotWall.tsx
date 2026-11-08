"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { TestimonialShot } from "@/lib/testimonials";

const LABEL: Record<TestimonialShot["source"], string> = {
  whatsapp: "Chat WhatsApp",
  instagram: "Instagram",
  google: "Google",
  langsung: "Lainnya",
};

/**
 * Screenshots of customer chats/reviews ("Kata Mereka"): a swipeable strip that
 * moves one card every few seconds; a tap opens the full screenshot.
 */
export function ShotWall({ shots }: { shots: TestimonialShot[] }) {
  const [filter, setFilter] = useState<TestimonialShot["source"] | "">("");
  const [open, setOpen] = useState<number | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  // Source filter only once there are enough screenshots to be worth it.
  const sources = [...new Set(shots.map((s) => s.source))];
  const showFilter = shots.length > 8 && sources.length > 1;
  const list = filter ? shots.filter((s) => s.source === filter) : shots;

  // Endless strip: the list is drawn several times so one copy is wider than the
  // screen; the track scrolls left continuously and jumps back by one copy's
  // width, which looks seamless. Still swipeable; pauses on hover/touch/lightbox.
  const reps = list.length > 1 ? Math.max(2, Math.ceil(16 / list.length)) : 1;
  useEffect(() => {
    const el = track.current;
    if (!el || reps < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let pos = el.scrollLeft;
    let last = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      const kids = el.children;
      const copy = kids.length > list.length ? (kids[list.length] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft : 0;
      if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft; // user swiped
      if (!paused.current && open == null && copy > 0) {
        pos += dt * 0.04; // ~40px per second
        if (pos >= copy) pos -= copy;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [open, list.length, reps]);

  useEffect(() => {
    if (open == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i == null ? i : (i + 1) % list.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i == null ? i : (i - 1 + list.length) % list.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, list.length]);

  if (shots.length === 0) return null;
  const current = open == null ? null : list[open];

  return (
    <div>
      {showFilter && (
        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {(["", ...sources] as const).map((s) => (
            <button
              key={s || "all"}
              onClick={() => {
                setFilter(s);
                track.current?.scrollTo({ left: 0 });
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                filter === s ? "bg-white text-[#a14a00]" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {s ? LABEL[s] : "Semua"}
            </button>
          ))}
        </div>
      )}

      <div
        ref={track}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onTouchStart={() => (paused.current = true)}
        onTouchEnd={() => setTimeout(() => (paused.current = false), 2500)}
        className="mx-[calc(50%-50vw)] flex gap-4 overflow-x-auto px-[calc(50vw-50%)] py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: reps }, () => list).flat().map((s, k) => {
          const i = k % list.length;
          const dup = k >= list.length;
          return (
          <figure key={k} aria-hidden={dup || undefined} className="w-[38%] shrink-0 sm:w-[26%] md:w-[20%] lg:w-[15.5%]">
            {/* Each card floats on its own rhythm so the row never moves in lockstep. */}
            <div className="shot-float" style={{ animationDelay: `${-(k * 1.3) % 7}s`, animationDuration: `${6 + (k % 3)}s` }}>
              <button
                onClick={() => setOpen(i)}
                tabIndex={dup ? -1 : undefined}
                className="block w-full rounded-full bg-white p-1.5 shadow-xl shadow-black/15 transition hover:scale-105"
                aria-label={`Perbesar testimoni${s.caption ? ` ${s.caption}` : ""}`}
              >
                <span className="relative block aspect-square overflow-hidden rounded-full bg-leaf-50">
                  <Image src={s.image_url} alt={s.caption ?? `Testimoni pelanggan via ${LABEL[s.source]}`} fill sizes="(min-width: 1024px) 200px, 40vw" className="object-cover object-top" />
                </span>
              </button>
              <figcaption className="mt-3 truncate text-center text-xs font-medium text-white/90">{s.caption ?? LABEL[s.source]}</figcaption>
            </div>
          </figure>
          );
        })}
      </div>

      {current && (
        <div role="dialog" aria-modal="true" aria-label="Screenshot testimoni" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4" onClick={() => setOpen(null)}>
          <div className="relative flex max-h-full w-full max-w-md flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <Image src={current.image_url} alt={current.caption ?? "Testimoni pelanggan"} width={800} height={1200}
              sizes="(min-width:640px) 448px, 90vw" className="max-h-[80vh] w-auto rounded-xl object-contain" unoptimized={false} />
            <p className="mt-3 text-center text-sm text-white">
              {current.caption ?? LABEL[current.source]} · {open! + 1}/{list.length}
            </p>
          </div>
          <button onClick={() => setOpen(null)} aria-label="Tutup" className="absolute top-4 right-4 rounded-full bg-white/15 p-2 text-white hover:bg-white/25">
            <X className="h-6 w-6" />
          </button>
          {list.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((open! - 1 + list.length) % list.length);
                }}
                aria-label="Sebelumnya"
                className="absolute left-2 rounded-full bg-white/15 p-2 text-white hover:bg-white/25 sm:left-6"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((open! + 1) % list.length);
                }}
                aria-label="Berikutnya"
                className="absolute right-2 rounded-full bg-white/15 p-2 text-white hover:bg-white/25 sm:right-6"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
