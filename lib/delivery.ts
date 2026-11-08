/**
 * Courier runs (kloter) offered at checkout — times come from the CRM's
 * dispatch schedule (web_delivery_slots, healthila-crm 0106). Client-safe.
 */
export type DeliverySlot = { n: number; label: string; at: string; enabled: boolean };

/** Same lead time as web_place_order: a run closes 60 min before it leaves. */
export const SLOT_LEAD_MIN = 60;

/** Jakarta "now" as YYYY-MM-DD and minutes since midnight. */
export function jakartaNow(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")) };
}

const toMinutes = (at: string) => {
  const [h, m] = at.split(":").map(Number);
  return h * 60 + m;
};

/** "09:50:00" → "09.50" */
export const slotTime = (at: string) => at.slice(0, 5).replace(":", ".");

/** Can this run still be booked for `date` (YYYY-MM-DD; empty = tomorrow)? */
export function slotOpen(slot: DeliverySlot, date: string, now = jakartaNow()) {
  if (!slot.enabled) return false;
  if (!date || date !== now.date) return true;
  return now.minutes <= toMinutes(slot.at) - SLOT_LEAD_MIN;
}

/** Last moment today to order for same-day delivery, e.g. "15.50"; null when past. */
export function sameDayCutoff(slots: DeliverySlot[], now = jakartaNow()) {
  const open = slots.filter((s) => s.enabled).map((s) => toMinutes(s.at) - SLOT_LEAD_MIN).filter((m) => m >= now.minutes);
  if (!open.length) return null;
  const m = Math.max(...open);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}.${String(m % 60).padStart(2, "0")}`;
}

/** Healthila is closed on Sunday: no deliveries (owner, Nov 2026). */
export const isSunday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay() === 0;

export function addDays(date: string, n: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Default delivery day when none is picked: tomorrow, or Monday when tomorrow is Sunday. */
export function nextDeliveryDate(today = jakartaNow().date) {
  const d = addDays(today, 1);
  return isSunday(d) ? addDays(d, 1) : d;
}

/** "Senin, 9 November" */
export const dayLabel = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

/**
 * Faster delivery with an ojol app, booked by admin. Ongkir is the app's tariff
 * and the order is confirmed on WhatsApp first — never QRIS.
 */
export const INSTANT_APPS = ["Gojek", "Grab", "Shopee", "Maxim"] as const;
export type InstantApp = (typeof INSTANT_APPS)[number];
