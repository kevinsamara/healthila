"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { requestOtp, verifyOtp } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function send(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await requestOtp(phone);
      if (res.ok) {
        setSentTo(res.phone);
        setCode("");
      } else setError(res.error);
    });
  }

  function verify(e: React.FormEvent) {
    e.preventDefault();
    if (!sentTo) return;
    setError(null);
    startTransition(async () => {
      const res = await verifyOtp(sentTo, code);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.replace(next);
      router.refresh();
    });
  }

  const input =
    "mt-1 h-12 w-full rounded-xl border border-leaf-200 bg-white px-4 text-base outline-none focus:border-leaf-700";

  return (
    <div className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-leaf-100">
      {!sentTo ? (
        <form onSubmit={send}>
          <label className="block text-sm font-medium text-ink">
            Nomor WhatsApp
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              autoComplete="tel"
              placeholder="0812 3456 7890"
              autoFocus
              className={input}
            />
          </label>
          <Submit pending={pending} label="Kirim kode via WhatsApp" busy="Mengirim kode…" />
        </form>
      ) : (
        <form onSubmit={verify}>
          <p className="text-sm text-muted">
            Kode dikirim ke WhatsApp <span className="font-semibold text-ink">{sentTo}</span>.
          </p>
          <label className="mt-4 block text-sm font-medium text-ink">
            Kode 6 digit
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="••••••"
              autoFocus
              className={`${input} text-center text-2xl tracking-[0.5em]`}
            />
          </label>
          <Submit pending={pending} label="Masuk" busy="Memeriksa…" />
          <div className="mt-4 flex justify-between text-sm">
            <button type="button" onClick={() => setSentTo(null)} className="text-muted hover:text-ink">
              Ganti nomor
            </button>
            <button type="button" onClick={() => send()} disabled={pending} className="font-semibold text-leaf-700 hover:underline">
              Kirim ulang kode
            </button>
          </div>
        </form>
      )}
      {error && (
        <p className="mt-4 rounded-xl bg-plum-50 px-3 py-2 text-sm font-medium text-plum-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Submit({ pending, label, busy }: { pending: boolean; label: string; busy: string }) {
  return (
    <button
      disabled={pending}
      className="mt-5 h-12 w-full rounded-full bg-leaf-700 font-bold text-white hover:bg-leaf-900 disabled:opacity-60"
    >
      {pending ? busy : label}
    </button>
  );
}
