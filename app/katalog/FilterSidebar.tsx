"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { sections } from "@/lib/site";
import { priceRanges, sorts, toQuery, type Filters } from "./filters";

type Facet = [string, number][];
const GROUPS_COLLAPSED = 8;

export function FilterSidebar({
  filters,
  sectionCounts,
  groups,
  origins,
  availableCount,
  promoCount,
}: {
  filters: Filters;
  sectionCounts: Record<string, number>;
  groups: Facet;
  origins: Facet;
  availableCount: number;
  promoCount: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showAllGroups, setShowAllGroups] = useState(false);

  function update(patch: Partial<Filters>) {
    startTransition(() => router.replace(toQuery({ ...filters, ...patch }), { scroll: false }));
  }
  const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const active =
    !!filters.kategori || filters.jenis.length + filters.asal.length > 0 || !!filters.harga || filters.tersedia || filters.promo;
  // Keep selected types visible even when the list is collapsed.
  const visibleGroups = showAllGroups
    ? groups
    : groups.filter(([g], i) => i < GROUPS_COLLAPSED || filters.jenis.includes(g));

  return (
    <div className={`divide-y divide-black/5 text-sm transition-opacity ${pending ? "opacity-60" : ""}`}>
      <Group title="Urutkan">
        <select
          value={filters.urut}
          onChange={(e) => update({ urut: e.target.value })}
          className="h-11 w-full cursor-pointer rounded-xl border-0 bg-[#f4f6f5] px-3 font-medium text-ink ring-1 ring-black/5 outline-none focus:ring-leaf-500"
        >
          {sorts.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </Group>

      <Group title="Kategori">
        <div className="flex flex-wrap gap-2">
          <Pill active={!filters.kategori} onClick={() => update({ kategori: "", jenis: [] })}>
            Semua
          </Pill>
          {sections
            .filter((s) => sectionCounts[s.key])
            .map((s) => (
              <Pill key={s.key} active={filters.kategori === s.key} onClick={() => update({ kategori: s.key, jenis: [] })} count={sectionCounts[s.key]}>
                {s.label}
              </Pill>
            ))}
        </div>
      </Group>

      <Group title="Ketersediaan">
        <Switch on={filters.tersedia} onClick={() => update({ tersedia: !filters.tersedia })} label="Hanya yang tersedia" count={availableCount} />
        <Switch on={filters.promo} onClick={() => update({ promo: !filters.promo })} label="Sedang promo" count={promoCount} />
      </Group>

      <Group title="Harga">
        <div className="flex flex-wrap gap-2">
          <Pill active={!filters.harga} onClick={() => update({ harga: "" })}>
            Semua
          </Pill>
          {priceRanges.map((r) => (
            <Pill key={r.key} active={filters.harga === r.key} onClick={() => update({ harga: filters.harga === r.key ? "" : r.key })}>
              {r.label}
            </Pill>
          ))}
        </div>
      </Group>

      {groups.length > 1 && (
        <Group title="Jenis">
          <div className="space-y-0.5">
            {visibleGroups.map(([g, n]) => (
              <Check key={g} checked={filters.jenis.includes(g)} onChange={() => update({ jenis: toggle(filters.jenis, g) })} label={g} count={n} />
            ))}
          </div>
          {groups.length > GROUPS_COLLAPSED && (
            <button
              type="button"
              onClick={() => setShowAllGroups((v) => !v)}
              className="mt-2 px-2 text-sm font-semibold text-leaf-700 hover:underline"
            >
              {showAllGroups ? "Tampilkan lebih sedikit" : `Tampilkan semua (${groups.length})`}
            </button>
          )}
        </Group>
      )}

      {origins.length > 0 && (
        <Group title="Negara asal">
          <div className="flex flex-wrap gap-2">
            {origins.map(([flag, n]) => (
              <Pill key={flag} active={filters.asal.includes(flag)} onClick={() => update({ asal: toggle(filters.asal, flag) })} count={n}>
                <span className="text-base">{flag}</span>
              </Pill>
            ))}
          </div>
        </Group>
      )}

      {active && (
        <div className="pt-5">
          <button
            type="button"
            onClick={() => update({ kategori: "", jenis: [], asal: [], harga: "", tersedia: false, promo: false })}
            className="h-11 w-full rounded-full bg-[#f4f6f5] font-semibold text-ink hover:bg-plum-50 hover:text-plum-700"
          >
            Reset semua filter
          </button>
        </div>
      )}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-5 first:pt-0">
      <h3 className="mb-3 text-xs font-bold tracking-widest text-muted uppercase">{title}</h3>
      {children}
    </section>
  );
}

function Count({ n, active }: { n: number; active?: boolean }) {
  return (
    <span className={`min-w-6 rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold ${active ? "bg-white/25" : "bg-black/5 text-muted"}`}>
      {n}
    </span>
  );
}

function Pill({ active, onClick, count, children }: { active: boolean; onClick: () => void; count?: number; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition ${
        active ? "bg-leaf-700 text-white shadow-sm" : "bg-white text-ink ring-1 ring-black/10 hover:ring-leaf-500"
      }`}
    >
      {children}
      {count != null && <Count n={count} active={active} />}
    </button>
  );
}

function Switch({ on, onClick, label, count }: { on: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={onClick} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 hover:bg-leaf-50">
      <span className={`relative h-6 w-10 shrink-0 rounded-full transition ${on ? "bg-leaf-700" : "bg-black/15"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
      </span>
      <span className="flex-1 text-left text-ink">{label}</span>
      <Count n={count} />
    </button>
  );
}

function Check({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count: number }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-leaf-50">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 shrink-0 accent-leaf-700" />
      <span className="flex-1 truncate text-ink">{label}</span>
      <Count n={count} />
    </label>
  );
}
