"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Apple, Building2, CupSoda, House, type LucideIcon, Minus, Plus, Salad, School, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { DynIcon } from "@/lib/icons";
import type { DeliverySlot } from "@/lib/delivery";
import { rupiah } from "@/lib/format";
import type { SubscriptionItem, SubscriptionPlan } from "@/lib/subscriptions";
import { manageSubscriptions } from "../akun/actions";
import { DAYS } from "../akun/RetentionPanels";
import { emptyTier, JuiceTierSteps, type TierDraft } from "./JuiceTierSteps";
import { Step } from "./Step";

const KIND_UI: Record<SubscriptionPlan["kind"], { letter: string; icon: LucideIcon }> = {
  buah_utuh: { letter: "A", icon: Apple },
  buah_potong: { letter: "B", icon: Salad },
  jus: { letter: "C", icon: CupSoda },
};
const AUDIENCES = [
  { key: "rumah", label: "Rumah", icon: House, text: "Keluarga di rumah" },
  { key: "sekolah", label: "Sekolah", icon: School, text: "Kantin, bekal, acara sekolah" },
  { key: "kantor", label: "Kantor", icon: Building2, text: "Pantry & tim kantor" },
  { key: "lainnya", label: "Lainnya", icon: Sparkles, text: "Komunitas, gym, klinik…" },
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
  /** Catalog plans: item id → quantity per delivery. */
  picks: Record<string, number>;
  picksDone: boolean;
  interval: "1" | "2";
  weekdays: number[];
  slot: string;
  name: string;
  address: string;
  preferences: string;
  /** 'tier' plans (juice): people, bottles, duration, flavours, cadence. */
  tier: TierDraft;
};

/** Recommended option for the head count: ~Rp35rb of fruit, or one box/bottle, per person. */
function recommend(plan: SubscriptionPlan, pax: number) {
  const target = plan.pricing === "budget" ? pax * 35_000 : pax;
  return plan.options.find((o) => o >= target) ?? plan.options[plan.options.length - 1] ?? null;
}

