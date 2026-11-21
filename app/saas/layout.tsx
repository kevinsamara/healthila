import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "OpsFlow — Dashboard Operasi UMKM",
    template: "%s · OpsFlow",
  },
  description:
    "Satu dashboard untuk CRM pesanan, katalog produk, broadcast WhatsApp dan toko online. Dirancang untuk UMKM & brand D2C.",
  robots: { index: false, follow: false },
};

function SaasHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/saas" className="flex items-center gap-2 text-slate-100">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-sm font-black text-slate-900">
            O
          </span>
          <span className="text-sm font-semibold tracking-tight">OpsFlow</span>
          <span className="ml-1 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-300">
            Demo
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/saas#fitur" className="hover:text-white">
            Fitur
          </Link>
          <Link href="/saas#harga" className="hover:text-white">
            Harga
          </Link>
          <Link href="/saas#faq" className="hover:text-white">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/saas/demo"
            className="inline-flex items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
          >
            Coba Demo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function SaasFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-8 text-sm text-slate-400 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-xs font-black text-slate-900">
            O
          </span>
          <span className="font-semibold text-slate-200">OpsFlow</span>
          <span className="text-slate-500">— Dashboard operasi untuk UMKM & brand D2C</span>
        </div>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} OpsFlow. Demo prototype.</p>
      </div>
    </footer>
  );
}

export default function SaasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SaasHeader />
      {children}
      <SaasFooter />
    </div>
  );
}
