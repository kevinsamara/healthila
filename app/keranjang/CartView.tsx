"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { cartTotal, clearCart, setQty, useCart, type CartItem } from "@/lib/cart";
import { qtyLabel, rupiah } from "@/lib/format";
import { trackEvent } from "@/lib/analytics";
import { jakartaNow, sameDayCutoff, slotOpen, slotTime, type DeliverySlot } from "@/lib/delivery";
import { FREE_SHIPPING, waLink } from "@/lib/site";
import { checkVoucher, getCheckoutProfile, placeOrder } from "./actions";
import { type OngkirState, useOngkir } from "./useOngkir";
import { AlarmClock, Cake, Ticket, Truck } from "lucide-react";

type Form = { name: string; phone: string; address: string; date: string; notes: string; slot: number | null };
type Done = { code: string; customerStatus: "new" | "existing" | null; wa: string; freeShippingMax: number | null };
type Profile = NonNullable<Awaited<ReturnType<typeof getCheckoutProfile>>>;

const BUYER_KEY = "healthila_buyer";

export function CartView({ slots }: { slots: DeliverySlot[] }) {
  const items = useCart();
  const [form, setForm] = useState<Form>({ name: "", phone: "", address: "", date: "", notes: "", slot: null });
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pending, startTransition] = useTransition();
  // One idempotency key per checkout attempt, reused on retry so a double tap never makes two orders.
  const orderKey = useRef<string | null>(null);
  const total = cartTotal(items);
  const ongkir = useOngkir(form.address);
  const router = useRouter();
  const [payChoice, setPayChoice] = useState<"qris" | "wa">("qris");
  const [voucher, setVoucher] = useState<{ code: string; discount: number; subtotal: number } | null>(null);
  // A voucher priced on another cart total is re-checked by the server anyway; drop it here.
  const appliedVoucher = voucher && voucher.subtotal === total ? voucher : null;
  // QRIS needs a known ongkir; otherwise admin confirms the total on WhatsApp.
  const payQris = payChoice === "qris" && ongkir.fee != null && !ongkir.loading;

  // Returning buyers: prefill name, phone and address saved on this device.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(BUYER_KEY) ?? "null") as Partial<Form> | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
      if (saved) setForm((f) => ({ ...f, name: saved.name ?? "", phone: saved.phone ?? "", address: saved.address ?? "" }));
    } catch {
      // storage unavailable — start with an empty form
    }
    // Signed-in buyers: verified phone + saved addresses from the CRM.
    if (!document.cookie.split("; ").includes("hl_auth=1")) return;
    void getCheckoutProfile().then((p) => {
      if (!p) return;
      setProfile(p);
      setForm((f) => ({
        ...f,
        phone: p.phone,
        name: f.name || p.name || p.addresses[0]?.recipient || "",
        address: f.address || p.addresses[0]?.address || "",
      }));
    });
  }, []);

  if (done) return <OrderPlaced done={done} />;

  if (items.length === 0) {
    return (
      <div className="mt-12 rounded-3xl bg-white p-10 text-center ring-1 ring-leaf-100">
        <p className="text-lg font-semibold text-ink">Keranjang masih kosong</p>
        <p className="mt-1 text-muted">Yuk pilih buah segar favorit Anda.</p>
        <Link href="/katalog" className="mt-6 inline-block rounded-full bg-leaf-700 px-6 py-3 font-bold text-white hover:bg-leaf-900">
          Lihat Katalog
        </Link>
      </div>
    );
  }

  function checkout(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Mohon isi nama, nomor WhatsApp, dan alamat pengiriman.");
      return;
    }
    setError(null);
    orderKey.current ??= crypto.randomUUID();
    const snapshot = items;
    startTransition(async () => {
      const res = await placeOrder({
        name: form.name,
        phone: form.phone,
        address: form.address,
        date: form.date || null,
        slot: form.slot,
        payment: payQris ? "qris" : null,
        voucher: appliedVoucher?.code ?? null,
        notes: orderNotes(snapshot, form.notes),
        key: orderKey.current!,
        lines: snapshot.map((i) => ({
          productId: i.productId,
          packagingId: i.packagingId,
          // Web-only packs are stored in the CRM's base unit (kg).
          quantity: i.basePerUnit ? Math.round(i.qty * i.basePerUnit * 1000) / 1000 : i.qty,
          label: i.basePerUnit ? qtyLabel(i.qty, i.unitLabel) : null,
        })),
      });
      if (!res.ok && res.fallback) {
        window.location.href = waLink(buildMessage(snapshot, cartTotal(snapshot), form, null));
        return;
      }
      if (!res.ok) {
        setError(res.error);
        return;
      }
      try {
        localStorage.setItem(BUYER_KEY, JSON.stringify({ name: form.name, phone: form.phone, address: form.address }));
      } catch {
        // not critical
      }
      const key = orderKey.current;
      orderKey.current = null;
      trackEvent("purchase", {
        transaction_id: res.code,
        currency: "IDR",
        value: Math.round(cartTotal(snapshot)),
        items: snapshot.map((i) => ({ item_id: i.productId, item_name: i.name, price: i.price, quantity: i.qty })),
      });
      if (res.qris && key) {
        clearCart();
        router.push(`/bayar/${res.code}?k=${encodeURIComponent(key)}`);
        return;
      }
      setDone({
        code: res.code,
        customerStatus: res.customerStatus,
        freeShippingMax: res.freeShippingMax,
        wa: waLink(buildMessage(snapshot, cartTotal(snapshot), form, res.code, res.freeShippingMax)),
      });
      clearCart();
    });
  }

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
      <ul className="h-fit divide-y divide-leaf-100 rounded-3xl bg-white ring-1 ring-leaf-100">
        {items.map((i) => (
          <li key={i.key} className="flex gap-4 p-4">
            <Link href={`/produk/${i.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-leaf-50">
              {i.photo && <Image src={i.photo} alt={i.name} fill sizes="80px" className="object-cover" />}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/produk/${i.slug}`} className="line-clamp-2 font-semibold text-ink hover:text-leaf-700">
                {i.name}
              </Link>
              {i.variant && <p className="text-sm text-muted">{i.variant}</p>}
              {i.note && <p className="mt-0.5 text-xs text-plum-700 italic">Catatan: {i.note}</p>}
              <p className="mt-1 text-sm text-muted">
                {rupiah(i.price)}
                {i.unitLabel ? ` / ${i.unitLabel}` : ""}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-9 items-center rounded-full ring-1 ring-leaf-200">
                  <button aria-label="Kurangi" onClick={() => setQty(i.key, i.qty - 1)} className="h-9 w-9 text-leaf-700">
                    −
                  </button>
                  <span className="min-w-12 text-center text-sm font-semibold">{qtyLabel(i.qty, i.unitLabel)}</span>
                  <button
                    aria-label="Tambah"
                    onClick={() => setQty(i.key, i.qty + 1)}
                    disabled={i.maxQty != null && i.qty >= i.maxQty}
                    className="h-9 w-9 text-leaf-700 disabled:text-leaf-200 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <button onClick={() => setQty(i.key, 0)} className="text-sm text-plum-700 hover:underline">
                  Hapus
                </button>
                {i.maxQty != null && i.qty >= i.maxQty && (
                  <span className="text-[11px] font-semibold text-plum-700">Stok maksimum ({i.maxQty} {i.unitLabel ?? ""})</span>
                )}
              </div>
            </div>
            <p className="shrink-0 font-bold text-ink">{rupiah(i.price * i.qty)}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={checkout} className="h-fit rounded-3xl bg-white p-6 ring-1 ring-leaf-100">
        <h2 className="text-lg font-bold text-ink">Detail pesanan</h2>
        {profile ? (
          <Field label="No. WhatsApp pemesan" hint="Terverifikasi — pesanan tersimpan di akun Anda.">
            <input value={profile.phone} readOnly className={`${input} bg-leaf-50 text-muted`} />
          </Field>
        ) : (
          <Field label="No. WhatsApp pemesan *" hint="Untuk konfirmasi pesanan & riwayat belanja Anda.">
            <input value={form.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" placeholder="0812 3456 7890" className={input} />
            <span className="mt-1 block text-xs font-normal text-muted">
              Sudah pernah pesan?{" "}
              <Link href="/masuk?next=/keranjang" className="font-semibold text-leaf-700 hover:underline">
                Masuk
              </Link>{" "}
              untuk memakai alamat tersimpan.
            </span>
          </Field>
        )}
        <Field label="Nama penerima *">
          <input value={form.name} onChange={set("name")} autoComplete="name" className={input} />
        </Field>
        {profile && profile.addresses.length > 1 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-ink">Alamat tersimpan</p>
            <div className="mt-1 space-y-1">
              {profile.addresses.slice(0, 5).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, address: a.address, name: a.recipient ?? f.name }))}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-xs ring-1 ${
                    form.address === a.address ? "bg-leaf-50 ring-leaf-500" : "ring-leaf-100 hover:ring-leaf-200"
                  }`}
                >
                  <span className="font-semibold text-ink">{a.recipient ?? "Alamat"}</span>
                  <span className="mt-0.5 line-clamp-2 block text-muted">{a.address}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <Field label="Alamat pengiriman *">
          <textarea value={form.address} onChange={set("address")} rows={3} autoComplete="street-address" className={input} />
        </Field>
        <Field label="Tanggal kirim" hint={form.date ? undefined : "Kosong = dikirim besok"}>
          <input type="date" value={form.date} onChange={set("date")} min={today()} className={input} />
        </Field>
        <SlotPicker slots={slots} date={form.date} value={form.slot} onChange={(slot) => setForm((f) => ({ ...f, slot }))} />
        <Field label="Catatan">
          <textarea value={form.notes} onChange={set("notes")} rows={2} placeholder="Mis. pilih yang matang, kartu ucapan…" className={input} />
        </Field>

        <div className="mt-6 space-y-1.5 border-t border-leaf-100 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span className="font-semibold text-ink">{rupiah(total)}</span>
          </div>
          {appliedVoucher && (
            <div className="flex justify-between text-leaf-700">
              <span>Voucher {appliedVoucher.code}</span>
              <span className="font-semibold">−{rupiah(appliedVoucher.discount)}</span>
            </div>
          )}
          <OngkirLines ongkir={ongkir} subtotal={total - (appliedVoucher?.discount ?? 0)} freeLeft={profile?.freeShippingLeft} />
        </div>
        <VoucherField
          subtotal={total}
          applied={appliedVoucher}
          onApply={(v) => setVoucher(v ? { ...v, subtotal: total } : null)}
        />
        {ongkir.fee != null && !ongkir.loading ? (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-ink">Pembayaran</p>
            {(
              [
                ["qris", "Bayar sekarang via QRIS", "Semua bank & e-wallet. Pesanan langsung diproses setelah pembayaran dicek."],
                ["wa", "Konfirmasi via WhatsApp", "Admin konfirmasi total & cara bayar lewat chat."],
              ] as const
            ).map(([k, title, text]) => (
              <button
                key={k}
                type="button"
                onClick={() => setPayChoice(k)}
                className={`block w-full rounded-xl px-3 py-2.5 text-left ring-1 ${payChoice === k ? "bg-leaf-50 ring-leaf-500" : "ring-leaf-100 hover:ring-leaf-200"}`}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <span className={`h-3.5 w-3.5 rounded-full border-2 ${payChoice === k ? "border-leaf-700 bg-leaf-700" : "border-leaf-300"}`} />
                  {title}
                </span>
                <span className="mt-0.5 block pl-5.5 text-xs text-muted">{text}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-1 text-xs text-muted">Ongkir final & pembayaran dikonfirmasi admin via WhatsApp.</p>
        )}
        <FreeShippingNote left={profile?.freeShippingLeft} />
        <TotebagHint subtotal={total} />

        {error && (
          <p className="mt-4 rounded-xl bg-plum-50 px-3 py-2 text-sm font-medium text-plum-700" role="alert">
            {error}
          </p>
        )}
        <button
          disabled={pending}
          className="mt-5 h-12 w-full rounded-full bg-leaf-700 font-bold text-white hover:bg-leaf-900 disabled:opacity-60"
        >
          {pending ? "Menyimpan pesanan…" : payQris ? "Buat Pesanan & Bayar QRIS" : "Buat Pesanan"}
        </button>
        <button type="button" onClick={clearCart} className="mt-3 w-full text-sm text-muted hover:text-plum-700">
          Kosongkan keranjang
        </button>
      </form>
    </div>
  );
}

function VoucherField({
  subtotal,
  applied,
  onApply,
}: {
  subtotal: number;
  applied: { code: string; discount: number } | null;
  onApply: (v: { code: string; discount: number } | null) => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  if (applied)
    return (
      <p className="mt-3 flex items-center justify-between rounded-xl bg-lime-100 px-3 py-2 text-xs font-medium text-leaf-900">
        <span>
          <Ticket className="mr-1 inline h-4 w-4 align-[-3px]" />
          Voucher {applied.code} terpakai
        </span>
        <button type="button" onClick={() => onApply(null)} className="text-plum-700 underline">
          hapus
        </button>
      </p>
    );
  return (
    <div className="mt-3">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Kode voucher"
          className="h-10 min-w-0 flex-1 rounded-xl border border-leaf-100 bg-white px-3 text-sm uppercase outline-none focus:border-leaf-500"
        />
        <button
          type="button"
          disabled={!code.trim() || pending}
          onClick={() =>
            start(async () => {
              setError(null);
              const r = await checkVoucher(code, subtotal);
              if (r.ok) {
                onApply({ code: r.code, discount: r.discount });
                setCode("");
              } else setError(r.error);
            })
          }
          className="h-10 rounded-xl border border-leaf-700 px-4 text-sm font-semibold text-leaf-700 hover:bg-leaf-50 disabled:opacity-50"
        >
          {pending ? "…" : "Pakai"}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-plum-700">{error}</p>}
    </div>
  );
}


function OngkirLines({ ongkir, subtotal, freeLeft }: { ongkir: OngkirState; subtotal: number; freeLeft: number | null | undefined }) {
  if (ongkir.loading)
    return (
      <div className="flex justify-between text-muted">
        <span>Ongkir</span>
        <span>menghitung…</span>
      </div>
    );
  if (ongkir.fee == null)
    return (
      <div className="flex justify-between text-muted">
        <span>Ongkir</span>
        <span>{ongkir.pending ? "dikonfirmasi admin" : "isi alamat dulu"}</span>
      </div>
    );
  // Known FREEONGKIR eligibility only for signed-in buyers.
  const discount = freeLeft && freeLeft > 0 ? Math.min(ongkir.fee, FREE_SHIPPING.max) : 0;
  return (
    <>
      <div className="flex justify-between">
        <span className="text-muted">Estimasi ongkir{ongkir.label ? ` · ${ongkir.label}` : ""}</span>
        <span className="font-semibold text-ink">{rupiah(ongkir.fee)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-leaf-700">
          <span>FREEONGKIR</span>
          <span className="font-semibold">−{rupiah(discount)}</span>
        </div>
      )}
      <div className="flex justify-between border-t border-dashed border-leaf-100 pt-1.5">
        <span className="font-semibold text-ink">Estimasi total</span>
        <span className="text-xl font-extrabold text-leaf-900">{rupiah(subtotal + ongkir.fee - discount)}</span>
      </div>
    </>
  );
}

/** FREEONGKIR hint; personalised for signed-in buyers (left = remaining promo orders). */
function FreeShippingNote({ left }: { left: number | null | undefined }) {
  if (left === 0) return null;
  return (
    <p className="mt-3 rounded-xl bg-lime-100 px-3 py-2 text-xs font-medium text-leaf-900">
      <Truck className="mr-1 inline h-4 w-4 align-[-3px]" />
      {left != null ? (
        <>
          Pesanan ini dapat <b>FREE ONGKIR s.d. {rupiah(FREE_SHIPPING.max)}</b> — sisa {left}× lagi bulan ini untuk nomor Kakak.
        </>
      ) : (
        <>
          <b>FREE ONGKIR s.d. {rupiah(FREE_SHIPPING.max)}</b> untuk {FREE_SHIPPING.orders}× pesanan pertama tiap bulan via website (per nomor WhatsApp).
        </>
      )}
    </p>
  );
}

/** Totebag hint — order >=250rb di web dapat totebag gratis, 1x/bulan/customer. */
function TotebagHint({ subtotal }: { subtotal: number }) {
  const target = 250_000;
  if (subtotal >= target) {
    return (
      <p className="mt-2 rounded-xl bg-plum-50 px-3 py-2 text-xs font-medium text-plum-700">
        🎁 <b>Totebag Healthila GRATIS</b> — pesanan Kakak sudah ≥ Rp250.000.
        <span className="block text-[11px] font-normal text-plum-700/70">Max 1 totebag per nomor WhatsApp per bulan.</span>
      </p>
    );
  }
  const left = target - subtotal;
  if (left > 100_000) return null; // kalau masih jauh, jangan ganggu
  return (
    <p className="mt-2 rounded-xl bg-sun-100 px-3 py-2 text-xs font-medium text-leaf-900">
      🎁 Tinggal <b>{rupiah(left)}</b> lagi, Kakak dapat <b>totebag Healthila GRATIS</b>! (web only, 1×/bulan)
    </p>
  );
}

function OrderPlaced({ done }: { done: Done }) {
  return (
    <div className="mx-auto mt-10 max-w-lg rounded-3xl bg-white p-8 text-center ring-1 ring-leaf-100">
      <p className="text-sm font-semibold tracking-wide text-leaf-500 uppercase">Pesanan tersimpan</p>
      <p className="mt-2 text-3xl font-extrabold text-leaf-900">{done.code}</p>
      <p className="mt-3 text-muted">
        {done.customerStatus === "existing" ? "Terima kasih sudah belanja lagi! " : "Terima kasih! "}
        Satu langkah lagi: kirim pesanan ini ke WhatsApp admin supaya ongkir & pembayaran bisa dikonfirmasi.
      </p>
      {done.freeShippingMax ? (
        <p className="mt-4 rounded-2xl bg-lime-100 px-4 py-2.5 text-sm font-semibold text-leaf-900">
          <Truck className="mr-1.5 inline h-4 w-4 align-[-3px]" />
          Pesanan ini dapat FREE ONGKIR s.d. {rupiah(done.freeShippingMax)}
        </p>
      ) : null}
      <a
        href={done.wa}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex h-12 items-center rounded-full bg-leaf-700 px-8 font-bold text-white hover:bg-leaf-900"
      >
        Kirim ke WhatsApp
      </a>
      <div className="mt-6 rounded-2xl bg-leaf-50 p-4 text-left text-sm">
        <p className="font-semibold text-ink"><Cake className="mr-1.5 inline h-4 w-4 align-[-3px]" />
          Biar tidak lupa momen berikutnya
        </p>
        <p className="mt-1 text-muted">Simpan tanggal ulang tahun atau anniversary — kami ingatkan via WhatsApp 3 hari sebelumnya.</p>
        <Link href="/akun#pengingat" className="mt-2 inline-block font-semibold text-leaf-700 underline">
          Atur pengingat
        </Link>
        <span className="mx-2 text-muted">·</span>
        <Link href="/langganan" className="font-semibold text-leaf-700 underline">
          Langganan buah mingguan
        </Link>
      </div>
      <p className="mt-6 flex justify-center gap-4 text-sm">
        <Link href="/akun" className="font-semibold text-leaf-700 hover:underline">
          Lacak pesanan
        </Link>
        <Link href="/katalog" className="text-leaf-700 hover:underline">
          Kembali belanja
        </Link>
      </p>
    </div>
  );
}

const input =
  "mt-1 w-full rounded-xl border border-leaf-200 bg-cream/50 px-3 py-2 text-sm outline-none focus:border-leaf-700 focus:bg-white";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="mt-4 block text-sm font-medium text-ink">
      {label}
      {children}
      {hint && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

function today() {
  return jakartaNow().date;
}

/** Courier run choice; runs already closed for the chosen day are disabled. */
function SlotPicker({
  slots,
  date,
  value,
  onChange,
}: {
  slots: DeliverySlot[];
  date: string;
  value: number | null;
  onChange: (slot: number | null) => void;
}) {
  const [now, setNow] = useState<ReturnType<typeof jakartaNow> | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clock is browser-only (page is cached)
    setNow(jakartaNow());
    const id = setInterval(() => setNow(jakartaNow()), 60_000);
    return () => clearInterval(id);
  }, []);
  // A run that closed while the buyer was filling the form is dropped.
  useEffect(() => {
    const chosen = slots.find((s) => s.n === value);
    if (now && chosen && !slotOpen(chosen, date, now)) onChange(null);
  }, [now, date, value, slots, onChange]);

  const enabled = slots.filter((s) => s.enabled);
  if (!enabled.length) return null;
  const cutoff = now ? sameDayCutoff(enabled, now) : null;
  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-ink">Jam antar</p>
      <div className="mt-1.5 grid grid-cols-3 gap-2">
        {enabled.map((s) => {
          const open = now ? slotOpen(s, date, now) : true;
          const on = value === s.n;
          return (
            <button
              key={s.n}
              type="button"
              disabled={!open}
              onClick={() => onChange(on ? null : s.n)}
              className={`rounded-xl px-2 py-2 text-center text-xs ring-1 transition disabled:cursor-not-allowed disabled:opacity-40 ${
                on ? "bg-leaf-700 font-semibold text-white ring-leaf-700" : "text-ink ring-leaf-100 hover:ring-leaf-300"
              }`}
            >
              <span className="block text-sm font-bold">{s.label}</span>
              berangkat ±{slotTime(s.at)}
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 text-xs text-muted">
        {cutoff ? (
          <>
            <AlarmClock className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
            Pesan sebelum <b className="text-ink">{cutoff}</b> WIB bisa diantar hari ini.
          </>
        ) : (
          "Pengantaran hari ini sudah tutup — pesanan dikirim besok atau di tanggal pilihan Kakak."
        )}{" "}
        Jam antar dikonfirmasi admin.
      </p>
    </div>
  );
}

function buildMessage(items: CartItem[], total: number, f: Form, code: string | null, freeShippingMax: number | null = null) {
  const lines = items.map(
    (i) =>
      `• ${i.name}${i.variant ? ` (${i.variant})` : ""} — ${qtyLabel(i.qty, i.unitLabel)}${
        i.basePerUnit ? ` (= ${qtyLabel(Math.round(i.qty * i.basePerUnit * 1000) / 1000, i.baseUnit ?? "kg")})` : ""
      } × ${rupiah(i.price)} = ${rupiah(i.price * i.qty)}${i.note ? `\n   Catatan: ${i.note}` : ""}`,
  );
  return [
    code ? `Halo Healthila, saya sudah pesan lewat website. Kode pesanan: *${code}*` : "Halo Healthila, saya mau pesan:",
    "",
    ...lines,
    "",
    `Subtotal: ${rupiah(total)}`,
    freeShippingMax ? `🚚 Promo FREE ONGKIR s.d. ${rupiah(freeShippingMax)} (2× per bulan via website)` : null,
    "",
    `Nama: ${f.name.trim()}`,
    code ? null : `No. WhatsApp: ${f.phone.trim()}`,
    `Alamat: ${f.address.trim()}`,
    f.date
      ? `Tanggal kirim: ${new Date(f.date + "T00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`
      : null,
    f.slot ? `Jam antar: ${f.slot === 1 ? "Pagi" : f.slot === 2 ? "Siang" : "Sore"}` : null,
    f.notes.trim() ? `Catatan: ${f.notes.trim()}` : null,
    "",
    "Mohon info ongkir & cara pembayarannya. Terima kasih!",
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}

/** Order-level note for the CRM: buyer note plus any per-item requests. */
function orderNotes(items: CartItem[], buyerNote: string) {
  const parts = [buyerNote.trim(), ...items.filter((i) => i.note).map((i) => `${i.name}: ${i.note}`)].filter(Boolean);
  return parts.length ? parts.join("\n").slice(0, 500) : null;
}
