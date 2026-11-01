import { healthilaSummary } from "@/lib/knowledge";
/**
 * /llms.txt — plain summary of Healthila for AI assistants and answer engines
 * (ChatGPT, Claude, Perplexity, Gemini, Copilot). Facts only, generated from
 * the live catalog so it never drifts from the website.
 */
export const revalidate = 3600;

export async function GET() {
  return new Response(await healthilaSummary(), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
