import Image from "next/image";
import type { Bundle } from "@/lib/bundles";

/** Bundle photo, or a 2×2 collage of its items' photos when no photo was uploaded. */
export function BundleVisual({ bundle, sizes }: { bundle: Bundle; sizes: string }) {
  if (bundle.photo_url) return <Image src={bundle.photo_url} alt={bundle.name} fill sizes={sizes} className="object-cover" />;
  const photos = bundle.items.map((i) => i.photo).filter((p): p is string => !!p).slice(0, 4);
  if (!photos.length) return null;
  return (
    <div className={`grid h-full w-full gap-0.5 ${photos.length > 1 ? "grid-cols-2" : ""}`}>
      {photos.map((p, i) => (
        <div key={i} className={`relative ${photos.length === 3 && i === 0 ? "row-span-2" : ""}`}>
          <Image src={p} alt="" fill sizes={sizes} className="object-cover" />
        </div>
      ))}
    </div>
  );
}

export const bundleSummary = (b: Bundle) => b.items.map((i) => i.name.replace(/ - .*$/, "")).join(" + ");
