"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { trackEvent } from "@/lib/analytics";
import type { DeliverySlot } from "@/lib/delivery";
import { rupiah } from "@/lib/format";
import type { SubscriptionPlan } from "@/lib/subscriptions";
import { manageSubscriptions } from "../akun/actions";
import { DAYS } from "../akun/RetentionPanels";

const KIND_UI: Record<SubscriptionPlan["kind"], { letter: string; emoji: string }> = {
  buah_utuh: { letter: "A", emoji: "🍎" },
  buah_potong: { letter: "B", emoji: "🍉" },
  jus: { letter: "C", emoji: "🧃" },
};
const AUDIENCES = [
  { key: "rumah", label: "Rumah", emoji: "🏠", text: "Keluarga di rumah" },
  { key: "sekolah", label: "Sekolah", emoji: "🏫", text: "Kantin, bekal, acara sekolah" },
  { key: "kantor", label: "Kantor", emoji: "🏢", text: "Pantry & tim kantor" },
  { key: "lainnya", label: "Lainnya", emoji: "✨", text: "Komunitas, gym, klinik…" },
] as const;
const PAX = [
  { label: "1–2 orang", value: 2 },
  { label: "3–4 orang", value: 4 },
  { label: "5–10 orang", value: 8 },
  { label: "11–20 orang", value: 15 },
  { label: "20+ orang", value: 25 },
];
const DRAFT_KEY = "healthila_sub_draft";

type Draft = {
  kind: SubscriptionPlan["kind"] | null;
  audience: string | null;
  pax: number | null;
  option: number | null;
  interval: "1" | "2";
  weekdays: number[];
  slot: string;
  name: string;
  address: string;
  preferences: string;
};

/** Recommended option for the head count: ~Rp35rb of fruit, or one box/bottle, per person. */
function recommend(plan: SubscriptionPlan, pax: number) {
  const target = plan.pricing === "budget" ? pax * 35_000 : pax;
  return plan.options.find((o) => o >= target) ?? plan.options[plan.options.length - 1] ?? null;
}

