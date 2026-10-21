"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import { submitParcelRequest } from "@/app/parcel/custom/actions";
import { getCheckoutProfile } from "@/app/keranjang/actions";
import { rupiah } from "@/lib/format";
import { CARD_STYLES, RIBBON_EXTRA, RIBBON_FREE, type ParcelContainer } from "@/lib/parcel-options";
import { waLink } from "@/lib/site";
import { WhatsAppIcon } from "../WhatsAppFab";
import { ParcelPhotoVisual } from "./ParcelPhotoVisual";
import { ParcelVisual } from "./ParcelVisual";
import type { FillArea } from "@/lib/parcel-composite";

export type ContainerOption = Omit<ParcelContainer, "crmMatch"> & {
  photo: string | null;
  /** Real PNG layers uploaded in Healthila OS; without `back` the SVG illustration is used. */
  back: string | null;
  front: string | null;
  fill: FillArea;
};
export type FruitGroup = {
  name: string;
  emoji: string;
  art: string | null;
  items: { id: string; name: string; art: string | null }[];
};

const RIBBONS = [
  { name: RIBBON_FREE, hex: "#d71920" },
  { name: "Pink", hex: "#f472b6" },
  { name: "Emas", hex: "#d4a017" },
  { name: "Hijau", hex: "#04724a" },
  { name: "Biru", hex: "#2563eb" },
  { name: "Ungu", hex: "#7f1a5c" },
  { name: "Putih", hex: "#f8fafc" },
  { name: "Cokelat", hex: "#8a5523" },
];

const OCCASIONS = [
  { label: "Ulang Tahun", icon: "🎂" },
  { label: "Get Well Soon", icon: "💐" },
  { label: "Lebaran / Hari Raya", icon: "🌙" },
  { label: "Imlek", icon: "🏮" },
  { label: "Natal", icon: "🎄" },
  { label: "Anniversary", icon: "💞" },
  { label: "Terima Kasih", icon: "🙏" },
  { label: "Corporate / Kantor", icon: "🏢" },
  { label: "Duka Cita", icon: "🕊️" },
  { label: "Lainnya", icon: "✨" },
];

const STEPS = ["Wadah", "Acara", "Budget", "Buah", "Pita", "Ucapan", "Kirim"] as const;
const ANY = " (apa saja)";

