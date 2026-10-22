"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { rupiah } from "@/lib/format";
import { manageReminders, manageSubscriptions, type Reminder, type Subscription } from "./actions";

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
export const DAYS = ["", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
export const SLOTS = ["", "Pagi", "Siang", "Sore"];
const input = "h-10 rounded-xl border border-leaf-100 bg-white px-3 text-sm outline-none focus:border-leaf-500";

/** Saved dates → WhatsApp nudge 3 days before ("Ulang tahun Mama, 14 Mei"). */
export function RemindersPanel({ initial }: { initial: Reminder[] }) {
  const [rows, setRows] = useState(initial);
  const [form, setForm] = useState({ label: "", recipient: "", month: "", day: "" });
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const run = (fn: () => ReturnType<typeof manageReminders>, after?: () => void) =>
    start(async () => {
      setError(null);
      const r = await fn();
      if (r.ok) {
        setRows(r.data);
        after?.();
      } else setError(r.error);
    });

  return (
    <section id="pengingat" className="mt-10 scroll-mt-24">
      <h2 className="text-lg font-bold text-ink">Pengingat momen</h2>
      <p className="mt-1 text-sm text-muted">
        Simpan tanggal penting — ulang tahun, anniversary, hari raya. Kami kirim pengingat via WhatsApp 3 hari sebelumnya, supaya parcelnya tidak terlambat.
      </p>
      {rows.length > 0 && (
        <ul className="mt-4 space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-leaf-100">
              <span>
                <b className="text-ink">{r.label}</b>
                {r.recipient ? <span className="text-muted"> · {r.recipient}</span> : null}
                <span className="ml-2 text-muted">
                  🎂 {r.day} {MONTHS[r.month - 1]}
                </span>
              </span>
              <button type="button" disabled={pending} onClick={() => run(() => manageReminders("delete", { id: r.id }))} className="text-xs text-plum-700 underline">
                hapus
              </button>
            </li>
          ))}
        </ul>
      )}
      <form
        className="mt-4 grid gap-2 rounded-2xl bg-leaf-50 p-4 sm:grid-cols-[1.4fr_1fr_0.6fr_1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          run(
            () => manageReminders("add", { label: form.label, recipient: form.recipient, month: form.month, day: form.day }),
            () => setForm({ label: "", recipient: "", month: "", day: "" }),
          );
        }}
      >
        <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Momen, mis. Ulang tahun Mama" className={input} maxLength={60} />
        <input value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} placeholder="Untuk siapa (opsional)" className={input} maxLength={60} />
        <input value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value.replace(/\D/g, "").slice(0, 2) })} placeholder="Tgl" inputMode="numeric" className={input} />
        <select value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} className={input}>
          <option value="">Bulan</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <button disabled={pending || !form.label || !form.day || !form.month} className="h-10 rounded-xl bg-leaf-700 px-4 text-sm font-bold text-white disabled:opacity-50">
          Simpan
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-plum-700">{error}</p>}
    </section>
  );
}

export function SubscriptionsPanel({ initial }: { initial: Subscription[] }) {
  const [rows, setRows] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const act = (action: "pause" | "resume" | "cancel", id: string) =>
    start(async () => {
      setError(null);
      const r = await manageSubscriptions(action, { id });
      if (r.ok) setRows(r.data);
      else setError(r.error);
    });

  return (
    <section id="langganan" className="mt-10 scroll-mt-24">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-lg font-bold text-ink">Langganan buah</h2>
        <Link href="/langganan" className="text-sm font-semibold text-leaf-700 hover:underline">
          + Langganan baru
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-muted">
          Belum ada. Buah segar diantar rutin tiap minggu sesuai budget —{" "}
          <Link href="/langganan" className="font-semibold text-leaf-700 underline">
            lihat paket langganan
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((s) => (
            <li key={s.id} className="rounded-2xl bg-white p-4 text-sm ring-1 ring-leaf-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <b className="text-ink">
                  Paket {rupiah(s.budget_idr)} · {s.interval_weeks === 2 ? "2 minggu sekali" : "tiap minggu"}
                </b>
                <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${s.status === "active" ? "bg-lime-100 text-leaf-900" : "bg-sun-300/40 text-ink"}`}>
                  {s.status === "active" ? "Aktif" : "Dijeda"}
                </span>
              </div>
              <p className="mt-1 text-muted">
                Tiap {DAYS[s.weekday]}
                {s.slot ? ` ${SLOTS[s.slot].toLowerCase()}` : ""} · {s.code}
                {s.status === "active" && (
                  <>
                    {" "}
                    · kirim berikutnya{" "}
                    <b className="text-ink">{new Date(s.next_date + "T00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}</b>
                  </>
                )}
              </p>
              {s.preferences && <p className="mt-1 text-xs text-muted">🍎 {s.preferences}</p>}
              <div className="mt-3 flex gap-2 text-xs">
                {s.status === "active" ? (
                  <button type="button" disabled={pending} onClick={() => act("pause", s.id)} className="rounded-full border border-leaf-200 px-3 py-1 font-semibold">
                    Jeda dulu
                  </button>
                ) : (
                  <button type="button" disabled={pending} onClick={() => act("resume", s.id)} className="rounded-full bg-leaf-700 px-3 py-1 font-semibold text-white">
                    Lanjutkan
                  </button>
                )}
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => confirm("Berhenti berlangganan?") && act("cancel", s.id)}
                  className="rounded-full px-3 py-1 text-plum-700 underline"
                >
                  Berhenti
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-2 text-sm text-plum-700">{error}</p>}
    </section>
  );
}
