"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Percent, Zap, Truck, Crown, Gift } from "lucide-react";

/**
 * Modal "Ayo Login!" — tampil ke pengunjung yang belum login untuk mendorong
 * sign-up. Highlight benefit: voucher, flash sale, free delivery, loyalty.
 *
 * Trigger: 4 detik setelah homepage load. Hanya kalau cookie hl_auth=1 tidak
 * ada DAN localStorage snooze belum di-set. Dismiss ("Nanti saja") snooze 7
 * hari. Kalau user klik Masuk, langsung redirect ke /masuk.
 *
 * Tidak tampil di /masuk, /otp, /bayar — halaman flow transaksi yang sudah
 * ada CTA sendiri.
 */
const SNOOZE_KEY = "healthila_login_prompt_snoozed";
const SNOOZE_DAYS = 7;
const SKIP_PATHS = ["/masuk", "/otp", "/bayar", "/akun", "/profil"];

export function LoginPrompt() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (SKIP_PATHS.some((p) => pathname?.startsWith(p))) return;
    // Already signed in — never show.
    if (document.cookie.split("; ").includes("hl_auth=1")) return;
    // Snoozed — honor until deadline.
    try {
      const until = Number(localStorage.getItem(SNOOZE_KEY) ?? "0");
      if (until > Date.now()) return;
    } catch { /* no storage — show */ }

    const t = setTimeout(() => setOpen(true), 4000);
    return () => clearTimeout(t);
  }, [pathname]);

  function snooze() {
    try {
      localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_DAYS * 86_400_000));
    } catch { /* ignore */ }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-labelledby="login-prompt-title"
    >
      {/* backdrop */}
      <button onClick={snooze} aria-label="Tutup" className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* card */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-leaf-100">
        <button
          onClick={snooze}
          aria-label="Tutup"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-leaf-900 hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Hero gradient dengan icon-icon manfaat */}
        <div className="relative overflow-hidden bg-gradient-to-br from-sun-100 via-leaf-50 to-white px-6 pt-8 pb-6 text-center">
          <div className="pointer-events-none absolute -left-6 -top-4 h-24 w-24 rounded-full bg-coral-500/15 blur-xl" />
          <div className="pointer-events-none absolute -right-8 bottom-0 h-24 w-24 rounded-full bg-leaf-700/10 blur-xl" />
          {/* 5 badge icon floating */}
          <div className="relative mb-4 flex items-center justify-center gap-2">
            <Badge color="bg-coral-500 text-white"><Percent className="h-5 w-5" strokeWidth={2.6} /></Badge>
            <Badge color="bg-leaf-700 text-white"><Truck className="h-5 w-5" strokeWidth={2.4} /></Badge>
            <Badge color="bg-sun-400 text-leaf-900"><Zap className="h-6 w-6 fill-leaf-900" strokeWidth={2.2} /></Badge>
            <Badge color="bg-leaf-700 text-white"><Gift className="h-5 w-5" strokeWidth={2.4} /></Badge>
            <Badge color="bg-sun-400 text-leaf-900"><Crown className="h-5 w-5" strokeWidth={2.4} /></Badge>
          </div>
          <h2 id="login-prompt-title" className="text-3xl font-extrabold leading-tight text-leaf-900">
            Ayo Login!
          </h2>
          <p className="mt-1.5 text-sm leading-snug text-ink/80">
            Login sekali, nikmati manfaatnya di setiap pesanan.
          </p>
        </div>

        {/* Benefits list */}
        <ul className="divide-y divide-leaf-50 px-5 py-4 text-sm">
          <BenefitRow icon={<Percent className="h-4 w-4" />} tone="bg-coral-100 text-coral-500">
            <b>Voucher spesial</b> — termasuk voucher ulang tahun otomatis
          </BenefitRow>
          <BenefitRow icon={<Zap className="h-4 w-4" />} tone="bg-sun-100 text-sun-500">
            <b>Akses Flash Sale</b> — diskon terbatas waktu di buah pilihan
          </BenefitRow>
          <BenefitRow icon={<Truck className="h-4 w-4" />} tone="bg-leaf-100 text-leaf-700">
            <b>Free delivery</b> — 2 order pertama bebas ongkir
          </BenefitRow>
          <BenefitRow icon={<Crown className="h-4 w-4" />} tone="bg-sun-100 text-sun-500">
            <b>Loyalty points</b> — tukar poin jadi voucher potongan
          </BenefitRow>
        </ul>

        {/* CTA */}
        <div className="space-y-2 px-5 pb-5">
          <Link
            href="/masuk?next=/"
            onClick={() => setOpen(false)}
            className="flex h-12 items-center justify-center rounded-full bg-leaf-700 px-6 text-base font-bold text-white hover:bg-leaf-900"
          >
            Masuk / Daftar
          </Link>
          <button
            onClick={snooze}
            className="block w-full py-2 text-sm text-muted hover:text-ink"
          >
            Nanti saja
          </button>
        </div>
      </div>
    </div>
  );
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-md ring-2 ring-white ${color}`}>
      {children}
    </span>
  );
}

function BenefitRow({
  icon, tone, children,
}: { icon: React.ReactNode; tone: string; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tone}`}>
        {icon}
      </span>
      <span className="leading-snug text-ink/90">{children}</span>
    </li>
  );
}
