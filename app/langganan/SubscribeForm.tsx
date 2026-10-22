"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { trackEvent } from "@/lib/analytics";
import type { DeliverySlot } from "@/lib/delivery";
import { rupiah } from "@/lib/format";
import { manageSubscriptions } from "../akun/actions";
import { DAYS } from "../akun/RetentionPanels";

const BUDGETS = [
  { value: 100_000, label: "Mini", text: "2–3 jenis buah, pas untuk 1–2 orang" },
  { value: 150_000, label: "Keluarga", text: "3–4 jenis buah untuk keluarga kecil" },
  { value: 250_000, label: "Keluarga besar", text: "4–6 jenis buah, termasuk buah impor" },
  { value: 400_000, label: "Kantor", text: "Untuk pantry kantor / tim" },
];

export function SubscribeForm({ slots, name, addresses }: { slots: DeliverySlot[]; name: string; addresses: string[] }) {
  const router = useRouter();
  const [f, setF] = useState({
    budget: 150_000,
    custom: "",
    interval: "1",
    weekday: "6",
    slot: slots[0] ? String(slots[0].n) : "",
    name,
    address: addresses[0] ?? "",
    preferences: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const budget = f.custom ? Number(f.custom.replace(/\D/g, "")) : f.budget;
  const input = "mt-1 w-full rounded-xl border border-leaf-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-leaf-500";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const r = await manageSubscriptions("create", {
        budget_idr: budget,
        interval_weeks: f.interval,
        weekday: f.weekday,
        slot: f.slot,
        name: f.name,
        address: f.address,
        preferences: f.preferences,
      });
      if (!r.ok) return setError(r.error);
      trackEvent("generate_lead", { lead_type: "langganan", currency: "IDR", value: budget });
      router.push("/akun#langganan");
    });
  }

  return (
    <form onSubmit={submit} className="h-fit rounded-3xl bg-white p-6 ring-1 ring-leaf-100">
      <h2 className="text-xl font-extrabold text-ink">Atur langganan</h2>

      <p className="mt-4 text-sm font-medium text-ink">Budget per kiriman</p>
      <div className="mt-1.5 grid grid-cols-2 gap-2">
        {BUDGETS.map((b) => {
          const on = !f.custom && f.budget === b.value;
          return (
            <button
              key={b.value}
              type="button"
              onClick={() => setF({ ...f, budget: b.value, custom: "" })}
              className={`rounded-xl px-3 py-2 text-left ring-1 ${on ? "bg-leaf-50 ring-leaf-500" : "ring-leaf-100 hover:ring-leaf-300"}`}
            >
              <span className="block text-sm font-bold text-ink">
                {rupiah(b.value)} · {b.label}
              </span>
              <span className="text-xs text-muted">{b.text}</span>
            </button>
          );
        })}
      </div>
      <input
        value={f.custom}
        onChange={(e) => setF({ ...f, custom: e.target.value.replace(/\D/g, "") })}
        placeholder="atau budget lain, mis. 200000"
        inputMode="numeric"
        className={input}
      />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium text-ink">
          Frekuensi
          <select value={f.interval} onChange={(e) => setF({ ...f, interval: e.target.value })} className={input}>
            <option value="1">Tiap minggu</option>
            <option value="2">2 minggu sekali</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-ink">
          Hari kirim
          <select value={f.weekday} onChange={(e) => setF({ ...f, weekday: e.target.value })} className={input}>
            {DAYS.slice(1).map((d, i) => (
              <option key={d} value={i + 1}>
                {d}
              </option>
            ))}
          </select>
        </label>
      </div>
      {slots.length > 0 && (
        <label className="mt-3 block text-sm font-medium text-ink">
          Jam antar
          <select value={f.slot} onChange={(e) => setF({ ...f, slot: e.target.value })} className={input}>
            {slots.map((s) => (
              <option key={s.n} value={s.n}>
                {s.label} (berangkat ±{s.at.slice(0, 5).replace(":", ".")})
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="mt-3 block text-sm font-medium text-ink">
        Nama penerima
        <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input} autoComplete="name" />
      </label>
      <label className="mt-3 block text-sm font-medium text-ink">
        Alamat pengiriman
        {addresses.length > 1 && (
          <select value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} className={input}>
            {addresses.map((a) => (
              <option key={a} value={a}>
                {a.slice(0, 60)}
              </option>
            ))}
          </select>
        )}
        <textarea value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} rows={2} className={input} autoComplete="street-address" />
      </label>
      <label className="mt-3 block text-sm font-medium text-ink">
        Preferensi (opsional)
        <textarea
          value={f.preferences}
          onChange={(e) => setF({ ...f, preferences: e.target.value })}
          rows={2}
          placeholder="Mis. suka anggur & jeruk, tidak suka pepaya, buah potong untuk anak…"
          className={input}
        />
      </label>
      {error && <p className="mt-3 rounded-xl bg-plum-50 px-3 py-2 text-sm text-plum-700">{error}</p>}
      <button disabled={pending || budget < 50_000} className="mt-5 h-12 w-full rounded-full bg-leaf-700 font-bold text-white hover:bg-leaf-900 disabled:opacity-50">
        {pending ? "Menyimpan…" : `Mulai langganan ${rupiah(budget || 0)}`}
      </button>
      <p className="mt-2 text-center text-xs text-muted">Kiriman pertama paling cepat 2 hari lagi. Bisa dijeda atau dihentikan kapan saja.</p>
    </form>
  );
}
