"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cartTotal, clearCart, setQty, useCart, type CartItem } from "@/lib/cart";
import { qtyLabel, rupiah } from "@/lib/format";
import { waLink } from "@/lib/site";

type Form = { name: string; phone: string; address: string; date: string; notes: string };

export function CartView() {
  const items = useCart();
  const [form, setForm] = useState<Form>({ name: "", phone: "", address: "", date: "", notes: "" });
  const [error, setError] = useState<string | null>(null);
  const total = cartTotal(items);

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
    if (!form.name.trim() || !form.address.trim()) {
      setError("Mohon isi nama dan alamat pengiriman.");
      return;
    }
    setError(null);
    window.open(waLink(buildMessage(items, total, form)), "_blank", "noopener,noreferrer");
  }

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
      <ul className="divide-y divide-leaf-100 rounded-3xl bg-white ring-1 ring-leaf-100">
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
        <Field label="Nama penerima *">
          <input value={form.name} onChange={set("name")} autoComplete="name" className={input} />
        </Field>
        <Field label="No. WhatsApp penerima">
          <input value={form.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" placeholder="08…" className={input} />
        </Field>
        <Field label="Alamat pengiriman *">
          <textarea value={form.address} onChange={set("address")} rows={3} autoComplete="street-address" className={input} />
        </Field>
        <Field label="Tanggal kirim">
          <input type="date" value={form.date} onChange={set("date")} className={input} />
        </Field>
        <Field label="Catatan">
          <textarea value={form.notes} onChange={set("notes")} rows={2} placeholder="Mis. pilih yang matang, kartu ucapan…" className={input} />
        </Field>

        <div className="mt-6 flex justify-between border-t border-leaf-100 pt-4">
          <span className="text-muted">Subtotal</span>
          <span className="text-xl font-extrabold text-leaf-900">{rupiah(total)}</span>
        </div>
        <p className="mt-1 text-xs text-muted">Ongkir & ketersediaan stok dikonfirmasi admin via WhatsApp.</p>

        {error && <p className="mt-4 text-sm font-medium text-plum-700">{error}</p>}
        <button className="mt-5 h-12 w-full rounded-full bg-leaf-700 font-bold text-white hover:bg-leaf-900">
          Pesan via WhatsApp
        </button>
        <button type="button" onClick={clearCart} className="mt-3 w-full text-sm text-muted hover:text-plum-700">
          Kosongkan keranjang
        </button>
      </form>
    </div>
  );
}

const input =
  "mt-1 w-full rounded-xl border border-leaf-200 bg-cream/50 px-3 py-2 text-sm outline-none focus:border-leaf-700 focus:bg-white";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-4 block text-sm font-medium text-ink">
      {label}
      {children}
    </label>
  );
}

function buildMessage(items: CartItem[], total: number, f: Form) {
  const lines = items.map(
    (i) =>
      `• ${i.name}${i.variant ? ` (${i.variant})` : ""} — ${qtyLabel(i.qty, i.unitLabel)}${
        i.basePerUnit ? ` (= ${qtyLabel(Math.round(i.qty * i.basePerUnit * 1000) / 1000, i.baseUnit ?? "kg")})` : ""
      } × ${rupiah(i.price)} = ${rupiah(i.price * i.qty)}`,
  );
  return [
    "Halo Healthila, saya mau pesan:",
    "",
    ...lines,
    "",
    `Subtotal: ${rupiah(total)}`,
    "",
    `Nama: ${f.name.trim()}`,
    f.phone.trim() ? `No. HP: ${f.phone.trim()}` : null,
    `Alamat: ${f.address.trim()}`,
    f.date
      ? `Tanggal kirim: ${new Date(f.date + "T00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`
      : null,
    f.notes.trim() ? `Catatan: ${f.notes.trim()}` : null,
    "",
    "(dipesan lewat healthila.id)",
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}
