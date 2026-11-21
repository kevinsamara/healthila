"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides Healthila-branded chrome (header, footer, floating widgets) on the generic SaaS demo pages under /saas. */
export function HideOnSaas({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/saas")) return null;
  return <>{children}</>;
}
