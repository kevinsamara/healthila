"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { submitAccessCodeAction } from "./actions";

export function SaasGate() {
  const [state, action, pending] = useActionState(
    async (_prev: { ok: boolean; error?: string } | null, formData: FormData) => {
      return submitAccessCodeAction(formData);
    },
    null,
  );

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-5">
      <form
        action={action}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-slate-900">
            <Lock className="h-5 w-5" />
          </div>
        </div>
        <h1 className="text-center font-display text-xl font-bold text-white">Akses OpsFlow Demo</h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          Masukkan kode akses untuk melihat demo.
        </p>

        <label className="mt-6 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Kode akses
        </label>
        <input
          name="code"
          type="password"
          inputMode="numeric"
          autoFocus
          autoComplete="off"
          placeholder="••••••"
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2.5 text-center font-mono text-lg tracking-widest text-white placeholder:text-slate-600 focus:border-indigo-400 focus:outline-none"
        />

        {state?.error && (
          <p className="mt-3 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-center text-xs text-rose-200">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 w-full rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50"
        >
          {pending ? "Memeriksa…" : "Masuk"}
        </button>

        <p className="mt-5 text-center text-[11px] text-slate-500">
          Lupa kode? Hubungi tim penjualan untuk minta akses demo.
        </p>
      </form>
    </div>
  );
}
