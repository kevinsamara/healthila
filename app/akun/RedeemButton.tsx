"use client";

import { useState, useTransition } from "react";
import { redeemLoyaltyVoucher } from "./actions";

/** Tombol Tukar — konfirm dulu, lalu panggil server action.
 *  Response ok: alert + reload (revalidatePath sudah di-trigger). */
export function RedeemButton({
  voucherId, pointsCost, affordable, label,
}: { voucherId: string; pointsCost: number; affordable: boolean; label: string }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  async function go() {
    setErr(null);
    if (!confirm(`Tukar ${pointsCost} poin dengan "${label}"?\n\nPoin akan terpotong sekarang. Voucher langsung muncul di tab Voucher dan bisa dipakai di checkout.`)) return;
    start(async () => {
      const r = await redeemLoyaltyVoucher(voucherId);
      if (!r.ok) { setErr(r.error); return; }
      alert(`✓ Berhasil! Voucher "${r.code}" sudah masuk ke daftar voucher kakak.\nSisa poin: ${r.balance_after}`);
      // revalidatePath sudah dipanggil di server action — list akan refresh.
    });
  }

  if (!affordable) {
    return (
      <button disabled className="shrink-0 cursor-not-allowed rounded-full bg-leaf-100 px-3 py-1.5 text-xs font-bold text-muted">
        Poin kurang
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={go}
        disabled={pending}
        className="shrink-0 rounded-full bg-leaf-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-leaf-900 disabled:opacity-60"
      >
        {pending ? "Menukar…" : `Tukar ${pointsCost} poin`}
      </button>
      {err && <span className="text-[10px] text-plum-700">{err}</span>}
    </div>
  );
}
