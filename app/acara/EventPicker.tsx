"use client";

import { useEffect, useState } from "react";
import { ArrowDown, Check } from "lucide-react";
import { DynIcon } from "@/lib/icons";
import { EVENT_NEEDS, type EventNeedKey } from "@/lib/event-needs";
import { CorporateForm } from "../korporat/CorporateForm";

/**
 * /acara: pick what to serve → explanation + matching products (rendered on
 * the server, passed in as `panels`) → quote form pre-filled with that need.
 */
export function EventPicker({ panels, counts }: { panels: Record<EventNeedKey, React.ReactNode>; counts: Record<EventNeedKey, number> }) {
  const [active, setActive] = useState<EventNeedKey | null>(null);
  const need = EVENT_NEEDS.find((n) => n.key === active) ?? null;

  // Deep link: /acara?pilih=platter
  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get("pilih") as EventNeedKey | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL
    if (k && EVENT_NEEDS.some((n) => n.key === k)) setActive(k);
  }, []);

  function choose(k: EventNeedKey) {
    setActive(k);
    const url = new URL(window.location.href);
    url.searchParams.set("pilih", k);
    window.history.replaceState(null, "", url);
    requestAnimationFrame(() => document.getElementById("detail")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-center text-sm font-bold tracking-wide text-leaf-500 uppercase">Langkah 1</p>
        <h2 className="mt-1 text-center text-3xl font-extrabold text-ink sm:text-4xl">Mau sajikan apa di acaramu?</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EVENT_NEEDS.map((n) => {
            const on = active === n.key;
            return (
              <button
                key={n.key}
                type="button"
                onClick={() => choose(n.key)}
                aria-pressed={on}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-left text-white shadow-lg transition hover:-translate-y-1 ${n.tone} ${
                  on ? "ring-4 ring-sun-400 ring-offset-2" : ""
                }`}
              >
                <span aria-hidden className="absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-white/10" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <DynIcon icon={n.icon} className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <span className="relative mt-4 block text-xl font-extrabold">{n.title}</span>
                <span className="relative mt-1 block text-sm text-white/85">{n.tagline}</span>
                <span className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                  {on ? <Check className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
                  {on ? "Dipilih" : counts[n.key] ? `Lihat ${counts[n.key]} pilihan` : "Lihat detail"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {need && (
        <section id="detail" className="scroll-mt-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-sm font-bold tracking-wide text-leaf-500 uppercase">Langkah 2 · {need.title}</p>
                <h2 className="mt-1 text-3xl font-extrabold text-ink">{need.tagline}</h2>
                <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted">{need.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {need.fits.map((f) => (
                    <span key={f} className="rounded-full bg-leaf-50 px-3 py-1 text-sm font-semibold text-leaf-900 ring-1 ring-leaf-100">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <a href="#penawaran" className="inline-flex h-12 items-center justify-center rounded-full bg-[#ff3e4c] px-6 font-bold text-white shadow-lg hover:brightness-95">
                Minta penawaran jumlah besar
              </a>
            </div>
            <div className="mt-8">{panels[need.key]}</div>
          </div>
        </section>
      )}

      <section id="penawaran" className="scroll-mt-24 mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_440px]">
        <div>
          <p className="text-sm font-bold tracking-wide text-leaf-500 uppercase">{need ? "Langkah 3" : "Atau langsung"}</p>
          <h2 className="mt-1 text-3xl font-extrabold text-ink">Ceritakan acaramu, kami siapkan penawarannya</h2>
          <p className="mt-3 text-muted">
            Tulis jumlah tamu, tanggal, dan budget — tim kami menghubungi lewat WhatsApp dengan rekomendasi isi & harga. Pesanan sedikit? Langsung
            masukkan ke keranjang dari pilihan di atas.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-ink">
            {["Isi & budget bisa disesuaikan", "Antar sesuai jam acara di Malang Raya", "Kartu ucapan / logo untuk parcel", "Penawaran & invoice untuk perusahaan"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-leaf-600" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <CorporateForm variant="event" needs={need?.formNeed} />
      </section>
    </>
  );
}
