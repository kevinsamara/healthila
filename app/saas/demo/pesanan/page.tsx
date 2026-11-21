import Link from "next/link";
import { listRecentOrders, type SaasOrderRow } from "@/lib/saas/orders";
import { rupiah } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pesanan" };

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-slate-400/15 text-slate-200",
  scheduled: "bg-sky-400/15 text-sky-300",
  confirmed: "bg-indigo-400/15 text-indigo-300",
  processing: "bg-amber-400/15 text-amber-300",
  shipped: "bg-fuchsia-400/15 text-fuchsia-300",
  delivered: "bg-emerald-400/15 text-emerald-300",
  completed: "bg-emerald-400/15 text-emerald-300",
  cancelled: "bg-rose-400/15 text-rose-300",
};

function StatusChip({ s }: { s: string }) {
  const cls = STATUS_STYLE[s] ?? "bg-white/10 text-slate-200";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}>{s}</span>;
}

function timeago(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const m = Math.round(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.round(h / 24);
  return `${d} hari lalu`;
}

export default async function PesananListPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const sp = await searchParams;
  const filter = sp.status ?? "all";

  let rows: SaasOrderRow[] = [];
  let err: string | null = null;
  try {
    rows = await listRecentOrders(60);
  } catch (e) {
    err = e instanceof Error ? e.message : "gagal muat pesanan";
  }

  const counts: Record<string, number> = { all: rows.length };
  for (const r of rows) counts[r.status] = (counts[r.status] ?? 0) + 1;

  const visible = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  const chips = ["all", "scheduled", "processing", "shipped", "delivered"];

  return (
    <div className="space-y-5">
      {err && (
        <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-100">
          <p className="font-semibold">Gagal mengambil data pesanan.</p>
          <p className="mt-1 text-amber-200/80">{err}</p>
          <p className="mt-2 text-[11px] text-amber-200/60">
            Pastikan env <code className="rounded bg-black/30 px-1">WEB_ORDER_SECRET</code>,{" "}
            <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
            <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> sudah terisi.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {chips.map((c) => {
          const active = filter === c;
          return (
            <Link
              key={c}
              href={c === "all" ? "/saas/demo/pesanan" : `/saas/demo/pesanan?status=${c}`}
              className={
                "rounded-full px-3 py-1 text-xs font-medium transition " +
                (active
                  ? "bg-white text-slate-900"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10")
              }
            >
              {c === "all" ? "Semua" : c}
              <span className="ml-1 text-[10px] opacity-70">({counts[c] ?? 0})</span>
            </Link>
          );
        })}
        <span className="ml-auto rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
          live · {rows.length} pesanan terbaru
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-xs text-slate-400">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium">Order</th>
              <th className="px-2 py-2.5 text-left font-medium">Pelanggan</th>
              <th className="px-2 py-2.5 text-left font-medium">Sumber</th>
              <th className="px-2 py-2.5 text-left font-medium">Delivery</th>
              <th className="px-2 py-2.5 text-right font-medium">Total</th>
              <th className="px-2 py-2.5 text-left font-medium">Status</th>
              <th className="px-4 py-2.5 text-right font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((o) => (
              <tr key={o.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-4 py-2.5">
                  <p className="font-mono text-xs text-slate-300">{o.code}</p>
                  <p className="text-[10px] text-slate-500">{timeago(o.created_at)}</p>
                </td>
                <td className="px-2 py-2.5">
                  <p className="font-medium text-white">
                    {o.customer_name ?? o.recipient_name ?? <span className="text-slate-500">(tanpa nama)</span>}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {o.customer_phone ?? o.recipient_phone ?? ""}
                  </p>
                </td>
                <td className="px-2 py-2.5 text-slate-300">{o.source ?? "—"}</td>
                <td className="px-2 py-2.5 text-slate-300">
                  {o.delivery_date ?? "—"}
                </td>
                <td className="px-2 py-2.5 text-right font-medium text-white">
                  {o.total ? rupiah(Number(o.total)) : <span className="text-slate-500">—</span>}
                </td>
                <td className="px-2 py-2.5">
                  <StatusChip s={o.status} />
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link
                    href={`/saas/demo/pesanan/${o.id}`}
                    className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white hover:bg-white/10"
                  >
                    Buka →
                  </Link>
                </td>
              </tr>
            ))}
            {visible.length === 0 && !err && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-slate-500">
                  Tidak ada pesanan pada filter ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
