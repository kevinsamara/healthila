"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { CircleAlert, CupSoda, Leaf, Minus, Plus, Shuffle, Truck } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { jakartaNow, type DeliverySlot } from "@/lib/delivery";
import {
  DEFAULT_WEEKDAYS,
  deliveryDatesFor,
  type Flavor,
  FREQUENCIES,
  type Frequency,
  formatIDR,
  isoWeekday,
  durationLabel,
  packageLabel,
  quoteSubscription,
  tierRate,
} from "@/lib/subscription-pricing";
import type { SubscriptionItem, SubscriptionPlan } from "@/lib/subscriptions";
import { createJuiceSubscription } from "../akun/actions";
import { useOngkir } from "../keranjang/useOngkir";
import { Step } from "./Step";

/** Choices of the juice (tier) wizard; kept in the draft so login doesn't lose them. */
export type TierDraft = {
  people: number | null;
  perDay: number | null;
  days: number | null;
  category: "cold_pressed" | "regular" | null;
  configDone: boolean;
  picks: Record<string, number>;
  picksDone: boolean;
  freq: Frequency | null;
  /** ISO weekdays for "N× seminggu". */
  weekdays: number[];
  /** Dates picked on the calendar ("Atur tanggal sendiri"). */
  custom: string[];
  start: string;
};

export const emptyTier = (): TierDraft => ({
  people: null,
  perDay: null,
  days: null,
  category: null,
  configDone: false,
  picks: {},
  picksDone: false,
  freq: null,
  weekdays: [],
  custom: [],
  start: "",
});

const CATEGORIES = [
  { key: "cold_pressed", label: "Cold-pressed", text: "Tanpa gula & air tambahan, diperas dingin" },
  { key: "regular", label: "Jus reguler", text: "Jus buah segar favorit (alpukat, jambu, mangga)" },
] as const;