export function SubscribeWizard({
  plans,
  slots,
  loggedIn,
  name,
  addresses,
}: {
  plans: SubscriptionPlan[];
  slots: DeliverySlot[];
  loggedIn: boolean;
  name: string;
  addresses: string[];
}) {
  const router = useRouter();
  const [d, setD] = useState<Draft>({
    kind: null,
    audience: null,
    pax: null,
    option: null,
    interval: "1",
    weekdays: [6],
    slot: slots[0] ? String(slots[0].n) : "",
    name,
    address: addresses[0] ?? "",
    preferences: "",
  });
  const [customPax, setCustomPax] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  // Coming back from login: restore the choices made before.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "null") as Draft | null;
      if (saved && loggedIn) {
        sessionStorage.removeItem(DRAFT_KEY);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore after login
        setD((cur) => ({ ...saved, name: saved.name || cur.name, address: saved.address || cur.address }));
      }
    } catch {
      // storage unavailable
    }
  }, [loggedIn]);

  const plan = plans.find((p) => p.kind === d.kind) ?? null;
  const rec = plan && d.pax ? recommend(plan, d.pax) : null;
  const price = plan && d.option ? (plan.pricing === "budget" ? d.option : d.option * (plan.unit_price ?? 0)) : 0;
  const step = !d.kind ? 1 : !d.audience ? 2 : !d.pax ? 3 : !d.option ? 4 : 5;
  const set = (patch: Partial<Draft>) => setD((cur) => ({ ...cur, ...patch }));

  function toggleDay(n: number) {
    if (!plan?.multi_day || d.interval === "2") return set({ weekdays: [n] });
    const has = d.weekdays.includes(n);
    const next = has ? d.weekdays.filter((x) => x !== n) : [...d.weekdays, n].sort();
    set({ weekdays: next.length ? next : [n] });
  }

  function submit() {
    if (!plan || !d.option) return;
    setError(null);
    start(async () => {
      const r = await manageSubscriptions("create", {
        kind: plan.kind,
        audience: d.audience,
        pax: d.pax,
        ...(plan.pricing === "budget" ? { budget_idr: d.option } : { quantity: d.option }),
        interval_weeks: d.interval,
        weekdays: d.weekdays,
        slot: d.slot,
        name: d.name,
        address: d.address,
        preferences: d.preferences,
      });
      if (!r.ok) return setError(r.error);
      trackEvent("generate_lead", { lead_type: "langganan", plan: plan.kind, currency: "IDR", value: price });
      router.push("/akun#langganan");
    });
  }

  function loginFirst() {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch {
      // storage unavailable — choices are simply asked again
    }
    router.push("/masuk?next=/langganan");
  }

  const card = (on: boolean) => `rounded-2xl p-4 text-left ring-1 transition ${on ? "bg-leaf-50 ring-2 ring-leaf-600" : "bg-white ring-leaf-100 hover:ring-leaf-300"}`;
  const input = "mt-1 w-full rounded-xl border border-leaf-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-leaf-500";

  return (
    <div className="space-y-4">
      {/* 1. Jenis */}
      <Step n={1} title="Mau langganan apa?" done={!!plan} summary={plan ? `${KIND_UI[plan.kind].letter}. ${plan.title}` : null} onEdit={() => set({ kind: null, option: null })}>
        <div className="grid gap-3 sm:grid-cols-3">
          {plans.map((p) => (
            <button
              key={p.kind}
              type="button"
              disabled={!p.available}
              onClick={() => set({ kind: p.kind, option: null, weekdays: d.weekdays.slice(0, p.multi_day ? 7 : 1) })}
              className={`${card(d.kind === p.kind)} disabled:cursor-not-allowed disabled:opacity-55`}
            >
              <span className="text-3xl">{KIND_UI[p.kind].emoji}</span>
              <span className="mt-2 block font-bold text-ink">
                {KIND_UI[p.kind].letter}. {p.title}
              </span>
              <span className="mt-1 block text-xs leading-snug text-muted">{p.description}</span>
              <span className="mt-2 block text-xs font-semibold text-leaf-700">
                {!p.available
                  ? "Segera hadir"
                  : p.pricing === "budget"
                    ? `mulai ${rupiah(Math.min(...p.options))}/kiriman`
                    : `${rupiah(p.unit_price ?? 0)}/${p.unit_label}`}
              </span>
            </button>
          ))}
        </div>
      </Step>

      {/* 2. Untuk */}
      {step >= 2 && (
        <Step
          n={2}
          title="Untuk siapa?"
          done={!!d.audience}
          summary={AUDIENCES.find((a) => a.key === d.audience)?.label ?? null}
          onEdit={() => set({ audience: null })}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {AUDIENCES.map((a) => (
              <button key={a.key} type="button" onClick={() => set({ audience: a.key })} className={card(d.audience === a.key)}>
                <span className="text-2xl">{a.emoji}</span>
                <span className="mt-1 block font-bold text-ink">{a.label}</span>
                <span className="text-xs text-muted">{a.text}</span>
              </button>
            ))}
          </div>
        </Step>
      )}

      {/* 3. Pax */}
      {step >= 3 && (
        <Step n={3} title="Untuk berapa orang (pax)?" done={!!d.pax} summary={d.pax ? `${d.pax} pax` : null} onEdit={() => set({ pax: null, option: null })}>
          <div className="flex flex-wrap gap-2">
            {PAX.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => set({ pax: p.value, option: null })}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink ring-1 ring-leaf-100 hover:ring-leaf-500"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={customPax}
              onChange={(e) => setCustomPax(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="atau tulis jumlahnya, mis. 30"
              inputMode="numeric"
              className="h-10 flex-1 rounded-xl border border-leaf-100 bg-white px-3 text-sm outline-none focus:border-leaf-500"
            />
            <button
              type="button"
              disabled={!Number(customPax)}
              onClick={() => set({ pax: Number(customPax), option: null })}
              className="h-10 rounded-xl bg-leaf-700 px-4 text-sm font-bold text-white disabled:opacity-50"
            >
              Lanjut
            </button>
          </div>
        </Step>
      )}

      {/* 4. Paket */}
      {step >= 4 && plan && (
        <Step
          n={4}
          title={plan.pricing === "budget" ? "Pilih budget per kiriman" : `Berapa ${plan.unit_label} per kiriman?`}
          done={!!d.option}
          summary={d.option ? (plan.pricing === "budget" ? rupiah(d.option) : `${d.option} ${plan.unit_label} · ${rupiah(price)}`) : null}
          onEdit={() => set({ option: null })}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {plan.options.map((o) => {
              const total = plan.pricing === "budget" ? o : o * (plan.unit_price ?? 0);
              return (
                <button key={o} type="button" onClick={() => set({ option: o })} className={`relative ${card(d.option === o)}`}>
                  {o === rec && (
                    <span className="absolute -top-2 right-2 rounded-full bg-sun-400 px-2 py-0.5 text-[10px] font-bold text-leaf-900">Disarankan</span>
                  )}
                  <span className="block font-bold text-ink">{plan.pricing === "budget" ? rupiah(o) : `${o} ${plan.unit_label}`}</span>
                  <span className="text-xs text-muted">{plan.pricing === "budget" ? "per kiriman" : `${rupiah(total)} per kiriman`}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-muted">Saran berdasarkan {d.pax} pax. Ongkir dihitung per kiriman sesuai alamat.</p>
        </Step>
      )}

      {/* 5. Jadwal & data */}
      {step >= 5 && plan && (
        <Step n={5} title="Jadwal & pengiriman" done={false} summary={null}>
          {!(plan.multi_day && d.weekdays.length > 1) && (
            <label className="block text-sm font-medium text-ink">
              Frekuensi
              <select
                value={d.interval}
                onChange={(e) => set({ interval: e.target.value as "1" | "2", weekdays: d.weekdays.slice(0, 1) })}
                className={input}
              >
                <option value="1">Tiap minggu</option>
                <option value="2">2 minggu sekali</option>
              </select>
            </label>
          )}
          <p className="mt-3 text-sm font-medium text-ink">
            Hari kirim{plan.multi_day && d.interval === "1" ? " (boleh pilih beberapa)" : ""}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {DAYS.slice(1).map((day, i) => {
              const n = i + 1;
              const on = d.weekdays.includes(n);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(n)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${on ? "bg-leaf-700 text-white ring-leaf-700" : "bg-white text-ink ring-leaf-100"}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          {slots.length > 0 && (
            <label className="mt-3 block text-sm font-medium text-ink">
              Jam antar
              <select value={d.slot} onChange={(e) => set({ slot: e.target.value })} className={input}>
                {slots.map((s) => (
                  <option key={s.n} value={s.n}>
                    {s.label} (berangkat ±{s.at.slice(0, 5).replace(":", ".")})
                  </option>
                ))}
              </select>
            </label>
          )}
          {loggedIn ? (
            <>
              <label className="mt-3 block text-sm font-medium text-ink">
                Nama penerima
                <input value={d.name} onChange={(e) => set({ name: e.target.value })} className={input} autoComplete="name" />
              </label>
              <label className="mt-3 block text-sm font-medium text-ink">
                Alamat pengiriman
                {addresses.length > 1 && (
                  <select value={d.address} onChange={(e) => set({ address: e.target.value })} className={input}>
                    {addresses.map((a) => (
                      <option key={a} value={a}>
                        {a.slice(0, 60)}
                      </option>
                    ))}
                  </select>
                )}
                <textarea value={d.address} onChange={(e) => set({ address: e.target.value })} rows={2} className={input} autoComplete="street-address" />
              </label>
              <label className="mt-3 block text-sm font-medium text-ink">
                Preferensi (opsional)
                <textarea
                  value={d.preferences}
                  onChange={(e) => set({ preferences: e.target.value })}
                  rows={2}
                  placeholder="Mis. suka anggur & jeruk, tidak suka pepaya, jus tanpa jahe…"
                  className={input}
                />
              </label>
              {error && <p className="mt-3 rounded-xl bg-plum-50 px-3 py-2 text-sm text-plum-700">{error}</p>}
              <button
                type="button"
                disabled={pending}
                onClick={submit}
                className="mt-5 h-12 w-full rounded-full bg-leaf-700 font-bold text-white hover:bg-leaf-900 disabled:opacity-50"
              >
                {pending ? "Menyimpan…" : `Mulai langganan · ${rupiah(price)}/kiriman`}
              </button>
              <p className="mt-2 text-center text-xs text-muted">Kiriman pertama paling cepat 2 hari lagi. Bisa dijeda atau dihentikan kapan saja.</p>
            </>
          ) : (
            <div className="mt-5 rounded-2xl bg-leaf-50 p-4 text-center">
              <p className="text-sm text-ink">Satu langkah lagi — masuk dengan nomor WhatsApp supaya Kakak bisa mengatur langganan sendiri.</p>
              <button type="button" onClick={loginFirst} className="mt-3 h-12 w-full rounded-full bg-leaf-700 font-bold text-white hover:bg-leaf-900">
                Masuk & lanjutkan
              </button>
              <p className="mt-2 text-xs text-muted">Pilihan Kakak tersimpan, tidak perlu mengulang.</p>
            </div>
          )}
        </Step>
      )}

      <p className="text-center text-xs text-muted">
        Butuh untuk acara atau jumlah besar?{" "}
        <Link href="/korporat" className="font-semibold text-leaf-700 underline">
          Pesanan korporat
        </Link>
      </p>
    </div>
  );
}

function Step({
  n,
  title,
  done,
  summary,
  onEdit,
  children,
}: {
  n: number;
  title: string;
  done: boolean;
  summary: string | null;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-5 ring-1 ring-leaf-100 sm:p-6">
      <div className="flex items-center gap-3">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${done ? "bg-leaf-700 text-white" : "bg-leaf-50 text-leaf-700"}`}>
          {done ? "✓" : n}
        </span>
        <h2 className="flex-1 text-lg font-bold text-ink">{title}</h2>
        {done && summary && (
          <>
            <span className="hidden text-sm font-semibold text-leaf-700 sm:inline">{summary}</span>
            {onEdit && (
              <button type="button" onClick={onEdit} className="text-xs text-muted underline hover:text-ink">
                ubah
              </button>
            )}
          </>
        )}
      </div>
      {done && summary && <p className="mt-1 pl-11 text-sm font-semibold text-leaf-700 sm:hidden">{summary}</p>}
      {!done && <div className="mt-4">{children}</div>}
    </section>
  );
}
