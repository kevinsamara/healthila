"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CsChat } from "./CsChat";
import { HilaAvatar } from "./Hila";

/** Floating "CS 24 Jam" button (above WhatsApp) opening the chat over any page. */
export function CsWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Full screen on phones: a link in the chat must reveal the page it opened.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- follows the route change
    if (window.innerWidth < 640) setOpen(false);
  }, [pathname]);

  if (pathname === "/cs") return null;
  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Chat dengan Hila, CS 24 Jam"
        className="fixed right-4 bottom-20 z-40 flex h-12 items-center gap-2 rounded-full bg-leaf-700 py-1 pr-4 pl-1 text-sm font-bold text-white shadow-lg ring-1 shadow-black/15 ring-white/40 transition hover:scale-105 sm:right-6 sm:bottom-[5.5rem]"
      >
        <HilaAvatar className="h-10 w-10" /> CS 24 Jam
      </button>
    );

  return (
    <div
      role="dialog"
      aria-label="CS 24 Jam Healthila"
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(640px,calc(100vh-6rem))] sm:w-[420px] sm:rounded-3xl sm:shadow-2xl sm:ring-1 sm:ring-black/10"
    >
      <div className="flex items-center gap-2 bg-leaf-700 px-4 py-3 text-white">
        <HilaAvatar className="h-9 w-9" />
        <p className="flex-1 leading-tight">
          <span className="block font-bold">Hila</span>
          <span className="block text-xs text-white/80">CS 24 Jam Healthila</span>
        </p>
        <button type="button" onClick={() => setOpen(false)} aria-label="Tutup" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15">
          <X className="h-5 w-5" />
        </button>
      </div>
      <CsChat embedded />
    </div>
  );
}
