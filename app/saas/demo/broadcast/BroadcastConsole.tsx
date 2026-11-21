"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Eye, Send } from "lucide-react";
import { previewBroadcastAction, sendBroadcastAction } from "../actions";
import type { SaasAudienceEntry } from "@/lib/saas/orders";

const TEMPLATES: { key: string; label: string; body: string }[] = [
  {
    key: "promo_hampers",
    label: "Promo hampers",
    body:
      "Halo {{nama}} 🎄\nHampers Natal Healthila sudah dibuka! Diskon 15% khusus sampai 10 Des.\n\nCek: https://healthila.id/hampers",
  },
  {
    key: "flash_jus",
    label: "Flash sale jus",
    body:
      "Halo {{nama}} ⚡\nFlash sale hari ini: Jus Buah Mix 500ml *2+1 FREE*. Berlaku sampai jam 15.00.\n\nPesan: https://healthila.id/jus-dessert",
  },
  {
    key: "reminder_cart",
    label: "Reminder keranjang",
    body:
      "Hai {{nama}}, keranjang kamu di Healthila masih berisi buah segar favorit.\nMasih tersedia kalau mau lanjut checkout: https://healthila.id/keranjang",
  },
];

function maskPhone(p: string): string {
  if (p.length <= 6) return p;
  return p.slice(0, 4) + "•".repeat(p.length - 7) + p.slice(-3);
}

