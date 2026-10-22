"use client";

import { useEffect, useRef, useState } from "react";

export type SlideItem = {
  key: string;
  quote: string;
  name: string;
  sub: string;
  rating: number;
  href: string | null;
  tone: "coral" | "sky" | "leaf";
  google: boolean;
};

const toneCls = {
  coral: { card: "bg-[#fff1f3]", quote: "text-coral-500/25", name: "text-coral-500" },
  sky: { card: "bg-sky-50", quote: "text-sky-400/30", name: "text-sky-600" },
  leaf: { card: "bg-leaf-50", quote: "text-leaf-500/25", name: "text-leaf-700" },
};

/** Swipeable testimonial carousel: 1 card on phones, 2 on tablet, 3 on desktop. Auto-advances. */
export function TestimonialSlider({ items: initial, onDark }: { items: SlideItem[]; /** On a coloured section: white dots. */ onDark?: boolean }) {
  // The page is cached, so shuffle in the browser: a new order on every refresh.
  const [items, setItems] = useState(initial);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- shuffle once after hydration
    setItems(shuffle(initial));
  }, [initial]);
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const paused = useRef(false);

  // Pages depend on how many cards fit; recompute on resize.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    // Measure after layout settles; observe the cards too, since their width
    // (not the track's) changes at breakpoints.
    const read = () => setPages(Math.max(1, Math.round(el.scrollWidth / Math.max(1, el.clientWidth))));
    const measure = () => {
      read();
      requestAnimationFrame(read);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items.length]);

  useEffect(() => {
    if (pages <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) go(page + 1 >= pages ? 0 : page + 1);
    }, 6000);
    return () => clearInterval(id);
  }, [page, pages]);

  function go(p: number) {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: p * el.clientWidth, behavior: "smooth" });
  }

  function onScroll() {
    const el = track.current;
    if (el) setPage(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={() => (paused.current = true)}
    >
      <div
        ref={track}
        onScroll={onScroll}
        className="-mx-2 flex snap-x snap-mandatory overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t) => {
          const c = toneCls[t.tone];
          return (
            <div key={t.key} className="w-full shrink-0 snap-start px-2 md:w-1/2 lg:w-1/3">
              <figure className={`relative flex h-full flex-col overflow-hidden rounded-3xl p-7 ${c.card}`}>
                <span className={`absolute top-1 right-5 font-display text-[8rem] leading-none font-extrabold ${c.quote}`} aria-hidden>
                  “
                </span>
                <p className="text-xl tracking-widest text-sun-400" aria-label={`${t.rating} dari 5 bintang`}>
                  {"★".repeat(t.rating)}
                  <span className="text-black/10">{"★".repeat(5 - t.rating)}</span>
                </p>
                <blockquote className="relative mt-4 line-clamp-6 leading-relaxed text-ink/85 italic">“{t.quote}”</blockquote>
                <figcaption className="mt-auto flex items-end justify-between gap-3 pt-6">
                  <span className="min-w-0">
                    {t.href ? (
                      <a href={t.href} target="_blank" rel="noopener noreferrer" className={`block truncate font-display text-xl font-bold hover:underline ${c.name}`}>
                        {t.name}
                      </a>
                    ) : (
                      <span className={`block truncate font-display text-xl font-bold ${c.name}`}>{t.name}</span>
                    )}
                    <span className="text-sm text-muted">{t.sub}</span>
                  </span>
                  {t.google && <span className="shrink-0 text-xs text-muted">via Google</span>}
                </figcaption>
              </figure>
            </div>
          );
        })}
      </div>

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <NavButton label="Sebelumnya" onClick={() => go(page - 1 < 0 ? pages - 1 : page - 1)}>
            ‹
          </NavButton>
          <div className="flex gap-1.5">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Halaman ${i + 1}`}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all ${
                  i === page ? (onDark ? "w-6 bg-white" : "w-6 bg-leaf-700") : onDark ? "w-2 bg-white/45" : "w-2 bg-black/15"
                }`}
              />
            ))}
          </div>
          <NavButton label="Berikutnya" onClick={() => go(page + 1 >= pages ? 0 : page + 1)}>
            ›
          </NavButton>
        </div>
      )}
    </div>
  );
}

function NavButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl text-ink shadow-sm ring-1 ring-black/5 hover:ring-leaf-500"
    >
      {children}
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
