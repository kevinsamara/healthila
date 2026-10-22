/**
 * Conversion tracking for Google Analytics 4 and Meta Pixel. Both are loaded
 * by <Analytics /> only when their IDs are configured, so every call here is
 * a no-op otherwise. Client-only.
 */
type Params = Record<string, string | number | boolean | undefined | object[]>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// GA4 recommended event → Meta standard event.
const META: Record<string, string> = {
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
  generate_lead: "Lead",
  contact: "Contact",
};

export function trackEvent(name: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", name, params);
    const meta = META[name];
    if (meta && window.fbq) {
      const { value, currency } = params;
      window.fbq("track", meta, value != null ? { value, currency: currency ?? "IDR" } : {});
    }
  } catch {
    // tracking must never break the page
  }
}
