import Image from "next/image";
import Link from "next/link";
import { displayPrice, type Product } from "@/lib/catalog";
import { rupiah } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const { price, was } = displayPrice(product);
  const fromLabel = product.packagings.length > 1 ? "mulai " : "";

  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-leaf-100 bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-leaf-900/5"
    >
      <div className="relative aspect-square bg-leaf-50">
        {product.photo_url ? (
          <Image
            src={product.photo_url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-medium text-leaf-500">
            Foto segera hadir
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {was != null && <Badge tone="plum">Promo</Badge>}
          {product.is_new && <Badge tone="lime">Baru</Badge>}
          {product.badges.slice(0, 2).map((b) => (
            <Badge key={b} tone="white">
              {b}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-xs font-medium text-muted">
          {product.country_flag ? `${product.country_flag} ` : ""}
          {product.product_group ?? product.category}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-ink sm:text-base">{product.name}</h3>
        <div className="mt-auto pt-3">
          {product.price_note ? (
            <p className="text-sm font-bold text-leaf-700">{product.price_note}</p>
          ) : price != null ? (
            <p className="text-sm sm:text-base">
              <span className="font-bold text-leaf-700">
                {fromLabel}
                {rupiah(price)}
              </span>
              {product.unit && product.packagings.length === 0 && (
                <span className="text-xs text-muted"> / {product.unit}</span>
              )}
              {was != null && <span className="ml-2 text-xs text-muted line-through">{rupiah(was)}</span>}
            </p>
          ) : (
            <p className="text-sm font-semibold text-plum-700">Tanya harga</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function Badge({ tone, children }: { tone: "plum" | "lime" | "white"; children: React.ReactNode }) {
  const cls = {
    plum: "bg-plum-700 text-white",
    lime: "bg-lime-400 text-leaf-900",
    white: "bg-white/90 text-leaf-900",
  }[tone];
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${cls}`}>{children}</span>;
}
