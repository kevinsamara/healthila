import { bundleSummary } from "./BundleVisual";
import { BundlePopup } from "./BundlePopup";
import { getBundles } from "@/lib/bundles";

/** Server part of the bundling popup: only bundles in stock, minimal data to the browser. */
export async function BundlePopupLoader() {
  const bundles = (await getBundles()).filter((b) => b.in_stock);
  if (!bundles.length) return null;
  return (
    <BundlePopup
      bundles={bundles.map((b) => ({
        id: b.id,
        slug: b.slug,
        name: b.name,
        price: b.bundle_price,
        regular: b.regular_price,
        photo: b.photo_url ?? b.items.find((i) => i.photo)?.photo ?? null,
        summary: bundleSummary(b),
      }))}
    />
  );
}
