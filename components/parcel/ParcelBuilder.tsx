"use client";

import { useMemo, useState } from "react";
import { rupiah } from "@/lib/format";
import { waLink } from "@/lib/site";
import { WhatsAppIcon } from "../WhatsAppFab";
import { ParcelVisual, type ShapeKey } from "./ParcelVisual";

export type FruitOption = { name: string; emoji: string; varieties: number };

const SHAPES: { key: ShapeKey; label: string; desc: string; icon: string }[] = [
  { key: "keranjang", label: "Keranjang Rotan", desc: "Klasik & paling populer", icon: "🧺" },
  { key: "box", label: "Box / Hampers", desc: "Rapi, elegan, mudah dibawa", icon: "🎁" },
  { key: "tas", label: "Tas Jinjing", desc: "Simpel untuk kunjungan", icon: "🛍️" },
  { key: "tower", label: "Fruit Tower", desc: "Bertingkat, mewah untuk acara", icon: "🗼" },
  { key: "plate", label: "Fruit Plate", desc: "Buah di piring saji", icon: "🍽️" },
];

const OCCASIONS = [
  { label: "Ulang Tahun", icon: "🎂", ribbon: "#ff4d5e" },
  { label: "Get Well Soon", icon: "💐", ribbon: "#38bdf8" },
  { label: "Lebaran / Hari Raya", icon: "🌙", ribbon: "#04724a" },
  { label: "Imlek", icon: "🏮", ribbon: "#dc2626" },
  { label: "Natal", icon: "🎄", ribbon: "#b91c1c" },
  { label: "Anniversary", icon: "💞", ribbon: "#a12a72" },
  { label: "Terima Kasih", icon: "🙏", ribbon: "#f59e0b" },
  { label: "Corporate / Kantor", icon: "🏢", ribbon: "#1d4ed8" },
  { label: "Duka Cita", icon: "🕊️", ribbon: "#64748b" },
  { label: "Lainnya", icon: "✨", ribbon: "#7f1a5c" },
];

const BUDGETS = [250_000, 350_000, 500_000, 750_000, 1_000_000];

const STEPS = ["Bentuk", "Acara", "Budget", "Buah", "Ucapan", "Kirim"] as const;

