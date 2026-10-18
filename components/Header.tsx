"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { nav } from "@/lib/site";
import { cartCount, useCart } from "@/lib/cart";

export function Header() {
  const [open, setOpen] = useState(false);
  const count = cartCount(useCart());

  return (
    <header className="sticky top-0 z-40 border-b border-leaf-100 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image src="/healthila-logo.png" alt="" width={36} height={36} className="rounded-full" priority />
          <span className="text-xl font-extrabold tracking-tight text-leaf-700">Healthila</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium text-muted hover:text-leaf-700">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/keranjang"
            className="relative flex h-10 items-center gap-2 rounded-full bg-leaf-700 px-4 text-sm font-semibold text-white hover:bg-leaf-900"
          >
            <CartIcon />
            <span className="hidden sm:inline">Keranjang</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime-400 px-1 text-xs font-bold text-leaf-900">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-leaf-700 hover:bg-leaf-50 md:hidden"
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
        <nav className="border-t border-leaf-100 bg-cream px-4 py-2 md:hidden">
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
        </nav>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 7h12l-1 13H7L6 7z" />
      <path d="M9 7a3 3 0 016 0" />
    </svg>
  );
}
