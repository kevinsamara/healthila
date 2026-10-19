"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { cartTotal, clearCart, setQty, useCart, type CartItem } from "@/lib/cart";
import { qtyLabel, rupiah } from "@/lib/format";
import { waLink } from "@/lib/site";
import { getCheckoutProfile, placeOrder } from "./actions";

type Form = { name: string; phone: string; address: string; date: string; notes: string };
type Done = { code: string; customerStatus: "new" | "existing" | null; wa: string };
type Profile = NonNullable<Awaited<ReturnType<typeof getCheckoutProfile>>>;

const BUYER_KEY = "healthila_buyer";

export function CartView() {
  const items = useCart();
  const [form, setForm] = useState<Form>({ name: "", phone: "", address: "", date: "", notes: "" });
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pending, startTransition] = useTransition();
  // One idempotency key per checkout attempt, reused on retry so a double tap never makes two orders.
  const orderKey = useRef<string | null>(null);
  const total = cartTotal(items);

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
      orderKey.current = null;
      setDone({ code: res.code, customerStatus: res.customerStatus, wa: waLink(buildMessage(snapshot, cartTotal(snapshot), form, res.code)) });
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
                  <button aria-label="Tambah" onClick={() => setQty(i.key, i.qty + 1)} className="h-9 w-9 text-leaf-700">
                    +
                  </button>
                </div>
                <button onClick={() => setQty(i.key, 0)} className="text-sm text-plum-700 hover:underline">
                  Hapus
                </button>
              </div>
            </div>
            <p className="shrink-0 font-bold text-ink">{rupiah(i.price * i.qty)}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={checkout} className="h-fit rounded-3xl bg-white p-6 ring-1 ring-leaf-100">
        <h2 className="text-lg font-bold text-ink">Detail pesanan</h2>
        {profile ? (
          <Field label="No. WhatsApp pemesan" hint="✓ Terverifikasi — pesanan tersimpan di akun Anda.">
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
        <Field label="Tanggal kirim">
          <input type="date" value={form.date} onChange={set("date")} min={today()} className={input} />
        </Field>
        <Field label="Catatan">
          <textarea value={form.notes} onChange={set("notes")} rows={2} placeholder="Mis. pilih yang matang, kartu ucapan…" className={input} />
        </Field>

        <div className="mt-6 flex justify-between border-t border-leaf-100 pt-4">
          <span className="text-muted">Subtotal</span>
          <span className="text-xl font-extrabold text-leaf-900">{rupiah(total)}</span>
        </div>
        <p className="mt-1 text-xs text-muted">Ongkir & pembayaran dikonfirmasi admin via WhatsApp.</p>

        {error && (
          <p className="mt-4 rounded-xl bg-plum-50 px-3 py-2 text-sm font-medium text-plum-700" role="alert">
            {error}
          </p>
        )}
        <button
          disabled={pending}
          className="mt-5 h-12 w-full rounded-full bg-leaf-700 font-bold text-white hover:bg-leaf-900 disabled:opacity-60"
        >
          {pending ? "Menyimpan pesanan…" : "Buat Pesanan"}
        </button>
        <button type="button" onClick={clearCart} className="mt-3 w-full text-sm text-muted hover:text-plum-700">
          Kosongkan keranjang
        </button>
      </form>
    </div>
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
      <a
        href={done.wa}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex h-12 items-center rounded-full bg-leaf-700 px-8 font-bold text-white hover:bg-leaf-900"
      >
        Kirim ke WhatsApp
      </a>
      <p className="mt-6 text-sm">
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
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildMessage(items: CartItem[], total: number, f: Form, code: string | null) {
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
    "",
    `Nama: ${f.name.trim()}`,
    code ? null : `No. WhatsApp: ${f.phone.trim()}`,
    `Alamat: ${f.address.trim()}`,
    f.date
      ? `Tanggal kirim: ${new Date(f.date + "T00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`
      : null,
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
