"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { rupiah } from "@/lib/format";
import { durationLabel } from "@/lib/subscription-pricing";
import { manageReminders, manageSubscriptions, type Reminder, type Subscription } from "./actions";
import { Cake } from "lucide-react";

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
                  <Cake className="mr-1 inline h-4 w-4 align-[-3px]" />
                  {r.day} {MONTHS[r.month - 1]}
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
          {rows.map((s) =>
            s.schedule && s.quote ? (
              <ScheduledSubscription key={s.id} s={s} pending={pending} onCancel={() => confirm("Batalkan langganan ini? Pengiriman yang belum dibuat tidak akan dikirim.") && act("cancel", s.id)} />
            ) : (
            <li key={s.id} className="rounded-2xl bg-white p-4 text-sm ring-1 ring-leaf-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <b className="text-ink">
                  {s.title ?? "Langganan"}
                  {s.quantity && !s.items ? ` ${s.quantity} ${s.unit_label ?? ""}` : ""} · {rupiah(s.budget_idr)}/kiriman
                </b>
                <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${s.status === "active" ? "bg-lime-100 text-leaf-900" : "bg-sun-300/40 text-ink"}`}>
                  {s.status === "active" ? "Aktif" : "Dijeda"}
                </span>
              </div>
              <p className="mt-1 text-muted">
                {s.interval_weeks === 2 ? "2 minggu sekali, " : "Tiap "}
                {(s.weekdays?.length ? s.weekdays : [s.weekday]).map((d) => DAYS[d]).join(", ")}
                {s.slot ? ` ${SLOTS[s.slot].toLowerCase()}` : ""}
                {s.audience ? ` · ${s.audience}` : ""}
                {s.pax ? ` · ${s.pax} pax` : ""} · {s.code}
                {s.status === "active" && (
                  <>
                    {" "}
                    · kirim berikutnya{" "}
                    <b className="text-ink">{new Date(s.next_date + "T00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}</b>
                  </>
                )}
              </p>
              {s.items && <p className="mt-1 text-xs text-muted">{s.items.map((i) => `${i.qty}× ${i.name}`).join(" · ")}</p>}
              {s.preferences && <p className="mt-1 text-xs text-muted">Preferensi: {s.preferences}</p>}
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
            ),
          )}
        </ul>
      )}
      {error && <p className="mt-2 text-sm text-plum-700">{error}</p>}
    </section>
  );
}

/** Fixed-duration juice subscription (tier pricing): deliveries are planned up front, no pause. */
function ScheduledSubscription({ s, pending, onCancel }: { s: Subscription; pending: boolean; onCancel: () => void }) {
  const q = s.quote!;
  const short = (d: string) => new Date(d + "T00:00").toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
  return (
    <li className="rounded-2xl bg-white p-4 text-sm ring-1 ring-leaf-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <b className="text-ink">
          {s.title ?? "Langganan Jus"} · {q.total_bottles} botol · {durationLabel(q.duration_days)}
        </b>
        <span className="rounded-full bg-lime-100 px-3 py-0.5 text-xs font-bold text-leaf-900">Aktif</span>
      </div>
      <p className="mt-1 text-muted">
        {q.people} orang × {q.bottles_per_day} botol/kiriman · {q.deliveries}× kirim{s.slot ? ` ${SLOTS[s.slot].toLowerCase()}` : ""} · {s.code}
      </p>
      {s.items && <p className="mt-1 text-xs text-muted">{s.items.map((i) => `${i.qty}× ${i.name.replace(/^Cold-pressed Juice - Healthila \((.*)\)$/, "$1")}`).join(" · ")}</p>}
      <ul className="mt-2 space-y-0.5 text-xs">
        {s.schedule!.map((e, i) => (
          <li key={e.date} className={`flex justify-between gap-3 ${e.order_id ? "text-muted line-through decoration-leaf-300" : "text-ink"}`}>
            <span>
              {i + 1}. {short(e.date)} · {e.bottles} botol
            </span>
            <span>{e.order_id ? "dijadwalkan" : "menunggu"}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted">
        Produk {rupiah(q.product_total)} (hemat {rupiah(q.savings)}, diskon {Math.round(q.rate * 1000) / 10}%) · ongkir{" "}
        {q.shipping_total == null ? "dikonfirmasi admin" : rupiah(q.shipping_total)} · <b className="text-ink">total {rupiah(q.payable)}</b>
      </p>
      <div className="mt-3 flex gap-2 text-xs">
        <button type="button" disabled={pending} onClick={onCancel} className="rounded-full px-3 py-1 text-plum-700 underline">
          Batalkan
        </button>
      </div>
    </li>
  );
}
