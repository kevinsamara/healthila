import "server-only";
import { webSecret } from "./web-rpc";

/**
 * Ongkir estimate from Healthila OS (POST /api/public/ongkir, healthila-crm
 * 0107): learned fee → area zone → Google route band. Server-to-server with
 * WEB_ORDER_SECRET; admin still confirms the final ongkir.
 */
export type OngkirEstimate =
  | { state: "calculated"; fee: number; source: string; label: string | null; distanceKm?: number }
  | { state: "pending"; reason: string };

const CRM_URL = (process.env.CRM_URL || "https://crm.healthila.id").replace(/\/$/, "");

export async function fetchOngkir(address: string): Promise<OngkirEstimate> {
  const secret = webSecret();
  if (!secret || address.trim().length < 8) return { state: "pending", reason: "unavailable" };
  try {
    const res = await fetch(`${CRM_URL}/api/public/ongkir`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
      body: JSON.stringify({ address: address.trim().slice(0, 500) }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[ongkir]", res.status);
      return { state: "pending", reason: "unavailable" };
    }
    return (await res.json()) as OngkirEstimate;
  } catch (e) {
    console.error("[ongkir]", e instanceof Error ? e.message : e);
    return { state: "pending", reason: "unavailable" };
  }
}
