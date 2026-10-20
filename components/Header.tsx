"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { nav } from "@/lib/site";
import { cartCount, useCart } from "@/lib/cart";

// The httpOnly session cookie is invisible here; hl_auth is a plain hint set alongside it.
const noop = () => () => {};
const readAuthHint = () => document.cookie.split("; ").includes("hl_auth=1");

export function Header() {
  const [open, setOpen] = useState(false);
  const count = cartCount(useCart());
  const pathname = usePathname(); // also re-reads the cookie after login/logout navigations
  const signedIn = useSyncExternalStore(noop, readAuthHint, () => false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:h-[72px]">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)} aria-label="Healthila — beranda">
          <Image src="/healthila-mark.png" alt="" width={256} height={256} priority className="h-10 w-10 rounded-full md:h-12 md:w-12" />
          <Image
            src="/healthila-wordmark.png"
            alt="Healthila — fruitful heart, eating smart"
            width={640}
            height={190}
            priority
            className="h-[30px] w-auto md:h-9"
          />
        </Link>

        <nav className="ml-6 hidden items-center gap-0.5 xl:flex">
          {nav.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`relative rounded-full px-3 py-2 text-[15px] font-medium whitespace-nowrap transition ${
                  active ? "text-coral-500" : "text-ink hover:text-leaf-700"
                }`}
              >
                {n.label}
                {active && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-coral-500" />}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href={signedIn ? "/akun" : "/masuk"}
            className="flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-leaf-700 hover:bg-leaf-50"
          >
            <UserIcon />
            <span className="hidden xl:inline">{signedIn ? "Akun" : "Masuk"}</span>
          </Link>
          <Link
            href="/keranjang"
            aria-label="Keranjang"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border-2 border-leaf-700 text-leaf-700 hover:bg-leaf-50"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime-400 px-1 text-xs font-bold text-leaf-900">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/katalog"
            className="hidden h-11 items-center rounded-full bg-sun-400 px-5 text-[15px] font-bold whitespace-nowrap text-leaf-900 shadow-sm hover:bg-sun-300 sm:flex"
          >
            Order Sekarang
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-leaf-700 hover:bg-leaf-50 xl:hidden"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-black/5 bg-white px-4 py-2 xl:hidden">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-base font-medium text-ink"
            >
              {n.label}
            </Link>
          ))}
          <Link href="/katalog" onClick={() => setOpen(false)} className="block py-3 text-base font-bold text-leaf-700">
            Lihat semua produk →
          </Link>
        </nav>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 7h12l-1 13H7L6 7z" />
      <path d="M9 7a3 3 0 016 0" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}
