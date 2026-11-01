import { getBundles } from "@/lib/bundles";
import { getProducts } from "@/lib/catalog";

const MAX_ITEMS = 8;
const slugs = (v: string | null) => (v ?? "").split(",").filter((s) => /^[a-z0-9-]{1,120}$/.test(s)).slice(0, MAX_ITEMS);

/** GET ?p=slug,slug&b=slug — catalog data for the cards an AI answer refers to, in that order. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const [products, bundles] = await Promise.all([getProducts(), getBundles()]);
  const pick = <T extends { slug: string }>(all: T[], want: string[]) => want.flatMap((s) => all.filter((x) => x.slug === s));
  return Response.json(
    { products: pick(products, slugs(url.searchParams.get("p"))), bundles: pick(bundles, slugs(url.searchParams.get("b"))) },
    { headers: { "Cache-Control": "public, max-age=60" } },
  );
}
