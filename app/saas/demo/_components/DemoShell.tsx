"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  BarChart3,
  Bell,
  Boxes,
  LayoutDashboard,
  MessageCircle,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  Users,
} from "lucide-react";

type Tab = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  subtitle: string;
  live?: boolean;
};

const TABS: Tab[] = [
  { href: "/saas/demo", label: "Dashboard", icon: LayoutDashboard, subtitle: "Ringkasan operasi hari ini" },
  { href: "/saas/demo/pesanan", label: "Pesanan", icon: ShoppingBag, subtitle: "Pesanan masuk dari WhatsApp, storefront & marketplace", live: true },
  { href: "/saas/demo/katalog", label: "Katalog", icon: Boxes, subtitle: "Produk, varian, bundling & stok" },
  { href: "/saas/demo/broadcast", label: "Broadcast WA", icon: MessageCircle, subtitle: "Kirim promo ke pelanggan dengan template Meta", live: true },
  { href: "/saas/demo/pelanggan", label: "Pelanggan", icon: Users, subtitle: "Segmentasi pelanggan & riwayat belanja" },
  { href: "/saas/demo/laporan", label: "Laporan", icon: BarChart3, subtitle: "Omzet, top produk, cohort retensi" },
  { href: "/saas/demo/toko", label: "Storefront", icon: Store, subtitle: "Preview tampilan storefront pelanggan" },
];

export function DemoShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";

  const active =
    [...TABS].sort((a, b) => b.href.length - a.href.length).find(
      (t) => pathname === t.href || pathname.startsWith(t.href + "/"),
    ) ?? TABS[0];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-0 px-3 py-6 md:flex-row md:px-5 md:py-8">
      <aside className="flex-none md:w-56 md:pr-5">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
          <p className="px-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Demo Workspace
          </p>
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-xs font-black text-slate-900">
              D
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Demo Store</p>
              <p className="truncate text-[10px] text-slate-400">data Healthila · live</p>
            </div>
          </div>
          <nav className="mt-3 space-y-0.5">
            {TABS.map(({ href, label, icon: Icon, live }) => {
              const isActive = active.href === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition " +
                    (isActive
                      ? "bg-white/10 font-medium text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200")
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{label}</span>
                  {live && (
                    <span className="rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-300">
                      live
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 rounded-xl border border-indigo-400/30 bg-indigo-500/10 p-3">
            <p className="flex items-center gap-1 text-xs font-semibold text-indigo-200">
              <Sparkles className="h-3.5 w-3.5" /> Mode Demo
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-indigo-100/80">
              Tab bertanda LIVE pakai data Healthila beneran. Aksi edit, kirim bukti, dan broadcast akan
              benar-benar dieksekusi.
            </p>
            <Link
              href="/saas"
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-200 hover:text-white"
            >
              ← Kembali ke landing
            </Link>
          </div>
        </div>
      </aside>

      <main className="mt-5 flex-1 md:mt-0">
        <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
          <div>
            <h1 className="font-display text-xl font-bold text-white">{active.label}</h1>
            <p className="text-xs text-slate-400">{active.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                <input
                  placeholder="Cari…"
                  className="w-48 rounded-lg border border-white/10 bg-white/5 py-1.5 pl-8 pr-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                />
              </div>
            </div>
            <button className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
