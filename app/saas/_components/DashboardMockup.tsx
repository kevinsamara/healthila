import { Bell, Search, TrendingUp } from "lucide-react";

const ROWS = [
  { id: "#HL-2041", name: "Rina Pratiwi", items: "Jus Buah Mix 500ml ×2", total: "Rp 148.000", status: "Diproses", channel: "WA" },
  { id: "#HL-2040", name: "Budi Hartono", items: "Hampers Sunrise", total: "Rp 320.000", status: "Siap kirim", channel: "Web" },
  { id: "#HL-2039", name: "Siti Nurhaliza", items: "Buah Potong Jumbo", total: "Rp 95.000", status: "Diproses", channel: "WA" },
  { id: "#HL-2038", name: "Agus Setiawan", items: "Parcel Welcome Baby", total: "Rp 475.000", status: "Diantar", channel: "Web" },
];

const STATUS_STYLE: Record<string, string> = {
  Diproses: "bg-amber-400/15 text-amber-300",
  "Siap kirim": "bg-sky-400/15 text-sky-300",
  Diantar: "bg-emerald-400/15 text-emerald-300",
};

export function DashboardMockup() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/10 to-transparent blur-3xl" />
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-indigo-900/30 backdrop-blur">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/60 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          <div className="mx-auto flex items-center gap-2 rounded-md bg-white/5 px-3 py-1 text-xs text-slate-400">
            <span className="text-emerald-400">●</span> app.opsflow.id/dashboard
          </div>
        </div>

        <div className="flex">
          {/* sidebar */}
          <aside className="hidden w-48 flex-none border-r border-white/10 bg-slate-950/40 px-3 py-4 md:block">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Menu</p>
            <nav className="mt-2 space-y-0.5 text-sm">
              <div className="rounded-md bg-white/10 px-2.5 py-1.5 font-medium text-white">Dashboard</div>
              <div className="rounded-md px-2.5 py-1.5 text-slate-400">Pesanan</div>
              <div className="rounded-md px-2.5 py-1.5 text-slate-400">Katalog</div>
              <div className="rounded-md px-2.5 py-1.5 text-slate-400">Broadcast WA</div>
              <div className="rounded-md px-2.5 py-1.5 text-slate-400">Pelanggan</div>
              <div className="rounded-md px-2.5 py-1.5 text-slate-400">Laporan</div>
            </nav>
          </aside>

          {/* main */}
          <div className="flex-1 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-white">Selamat pagi, Admin ☀️</h3>
                <p className="text-xs text-slate-400">Senin, 21 November — 12 pesanan baru sejak jam 6 pagi</p>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                  <input
                    readOnly
                    value="Cari pesanan…"
                    className="w-40 rounded-md border border-white/10 bg-white/5 py-1 pl-7 pr-2 text-xs text-slate-400 outline-none"
                  />
                </div>
                <button className="rounded-md border border-white/10 bg-white/5 p-1.5 text-slate-400">
                  <Bell className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Omzet hari ini", value: "Rp 4,2jt", d: "+18%" },
                { label: "Pesanan baru", value: "12", d: "+3" },
                { label: "Siap kirim", value: "7", d: null },
                { label: "Follow-up WA", value: "5", d: null },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-white/10 bg-slate-950/40 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">{s.label}</p>
                  <p className="mt-1 font-display text-xl font-bold text-white">{s.value}</p>
                  {s.d && (
                    <p className="mt-0.5 flex items-center gap-0.5 text-[10px] text-emerald-400">
                      <TrendingUp className="h-2.5 w-2.5" /> {s.d}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-white/10 bg-slate-950/40">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                <p className="text-sm font-semibold text-white">Pesanan masuk</p>
                <span className="text-[10px] text-slate-500">realtime · 4 dari 12</span>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="px-4 py-2 font-medium">Order</th>
                    <th className="px-2 py-2 font-medium">Pelanggan</th>
                    <th className="px-2 py-2 font-medium">Item</th>
                    <th className="px-2 py-2 font-medium">Total</th>
                    <th className="px-2 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Dari</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.id} className="border-t border-white/5 text-slate-300">
                      <td className="px-4 py-2 font-mono text-slate-400">{r.id}</td>
                      <td className="px-2 py-2 font-medium text-white">{r.name}</td>
                      <td className="px-2 py-2 text-slate-400">{r.items}</td>
                      <td className="px-2 py-2">{r.total}</td>
                      <td className="px-2 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLE[r.status]}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-slate-400">{r.channel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
