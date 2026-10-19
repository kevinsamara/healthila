"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { sections } from "@/lib/site";
import { priceRanges, sorts, toQuery, type Filters } from "./filters";

type Facet = [string, number][];

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

  function update(patch: Partial<Filters>) {
    startTransition(() => router.replace(toQuery({ ...filters, ...patch }), { scroll: false }));
  }
  const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const active =
    !!filters.kategori || filters.jenis.length + filters.asal.length > 0 || !!filters.harga || filters.tersedia || filters.promo;

  return (
    <div className={`space-y-6 text-sm transition-opacity ${pending ? "opacity-60" : ""}`}>
      <Group title="Urutkan">
        <select
          value={filters.urut}
          onChange={(e) => update({ urut: e.target.value })}
          className="w-full rounded-xl border border-leaf-200 bg-white px-3 py-2"
        >
          {sorts.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </Group>

      <Group title="Kategori">
        <Radio checked={!filters.kategori} onChange={() => update({ kategori: "", jenis: [] })} label="Semua" />
        {sections
          .filter((s) => sectionCounts[s.key])
          .map((s) => (
            <Radio
              key={s.key}
              checked={filters.kategori === s.key}
              onChange={() => update({ kategori: s.key, jenis: [] })}
              label={s.label}
              count={sectionCounts[s.key]}
            />
          ))}
      </Group>

      <Group title="Ketersediaan">
        <Check checked={filters.tersedia} onChange={() => update({ tersedia: !filters.tersedia })} label="Hanya yang tersedia" count={availableCount} />
        <Check checked={filters.promo} onChange={() => update({ promo: !filters.promo })} label="Sedang promo" count={promoCount} />
      </Group>

      <Group title="Harga">
        <Radio checked={!filters.harga} onChange={() => update({ harga: "" })} label="Semua harga" />
        {priceRanges.map((r) => (
          <Radio key={r.key} checked={filters.harga === r.key} onChange={() => update({ harga: r.key })} label={r.label} />
        ))}
      </Group>

      {groups.length > 1 && (
        <Group title="Jenis">
          <div className="max-h-72 space-y-0.5 overflow-y-auto pr-1">
            {groups.map(([g, n]) => (
              <Check key={g} checked={filters.jenis.includes(g)} onChange={() => update({ jenis: toggle(filters.jenis, g) })} label={g} count={n} />
            ))}
          </div>
        </Group>
      )}

      {origins.length > 0 && (
        <Group title="Negara asal">
          {origins.map(([flag, n]) => (
            <Check key={flag} checked={filters.asal.includes(flag)} onChange={() => update({ asal: toggle(filters.asal, flag) })} label={flag} count={n} />
          ))}
        </Group>
      )}

      {active && (
        <button
          type="button"
          onClick={() => update({ kategori: "", jenis: [], asal: [], harga: "", tersedia: false, promo: false })}
          className="w-full rounded-full border border-leaf-200 py-2 font-semibold text-leaf-700 hover:bg-leaf-50"
        >
          Reset filter
        </button>
      )}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 font-bold text-ink">{title}</legend>
      <div className="space-y-0.5">{children}</div>
    </fieldset>
  );
}

function Radio({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count?: number }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 hover:bg-leaf-50">
      <input type="radio" checked={checked} onChange={onChange} className="accent-leaf-700" />
      <span className="flex-1 text-ink">{label}</span>
      {count != null && <span className="text-xs text-muted">{count}</span>}
    </label>
  );
}

function Check({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count?: number }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 hover:bg-leaf-50">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-leaf-700" />
      <span className="flex-1 text-ink">{label}</span>
      {count != null && <span className="text-xs text-muted">{count}</span>}
    </label>
  );
}