export function SubscribeWizard({
  plans,
  items,
  slots,
  loggedIn,
  name,
  addresses,
}: {
  plans: SubscriptionPlan[];
  items: SubscriptionItem[];
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
    picks: {},
    picksDone: false,
    interval: "1",
    weekdays: [6],
    slot: slots[0] ? String(slots[0].n) : "",
    name,
    address: addresses[0] ?? "",
    preferences: "",
    tier: emptyTier(),
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
        setD((cur) => ({ ...saved, tier: { ...emptyTier(), ...saved.tier }, name: saved.name || cur.name, address: saved.address || cur.address }));
      }
    } catch {
      // storage unavailable
    }
  }, [loggedIn]);

  const plan = plans.find((p) => p.kind === d.kind) ?? null;
  const catalog = plan?.pricing === "catalog";
  const tier = plan?.pricing === "tier";
  const planItems = items.filter((i) => i.plan_kind === d.kind);
  const picked = planItems.filter((i) => (d.picks[i.id] ?? 0) > 0);
  const units = picked.reduce((n, i) => n + d.picks[i.id], 0);
  const catalogTotal = picked.reduce((n, i) => n + d.picks[i.id] * (i.sub_price ?? 0), 0);
  const catalogNormal = picked.reduce((n, i) => n + d.picks[i.id] * (i.normal_price ?? i.sub_price ?? 0), 0);
  const rec = plan && d.pax && !catalog ? recommend(plan, d.pax) : null;
  const price = catalog ? catalogTotal : plan && d.option ? (plan.pricing === "budget" ? d.option : d.option * (plan.unit_price ?? 0)) : 0;
  const packageDone = catalog ? d.picksDone && units > 0 : !!d.option;
  const step = !d.kind ? 1 : !d.audience ? 2 : tier ? 3 : !d.pax ? 3 : !packageDone ? 4 : 5;
  const setQty = (id: string, q: number) =>
    setD((cur) => ({ ...cur, picks: { ...cur.picks, [id]: Math.max(0, Math.min(99, q)) } }));
  const set = (patch: Partial<Draft>) => setD((cur) => ({ ...cur, ...patch }));
  const setTier = (patch: Partial<TierDraft>) => setD((cur) => ({ ...cur, tier: { ...cur.tier, ...patch } }));

  function toggleDay(n: number) {
    if (!plan?.multi_day || d.interval === "2") return set({ weekdays: [n] });
    const has = d.weekdays.includes(n);
    const next = has ? d.weekdays.filter((x) => x !== n) : [...d.weekdays, n].sort();
    set({ weekdays: next.length ? next : [n] });
  }

  function submit() {
    if (!plan || !packageDone) return;
    setError(null);
    start(async () => {
      const r = await manageSubscriptions("create", {
        kind: plan.kind,
        audience: d.audience,
        pax: d.pax,
        ...(catalog
          ? { items: picked.map((i) => ({ item_id: i.id, qty: d.picks[i.id] })) }
          : plan.pricing === "budget"
            ? { budget_idr: d.option }
            : { quantity: d.option }),
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
      <Step n={1} title="Mau langganan apa?" done={!!plan} summary={plan ? `${KIND_UI[plan.kind].letter}. ${plan.title}` : null} onEdit={() => set({ kind: null, option: null, picks: {}, picksDone: false, tier: emptyTier() })}>
        <div className="grid gap-3 sm:grid-cols-3">
          {plans.map((p) => (
            <button
              key={p.kind}
              type="button"
              disabled={!p.available}
              onClick={() => set({ kind: p.kind, option: null, picks: {}, picksDone: false, tier: emptyTier(), weekdays: d.weekdays.slice(0, p.multi_day ? 7 : 1) })}
              className={`${card(d.kind === p.kind)} disabled:cursor-not-allowed disabled:opacity-55`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-leaf-50 text-leaf-700">
                <DynIcon icon={KIND_UI[p.kind].icon} className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <span className="mt-2 block font-bold text-ink">
                {KIND_UI[p.kind].letter}. {p.title}
              </span>
              <span className="mt-1 block text-xs leading-snug text-muted">{p.description}</span>
              <span className="mt-2 block text-xs font-semibold text-leaf-700">
                {!p.available
                  ? "Segera hadir"
                  : p.pricing === "budget"
                    ? `mulai ${rupiah(Math.min(...p.options))}/kiriman`
                    : p.pricing === "tier"
                      ? `hemat hingga ${Math.round(Math.max(0, ...p.tiers.map((t) => t.rate)) * 100)}% sesuai jumlah botol`
                      : p.pricing === "catalog"
                      ? `mulai ${rupiah(Math.min(...items.filter((i) => i.plan_kind === p.kind).map((i) => i.sub_price ?? Infinity)))}/${p.unit_label}`
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
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-50 text-leaf-700">
                  <DynIcon icon={a.icon} className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span className="mt-1 block font-bold text-ink">{a.label}</span>
                <span className="text-xs text-muted">{a.text}</span>
              </button>
            ))}
          </div>
        </Step>
      )}

      {step >= 3 && plan && tier && (
        <JuiceTierSteps
          plan={plan}
          items={items}
          slots={slots}
          audience={d.audience}
          loggedIn={loggedIn}
          t={d.tier}
          setT={setTier}
          name={d.name}
          address={d.address}
          preferences={d.preferences}
          slot={d.slot}
          addresses={addresses}
          setContact={set}
          onLogin={loginFirst}
        />
      )}

      {/* 3. Pax */}
      {step >= 3 && !tier && (
        <Step n={3} title="Untuk berapa orang (pax)?" done={!!d.pax} summary={d.pax ? `${d.pax} pax` : null} onEdit={() => set({ pax: null, option: null, picksDone: false })}>
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
      {step >= 4 && plan && catalog && !tier && (
        <Step
          n={4}
          title={`Pilih ${plan.unit_label === "botol" ? "jus" : "produk"} per kiriman`}
          done={packageDone}
          summary={packageDone ? `${units} ${plan.unit_label} · ${rupiah(catalogTotal)}` : null}
          onEdit={() => set({ picksDone: false })}
        >
          <p className="mb-3 text-sm text-muted">
            Harga langganan sudah lebih hemat dari harga satuan. Saran untuk {d.pax} pax: ±{d.pax} {plan.unit_label} per kiriman.
          </p>
          <ul className="divide-y divide-leaf-100 rounded-2xl ring-1 ring-leaf-100">
            {planItems.map((i) => {
              const q = d.picks[i.id] ?? 0;
              return (
                <li key={i.id} className="flex items-center gap-3 p-3">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-leaf-50">
                    {i.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- catalog photo (Supabase storage)
                      <img src={i.photo} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <CupSoda className="m-auto mt-3.5 h-7 w-7 text-leaf-700" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{i.variant ?? i.name}</span>
                    {i.variant && <span className="block truncate text-xs text-muted">{i.name}</span>}
                    <span className="text-sm">
                      <b className="text-leaf-700">{rupiah(i.sub_price)}</b>
                      {i.normal_price && i.sub_price != null && i.normal_price > i.sub_price && <span className="ml-1.5 text-xs text-muted line-through">{rupiah(i.normal_price)}</span>}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setQty(i.id, q - 1)}
                      disabled={q === 0}
                      aria-label="Kurangi"
                      className="flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-leaf-200 disabled:opacity-30"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-7 text-center font-bold text-ink">{q}</span>
                    <button
                      type="button"
                      onClick={() => setQty(i.id, q + 1)}
                      aria-label="Tambah"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-700 text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-leaf-50 px-4 py-3">
            <span className="text-sm text-ink">
              {units} {plan.unit_label} · <b>{rupiah(catalogTotal)}</b>/kiriman
              {catalogNormal > catalogTotal && <span className="ml-2 text-xs font-semibold text-leaf-700">hemat {rupiah(catalogNormal - catalogTotal)}</span>}
            </span>
            <button
              type="button"
              disabled={units === 0}
              onClick={() => set({ picksDone: true })}
              className="h-10 rounded-full bg-leaf-700 px-5 text-sm font-bold text-white disabled:opacity-50"
            >
              Lanjut
            </button>
          </div>
        </Step>
      )}

      {step >= 4 && plan && !catalog && !tier && (
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
      {step >= 5 && plan && !tier && (
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
