import { Heart, Trophy } from "lucide-react";
import type { Product } from "@/lib/catalog";

/** Automatic sales label (healthila-crm 0125). `size="xs"` for the compact Flash/HOT cards. */
export function SalesBadge({ badge, size = "sm" }: { badge: Product["sales_badge"]; size?: "sm" | "xs" }) {
  if (!badge) return null;
  const best = badge === "best_seller";
  const Icon = best ? Trophy : Heart;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold tracking-wide whitespace-nowrap uppercase shadow-sm ${
        best ? "bg-ink text-sun-300" : "bg-plum-700 text-white"
      } ${size === "xs" ? "px-1.5 py-0.5 text-[9px]" : "px-2.5 py-1 text-[11px]"}`}
    >
      <Icon className={`${size === "xs" ? "h-2.5 w-2.5" : "h-3 w-3"} ${best ? "" : "fill-current"}`} strokeWidth={2.4} />
      {best ? "Best Seller" : "Favorit"}
    </span>
  );
}
