import "server-only";
import { sessionToken } from "./session";
import { webRpc } from "./web-rpc";

/** Website profile of the signed-in buyer (healthila-crm 0115). */
export type WebProfile = { birth_date: string | null; asked: boolean };

export async function getProfile(): Promise<WebProfile | null> {
  const token = await sessionToken();
  if (!token) return null;
  try {
    return await webRpc<WebProfile>("web_profile_manage", { p_session_token: token, p_action: "get", p: {} });
  } catch {
    return null;
  }
}
