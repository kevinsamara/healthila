import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/WhatsAppFab";
import { rupiah } from "@/lib/format";
import { getBayarDetail, getQrisPayment, isSubscriptionCode } from "@/lib/payment";
import { qrisWithAmount, qrSvg } from "@/lib/qris";
import { waLink } from "@/lib/site";
import { Countdown, CopyAmount, ProofUpload } from "./PaymentClient";
import { VoucherForm } from "./VoucherForm";
import { CircleCheck, Gift, LogIn, ReceiptText } from "lucide-react";

export const metadata: Metadata = { title: "Pembayaran QRIS", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function BayarPage({ params, searchParams }: PageProps<"/bayar/[code]">) {
  const { code } = await params;
  const sp = await searchParams;
  const key = typeof sp.k === "string" ? sp.k : null;
  const showQris = sp.pay === "1";
  const pay = await getQrisPayment(code, key);
  const sub = isSubscriptionCode(code);
  const jar = await cookies();
  const loggedIn = jar.get("hl_auth")?.value === "1";

  if (!pay) {
    return (
      <Shell>
        <p className="text-center text-muted">
          Pembayaran tidak ditemukan. Buka lewat link dari halaman pesanan, atau{" "}
          <Link href="/masuk?next=/akun" className="font-semibold text-leaf-700 underline">
            masuk
          </Link>{" "}
          dengan nomor WhatsApp yang dipakai memesan.
        </p>
      </Shell>
    );
  }

  const wa = waLink(`Halo Healthila, saya mau tanya pembayaran ${sub ? "langganan" : "pesanan"} ${pay.code} (${rupiah(pay.amount)}).`);

  if (pay.status === "verified") {
    return (
      <Shell>
        <CircleCheck className="mx-auto h-14 w-14 text-leaf-700" strokeWidth={1.6} />
        <h1 className="mt-3 text-center text-2xl font-extrabold text-leaf-900">Pembayaran diterima</h1>
        <p className="mt-2 text-center text-muted">
          {pay.code} sudah lunas.{sub ? " Langganan aktif — jadwal kirim & status tiap pengiriman ada di Akun." : " Pantau status pengiriman di Akun."}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/" className="flex h-12 items-center justify-center rounded-full bg-leaf-700 px-6 font-bold text-white hover:bg-leaf-900">
            Kembali ke beranda
          </Link>
          <Link href="/akun" className="flex h-12 items-center justify-center rounded-full border border-leaf-200 px-6 font-semibold text-leaf-700 hover:bg-leaf-50">
            Lihat Akun
          </Link>
        </div>
      </Shell>
    );
  }

  if (pay.status !== "awaiting" && pay.status !== "submitted") {
    return (
      <Shell>
        <h1 className="text-center text-2xl font-extrabold text-ink">
          {pay.status === "expired" ? "Batas waktu pembayaran lewat" : pay.status === "cancelled" ? (sub ? "Langganan dibatalkan" : "Pesanan dibatalkan") : "Pembayaran belum terverifikasi"}
        </h1>
        <p className="mt-2 text-center text-muted">
          {pay.status === "expired"
            ? sub
              ? "Langganan Kakak tetap tersimpan dan belum aktif. Chat admin untuk melanjutkan pembayaran."
              : "Pesanan Kakak tetap tersimpan. Admin kami akan konfirmasi pembayaran lewat WhatsApp."
            : "Silakan hubungi admin kami lewat WhatsApp untuk bantuan."}
        </p>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="mx-auto mt-6 flex h-12 w-fit items-center gap-2 rounded-full bg-leaf-700 px-7 font-bold text-white hover:bg-leaf-900">
          <WhatsAppIcon className="h-5 w-5" /> Chat admin
        </a>
      </Shell>
    );
  }

  const loginNext = encodeURIComponent(`/bayar/${code}${key ? `?k=${key}` : ""}`);

  // ─── INVOICE PREVIEW (default) ─────────────────────────────────────────
  // Tampil pertama kali buyer buka link: list items + total + voucher input.
  // Baru lanjut ke QRIS saat klik "Bayar QRIS" (?pay=1).
  if (!showQris && !sub) {
    const detail = await getBayarDetail(code, key);
    const subtotal = detail?.subtotal ?? pay.subtotal;
    const discount = detail?.discount ?? 0;
    const shipping = detail?.shipping ?? pay.shipping;
    const total = detail?.total ?? (subtotal + shipping - discount);
    return (
      <Shell>
        <div className="mb-4 flex items-center gap-2">
          <ReceiptText className="h-5 w-5 text-leaf-700" />
          <h1 className="text-xl font-extrabold text-leaf-900">Tagihan {pay.code}</h1>
        </div>

        {!loggedIn && (
          <div className="mb-5 rounded-2xl bg-gradient-to-br from-sun-100 to-coral-100 p-4 ring-1 ring-sun-300">
            <div className="flex items-start gap-3">
              <Gift className="h-6 w-6 shrink-0 text-plum-700" strokeWidth={2} />
              <div className="min-w-0">
                <p className="font-bold text-leaf-900">Login dulu, dapat voucher Rp5.000!</p>
                <p className="mt-0.5 text-xs text-leaf-900/80">
                  Pembeli yang login pertama kali di healthila.id dapat voucher <b>Rp5.000</b> otomatis untuk pembelian berikutnya,
                  plus bisa pakai kode voucher di tagihan ini sebelum bayar.
                </p>
                <Link href={`/masuk?next=${loginNext}`} className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-full bg-leaf-700 px-5 text-sm font-bold text-white hover:bg-leaf-900">
                  <LogIn className="h-4 w-4" /> Masuk dulu
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Items */}
        {detail && detail.items.length > 0 && (
          <div className="mb-4 rounded-2xl bg-white p-4 ring-1 ring-leaf-100">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Rincian pesanan</p>
            <ul className="divide-y divide-leaf-50">
              {detail.items.map((it) => (
                <li key={it.id} className="flex items-start justify-between gap-3 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{it.name}</p>
                    <p className="text-xs text-muted">
                      {it.variant ? `${it.variant} · ` : ""}{it.quantity} {it.unit ?? ""} × {rupiah(it.unit_price)}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-ink tabular-nums">{rupiah(it.line_total)}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Totals + voucher */}
        <div className="rounded-2xl bg-white p-4 ring-1 ring-leaf-100">
          <dl className="space-y-1.5 text-sm">
            <Line k="Subtotal" v={rupiah(subtotal)} />
            {shipping > 0 && <Line k="Ongkir" v={rupiah(shipping)} />}
            {discount > 0 && <Line k="Diskon" v={`−${rupiah(discount)}`} className="text-leaf-700" />}
            {detail?.applied_vouchers?.map((v) => (
              <Line key={v.code} k={`Voucher ${v.code}`} v={`−${rupiah(v.discount)}`} className="text-leaf-700" />
            ))}
            <Line k="Kode unik" v={`+${rupiah(pay.unique_code)}`} className="text-muted" />
            <div className="my-2 border-t border-leaf-100" />
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold text-ink">Total bayar</span>
              <span className="text-2xl font-extrabold text-leaf-900 tabular-nums">{rupiah(pay.amount)}</span>
            </div>
          </dl>

          <VoucherForm
            code={code}
            k={key}
            loggedIn={loggedIn}
            available={detail?.available_vouchers ?? []}
            applied={detail?.applied_vouchers ?? []}
          />
        </div>

        {/* CTA Bayar QRIS */}
        <Link
          href={`/bayar/${code}?pay=1${key ? `&k=${key}` : ""}`}
          className="mt-6 flex h-14 w-full items-center justify-center rounded-full bg-leaf-700 text-base font-bold text-white hover:bg-leaf-900"
        >
          Bayar QRIS {rupiah(pay.amount)}
        </Link>

        <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-4 block text-center text-sm font-semibold text-leaf-700 hover:underline">
          Ada kendala? Chat admin via WhatsApp
        </a>
      </Shell>
    );
  }

  // ─── QRIS VIEW (?pay=1) ────────────────────────────────────────────────
  const svg = await qrSvg(qrisWithAmount(pay.amount));
  return (
    <Shell>
      {!sub && (
        <Link
          href={`/bayar/${code}${key ? `?k=${key}` : ""}`}
          className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-leaf-700 hover:underline"
        >
          ← Kembali ke rincian tagihan
        </Link>
      )}
      <p className="text-center text-sm font-semibold tracking-wide text-leaf-500 uppercase">
        {sub ? "Bayar langganan" : "Bayar pesanan"} {pay.code}
      </p>
      <CopyAmount amount={pay.amount} />
      <dl className="mx-auto mt-2 max-w-xs space-y-0.5 text-xs text-muted">
        <Line k={sub ? "Jus (setelah diskon langganan)" : "Belanja"} v={rupiah(pay.subtotal)} />
        <Line k={sub && pay.deliveries ? `Ongkir ${pay.deliveries}× kirim` : "Ongkir"} v={pay.shipping ? rupiah(pay.shipping) : "Gratis"} />
        <Line k="Kode unik" v={`+${rupiah(pay.unique_code)}`} />
      </dl>

      {pay.status === "awaiting" && <Countdown until={pay.expires_at} />}

      <div className="mx-auto mt-5 max-w-[280px] rounded-3xl bg-white p-3 ring-1 ring-leaf-100">
        <div className="[&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
        <p className="mt-1 text-center text-xs font-bold tracking-wide text-ink">QRIS · HEALTHILA</p>
      </div>
      <ol className="mx-auto mt-4 max-w-sm list-decimal space-y-1 pl-5 text-sm text-muted">
        <li>Scan dengan aplikasi bank / e-wallet apa saja (BCA, GoPay, OVO, DANA, ShopeePay…). Di HP: screenshot lalu buka dari galeri.</li>
        <li>Pastikan nominal <b className="text-ink">{rupiah(pay.amount)}</b> — persis sampai angka terakhir.</li>
        <li>Upload screenshot bukti bayar di bawah.{sub ? " Langganan aktif setelah admin mengecek pembayaran." : ""}</li>
      </ol>

      <ProofUpload code={pay.code} k={key} submitted={pay.status === "submitted"} />

      <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-6 block text-center text-sm font-semibold text-leaf-700 hover:underline">
        Ada kendala? Chat admin via WhatsApp
      </a>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="rounded-3xl bg-white/70 p-6 ring-1 ring-leaf-100 sm:p-8">{children}</div>
    </div>
  );
}

function Line({ k, v, className = "" }: { k: string; v: string; className?: string }) {
  return (
    <div className={`flex justify-between ${className}`}>
      <dt>{k}</dt>
      <dd className="tabular-nums">{v}</dd>
    </div>
  );
}