export function ParcelBuilder({ fruits }: { fruits: FruitOption[] }) {
  const [step, setStep] = useState(0);
  const [shape, setShape] = useState<ShapeKey>("keranjang");
  const [occasion, setOccasion] = useState<string | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [customBudget, setCustomBudget] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [card, setCard] = useState({ to: "", from: "", message: "" });
  const [contact, setContact] = useState({ name: "", date: "", notes: "" });

  const ribbon = OCCASIONS.find((o) => o.label === occasion)?.ribbon ?? "#7f1a5c";
  const emojis = useMemo(() => picked.map((n) => fruits.find((f) => f.name === n)?.emoji ?? "🍎"), [picked, fruits]);
  const shapeLabel = SHAPES.find((s) => s.key === shape)!.label;
  const budgetValue = budget ?? (Number(customBudget.replace(/\D/g, "")) || null);

  const canNext = [true, !!occasion, !!budgetValue && budgetValue >= 100_000, picked.length > 0, true, true][step];

  function toggle(name: string) {
    setPicked((p) => (p.includes(name) ? p.filter((x) => x !== name) : [...p, name]));
  }

  const message = [
    "Halo Healthila, saya mau *konsultasi parcel custom*:",
    "",
    `🧺 Bentuk: ${shapeLabel}`,
    `🎉 Acara: ${occasion ?? "-"}`,
    `💰 Budget: ${budgetValue ? rupiah(budgetValue) : "-"}`,
    `🍇 Buah pilihan: ${picked.join(", ") || "-"}`,
    "",
    card.message.trim() ? `💌 Kartu ucapan:\n"${card.message.trim()}"` : "💌 Kartu ucapan: tidak perlu",
    card.to.trim() ? `Untuk: ${card.to.trim()}` : null,
    card.from.trim() ? `Dari: ${card.from.trim()}` : null,
    "",
    contact.name.trim() ? `Nama pemesan: ${contact.name.trim()}` : null,
    contact.date
      ? `Tanggal dibutuhkan: ${new Date(contact.date + "T00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`
      : null,
    contact.notes.trim() ? `Catatan: ${contact.notes.trim()}` : null,
    "",
    "Mohon dibantu rekomendasi isi & jumlahnya. Terima kasih!",
  ]
    .filter((l): l is string => l !== null)
    .join("\n");

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_440px] lg:items-start">
      {/* Steps */}
      <div>
        <ol className="flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => i <= step && setStep(i)}
                disabled={i > step}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  i === step ? "bg-plum-700 text-white" : i < step ? "bg-plum-50 text-plum-700 hover:bg-plum-100" : "bg-white text-muted ring-1 ring-black/10"
                }`}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${i === step ? "bg-white/20" : "bg-black/5"}`}>
                  {i < step ? "✓" : i + 1}
                </span>
                {s}
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
          {step === 0 && (
            <Step title="Mau parcel berbentuk apa?">
              <div className="grid gap-3 sm:grid-cols-2">
                {SHAPES.map((s) => (
                  <Choice key={s.key} active={shape === s.key} onClick={() => setShape(s.key)} icon={s.icon} label={s.label} desc={s.desc} />
                ))}
              </div>
            </Step>
          )}

          {step === 1 && (
            <Step title="Untuk acara apa?">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {OCCASIONS.map((o) => (
                  <Choice key={o.label} active={occasion === o.label} onClick={() => setOccasion(o.label)} icon={o.icon} label={o.label} />
                ))}
              </div>
            </Step>
          )}

          {step === 2 && (
            <Step title="Berapa budget-nya?" hint="Isi & jumlah buah akan disesuaikan tim kami dengan budget ini (belum termasuk ongkir).">
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setBudget(b);
                      setCustomBudget("");
                    }}
                    className={`rounded-full px-5 py-2.5 font-semibold transition ${
                      budget === b ? "bg-plum-700 text-white" : "bg-white text-ink ring-1 ring-black/10 hover:ring-plum-500"
                    }`}
                  >
                    {b >= 1_000_000 ? "Rp 1 juta+" : rupiah(b)}
                  </button>
                ))}
              </div>
              <label className="mt-5 block text-sm font-medium text-ink">
                Atau tentukan sendiri
                <div className="mt-2 flex max-w-xs items-center rounded-xl border border-black/15 bg-white focus-within:border-plum-500">
                  <span className="pl-4 text-muted">Rp</span>
                  <input
                    inputMode="numeric"
                    value={customBudget}
                    onChange={(e) => {
                      setBudget(null);
                      const digits = e.target.value.replace(/\D/g, "");
                      setCustomBudget(digits ? Number(digits).toLocaleString("id-ID") : "");
                    }}
                    placeholder="400.000"
                    className="w-full bg-transparent px-2 py-3 outline-none"
                  />
                </div>
              </label>
              {budgetValue != null && budgetValue < 100_000 && (
                <p className="mt-2 text-sm text-plum-700">Minimal budget parcel Rp 100.000.</p>
              )}
            </Step>
          )}

          {step === 3 && (
            <Step title="Buah apa saja yang diinginkan?" hint="Pilih sebanyak yang Kakak mau — tidak perlu jumlah, tim kami yang mengatur komposisinya.">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
                {fruits.map((f) => {
                  const on = picked.includes(f.name);
                  return (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => toggle(f.name)}
                      aria-pressed={on}
                      className={`relative flex flex-col items-center rounded-2xl p-3 text-center transition ${
                        on ? "bg-plum-50 ring-2 ring-plum-500" : "bg-[#f7f6f2] ring-1 ring-transparent hover:ring-black/10"
                      }`}
                    >
                      {on && <span className="absolute top-1.5 right-2 text-xs font-bold text-plum-700">✓</span>}
                      <span className="text-3xl">{f.emoji}</span>
                      <span className="mt-1 text-sm font-semibold text-ink">{f.name}</span>
                      <span className="text-[11px] text-muted">{f.varieties} pilihan</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-muted">{picked.length ? `${picked.length} buah dipilih` : "Belum ada buah dipilih"}</p>
            </Step>
          )}

          {step === 4 && (
            <Step title="Kartu ucapan" hint="Opsional. Kami tulis rapi di kartu dan sertakan di parcel.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Untuk" value={card.to} onChange={(v) => setCard((c) => ({ ...c, to: v }))} placeholder="Ibu Sari" />
                <Input label="Dari" value={card.from} onChange={(v) => setCard((c) => ({ ...c, from: v }))} placeholder="Keluarga Budi" />
              </div>
              <label className="mt-3 block text-sm font-medium text-ink">
                Pesan
                <textarea
                  value={card.message}
                  onChange={(e) => setCard((c) => ({ ...c, message: e.target.value.slice(0, 200) }))}
                  rows={4}
                  placeholder="Semoga lekas sembuh dan sehat selalu 💚"
                  className="mt-1 w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-plum-500"
                />
                <span className="text-xs text-muted">{card.message.length}/200</span>
              </label>
            </Step>
          )}

          {step === 5 && (
            <Step title="Hampir selesai!" hint="Ringkasan dikirim ke admin via WhatsApp untuk rekomendasi isi, harga final, dan ongkir.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Nama Kakak" value={contact.name} onChange={(v) => setContact((c) => ({ ...c, name: v }))} />
                <label className="block text-sm font-medium text-ink">
                  Tanggal dibutuhkan
                  <input
                    type="date"
                    value={contact.date}
                    onChange={(e) => setContact((c) => ({ ...c, date: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-plum-500"
                  />
                </label>
              </div>
              <Input label="Catatan lain (opsional)" value={contact.notes} onChange={(v) => setContact((c) => ({ ...c, notes: v }))} placeholder="Mis. tanpa durian, warna pita hijau" />

              <dl className="mt-6 grid gap-x-6 gap-y-2 rounded-2xl bg-[#f7f6f2] p-5 text-sm sm:grid-cols-2">
                <Summary k="Bentuk" v={shapeLabel} />
                <Summary k="Acara" v={occasion ?? "-"} />
                <Summary k="Budget" v={budgetValue ? rupiah(budgetValue) : "-"} />
                <Summary k="Buah" v={picked.join(", ") || "-"} />
                <Summary k="Ucapan" v={card.message.trim() || "Tanpa kartu"} />
              </dl>

              <a
                href={waLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-lg font-bold text-white hover:brightness-95"
              >
                <WhatsAppIcon className="h-6 w-6" /> Kirim ke Admin via WhatsApp
              </a>
            </Step>
          )}

          {step < STEPS.length - 1 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className={`font-semibold text-muted hover:text-ink ${step === 0 ? "invisible" : ""}`}
              >
                ← Kembali
              </button>
              <button
                type="button"
                disabled={!canNext}
                onClick={() => setStep((s) => s + 1)}
                className="h-12 rounded-full bg-plum-700 px-8 font-bold text-white hover:bg-plum-900 disabled:opacity-40"
              >
                Lanjut →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live preview */}
      <aside className="order-first lg:sticky lg:top-24 lg:order-none">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-b from-plum-50 to-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="aspect-[10/9]">
            <ParcelVisual shape={shape} fruits={emojis} ribbon={ribbon} card={card.message.trim() || null} />
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5 text-xs">
            <Tag>{shapeLabel}</Tag>
            {occasion && <Tag>{occasion}</Tag>}
            {budgetValue ? <Tag>{rupiah(budgetValue)}</Tag> : null}
          </div>
          <p className="mt-3 text-center text-[11px] text-muted">Ilustrasi. Komposisi & jumlah final ditentukan tim Healthila.</p>
        </div>
      </aside>
    </div>
  );
}

function Step({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-3xl font-extrabold text-ink">{title}</h2>
      {hint && <p className="mt-1 text-muted">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Choice({ active, onClick, icon, label, desc }: { active: boolean; onClick: () => void; icon: string; label: string; desc?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-3 rounded-2xl p-4 text-left transition ${
        active ? "bg-plum-50 ring-2 ring-plum-500" : "bg-[#f7f6f2] ring-1 ring-transparent hover:ring-black/10"
      }`}
    >
      <span className="text-3xl">{icon}</span>
      <span>
        <span className="block font-bold text-ink">{label}</span>
        {desc && <span className="block text-sm text-muted">{desc}</span>}
      </span>
    </button>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="mt-3 block text-sm font-medium text-ink first:mt-0">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 120))}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-plum-500"
      />
    </label>
  );
}

function Summary({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="font-semibold text-ink">{v}</dd>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white px-2.5 py-1 font-semibold text-plum-700 ring-1 ring-plum-100">{children}</span>;
}
