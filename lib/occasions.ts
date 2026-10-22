/**
 * Gift occasions for parcel filters and seasonal landing pages. Keys are
 * stored on products.web_occasions in Healthila OS (healthila-crm 0106) —
 * keep in sync with healthila-crm lib/web-occasions.ts.
 */
import { Bird, Briefcase, Cake, Flower2, Gem, LampWallUp, type LucideIcon, Moon, TreePine } from "lucide-react";

export type Occasion = { key: string; label: string; icon: LucideIcon };

export const OCCASIONS: Occasion[] = [
  { key: "ulang-tahun", label: "Ulang Tahun", icon: Cake },
  { key: "jenguk", label: "Jenguk / Get Well", icon: Flower2 },
  { key: "lamaran", label: "Lamaran & Pernikahan", icon: Gem },
  { key: "duka", label: "Duka Cita", icon: Bird },
  { key: "kantor", label: "Kantor & Klien", icon: Briefcase },
  { key: "lebaran", label: "Lebaran", icon: Moon },
  { key: "natal", label: "Natal", icon: TreePine },
  { key: "imlek", label: "Imlek", icon: LampWallUp },
];

export const occasionLabel = (key: string) => OCCASIONS.find((o) => o.key === key)?.label ?? key;

/** Parcel price bands (lowest price a buyer can pay). */
export const PRICE_BANDS = [
  { key: "300", label: "s.d. 300rb", min: 0, max: 300_000 },
  { key: "300-500", label: "300–500rb", min: 300_001, max: 500_000 },
  { key: "500", label: "> 500rb", min: 500_001, max: Infinity },
] as const;