const addDays = (date: string, n: number) => {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const longDate = (date: string) =>
  new Date(date + "T00:00:00").toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const WD = ["", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const freqLabel = (f: Frequency | null) => FREQUENCIES.find((x) => x.key === f)?.label ?? "-";

export function JuiceTierSteps({
  plan,
  items,
  slots,
  audience,
  loggedIn,
  t,
  setT,
  name,
  address,
  preferences,
  slot,
  addresses,
  setContact,
  onLogin,
}: {
  plan: SubscriptionPlan;
  items: SubscriptionItem[];
  slots: DeliverySlot[];
  audience: string | null;
  loggedIn: boolean;
  t: TierDraft;
  setT: (patch: Partial<TierDraft>) => void;
  name: string;
  address: string;
  preferences: string;
  slot: string;
  addresses: string[];
  setContact: (patch: { name?: string; address?: string; preferences?: string; slot?: string }) => void;
  onLogin: () => void;
}) {
  const router = useRouter();
  const [customPeople, setCustomPeople] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const ongkir = useOngkir(loggedIn ? address : "");

  const today = jakartaNow().date;
  const minStart = addDays(today, 1);
  const startDate = t.start && t.start >= minStart ? t.start : addDays(today, 2);
  const tiers = plan.tiers.length ? plan.tiers : undefined;

  const flavors: Flavor[] = useMemo(
    () =>
      items
        .filter((i) => i.plan_kind === plan.kind && i.normal_price != null)
        .map((i) => ({ id: i.id, name: i.variant ?? i.name, price: i.normal_price!, category: i.category ?? "regular", available: i.in_stock })),
    [items, plan.kind],
  );
  const byId = new Map(items.map((i) => [i.id, i]));
  const categories = CATEGORIES.filter((c) => flavors.some((f) => f.category === c.key));
  const shown = flavors.filter((f) => f.category === t.category);

  // Delivery frequency → concrete dates; "N× seminggu" starts on the first chosen weekday.
  const perWeek = FREQUENCIES.find((f) => f.key === t.freq)?.perWeek;
  const weekdays = perWeek ? (t.weekdays.length ? t.weekdays : DEFAULT_WEEKDAYS[perWeek]) : [];
  const dates = t.freq && t.days ? deliveryDatesFor(t.freq, startDate, t.days, { weekdays, custom: t.custom }) : [];
  const firstDate = dates[0] ?? startDate;
  const freqOptions = FREQUENCIES.filter((f) => (t.days ?? 0) >= f.minDays);
  const freqOk = !!t.freq && freqOptions.some((f) => f.key === t.freq) && dates.length > 0 && (!perWeek || weekdays.length === perWeek);

  // Total = people × bottles per person per delivery × deliveries.
  const perShipment = (t.people ?? 0) * (t.perDay ?? 0);
  const total = perShipment * dates.length;
  const quote = quoteSubscription({
    people: t.people ?? 0,
    bottlesPerDelivery: t.perDay ?? 0,
    days: t.days ?? 0,
    deliveryDates: dates,
    category: t.category ?? "",
    picks: t.picks,
    flavors,
    tiers,
    shippingPerDelivery: ongkir.fee,
    startDate: firstDate,
  });
  const selected = quote.selectedBottles;
  const nextTier = (tiers ?? []).filter((x) => x.min > total).sort((a, b) => a.min - b.min)[0];

  const configDone = t.configDone && !!t.people && !!t.perDay && !!t.days && !!t.category && freqOk;
  const picksDone = configDone && t.picksDone && quote.errors.length === 0;
  const step = !t.people ? 3 : !configDone ? 4 : !picksDone ? 5 : 6;
  const setQty = (id: string, q: number) => setT({ picks: { ...t.picks, [id]: Math.max(0, Math.min(total, q)) } });

  /** Spread the bottles evenly over the available flavours of the category. */
  function autoFill() {
    const avail = shown.filter((f) => f.available);
    if (!avail.length) return;
    const picks: Record<string, number> = {};
    avail.forEach((f, i) => (picks[f.id] = Math.floor(total / avail.length) + (i < total % avail.length ? 1 : 0)));
    setT({ picks });
  }

  function submit() {
    if (!t.people || !t.perDay || !t.days || !t.category || quote.errors.length) return;
    setError(null);
    start(async () => {
      const r = await createJuiceSubscription({
        kind: plan.kind,
        audience,
        people: t.people!,
        bottles_per_delivery: t.perDay!,
        duration_days: t.days!,
        frequency: t.freq!,
        dates,
        category: t.category!,
        items: Object.entries(t.picks)
          .filter(([, q]) => q > 0)
          .map(([item_id, qty]) => ({ item_id, qty })),
        start_date: firstDate,
        slot,
        name,
        address,
        preferences,
      });
      if (!r.ok) return setError(r.error);
      trackEvent("generate_lead", { lead_type: "langganan", plan: plan.kind, currency: "IDR", value: r.data?.[0]?.quote?.payable ?? quote.payable });
      router.push("/akun#langganan");
    });
  }

  const card = (on: boolean) => `rounded-2xl p-4 text-left ring-1 transition ${on ? "bg-leaf-50 ring-2 ring-leaf-600" : "bg-white ring-leaf-100 hover:ring-leaf-300"}`;
  const chip = (on: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${on ? "bg-leaf-700 text-white ring-leaf-700" : "bg-white text-ink ring-leaf-100 hover:ring-leaf-500"}`;
  const input = "mt-1 w-full rounded-xl border border-leaf-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-leaf-500";

  return (
    <>
      {/* 3. Orang */}
      <Step n={3} title="Untuk berapa orang?" done={!!t.people} summary={t.people ? `${t.people} orang` : null} onEdit={() => setT({ people: null, configDone: false, picksDone: false })}>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((n) => (
            <button key={n} type="button" onClick={() => setT({ people: n })} className={chip(t.people === n)}>
              {n} orang
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={customPeople}
            onChange={(e) => setCustomPeople(e.target.value.replace(/\D/g, "").slice(0, 3))}
            placeholder="Lebih dari 3? tulis jumlahnya, mis. 6"
            inputMode="numeric"
            className="h-10 flex-1 rounded-xl border border-leaf-100 bg-white px-3 text-sm outline-none focus:border-leaf-500"
          />
          <button
            type="button"
            disabled={!(Number(customPeople) >= 1 && Number(customPeople) <= 100)}
            onClick={() => setT({ people: Number(customPeople) })}
            className="h-10 rounded-xl bg-leaf-700 px-4 text-sm font-bold text-white disabled:opacity-50"
          >
            Lanjut
          </button>
        </div>
      </Step>

      {/* 4. Paket */}
      {step >= 4 && t.people && (
        <Step
          n={4}
          title="Atur paket botol"
          done={configDone}
          summary={configDone ? `${packageLabel(t.people, t.perDay!)} · ${durationLabel(t.days!)} · ${freqLabel(t.freq)} · ${total} botol` : null}
          onEdit={() => setT({ configDone: false, picksDone: false })}
        >
          <p className="text-sm font-medium text-ink">Botol per orang setiap kiriman</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {[1, 2, 3].map((n) => (
              <button key={n} type="button" onClick={() => setT({ perDay: n, picksDone: false })} className={chip(t.perDay === n)}>
                {n} botol
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm font-medium text-ink">Durasi langganan</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {plan.durations.map((n) => (
              <button key={n} type="button" onClick={() => setT({ days: n, custom: [], picksDone: false })} className={chip(t.days === n)}>
                {durationLabel(n)}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm font-medium text-ink">Frekuensi kirim</p>
          {t.days ? (
            <div className="mt-1.5 flex flex-wrap gap-2">
              {freqOptions.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setT({ freq: f.key, weekdays: f.perWeek ? DEFAULT_WEEKDAYS[f.perWeek] : [], custom: f.key === "custom" ? dates : [] })}
                  className={chip(t.freq === f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-xs text-muted">Pilih durasi dulu.</p>
          )}
          {t.freq && t.days && (
            <>
          <label className="mt-3 block text-sm font-medium text-ink">
            Mulai tanggal
            <input
              type="date"
              value={startDate}
              min={minStart}
              max={addDays(today, 60)}
              onChange={(e) => e.target.value && setT({ start: e.target.value, custom: t.freq === "custom" ? [] : t.custom })}
              className={input}
            />
          </label>
          {perWeek && (
            <>
              <p className="mt-3 text-sm font-medium text-ink">Hari kirim (pilih {perWeek})</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => {
                  const on = weekdays.includes(n);
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        const next = on ? weekdays.filter((x) => x !== n) : [...weekdays, n].slice(-perWeek);
                        if (next.length) setT({ weekdays: next.sort((x, y) => x - y) });
                      }}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${on ? "bg-leaf-700 text-white ring-leaf-700" : "bg-white text-ink ring-leaf-100"}`}
                    >
                      {WD[n]}
                    </button>
                  );
                })}
              </div>
              {weekdays.length !== perWeek && <p className="mt-1 text-xs text-plum-700">Pilih {perWeek} hari.</p>}
            </>
          )}
          <Calendar
            from={firstDate}
            days={t.days!}
            selected={dates}
            onToggle={(d) => {
              if (d === firstDate) return;
              const next = dates.includes(d) ? dates.filter((x) => x !== d) : [...dates, d];
              setT({ freq: "custom", custom: next, start: firstDate });
            }}
          />
          <p className="mt-1 text-xs text-muted">
            Ketuk tanggal untuk menambah atau menghapus kiriman. Setiap kiriman berisi {t.people} orang × {t.perDay ?? "…"} botol.
          </p>
            </>
          )}
          <p className="mt-4 text-sm font-medium text-ink">Kategori jus</p>
          <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
            {categories.map((c) => (
              <button key={c.key} type="button" onClick={() => setT({ category: c.key, picks: {}, picksDone: false })} className={card(t.category === c.key)}>
                <span className="flex items-center gap-2 font-bold text-ink">
                  {c.key === "cold_pressed" ? <Leaf className="h-4 w-4 text-leaf-700" /> : <CupSoda className="h-4 w-4 text-leaf-700" />}
                  {c.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted">{c.text}</span>
              </button>
            ))}
          </div>

          {t.perDay && t.days && dates.length > 0 && (
            <div className="mt-4 rounded-2xl bg-leaf-50 p-4 text-sm">
              <p className="text-ink">
                <b>{packageLabel(t.people, t.perDay)}</b> — {t.people} orang × {t.perDay} botol × {dates.length} kiriman ({freqLabel(t.freq).toLowerCase()},{" "}
                {durationLabel(t.days)}) = <b>{total} botol</b>
              </p>
              <p className="mt-1 text-xs text-muted">
                Diskon langganan sesuai total botol:{" "}
                {(tiers ?? [])
                  .filter((x) => x.rate > 0)
                  .map((x) => `${x.min}+ botol ${pct(x.rate)}`)
                  .join(" · ")}
                . Paket kamu: <b className="text-leaf-700">{pct(tierRate(total, tiers))}</b>
                {nextTier && ` — tambah ${nextTier.min - total} botol lagi untuk ${pct(nextTier.rate)}`}.
              </p>
            </div>
          )}
          <button
            type="button"
            disabled={!t.perDay || !t.days || !t.category || !freqOk}
            onClick={() => setT({ configDone: true })}
            className="mt-4 h-11 w-full rounded-full bg-leaf-700 text-sm font-bold text-white disabled:opacity-50"
          >
            Lanjut pilih rasa
          </button>
        </Step>
      )}

      {/* 5. Rasa */}
      {step >= 5 && configDone && (
        <Step
          n={5}
          title={`Pilih rasa untuk ${total} botol`}
          done={picksDone}
          summary={picksDone ? `${total} botol · ${formatIDR(quote.productTotal)}` : null}
          onEdit={() => setT({ picksDone: false })}
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted">Boleh campur rasa. Harga sesuai katalog, diskon dihitung dari total botol.</p>
            <button type="button" onClick={autoFill} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-leaf-700 ring-1 ring-leaf-200">
              <Shuffle className="h-3.5 w-3.5" /> Isi rata otomatis
            </button>
          </div>
          <ul className="divide-y divide-leaf-100 rounded-2xl ring-1 ring-leaf-100">
            {shown.map((f) => {
              const q = t.picks[f.id] ?? 0;
              const item = byId.get(f.id);
              return (
                <li key={f.id} className={`flex items-center gap-3 p-3 ${!f.available ? "opacity-60" : ""}`}>
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-leaf-50">
                    {item?.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- catalog photo (Supabase storage)
                      <img src={item.photo} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <CupSoda className="m-auto mt-3.5 h-7 w-7 text-leaf-700" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{f.name}</span>
                    <span className="text-sm text-leaf-700">{formatIDR(f.price)}</span>
                    {!f.available && <span className="ml-2 rounded-full bg-plum-50 px-2 py-0.5 text-[11px] font-bold text-plum-700">Habis</span>}
                  </span>
                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setQty(f.id, q - 1)}
                      disabled={q === 0}
                      aria-label="Kurangi"
                      className="flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-leaf-200 disabled:opacity-30"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-ink">{q}</span>
                    <button
                      type="button"
                      onClick={() => setQty(f.id, q + 1)}
                      disabled={!f.available || selected >= total}
                      aria-label="Tambah"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-700 text-white disabled:opacity-30"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 rounded-2xl bg-leaf-50 px-4 py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink">
                Terpilih <b>{selected}</b> / {total} botol
              </span>
              <span className="font-semibold text-ink">{formatIDR(quote.subtotal)}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-leaf-600 transition-all" style={{ width: `${Math.min(100, (selected / Math.max(1, total)) * 100)}%` }} />
            </div>
            {selected > 0 && quote.errors.length > 0 && <Errors list={quote.errors} />}
          </div>
          <button
            type="button"
            disabled={quote.errors.length > 0}
            onClick={() => setT({ picksDone: true })}
            className="mt-3 h-11 w-full rounded-full bg-leaf-700 text-sm font-bold text-white disabled:opacity-50"
          >
            Lanjut atur pengiriman
          </button>
        </Step>
      )}

      {/* 6. Jadwal, alamat & ringkasan */}
      {step >= 6 && picksDone && (
        <Step n={6} title="Jadwal & pengiriman" done={false} summary={null}>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-leaf-50 px-4 py-3 text-sm">
            <p className="text-ink">
              <b>{freqLabel(t.freq)}</b> · {dates.length}× kirim · mulai {longDate(firstDate)}
            </p>
            <button type="button" onClick={() => setT({ configDone: false })} className="text-xs text-muted underline">
              ubah jadwal
            </button>
          </div>
          {slots.length > 0 && (
            <label className="mt-3 block text-sm font-medium text-ink">
              Jam antar
              <select value={slot} onChange={(e) => setContact({ slot: e.target.value })} className={input}>
                {slots.map((s) => (
                  <option key={s.n} value={s.n}>
                    {s.label} (berangkat ±{s.at.slice(0, 5).replace(":", ".")})
                  </option>
                ))}
              </select>
            </label>
          )}

          {loggedIn && (
            <>
              <label className="mt-3 block text-sm font-medium text-ink">
                Nama penerima
                <input value={name} onChange={(e) => setContact({ name: e.target.value })} className={input} autoComplete="name" />
              </label>
              <label className="mt-3 block text-sm font-medium text-ink">
                Alamat pengiriman
                {addresses.length > 1 && (
                  <select value={address} onChange={(e) => setContact({ address: e.target.value })} className={input}>
                    {addresses.map((a) => (
                      <option key={a} value={a}>
                        {a.slice(0, 60)}
                      </option>
                    ))}
                  </select>
                )}
                <textarea value={address} onChange={(e) => setContact({ address: e.target.value })} rows={2} className={input} autoComplete="street-address" />
              </label>
              <label className="mt-3 block text-sm font-medium text-ink">
                Catatan (opsional)
                <textarea value={preferences} onChange={(e) => setContact({ preferences: e.target.value })} rows={2} placeholder="Mis. titip di resepsionis…" className={input} />
              </label>
            </>
          )}

          <Summary t={t} total={total} quote={quote} byId={byId} ongkirLoading={ongkir.loading} ongkirLabel={ongkir.label} ongkirPending={ongkir.pending} />

          {loggedIn ? (
            <>

              {(error || quote.errors.length > 0) && <Errors list={error ? [error] : quote.errors} />}
              <button
                type="button"
                disabled={pending || quote.errors.length > 0 || ongkir.loading}
                onClick={submit}
                className="mt-5 h-12 w-full rounded-full bg-leaf-700 font-bold text-white hover:bg-leaf-900 disabled:opacity-50"
              >
                {pending ? "Menyimpan…" : `Mulai langganan · ${formatIDR(quote.payable)}`}
              </button>
              <p className="mt-2 text-center text-xs text-muted">Admin mengonfirmasi pembayaran lewat WhatsApp sebelum pengiriman pertama.</p>
            </>
          ) : (
            <div className="mt-5 rounded-2xl bg-leaf-50 p-4 text-center">
              <p className="text-sm text-ink">Satu langkah lagi — masuk dengan nomor WhatsApp untuk melihat ongkir & menyimpan langganan.</p>
              <button type="button" onClick={onLogin} className="mt-3 h-12 w-full rounded-full bg-leaf-700 font-bold text-white hover:bg-leaf-900">
                Masuk & lanjutkan
              </button>
              <p className="mt-2 text-xs text-muted">Pilihan Kakak tersimpan, tidak perlu mengulang.</p>
            </div>
          )}
        </Step>
      )}
    </>
  );
}

function Errors({ list }: { list: string[] }) {
  return (
    <ul className="mt-3 space-y-1 rounded-xl bg-plum-50 px-3 py-2 text-sm text-plum-700">
      {list.map((e) => (
        <li key={e} className="flex gap-2">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {e}
        </li>
      ))}
    </ul>
  );
}

function Summary({
  t,
  total,
  quote,
  byId,
  ongkirLoading,
  ongkirLabel,
  ongkirPending,
}: {
  t: TierDraft;
  total: number;
  quote: ReturnType<typeof quoteSubscription>;
  byId: Map<string, SubscriptionItem>;
  ongkirLoading: boolean;
  ongkirLabel: string | null;
  ongkirPending: boolean;
}) {
  const noFee = ongkirPending ? "dikonfirmasi admin" : "dihitung dari alamat";
  const row = (label: string, value: React.ReactNode, strong = false) => (
    <div className={`flex justify-between gap-3 ${strong ? "font-bold text-ink" : ""}`}>
      <span className={strong ? "" : "text-muted"}>{label}</span>
      <span className={strong ? "" : "font-semibold text-ink"}>{value}</span>
    </div>
  );
  const name = (id: string) => {
    const i = byId.get(id);
    return i?.variant ?? i?.name ?? "Rasa";
  };
  return (
    <div className="mt-5 space-y-4 rounded-2xl bg-cream p-4 text-sm ring-1 ring-leaf-100">
      <p className="font-bold text-ink">Ringkasan langganan</p>
      <div className="space-y-1">
        {row("Paket", packageLabel(t.people!, t.perDay!))}
        {row("Jumlah orang", `${t.people} orang`)}
        {row("Botol per orang per kiriman", `${t.perDay} botol`)}
        {row("Durasi", durationLabel(t.days!))}
        {row("Total botol", `${total} botol`)}
      </div>
      <div className="space-y-1 border-t border-leaf-100 pt-3">
        {Object.entries(t.picks)
          .filter(([, q]) => q > 0)
          .map(([id, q]) => (
            <div key={id} className="flex justify-between gap-3">
              <span className="text-muted">
                {q}× {name(id)}
              </span>
              <span className="text-ink">{formatIDR(q * (byId.get(id)?.normal_price ?? 0))}</span>
            </div>
          ))}
      </div>
      <div className="space-y-1 border-t border-leaf-100 pt-3">
        {row("Subtotal produk", formatIDR(quote.subtotal))}
        {row("Diskon langganan", pct(quote.rate))}
        {row("Hemat", `−${formatIDR(quote.savings)}`)}
        {row("Total produk setelah diskon", formatIDR(quote.productTotal), true)}
      </div>
      <div className="space-y-1 border-t border-leaf-100 pt-3">
        {row("Frekuensi kirim", freqLabel(t.freq))}
        {row("Jumlah pengiriman", `${quote.deliveries}×`)}
        <ul className="space-y-0.5 text-xs text-muted">
          {quote.shipments.map((s, i) => (
            <li key={s.date} className="flex justify-between gap-3">
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" /> {i + 1}. {longDate(s.date)} · {s.bottles} botol
              </span>
              <span>{s.items.map((it) => `${it.qty} ${name(it.id)}`).join(", ")}</span>
            </li>
          ))}
        </ul>
        {row(
          `Ongkir per pengiriman${ongkirLabel ? ` · ${ongkirLabel}` : ""}`,
          ongkirLoading ? "menghitung…" : quote.shippingPerDelivery == null ? noFee : formatIDR(quote.shippingPerDelivery),
        )}
        {row("Total ongkir", quote.shippingTotal == null ? noFee : formatIDR(quote.shippingTotal))}
      </div>
      <div className="border-t border-leaf-100 pt-3 text-base">
        {row(quote.shippingTotal == null ? "Total bayar (belum termasuk ongkir)" : "Total bayar", formatIDR(quote.payable), true)}
      </div>
    </div>
  );
}

/** Month-style grid of the subscription period; delivery days highlighted. */
function Calendar({ from, days, selected, onToggle }: { from: string; days: number; selected: string[]; onToggle: (d: string) => void }) {
  const lead = isoWeekday(from) - 1;
  const cells = Array.from({ length: days }, (_, i) => addDays(from, i));
  return (
    <div className="mt-3 rounded-2xl p-3 ring-1 ring-leaf-100">
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-muted">
        {WD.slice(1).map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: lead }, (_, i) => (
          <span key={`x${i}`} />
        ))}
        {cells.map((d, i) => {
          const on = selected.includes(d);
          return (
            <button
              key={d}
              type="button"
              onClick={() => onToggle(d)}
              aria-pressed={on}
              className={`flex h-10 flex-col items-center justify-center rounded-lg text-xs ${
                on ? "bg-leaf-700 font-bold text-white" : "bg-leaf-50/60 text-ink hover:bg-leaf-100"
              } ${i === 0 ? "cursor-default" : ""}`}
            >
              <span>{Number(d.slice(8))}</span>
              {(i === 0 || d.endsWith("-01")) && <span className="text-[9px] opacity-80">{new Date(d + "T00:00").toLocaleDateString("id-ID", { month: "short" })}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
