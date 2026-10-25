"use client";

import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Package, Sparkles, Ticket, Heart, Lightbulb,
  Repeat, BellRing, MapPin, Menu, X,
} from "lucide-react";

export type TabKey =
  | "ringkasan" | "pesanan" | "loyalty" | "voucher" | "favorit"
  | "rekomendasi" | "langganan" | "pengingat" | "alamat";

export type TabDef = { key: TabKey; label: string; badge?: number | null };

const ICONS: Record<TabKey, typeof LayoutDashboard> = {
  ringkasan: LayoutDashboard,
  pesanan: Package,
  loyalty: Sparkles,
  voucher: Ticket,
  favorit: Heart,
  rekomendasi: Lightbulb,
  langganan: Repeat,
  pengingat: BellRing,
  alamat: MapPin,
};

/**
 * Sidebar + section container. Server page passes semua konten sebagai
 * children (keyed by TabKey) sehingga data fetching tetap SSR; client hanya
 * ngatur state tab aktif. Mobile pakai drawer collapsible, desktop sidebar
 * fixed di kiri.
 */
export function AccountShell({
  tabs, sections, initial,
}: {
  tabs: TabDef[];
  sections: Partial<Record<TabKey, ReactNode>>;
  initial?: TabKey;
}) {
  const [tab, setTab] = useState<TabKey>(initial ?? tabs[0]!.key);
  const [open, setOpen] = useState(false);

  const activeLabel = tabs.find((t) => t.key === tab)?.label ?? "";

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
      {/* Mobile tab trigger */}
      <button
        onClick={() => setOpen(true)}
        className="mb-4 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 ring-1 ring-leaf-100 md:hidden"
        aria-label="Buka menu akun"
      >
        <span className="font-semibold text-ink">{activeLabel}</span>
        <Menu className="h-5 w-5 text-muted" />
      </button>

      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden md:block">
          <nav className="sticky top-24 space-y-1 rounded-2xl bg-white p-2 ring-1 ring-leaf-100">
            {tabs.map((t) => <TabButton key={t.key} tab={t} active={tab === t.key} onClick={() => setTab(t.key)} />)}
          </nav>
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-50 md:hidden" onClick={() => setOpen(false)}>
            <div className="absolute inset-0 bg-black/40" />
            <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between">
                <p className="font-bold text-ink">Akun Saya</p>
                <button onClick={() => setOpen(false)} aria-label="Tutup"><X className="h-5 w-5 text-muted" /></button>
              </div>
              <nav className="space-y-1">
                {tabs.map((t) => (
                  <TabButton key={t.key} tab={t} active={tab === t.key} onClick={() => { setTab(t.key); setOpen(false); }} />
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Content */}
        <main className="min-w-0">
          {sections[tab] ?? <div className="rounded-2xl bg-white p-6 ring-1 ring-leaf-100 text-muted">Belum ada data.</div>}
        </main>
      </div>
    </div>
  );
}

function TabButton({ tab, active, onClick }: { tab: TabDef; active: boolean; onClick: () => void }) {
  const Icon = ICONS[tab.key];
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition ${
        active ? "bg-leaf-700 font-bold text-white" : "font-medium text-muted hover:bg-leaf-50 hover:text-ink"
      }`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-sun-400" : ""}`} />
      <span className="flex-1 truncate">{tab.label}</span>
      {tab.badge != null && tab.badge > 0 && (
        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? "bg-sun-400 text-leaf-900" : "bg-leaf-100 text-leaf-900"}`}>
          {tab.badge}
        </span>
      )}
    </button>
  );
}
