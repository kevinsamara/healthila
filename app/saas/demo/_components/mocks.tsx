import Link from "next/link";
import { ChevronRight, Package, TrendingUp } from "lucide-react";

/** All mocked demo views (dashboard, katalog, pelanggan, laporan, toko).
 *  Kept as a single file to avoid churn: these are purely illustrative. */

function formatIdr(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

/* ------- Dashboard ------- */

const KPI = [
  { label: "Omzet hari ini", value: "Rp 4,2jt", delta: "+18%", positive: true },
  { label: "Pesanan baru", value: "12", delta: "+3", positive: true },
  { label: "Siap kirim", value: "7", delta: "—", positive: true },
  { label: "Follow-up WA", value: "5", delta: "+2", positive: false },
];

function MiniBarChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values);
  return (
    <div className="flex gap-2">
      {values.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex h-32 w-full items-end">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-fuchsia-400"
              style={{ height: `${Math.max(6, (v / max) * 100)}%` }}
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold text-slate-300">{v}jt</span>
            <span className="text-[10px] text-slate-500">{labels[i]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardView() {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KPI.map((k) => (
          <div key={k.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{k.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">{k.value}</p>
            <p className={`mt-1 flex items-center gap-1 text-[11px] ${k.positive ? "text-emerald-400" : "text-amber-300"}`}>
              <TrendingUp className="h-3 w-3" /> {k.delta} vs kemarin
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Omzet 7 hari terakhir</p>
              <p className="text-xs text-slate-500">Minggu lalu → hari ini</p>
            </div>
            <span className="rounded-md bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
              +18% WoW
            </span>
          </div>
          <MiniBarChart values={[2.1, 3.0, 2.6, 4.2, 3.8, 5.1, 4.2]} labels={["S", "S", "R", "K", "J", "S", "M"]} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-sm font-semibold text-white">Top produk minggu ini</p>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { n: "Jus Buah Mix 500ml", v: 54, color: "bg-indigo-400" },
              { n: "Hampers Sunrise", v: 38, color: "bg-fuchsia-400" },
              { n: "Buah Potong Jumbo", v: 27, color: "bg-amber-300" },
              { n: "Parcel Welcome Baby", v: 14, color: "bg-emerald-400" },
            ].map((p) => (
              <li key={p.n}>
                <div className="flex items-center justify-between">
                  <span className="text-slate-200">{p.n}</span>
                  <span className="text-xs text-slate-400">{p.v}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/10">
                  <div className={`h-full rounded-full ${p.color}`} style={{ width: `${(p.v / 54) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-indigo-400/40 bg-gradient-to-br from-indigo-500/10 to-slate-900/60 p-5">
        <p className="text-sm font-semibold text-white">👉 Tab "Pesanan" & "Broadcast WA" sudah terhubung ke data Healthila asli.</p>
        <p className="mt-1 text-xs text-slate-300">
          Dashboard, Katalog, Pelanggan, Laporan masih pakai data contoh. Akan dijadikan live di iterasi
          berikutnya setelah skema reporting disamakan.
        </p>
      </div>
    </div>
  );
}

/* ------- Katalog (mock) ------- */

const PRODUCTS = [
  { name: "Jus Buah Mix 500ml", sku: "JBM-500", price: 42000, stock: 86, status: "Aktif" },
  { name: "Hampers Sunrise", sku: "HMP-SUN", price: 320000, stock: 12, status: "Aktif" },
  { name: "Buah Potong Jumbo", sku: "BPT-JMB", price: 95000, stock: 24, status: "Aktif" },
  { name: "Parcel Welcome Baby", sku: "PCL-BBY", price: 475000, stock: 5, status: "Low stock" },
  { name: "Jus Immune Boost 6pack", sku: "JIB-6", price: 285000, stock: 0, status: "Habis" },
  { name: "Hampers Korporat 24 pcs", sku: "HMP-KRP-24", price: 2850000, stock: 3, status: "Aktif" },
];

function StockChip({ s }: { s: string }) {
  const style: Record<string, string> = {
    Aktif: "bg-emerald-400/15 text-emerald-300",
    "Low stock": "bg-amber-400/15 text-amber-300",
    Habis: "bg-rose-400/15 text-rose-300",
  };
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${style[s]}`}>{s}</span>
  );
}

export function KatalogView() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        {PRODUCTS.length} produk ·{" "}
        <span className="text-emerald-400">{PRODUCTS.filter((p) => p.status === "Aktif").length} aktif</span>
        {" · "}
        <span className="text-amber-300">{PRODUCTS.filter((p) => p.status === "Low stock").length} low stock</span>
        {" · "}
        <span className="text-rose-400">{PRODUCTS.filter((p) => p.status === "Habis").length} habis</span>
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <div key={p.sku} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20">
            <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/10 to-amber-500/10">
              <div className="flex h-full items-center justify-center">
                <Package className="h-8 w-8 text-white/30" />
              </div>
            </div>
            <div className="mt-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{p.name}</p>
                <p className="font-mono text-[10px] text-slate-500">{p.sku}</p>
              </div>
              <StockChip s={p.status} />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="font-display text-lg font-bold text-white">{formatIdr(p.price)}</p>
              <p className="text-xs text-slate-400">stok {p.stock}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------- Pelanggan (mock) ------- */

const SEGMENTS = [
  { label: "Pelanggan setia", count: 384, pct: 15.6, color: "bg-emerald-400" },
  { label: "Baru (30 hari)", count: 212, pct: 8.6, color: "bg-indigo-400" },
  { label: "Churn (>90 hari)", count: 198, pct: 8.0, color: "bg-rose-400" },
  { label: "Lainnya", count: 1664, pct: 67.8, color: "bg-slate-500" },
];

const CUSTOMERS = [
  { name: "Rina Pratiwi", phone: "0812-xxxx-1234", orders: 24, ltv: 3_820_000, tag: "setia" },
  { name: "Dedy Kurniawan", phone: "0812-xxxx-2244", orders: 8, ltv: 12_400_000, tag: "korporat" },
  { name: "Maya Lestari", phone: "0878-xxxx-7788", orders: 11, ltv: 1_950_000, tag: "setia" },
  { name: "Siti Nurhaliza", phone: "0821-xxxx-9012", orders: 2, ltv: 180_000, tag: "baru" },
];

export function PelangganView() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <p className="text-sm font-semibold text-white">Segmentasi otomatis (2.458 pelanggan)</p>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white/5">
          {SEGMENTS.map((s) => (
            <div key={s.label} className={s.color} style={{ width: `${s.pct}%` }} />
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SEGMENTS.map((s) => (
            <div key={s.label} className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <span className={`mt-1 h-2.5 w-2.5 rounded-full ${s.color}`} />
              <div>
                <p className="text-sm font-semibold text-white">{s.label}</p>
                <p className="text-xs text-slate-400">{s.count} · {s.pct}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-xs text-slate-400">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium">Nama</th>
              <th className="px-2 py-2.5 text-left font-medium">Nomor WA</th>
              <th className="px-2 py-2.5 text-right font-medium">Order</th>
              <th className="px-2 py-2.5 text-right font-medium">LTV</th>
              <th className="px-4 py-2.5 text-left font-medium">Tag</th>
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((c) => (
              <tr key={c.phone} className="border-t border-white/5">
                <td className="px-4 py-2.5 font-medium text-white">{c.name}</td>
                <td className="px-2 py-2.5 font-mono text-xs text-slate-400">{c.phone}</td>
                <td className="px-2 py-2.5 text-right text-slate-200">{c.orders}</td>
                <td className="px-2 py-2.5 text-right font-medium text-white">{formatIdr(c.ltv)}</td>
                <td className="px-4 py-2.5">
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-200">
                    {c.tag}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------- Laporan (mock) ------- */

export function LaporanView() {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Omzet November", v: "Rp 142jt", d: "+24% MoM" },
          { l: "Pesanan selesai", v: "812", d: "+18%" },
          { l: "AOV", v: "Rp 174rb", d: "+5%" },
          { l: "Return rate", v: "0,6%", d: "sehat" },
        ].map((k) => (
          <div key={k.l} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{k.l}</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">{k.v}</p>
            <p className="mt-1 text-[11px] text-emerald-400">{k.d}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <p className="text-sm font-semibold text-white">Omzet per channel (30 hari)</p>
        <div className="mt-4 space-y-3 text-sm">
          {[
            { ch: "WhatsApp", v: 68, color: "bg-emerald-400" },
            { ch: "Storefront web", v: 42, color: "bg-indigo-400" },
            { ch: "Tokopedia", v: 18, color: "bg-amber-300" },
            { ch: "Shopee", v: 14, color: "bg-fuchsia-400" },
          ].map((row) => (
            <div key={row.ch}>
              <div className="flex items-center justify-between">
                <span className="text-slate-200">{row.ch}</span>
                <span className="text-xs text-slate-400">Rp {row.v}jt</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-white/10">
                <div className={`h-full rounded-full ${row.color}`} style={{ width: `${(row.v / 68) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------- Toko (mock preview) ------- */

export function TokoView() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-white">Preview storefront</p>
          <p className="text-xs text-slate-400">Tampilan ini yang akan dilihat pelanggan di toko-anda.opsflow.id</p>
        </div>
        <Link href="/saas" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-white">
          Lihat landing pelanggan <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="ml-2">toko-anda.opsflow.id</span>
        </div>
        <div className="bg-gradient-to-b from-emerald-50 to-white p-6 text-slate-900">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Demo Store</p>
          <h2 className="mt-1 font-display text-2xl font-bold">Buah segar & hampers, diantar hari ini.</h2>
          <p className="mt-2 text-sm text-slate-600">
            Pesan sebelum jam 2 siang, sampai sore ini juga. Pembayaran QRIS, transfer, atau COD.
          </p>
          <div className="mt-4 flex gap-2">
            <button className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white">Belanja sekarang</button>
            <button className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700">Hampers Natal 🎄</button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Jus Mix 500ml", "Hampers Sunrise", "Buah Potong", "Parcel Baby"].map((p, i) => (
              <div key={p} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="aspect-square rounded-lg bg-gradient-to-br from-emerald-100 via-amber-50 to-rose-50" />
                <p className="mt-2 text-xs font-semibold">{p}</p>
                <p className="text-[11px] text-emerald-700">Rp {[42, 320, 95, 475][i]}.000</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
