import "server-only";
import { sessionToken } from "./session";
import { webRpc } from "./web-rpc";

/** Loyalty + voucher + favorit untuk halaman /akun (healthila-crm 0124). */
export type AccountOverview = {
  loyalty_points: number;
  loyalty_history: Array<{ points: number; entry_type: "EARN" | "REDEEM" | "ADJUSTMENT" | "EXPIRE"; notes: string | null; at: string }>;
  vouchers: Array<{
    code: string; name: string;
    kind: "percent" | "fixed" | "free_shipping" | string;
    amount: number;
    min_subtotal: number | null;
    max_discount: number | null;
    expires_at: string | null;
    notes: string | null;
  }>;
  favorites: Array<{ name: string; count: number }>;
};

export async function getAccountOverview(): Promise<AccountOverview | null> {
  const token = await sessionToken();
  if (!token) return null;
  try {
    return await webRpc<AccountOverview>("web_account_overview", { p_session_token: token });
  } catch {
    return { loyalty_points: 0, loyalty_history: [], vouchers: [], favorites: [] };
  }
}
