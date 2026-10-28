"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ticket } from "lucide-react";
import { applyBayarVoucher } from "./actions";
import { rupiah } from "@/lib/format";

type AvailableVoucher = {
  code: string; name: string | null;
  kind: "nominal" | "percent" | string;
  amount: number;
  min_subtotal: number | null; max_discount: number | null;
  expires_at: string | null;
};
type AppliedVoucher = { code: string; name: string | null; discount: number };

/**
 * Voucher input + list voucher pribadi untuk /bayar invoice preview.
 * Immediate consume: begitu di-apply, voucher tersimpan di
 * voucher_redemptions + order discount + total langsung ter-update.
 */
export function VoucherForm({
  code, k, loggedIn, available, applied,
}: {
  code: string; k: string | null; loggedIn: boolean;
  available: AvailableVoucher[]; applied: AppliedVoucher[];
}) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function go(voucherCode: string) {
    setMsg(null);
    start(async () => {
      const r = await applyBayarVoucher(code, k, voucherCode);
      if (!r.ok) { setMsg(`✗ ${r.error}`); return; }
      setMsg(`✓ Voucher ${voucherCode.toUpperCase()} dipotong Rp${r.discount.toLocaleString("id-ID")}`);
      setInput("");
      router.refresh();
      setTimeout(() => setMsg(null), 4000);
    });
  }

  if (!loggedIn) {
    return (
      <p className="mt-4 rounded-xl bg-leaf-50 p-3 text-xs text-muted">
        <Ticket className="mr-1 inline h-4 w-4 align-[-3px] text-leaf-700" />
        Login untuk pakai voucher di tagihan ini.
      </p>
    );
  }

  return (
    <div className="mt-4 border-t border-leaf-100 pt-4">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
        <Ticket className="h-4 w-4 text-leaf-700" /> Pakai voucher
      </p>

      {/* Input manual */}
      <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) go(input.trim()); }} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))}
          placeholder="Masukkan kode voucher"
          className="flex-1 rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm font-mono uppercase outline-none focus:border-leaf-500"
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="rounded-lg bg-leaf-700 px-4 text-sm font-semibold text-white hover:bg-leaf-900 disabled:opacity-50"
        >
          {pending ? "..." : "Terapkan"}
        </button>
      </form>

      {msg && (
        <p className={`mt-2 text-xs font-semibold ${msg.startsWith("✓") ? "text-leaf-700" : "text-plum-700"}`}>
          {msg}
        </p>
      )}

      {/* Voucher pribadi yg bisa langsung di-pakai */}
      {available.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Voucher kakak</p>
          <ul className="space-y-1.5">
            {available.map((v) => (
              <li key={v.code} className="flex items-center justify-between gap-2 rounded-lg bg-sun-50 px-3 py-2 ring-1 ring-sun-200">
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm font-semibold text-plum-700">{v.code}</p>
                  <p className="truncate text-[11px] text-ink/80">
                    {v.name ?? "Voucher"} ·{" "}
                    {v.kind === "percent" ? `${v.amount}%` : rupiah(v.amount)}
                    {v.min_subtotal && v.min_subtotal > 0 ? ` · min ${rupiah(v.min_subtotal)}` : ""}
                    {v.expires_at ? ` · s/d ${v.expires_at}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => go(v.code)}
                  disabled={pending}
                  className="shrink-0 rounded-full bg-sun-400 px-3 py-1 text-[11px] font-bold text-leaf-900 hover:bg-sun-300 disabled:opacity-50"
                >
                  Pakai
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Yang sudah ter-apply */}
      {applied.length > 0 && (
        <div className="mt-3 rounded-lg bg-leaf-50 p-2 text-[11px] text-leaf-900">
          Voucher terpakai: {applied.map((v) => <b key={v.code} className="font-mono">{v.code}</b>).reduce((prev, curr, i) => <>{prev}{i > 0 ? ", " : ""}{curr}</>, <></>)}
        </div>
      )}
    </div>
  );
}
