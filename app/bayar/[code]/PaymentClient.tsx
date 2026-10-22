"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { rupiah } from "@/lib/format";
import { uploadPaymentProof } from "./actions";
import { Camera, CircleCheck } from "lucide-react";

export function CopyAmount({ amount }: { amount: number }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(String(amount)).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="mx-auto mt-2 block text-center"
      title="Salin nominal"
    >
      <span className="text-4xl font-extrabold text-leaf-900">{rupiah(amount)}</span>
      <span className="ml-2 align-middle text-xs font-semibold text-leaf-700">{copied ? "disalin" : "salin"}</span>
    </button>
  );
}

export function Countdown({ until }: { until: string }) {
  const router = useRouter();
  const end = new Date(until).getTime();
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const ms = end - Date.now();
      setLeft(ms);
      if (ms <= 0) router.refresh();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [end, router]);
  if (left == null) return null;
  const s = Math.max(0, Math.floor(left / 1000));
  const hh = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return (
    <p className="mt-3 text-center text-sm text-muted">
      Bayar dalam <b className="font-mono text-plum-700">{hh}:{mm}:{ss}</b>
    </p>
  );
}

/** Downscale to ≤1600px JPEG so the upload stays small (server action limit). */
async function shrink(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("blob"))), "image/jpeg", 0.85));
  } catch {
    return file;
  }
}

export function ProofUpload({ code, k, submitted }: { code: string; k: string | null; submitted: boolean }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(submitted);
  const [pending, start] = useTransition();

  function send() {
    if (!file) return;
    setError(null);
    start(async () => {
      const blob = await shrink(file);
      if (blob.size > 3.8 * 1024 * 1024) return setError("Foto terlalu besar, coba screenshot saja.");
      const fd = new FormData();
      fd.append("photo", blob, "bukti.jpg");
      const res = await uploadPaymentProof(code, k, fd);
      if (!res.ok) return setError(res.error);
      setDone(true);
      setFile(null);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-leaf-50 p-4">
      {done && (
        <p className="mb-3 rounded-xl bg-white px-3 py-2 text-sm text-leaf-900">
          <CircleCheck className="mr-1 inline h-4 w-4 text-leaf-700 align-[-3px]" />
          Bukti bayar terkirim. Admin akan mengecek mutasi dan mengonfirmasi lewat WhatsApp. Salah upload? Kirim ulang di bawah.
        </p>
      )}
      <label className="block cursor-pointer rounded-xl border border-dashed border-leaf-300 bg-white px-3 py-3 text-center text-sm text-leaf-700 hover:border-leaf-500">
        {!file && <Camera className="mr-1.5 inline h-4 w-4 align-[-3px]" />}
        {file ? file.name : done ? "Ganti bukti bayar" : "Pilih screenshot bukti bayar"}
        <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </label>
      {error && <p className="mt-2 text-sm font-medium text-plum-700">{error}</p>}
      <button
        type="button"
        disabled={!file || pending}
        onClick={send}
        className="mt-3 h-11 w-full rounded-full bg-leaf-700 font-bold text-white hover:bg-leaf-900 disabled:opacity-50"
      >
        {pending ? "Mengirim…" : "Kirim bukti bayar"}
      </button>
    </div>
  );
}
