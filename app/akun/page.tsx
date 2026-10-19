import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccount, type AccountOrder } from "@/lib/session";
import { rupiah } from "@/lib/format";
import { logout } from "../masuk/actions";

export const metadata: Metadata = { title: "Akun Saya", robots: { index: false } };

export default async function AkunPage() {
  const account = await getAccount();
  if (!account) redirect("/masuk?next=/akun");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-leaf-900">
            {account.name ? `Halo, ${account.name.split(" ")[0]}` : "Akun Saya"}
          </h1>
          <p className="mt-1 text-muted">WhatsApp {account.phone}</p>
        </div>
        <form action={logout}>
          <button className="rounded-full border border-leaf-200 px-4 py-2 text-sm font-semibold text-muted hover:text-plum-700">
            Keluar
          </button>
        </form>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">Riwayat pesanan</h2>
        {account.orders.length === 0 ? (
          <div className="mt-4 rounded-3xl bg-white p-8 text-center ring-1 ring-leaf-100">
            <p className="text-muted">Belum ada pesanan dengan nomor ini.</p>
            <Link href="/katalog" className="mt-4 inline-block rounded-full bg-leaf-700 px-6 py-3 font-bold text-white hover:bg-leaf-900">
              Mulai belanja
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {account.orders.map((o) => (
              <li key={o.code} className="rounded-2xl bg-white p-5 ring-1 ring-leaf-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-ink">{o.code}</p>
                  <StatusBadge order={o} />
                </div>
                <p className="mt-1 text-sm text-muted">
                  Dipesan {fmtDate(o.order_date)}
                  {o.delivery_date ? ` · Kirim ${fmtDate(o.delivery_date)}` : ""}
                </p>
                {o.items && <p className="mt-2 line-clamp-2 text-sm text-ink">{o.items}</p>}
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className={o.payment_status === "paid" ? "font-semibold text-leaf-700" : "text-muted"}>
                    {o.payment_status === "paid" ? "Lunas" : "Menunggu pembayaran"}
                  </span>
                  <span className="font-bold text-ink">{rupiah(Number(o.total))}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {account.addresses.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-ink">Alamat tersimpan</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {account.addresses.map((a) => (
              <li key={a.id} className="rounded-2xl bg-white p-4 text-sm ring-1 ring-leaf-100">
                <p className="font-semibold text-ink">{a.recipient ?? a.label ?? "Alamat"}</p>
                <p className="mt-1 whitespace-pre-line text-muted">{a.address}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Alamat baru otomatis tersimpan saat Anda memesan.</p>
        </section>
      )}
    </div>
  );
}

const STATUS: Record<string, [string, string]> = {
  scheduled: ["Dijadwalkan", "bg-leaf-100 text-leaf-900"],
  processing: ["Diproses", "bg-lime-300 text-leaf-900"],
  prepared: ["Disiapkan", "bg-lime-300 text-leaf-900"],
  shipped: ["Dikirim", "bg-leaf-700 text-white"],
  cancelled: ["Dibatalkan", "bg-plum-100 text-plum-700"],
};

function StatusBadge({ order }: { order: AccountOrder }) {
  const [label, cls] =
    !order.confirmed && order.status !== "cancelled"
      ? ["Menunggu konfirmasi", "bg-plum-50 text-plum-700"]
      : STATUS[order.status] ?? [order.status, "bg-leaf-50 text-ink"];
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${cls}`}>{label}</span>;
}

function fmtDate(d: string) {
  return new Date(d + "T00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
