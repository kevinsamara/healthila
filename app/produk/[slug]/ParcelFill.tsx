"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, PenLine, Search, Sparkles, X } from "lucide-react";

export type ReadyFruit = { id: string; name: string; group: string | null };

/**
 * Parcel "Tambah ke Keranjang", two steps: (1) the buyer picks the fruit
 * themselves (A, from what is ready today) or lets Healthila pick the best
 * (B); (2) an optional greeting card. Both go into the line's note, which
 * lands in the order notes.
 */
export function ParcelFillDialog({
  fruits,
  natal,
  onClose,
  onConfirm,
}: {
  fruits: ReadyFruit[];
  /** Natal parcel: Christmas example for the card. */
  natal?: boolean;
  onClose: () => void;
  onConfirm: (fillNote: string) => void;
}) {
  const [step, setStep] = useState<"isi" | "ucapan">("isi");
  const [mode, setMode] = useState<"pilih" | "terbaik" | null>(null);
  const [card, setCard] = useState({ to: "", msg: "", from: "" });
  const [picked, setPicked] = useState<string[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const map = new Map<string, ReadyFruit[]>();
    for (const f of fruits) {
      if (needle && !f.name.toLowerCase().includes(needle) && !(f.group ?? "").toLowerCase().includes(needle)) continue;
      const g = f.group ?? "Lainnya";
      map.set(g, [...(map.get(g) ?? []), f]);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, "id"));
  }, [fruits, q]);

  const toggle = (name: string) => setPicked((p) => (p.includes(name) ? p.filter((x) => x !== name) : [...p, name]));
  const canConfirm = mode === "terbaik" || (mode === "pilih" && picked.length > 0);

  function confirm(withCard: boolean) {
    const fill = mode === "terbaik" ? "Isi buah: dipilihkan yang terbaik oleh Healthila" : `Isi buah pilihan sendiri: ${picked.join(", ")}`;
    const msg = card.msg.trim();
    const cardNote =
      withCard && msg
        ? `Kartu ucapan: ${card.to.trim() ? `Untuk ${card.to.trim()} — ` : ""}"${msg}"${card.from.trim() ? ` — Dari ${card.from.trim()}` : ""}`
        : null;
    onConfirm([fill, cardNote].filter(Boolean).join(" · "));
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="Pilih isi parcel" className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-3xl bg-white sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-leaf-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            {step === "ucapan" && (
              <button type="button" onClick={() => setStep("isi")} aria-label="Kembali ke isi buah" className="rounded-full p-1 text-muted hover:bg-leaf-50">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            {step === "isi" ? "Isi buah parcel" : "Tulis kartu ucapan"}
            <span className="text-xs font-medium text-muted">{step === "isi" ? "1/2" : "2/2"}</span>
          </h2>
          <button type="button" onClick={onClose} aria-label="Tutup" className="rounded-full p-1.5 text-muted hover:bg-leaf-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "ucapan" ? (
          <div className="overflow-y-auto px-5 py-4">
            <p className="flex items-start gap-2 text-sm text-muted">
              <PenLine className="mt-0.5 h-4 w-4 shrink-0 text-leaf-700" />
              Kartu ucapan gratis, kami tulis & selipkan di parcel. Boleh dikosongkan.
            </p>
            <div className="mt-4 grid gap-3">
              <CardField label="Untuk" value={card.to} max={60} placeholder="Contoh: Keluarga Pak Budi" onChange={(to) => setCard((c) => ({ ...c, to }))} />
              <label className="block text-sm font-semibold text-ink">
                Ucapan
                <textarea
                  value={card.msg}
                  onChange={(e) => setCard((c) => ({ ...c, msg: e.target.value.slice(0, 200) }))}
                  rows={4}
                  placeholder={natal ? "Contoh: Selamat Natal & Tahun Baru! Semoga damai dan sehat selalu." : "Contoh: Selamat ulang tahun, semoga sehat & bahagia selalu!"}
                  className="mt-1.5 w-full rounded-2xl border border-leaf-200 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-leaf-700"
                />
                <span className="mt-0.5 block text-right text-[11px] font-normal text-muted">{card.msg.length}/200</span>
              </label>
              <CardField label="Dari" value={card.from} max={60} placeholder="Contoh: Keluarga Andi" onChange={(from) => setCard((c) => ({ ...c, from }))} />
            </div>
          </div>
        ) : (
        <div className="overflow-y-auto px-5 py-4">
          <div className="grid gap-3">
            <Choice active={mode === "pilih"} onClick={() => setMode("pilih")} letter="A" title="Pilih buah sendiri" text="Pilih dari buah yang ready hari ini." />
            <Choice
              active={mode === "terbaik"}
              onClick={() => setMode("terbaik")}
              letter="B"
              title="Dipilihkan yang terbaik"
              text="Tim kami pilihkan buah paling segar & cantik hari ini."
              icon
            />
          </div>

          {mode === "pilih" && (
            <div className="mt-5">
              <label className="flex items-center gap-2 rounded-xl px-3 ring-1 ring-leaf-200 focus-within:ring-leaf-500">
                <Search className="h-4 w-4 text-muted" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari buah…" className="h-10 w-full bg-transparent text-sm outline-none" />
              </label>
              <p className="mt-2 text-xs text-muted">
                {picked.length ? `${picked.length} dipilih. ` : ""}Jumlah & susunan menyesuaikan ukuran parcel; tim kami konfirmasi bila ada yang perlu diganti.
              </p>
              {groups.length === 0 ? (
                <p className="mt-4 text-sm text-muted">Tidak ada buah yang cocok.</p>
              ) : (
                groups.map(([g, list]) => (
                  <div key={g} className="mt-4">
                    <p className="text-xs font-semibold tracking-wide text-muted uppercase">{g}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {list.map((f) => {
                        const on = picked.includes(f.name);
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => toggle(f.name)}
                            aria-pressed={on}
                            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm ring-1 ${
                              on ? "bg-leaf-700 font-semibold text-white ring-leaf-700" : "bg-white text-ink ring-leaf-200 hover:ring-leaf-500"
                            }`}
                          >
                            {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                            {f.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        )}

        <div className="border-t border-leaf-100 px-5 py-4">
          {step === "isi" ? (
            <button
              type="button"
              disabled={!canConfirm}
              onClick={() => setStep("ucapan")}
              className="h-12 w-full rounded-full bg-leaf-700 font-bold text-white hover:bg-leaf-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {mode === "pilih" && picked.length === 0 ? "Pilih minimal 1 buah" : "Lanjut: tulis ucapan"}
            </button>
          ) : (
            <div className="flex gap-3">
              <button type="button" onClick={() => confirm(false)} className="h-12 flex-1 rounded-full font-semibold text-leaf-700 ring-1 ring-leaf-200 hover:bg-leaf-50">
                Lewati
              </button>
              <button
                type="button"
                disabled={!card.msg.trim()}
                onClick={() => confirm(true)}
                className="h-12 flex-[2] rounded-full bg-leaf-700 font-bold text-white hover:bg-leaf-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Tambah ke Keranjang
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Choice({ active, onClick, letter, title, text, icon }: { active: boolean; onClick: () => void; letter: string; title: string; text: string; icon?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-start gap-3 rounded-2xl p-4 text-left ring-1 transition ${active ? "bg-leaf-50 ring-2 ring-leaf-700" : "ring-leaf-200 hover:ring-leaf-500"}`}
    >
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${active ? "bg-leaf-700 text-white" : "bg-leaf-100 text-leaf-700"}`}>
        {letter}
      </span>
      <span>
        <span className="flex items-center gap-1.5 font-bold text-ink">
          {title} {icon && <Sparkles className="h-4 w-4 text-sun-500" />}
        </span>
        <span className="mt-0.5 block text-sm text-muted">{text}</span>
      </span>
    </button>
  );
}

function CardField({ label, value, max, placeholder, onChange }: { label: string; value: string; max: number; placeholder: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label} <span className="font-normal text-muted">(opsional)</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, max))}
        placeholder={placeholder}
        className="mt-1.5 h-11 w-full rounded-xl border border-leaf-200 bg-white px-4 text-sm font-normal outline-none focus:border-leaf-700"
      />
    </label>
  );
}