export function BroadcastConsole() {
  const [templateKey, setTemplateKey] = useState(TEMPLATES[0].key);
  const [name, setName] = useState("Promo hampers 2026-11-21");
  const [message, setMessage] = useState(TEMPLATES[0].body);
  const [limit, setLimit] = useState(5);
  const [loyalOnly, setLoyalOnly] = useState(true);

  const [audience, setAudience] = useState<SaasAudienceEntry[] | null>(null);
  const [previewing, startPreview] = useTransition();
  const [previewErr, setPreviewErr] = useState<string | null>(null);

  const [confirm, setConfirm] = useState("");
  const [sending, startSend] = useTransition();
  const [sendResult, setSendResult] = useState<
    | { ok: true; bcId: string; sent: number; failed: number }
    | { ok: false; error: string }
    | null
  >(null);

  function pickTemplate(k: string) {
    setTemplateKey(k);
    const t = TEMPLATES.find((x) => x.key === k);
    if (t) {
      setMessage(t.body);
      setName(t.label + " · " + new Date().toISOString().slice(0, 10));
    }
    setAudience(null);
    setSendResult(null);
  }

  function preview() {
    setPreviewErr(null);
    startPreview(async () => {
      const res = await previewBroadcastAction(limit, loyalOnly);
      if (res.ok) setAudience(res.rows);
      else setPreviewErr(res.error);
    });
  }

  function send() {
    if (!audience || !audience.length) return;
    setSendResult(null);
    startSend(async () => {
      const res = await sendBroadcastAction({ name, message, audience, confirm });
      setSendResult(res);
      if (res.ok) setConfirm("");
    });
  }

  const previewMsg = message.replace(/\{\{nama\}\}/g, "Rina");

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-100">
          <p className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4" /> Ini kirim WA beneran dari nomor Healthila.
          </p>
          <p className="mt-1 text-amber-200/90">
            Preview dulu ke 5 kontak saja. Setelah yakin, ketik <code className="rounded bg-black/30 px-1">KIRIM</code>{" "}
            untuk konfirmasi. Semua recipient ditulis ke tabel <code>broadcast_recipients</code>.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-sm font-semibold text-white">1. Pilih template</p>
          <div className="mt-3 space-y-2">
            {TEMPLATES.map((t) => (
              <label
                key={t.key}
                className={
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition " +
                  (templateKey === t.key
                    ? "border-indigo-400 bg-indigo-500/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20")
                }
              >
                <input
                  type="radio"
                  name="tpl"
                  checked={templateKey === t.key}
                  onChange={() => pickTemplate(t.key)}
                  className="mt-1"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">{t.label}</p>
                  <p className="mt-1 whitespace-pre-wrap text-xs text-slate-400">{t.body}</p>
                </div>
              </label>
            ))}
          </div>

          <p className="mt-4 text-xs text-slate-400">Pesan (edit bebas; <code>&#123;&#123;nama&#125;&#125;</code> diganti nama pelanggan):</p>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setAudience(null);
            }}
            rows={5}
            className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 p-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-sm font-semibold text-white">2. Pilih audience</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-slate-400">Jumlah penerima</label>
              <input
                type="number"
                min={1}
                max={100}
                value={limit}
                onChange={(e) => {
                  setLimit(Math.max(1, Math.min(100, Number(e.target.value) || 1)));
                  setAudience(null);
                }}
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-slate-500">Maks 100 per broadcast untuk safety.</p>
            </div>
            <div>
              <label className="flex cursor-pointer items-center gap-2 pt-5 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={loyalOnly}
                  onChange={(e) => {
                    setLoyalOnly(e.target.checked);
                    setAudience(null);
                  }}
                />
                Hanya pelanggan setia (<code>is_loyal = true</code>)
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={preview}
            disabled={previewing}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-50"
          >
            <Eye className="h-3.5 w-3.5" /> {previewing ? "Mengambil…" : "Preview audience"}
          </button>

          {previewErr && <p className="mt-3 text-xs text-rose-300">{previewErr}</p>}

          {audience && (
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <div className="bg-white/5 px-3 py-2 text-xs text-slate-300">
                {audience.length} kontak akan menerima:
              </div>
              <ul className="divide-y divide-white/5 text-xs">
                {audience.map((a) => (
                  <li key={a.customer_id} className="flex items-center justify-between gap-3 px-3 py-2">
                    <span className="truncate text-white">{a.name ?? "(tanpa nama)"}</span>
                    <span className="font-mono text-slate-400">{maskPhone(a.phone_e164)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-rose-400/30 bg-rose-500/5 p-5">
          <p className="text-sm font-semibold text-white">3. Kirim</p>
          <p className="mt-1 text-xs text-slate-400">
            Ketik <code className="rounded bg-black/30 px-1">KIRIM</code> di bawah untuk konfirmasi, lalu klik tombol.
            Jumlah: {audience?.length ?? 0} penerima.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ketik: KIRIM"
              className="rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={send}
              disabled={!audience?.length || confirm !== "KIRIM" || sending}
              className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> {sending ? "Mengirim…" : `Kirim ke ${audience?.length ?? 0} kontak`}
            </button>
          </div>

          {sendResult && (
            <div
              className={
                "mt-4 rounded-xl p-3 text-sm " +
                (sendResult.ok
                  ? "border border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                  : "border border-rose-400/30 bg-rose-500/10 text-rose-100")
              }
            >
              {sendResult.ok ? (
                <>
                  <p className="font-semibold">Broadcast selesai ✓</p>
                  <p className="mt-1 text-[12px]">
                    Terkirim: {sendResult.sent} · Gagal: {sendResult.failed} · ID:{" "}
                    <code className="rounded bg-black/30 px-1 text-[10px]">{sendResult.bcId}</code>
                  </p>
                </>
              ) : (
                <p>{sendResult.error}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-emerald-500/5 to-slate-900/60 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Preview di WhatsApp
          </p>
          <div className="rounded-2xl bg-[#0b141a] p-3">
            <div className="rounded-2xl rounded-tl-sm bg-[#1f2c33] p-3">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-100">{previewMsg}</p>
              <p className="mt-1 text-right text-[10px] text-slate-500">08:42 ✓✓</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs text-slate-400">
          <p className="font-semibold text-slate-200">Aturan safety</p>
          <ul className="mt-2 space-y-1 list-disc pl-4">
            <li>Maks 100 penerima per broadcast</li>
            <li>Jeda random 0.2–0.6 detik antar kirim (anti-spam)</li>
            <li>Semua send ditulis ke audit <code>broadcasts</code> + <code>broadcast_recipients</code></li>
            <li>Error per kontak tidak menghentikan broadcast — dicatat sebagai failed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