export function ParcelBuilder({ containers, fruits }: { containers: ContainerOption[]; fruits: FruitGroup[] }) {
  const [step, setStep] = useState(0);
  const [containerKey, setContainerKey] = useState(containers[0]?.key ?? "");
  const [occasion, setOccasion] = useState<string | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [customBudget, setCustomBudget] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [openGroup, setOpenGroup] = useState<string | null>(fruits[0]?.name ?? null);
  const [ribbonName, setRibbonName] = useState(RIBBON_FREE);
  const [cardStyle, setCardStyle] = useState<(typeof CARD_STYLES)[number]["key"]>("healthila");
  const [card, setCard] = useState({ to: "", from: "", message: "" });
  const [contact, setContact] = useState({ name: "", phone: "", date: "", notes: "" });
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [doneCode, setDoneCode] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Signed-in buyers: phone is already verified, prefill name too.
  useEffect(() => {
    if (!document.cookie.split("; ").includes("hl_auth=1")) return;
    void getCheckoutProfile().then((p) => {
      if (!p) return;
      setVerifiedPhone(p.phone);
      setContact((c) => ({ ...c, phone: p.phone, name: c.name || p.name || "" }));
    });
  }, []);

  const container = containers.find((c) => c.key === containerKey) ?? containers[0];
  const ribbon = RIBBONS.find((r) => r.name === ribbonName) ?? RIBBONS[0];
  const ribbonCost = ribbonName === RIBBON_FREE ? 0 : RIBBON_EXTRA;
  const cardCost = CARD_STYLES.find((c) => c.key === cardStyle)?.price ?? 0;
  const addons = ribbonCost + cardCost;
  const minPrice = container.start + addons;
  const budgetPresets = useMemo(() => presets(minPrice), [minPrice]);
  const budgetValue = budget ?? (Number(customBudget.replace(/\D/g, "")) || null);
  const budgetOk = !!budgetValue && budgetValue >= minPrice;

  // One fruit per picked item: the variety's own PNG, else its fruit type's.
  const visualFruits = useMemo(
    () =>
      picked.map((p) => {
        const g = fruits.find((f) => p === f.name + ANY || f.items.some((i) => i.name === p));
        const item = g?.items.find((i) => i.name === p);
        return { emoji: g?.emoji ?? "🍎", art: item?.art ?? g?.art ?? null };
      }),
    [picked, fruits],
  );

  const canNext = [true, !!occasion, budgetOk, picked.length > 0, true, true, true][step];

  function toggle(name: string) {
    setPicked((p) => (p.includes(name) ? p.filter((x) => x !== name) : [...p, name]));
  }

  function submit() {
    if (!contact.name.trim() || !(verifiedPhone || contact.phone.trim())) {
      setError("Mohon isi nama dan nomor WhatsApp.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await submitParcelRequest({
        name: contact.name,
        phone: verifiedPhone ?? contact.phone,
        shape: container.label,
        occasion,
        budget: budgetValue,
        fruits: picked,
        ribbon: ribbonName,
        cardStyle: CARD_STYLES.find((c) => c.key === cardStyle)!.label,
        cardTo: cardStyle === "none" ? "" : card.to,
        cardFrom: cardStyle === "none" ? "" : card.from,
        cardMessage: cardStyle === "none" ? "" : card.message,
        addons,
        minPrice,
        date: contact.date || null,
        notes: contact.notes,
      });
      if (res.ok) setDoneCode(res.code);
      else setError(res.error);
    });
  }

  const cardLabel = CARD_STYLES.find((c) => c.key === cardStyle)!.label;
  const message = [
    doneCode ? `Halo Healthila, saya sudah isi konsultasi parcel di website. Kode: *${doneCode}*` : "Halo Healthila, saya mau *konsultasi parcel custom*:",
    "",
    `🧺 Wadah: ${container.label} (mulai ${rupiah(container.start)})`,
    `🎉 Acara: ${occasion ?? "-"}`,
    `💰 Budget: ${budgetValue ? rupiah(budgetValue) : "-"}`,
    `🍇 Buah pilihan: ${picked.join(", ") || "-"}`,
    `🎀 Pita: ${ribbonName}${ribbonCost ? ` (+${rupiah(ribbonCost)})` : " (gratis)"}`,
    `💌 ${cardLabel}${cardCost ? ` (+${rupiah(cardCost)})` : ""}`,
    cardStyle !== "none" && card.message.trim() ? `"${card.message.trim()}"` : null,
    cardStyle !== "none" && card.to.trim() ? `Untuk: ${card.to.trim()}` : null,
    cardStyle !== "none" && card.from.trim() ? `Dari: ${card.from.trim()}` : null,
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

  const groups = [...new Set(containers.map((c) => c.group))];

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
            <Step title="Pilih wadah parcel" hint="Harga mulai dari — isi & jumlah buah menyesuaikan budget Kakak.">
              {groups.map((g) => (
                <div key={g} className="mb-6 last:mb-0">
                  <p className="mb-2 text-xs font-bold tracking-widest text-muted uppercase">{g}</p>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {containers
                      .filter((c) => c.group === g)
                      .map((c) => {
                        const on = c.key === containerKey;
                        return (
                          <button
                            key={c.key}
                            type="button"
                            onClick={() => {
                              setContainerKey(c.key);
                              setBudget(null);
                            }}
                            aria-pressed={on}
                            className={`flex items-center gap-3 rounded-2xl p-2.5 text-left transition ${
                              on ? "bg-plum-50 ring-2 ring-plum-500" : "bg-[#f7f6f2] ring-1 ring-transparent hover:ring-black/10"
                            }`}
                          >
                            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                              {c.photo ? (
                                <Image src={c.photo} alt="" fill sizes="64px" className="object-cover" />
                              ) : (
                                <span className="flex h-full items-center justify-center text-3xl">
                                  {c.shape === "tas" ? "🛍️" : c.shape === "box" ? "🎁" : c.shape === "tower" ? "🗼" : c.shape === "plate" ? "🍽️" : "🧺"}
                                </span>
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block font-bold leading-tight text-ink">{c.label}</span>
                              <span className="block text-xs text-muted">{c.desc}</span>
                              <span className="mt-0.5 block text-sm font-bold text-plum-700">mulai {rupiah(c.start)}</span>
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
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
            <Step
              title="Berapa budget-nya?"
              hint={`${container.label} mulai ${rupiah(container.start)}${addons ? ` + add-on ${rupiah(addons)}` : ""}. Belum termasuk ongkir.`}
            >
              <div className="flex flex-wrap gap-2">
                {budgetPresets.map((b) => (
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
                    {rupiah(b)}
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
                    placeholder={minPrice.toLocaleString("id-ID")}
                    className="w-full bg-transparent px-2 py-3 outline-none"
                  />
                </div>
              </label>
              {budgetValue != null && budgetValue < minPrice && (
                <p className="mt-2 text-sm text-plum-700">Minimal {rupiah(minPrice)} untuk {container.label}.</p>
              )}
            </Step>
          )}

          {step === 3 && (
            <Step title="Buah apa saja yang diinginkan?" hint="Pilih jenis atau varietas spesifik — tidak perlu jumlah, tim kami yang mengatur komposisinya.">
              <div className="space-y-2">
                {fruits.map((g) => {
                  const count = picked.filter((p) => p === g.name + ANY || g.items.some((i) => i.name === p)).length;
                  const open = openGroup === g.name;
                  return (
                    <div key={g.name} className={`rounded-2xl ring-1 transition ${count ? "bg-plum-50/60 ring-plum-200" : "bg-[#f7f6f2] ring-transparent"}`}>
                      <button
                        type="button"
                        onClick={() => setOpenGroup(open ? null : g.name)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
                        aria-expanded={open}
                      >
                        <FruitIcon g={g} />
                        <span className="flex-1 font-bold text-ink">{g.name}</span>
                        {count > 0 && <span className="rounded-full bg-plum-700 px-2 py-0.5 text-xs font-bold text-white">{count}</span>}
                        <span className="text-xs text-muted">{g.items.length} pilihan</span>
                        <span className={`text-muted transition ${open ? "rotate-180" : ""}`}>▾</span>
                      </button>
                      {open && (
                        <div className="flex flex-wrap gap-2 px-3 pb-3">
                          <Pill on={picked.includes(g.name + ANY)} onClick={() => toggle(g.name + ANY)}>
                            ✨ {g.name} apa saja (pilihkan terbaik)
                          </Pill>
                          {g.items.map((i) => (
                            <Pill key={i.id} on={picked.includes(i.name)} onClick={() => toggle(i.name)}>
                              {i.name}
                            </Pill>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-muted">{picked.length ? `${picked.length} pilihan: ${picked.join(", ")}` : "Belum ada buah dipilih"}</p>
            </Step>
          )}

          {step === 4 && (
            <Step title="Pilih warna pita" hint={`Pita ${RIBBON_FREE} gratis. Warna lain +${rupiah(RIBBON_EXTRA)}.`}>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-4">
                {RIBBONS.map((r) => {
                  const on = ribbonName === r.name;
                  return (
                    <button
                      key={r.name}
                      type="button"
                      onClick={() => setRibbonName(r.name)}
                      aria-pressed={on}
                      className={`flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center text-xs font-semibold transition ${
                        on ? "bg-plum-50 ring-2 ring-plum-500" : "bg-[#f7f6f2] hover:ring-1 hover:ring-black/10"
                      }`}
                    >
                      <span className="h-10 w-10 rounded-full shadow-inner ring-1 ring-black/10" style={{ background: r.hex }} />
                      {r.name}
                      <span className={r.name === RIBBON_FREE ? "text-leaf-700" : "font-normal text-muted"}>
                        {r.name === RIBBON_FREE ? "Gratis" : `+${rupiah(RIBBON_EXTRA)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          {step === 5 && (
            <Step title="Kartu ucapan">
              <div className="grid gap-3 sm:grid-cols-3">
                {CARD_STYLES.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCardStyle(c.key)}
                    aria-pressed={cardStyle === c.key}
                    className={`rounded-2xl p-4 text-left transition ${
                      cardStyle === c.key ? "bg-plum-50 ring-2 ring-plum-500" : "bg-[#f7f6f2] ring-1 ring-transparent hover:ring-black/10"
                    }`}
                  >
                    <span className="block font-bold text-ink">{c.label}</span>
                    {c.desc && <span className="block text-xs text-muted">{c.desc}</span>}
                    <span className={`mt-1 block text-sm font-bold ${c.price ? "text-plum-700" : "text-leaf-700"}`}>
                      {c.price ? `+${rupiah(c.price)}` : "Gratis"}
                    </span>
                  </button>
                ))}
              </div>
              {cardStyle !== "none" && (
                <>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
                  {cardStyle === "custom" && (
                    <p className="mt-2 text-sm text-muted">Admin akan menghubungi Kakak untuk detail desain (tema, warna, logo).</p>
                  )}
                </>
              )}
            </Step>
          )}

          {step === 6 && !doneCode && (
            <Step title="Hampir selesai!" hint="Admin akan menghubungi via WhatsApp untuk rekomendasi isi, harga final, dan ongkir.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Nama Kakak *" value={contact.name} onChange={(v) => setContact((c) => ({ ...c, name: v }))} />
                {verifiedPhone ? (
                  <label className="block text-sm font-medium text-ink">
                    No. WhatsApp
                    <input value={verifiedPhone} readOnly className="mt-1 w-full rounded-xl border border-black/10 bg-leaf-50 px-4 py-3 text-muted" />
                    <span className="text-xs text-leaf-700">✓ Terverifikasi</span>
                  </label>
                ) : (
                  <Input label="No. WhatsApp *" value={contact.phone} onChange={(v) => setContact((c) => ({ ...c, phone: v }))} placeholder="0812 3456 7890" />
                )}
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
              <Input label="Catatan lain (opsional)" value={contact.notes} onChange={(v) => setContact((c) => ({ ...c, notes: v }))} placeholder="Mis. tanpa durian, tambah bunga" />

              <dl className="mt-6 grid gap-x-6 gap-y-2 rounded-2xl bg-[#f7f6f2] p-5 text-sm sm:grid-cols-2">
                <Summary k="Wadah" v={`${container.label} — mulai ${rupiah(container.start)}`} />
                <Summary k="Acara" v={occasion ?? "-"} />
                <Summary k="Budget" v={budgetValue ? rupiah(budgetValue) : "-"} />
                <Summary k="Buah" v={picked.join(", ") || "-"} />
                <Summary k="Pita" v={`${ribbonName} ${ribbonCost ? `(+${rupiah(ribbonCost)})` : "(gratis)"}`} />
                <Summary k="Kartu" v={`${cardLabel} ${cardCost ? `(+${rupiah(cardCost)})` : ""}`} />
              </dl>
              <p className="mt-3 text-sm text-muted">
                Estimasi mulai dari <span className="font-bold text-ink">{rupiah(minPrice)}</span> (wadah + add-on), belum termasuk ongkir.
              </p>

              {error && (
                <p className="mt-4 rounded-xl bg-plum-50 px-3 py-2 text-sm font-medium text-plum-700" role="alert">
                  {error}
                </p>
              )}
              <button
                type="button"
                disabled={pending}
                onClick={submit}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-plum-700 text-lg font-bold text-white hover:bg-plum-900 disabled:opacity-60"
              >
                {pending ? "Mengirim…" : "Kirim Konsultasi"}
              </button>
              <p className="mt-2 text-center text-xs text-muted">Konsultasi gratis & belum mengikat.</p>
            </Step>
          )}

          {step === 6 && doneCode && (
            <div className="py-6 text-center">
              <p className="text-sm font-semibold tracking-wide text-plum-500 uppercase">Konsultasi terkirim</p>
              <p className="mt-2 font-display text-4xl font-extrabold text-plum-900">{doneCode}</p>
              <p className="mx-auto mt-3 max-w-md text-muted">
                Terima kasih! Tim kami akan menghubungi Kakak dengan rekomendasi isi & harga. Mau lebih cepat? Kirim juga ringkasannya ke WhatsApp.
              </p>
              <a
                href={waLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto mt-6 flex h-14 max-w-sm items-center justify-center gap-2 rounded-full bg-[#25D366] text-lg font-bold text-white hover:brightness-95"
              >
                <WhatsAppIcon className="h-6 w-6" /> Chat Admin via WhatsApp
              </a>
            </div>
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
            {container.back ? (
              <ParcelPhotoVisual
                back={container.back}
                front={container.front}
                fill={container.fill}
                fruits={visualFruits}
                ribbon={ribbon.hex}
                card={cardStyle === "none" ? null : card.message.trim() || null}
              />
            ) : (
              <ParcelVisual
                shape={container.shape}
                fruits={visualFruits}
                ribbon={ribbon.hex}
                card={cardStyle === "none" ? null : card.message.trim() || null}
              />
            )}
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5 text-xs">
            <Tag>{container.label}</Tag>
            {occasion && <Tag>{occasion}</Tag>}
            {budgetValue ? <Tag>{rupiah(budgetValue)}</Tag> : null}
          </div>
          <p className="mt-2 text-center text-sm">
            Mulai dari <span className="font-bold text-plum-700">{rupiah(minPrice)}</span>
          </p>
          {container.photo && (
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-2 ring-1 ring-black/5">
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                <Image src={container.photo} alt={container.label} fill sizes="56px" className="object-cover" />
              </span>
              <span className="text-xs text-muted">Contoh {container.label} asli dari Healthila.</span>
            </div>
          )}
          <p className="mt-3 text-center text-[11px] text-muted">Ilustrasi. Komposisi & jumlah final ditentukan tim Healthila.</p>
        </div>
      </aside>
    </div>
  );
}

/** Budget shortcuts from the floor price upward, rounded to 50rb. */
function presets(min: number) {
  const base = Math.ceil(min / 50_000) * 50_000;
  return [...new Set([min, base + 50_000, base + 150_000, base + 300_000, base + 500_000])].sort((a, b) => a - b);
}

function FruitIcon({ g }: { g: FruitGroup }) {
  return g.art ? (
    // eslint-disable-next-line @next/next/no-img-element -- small CDN illustration
    <img src={g.art} alt="" width={36} height={36} loading="lazy" className="h-9 w-9" />
  ) : (
    <span className="flex h-9 w-9 items-center justify-center text-3xl">{g.emoji}</span>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
        on ? "bg-plum-700 text-white" : "bg-white text-ink ring-1 ring-black/10 hover:ring-plum-500"
      }`}
    >
      {on ? "✓ " : ""}
      {children}
    </button>
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

function Choice({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
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
      <span className="font-bold text-ink">{label}</span>
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
