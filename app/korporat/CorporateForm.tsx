"use client";

import { useState, useTransition } from "react";
import { trackEvent } from "@/lib/analytics";
import { submitCorporate } from "./actions";

const NEEDS = ["Hampers hari raya (klien/relasi)", "Apresiasi karyawan", "Buah untuk rapat / acara", "Langganan buah kantor", "Lainnya"];

export function CorporateForm() {
  const [f, setF] = useState({ company: "", name: "", phone: "", email: "", needs: NEEDS[0], quantity: "", budget: "", date: "", notes: "" });
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((x) => ({ ...x, [k]: e.target.value }));
  const num = (s: string) => (s.replace(/\D/g, "") ? Number(s.replace(/\D/g, "")) : null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await submitCorporate({
        company: f.company,
        name: f.name,
        phone: f.phone,
        email: f.email,
        needs: f.needs,
        quantity: num(f.quantity),
        budget: num(f.budget),
        date: f.date || null,
        notes: f.notes,
      });
      if (!res.ok) return setError(res.error);
      trackEvent("generate_lead", { lead_type: "korporat" });
      setDone(res.code);
    });
  }

  if (done)
    return (
      <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-leaf-100">
        <p className="text-sm font-semibold tracking-wide text-leaf-500 uppercase">Permintaan terkirim</p>
        <p className="mt-2 text-3xl font-extrabold text-leaf-900">{done}</p>
        <p className="mt-3 text-muted">Terima kasih! Tim kami akan menghubungi lewat WhatsApp dengan penawaran dalam 1×24 jam kerja.</p>
      </div>
    );

  const input = "mt-1 w-full rounded-xl border border-leaf-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-leaf-500";
  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-6 ring-1 ring-leaf-100">
      <h2 className="text-xl font-extrabold text-ink">Minta penawaran</h2>
      <label className="mt-4 block text-sm font-medium text-ink">
        Perusahaan / instansi *
        <input value={f.company} onChange={set("company")} className={input} autoComplete="organization" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="mt-3 block text-sm font-medium text-ink">
          Nama Kakak *
          <input value={f.name} onChange={set("name")} className={input} autoComplete="name" />
        </label>
        <label className="mt-3 block text-sm font-medium text-ink">
          WhatsApp *
          <input value={f.phone} onChange={set("phone")} className={input} inputMode="tel" autoComplete="tel" placeholder="0812…" />
        </label>
      </div>
      <label className="mt-3 block text-sm font-medium text-ink">
        Email (opsional)
        <input value={f.email} onChange={set("email")} className={input} type="email" autoComplete="email" />
      </label>
      <label className="mt-3 block text-sm font-medium text-ink">
        Kebutuhan *
        <select value={f.needs} onChange={set("needs")} className={input}>
          {NEEDS.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="mt-3 block text-sm font-medium text-ink">
          Jumlah paket
          <input value={f.quantity} onChange={set("quantity")} className={input} inputMode="numeric" placeholder="50" />
        </label>
        <label className="mt-3 block text-sm font-medium text-ink">
          Budget/paket
          <input value={f.budget} onChange={set("budget")} className={input} inputMode="numeric" placeholder="250000" />
        </label>
        <label className="mt-3 block text-sm font-medium text-ink">
          Dibutuhkan
          <input value={f.date} onChange={set("date")} className={input} type="date" />
        </label>
      </div>
      <label className="mt-3 block text-sm font-medium text-ink">
        Catatan
        <textarea value={f.notes} onChange={set("notes")} rows={3} className={input} placeholder="Mis. kirim ke 20 alamat berbeda, pakai logo perusahaan di kartu…" />
      </label>
      {error && <p className="mt-3 rounded-xl bg-plum-50 px-3 py-2 text-sm font-medium text-plum-700">{error}</p>}
      <button disabled={pending} className="mt-5 h-12 w-full rounded-full bg-leaf-700 font-bold text-white hover:bg-leaf-900 disabled:opacity-60">
        {pending ? "Mengirim…" : "Kirim permintaan"}
      </button>
    </form>
  );
}
