import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { FruitGlyph } from "@/lib/icons";
import { rupiah } from "@/lib/format";
import { cardUnit, displayPrice } from "@/lib/price";
import { QuickAdd } from "./QuickAdd";
import { SalesBadge } from "./SalesBadge";

export function ProductCard({ product }: { product: Product }) {
  const { price, was } = displayPrice(product);
  const fromLabel = product.packagings.length > 1 ? "mulai " : "";
  const blurb = shortBlurb(product.description);
  const unit = cardUnit(product);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-leaf-900/10">
      <Link href={`/produk/${product.slug}`} className="relative block aspect-square bg-leaf-50">
        <ProductImage product={product} sizes="(min-width: 1280px) 22vw, (min-width: 640px) 30vw, 50vw" />
        {!product.in_stock && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/75 py-1.5 text-center text-xs font-bold tracking-wide text-white uppercase">
            Stok habis
          </span>
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <SalesBadge badge={product.sales_badge} />
          {was != null && product.in_stock && <Badge tone="coral">Promo</Badge>}
          {product.is_new && <Badge tone="lime">Baru</Badge>}
        </div>
        {product.badges[0] && (
          <span className="absolute top-3 right-3">
            <Badge tone="sun">{product.badges[0]}</Badge>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <span className="w-fit rounded-full bg-leaf-50 px-2.5 py-0.5 text-[11px] font-semibold text-leaf-700">
          {product.country_flag ? `${product.country_flag} ` : ""}
          {product.product_group ?? product.category}
        </span>
        <Link href={`/produk/${product.slug}`}>
          <h3 className="mt-2 line-clamp-2 font-display text-lg leading-tight font-bold text-ink hover:text-leaf-700 sm:text-xl">
            {product.name}
          </h3>
        </Link>
        {blurb && <p className="mt-1 line-clamp-2 text-xs text-muted sm:text-sm">{blurb}</p>}

        <div className="mt-auto pt-3">
          {product.price_note ? (
            <p className="font-bold text-leaf-700">{product.price_note}</p>
          ) : price != null ? (
            <p className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="text-lg font-extrabold text-leaf-700">
                {fromLabel}
                <span className="whitespace-nowrap">{rupiah(price)}</span>
              </span>
              {unit && <span className="text-xs text-muted">/ {unit}</span>}
              {was != null && <span className="text-xs text-muted line-through">{rupiah(was)}</span>}
            </p>
          ) : (
            product.from_price ? (
              <p className="text-lg font-extrabold text-leaf-700">
                <span className="text-xs font-semibold text-muted">mulai </span>
                <span className="whitespace-nowrap">{rupiah(product.from_price)}</span>
              </p>
            ) : (
              <p className="font-semibold text-plum-700">Harga by request</p>
            )
          )}
          <div className="mt-3">
            <QuickAdd product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductImage({ product, sizes, priority }: { product: Product; sizes: string; priority?: boolean }) {
  if (product.photo_url) {
    return (
      <Image
        src={product.photo_url}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover transition duration-500 group-hover:scale-105 ${product.in_stock ? "" : "opacity-50 grayscale"}`}
      />
    );
  }
  return (
    <div className={`flex h-full items-center justify-center ${product.in_stock ? "" : "opacity-50 grayscale"}`}>
      <span className="flex aspect-square w-1/2 items-center justify-center rounded-full bg-leaf-100/70 text-leaf-700">
        <FruitGlyph hints={[product.product_group, product.category, product.name]} className="h-1/2 w-1/2" strokeWidth={1.5} />
      </span>
    </div>
  );
}

/** First sentence of the CRM description, kept short for cards. */
function shortBlurb(desc: string | null) {
  if (!desc) return null;
  const first = desc.split(/\n|(?<=[.!?])\s/)[0]?.trim();
  return first && first.length > 4 ? first : null;
}

export function Badge({ tone, children }: { tone: "plum" | "lime" | "white" | "coral" | "sun"; children: React.ReactNode }) {
  const cls = {
    plum: "bg-plum-700 text-white",
    lime: "bg-lime-400 text-leaf-900",
    white: "bg-white/90 text-leaf-900",
    coral: "bg-coral-500 text-white",
    sun: "bg-sun-400 text-leaf-900",
  }[tone];
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${cls}`}>{children}</span>;
}
