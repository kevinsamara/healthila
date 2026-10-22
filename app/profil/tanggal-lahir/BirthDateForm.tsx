"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveBirthDate } from "../actions";

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export function BirthDateForm({ next, initial, allowSkip }: { next: string; initial: string | null; allowSkip: boolean }) {
  const router = useRouter();
  const [y0, m0, d0] = (initial ?? "").split("-");
  const [day, setDay] = useState(d0 ? String(Number(d0)) : "");
  const [month, setMonth] = useState(m0 ? String(Number(m0)) : "");
  const [year, setYear] = useState(y0 ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const thisYear = new Date().getFullYear();
  const select = "h-12 rounded-xl border border-leaf-100 bg-white px-3 text-base outline-none focus:border-leaf-500";

  const go = (date: string | null) =>
    start(async () => {
      setError(null);
      const r = await saveBirthDate(date);
      if (!r.ok) return setError(r.error);
      router.replace(next);
      router.refresh();
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!day || !month || !year) return setError("Lengkapi tanggal, bulan, dan tahun.");
        go(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
      }}
      className="mt-6"
    >
      <div className="grid grid-cols-[0.8fr_1.4fr_1fr] gap-2">
        <select value={day} onChange={(e) => setDay(e.target.value)} className={select} aria-label="Tanggal">
          <option value="">Tgl</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className={select} aria-label="Bulan">
          <option value="">Bulan</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)} className={select} aria-label="Tahun">
          <option value="">Tahun</option>
          {Array.from({ length: 90 }, (_, i) => thisYear - 5 - i).map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>
      {error && <p className="mt-3 text-sm text-plum-700">{error}</p>}
      <button disabled={pending} className="mt-5 h-12 w-full rounded-full bg-leaf-700 font-bold text-white hover:bg-leaf-900 disabled:opacity-60">
        {pending ? "Menyimpan…" : "Simpan"}
      </button>
      {allowSkip && (
        <button type="button" disabled={pending} onClick={() => go(null)} className="mt-3 w-full text-sm text-muted hover:text-ink">
          Nanti saja
        </button>
      )}
    </form>
  );
}
