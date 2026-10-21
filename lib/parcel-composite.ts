/**
 * Fruit pile layout for the parcel photo preview — copy of healthila-crm
 * lib/parcel-composite.ts (CRM preview); keep both identical so the admin's
 * fill-area adjustment matches the website. All values are % of the square preview.
 */
export type FillArea = { fill_x: number; fill_y: number; fill_w: number; fill_h: number };
export type PileSlot = { x: number; y: number; size: number };

export function pileSlots(a: FillArea): PileSlot[] {
  const size = Math.max(6, a.fill_w / 4.5);
  const step = size * 0.62;
  const rows = Math.max(1, Math.floor((a.fill_h - size * 0.4) / step) + 1);
  const out: PileSlot[] = [];
  for (let r = rows - 1; r >= 0; r--) {
    // Pyramid: fewer fruit higher up, drawn first so lower rows overlap them.
    const perRow = Math.max(1, Math.floor(a.fill_w / (size * 0.78)) - r);
    const width = (perRow - 1) * size * 0.78;
    const cy = a.fill_y + a.fill_h - size / 2 - r * step;
    for (let i = 0; i < perRow; i++) {
      out.push({ x: a.fill_x + a.fill_w / 2 - width / 2 + i * size * 0.78, y: cy, size: size * (1 - r * 0.04) });
    }
  }
  return out;
}
