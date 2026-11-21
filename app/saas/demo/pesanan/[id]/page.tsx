import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderDetail } from "@/lib/saas/orders";
import { rupiah } from "@/lib/format";
import { OrderEditor } from "./OrderEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Detail pesanan" };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let order;
  try {
    order = await getOrderDetail(id);
  } catch (e) {
    return (
      <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">
        Gagal muat detail: {e instanceof Error ? e.message : "unknown"}
      </div>
    );
  }
  if (!order) notFound();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/saas/demo/pesanan" className="text-xs text-slate-400 hover:text-white">
          ← Semua pesanan
        </Link>
        <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
          live
        </span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-slate-400">{order.code}</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              {order.customer_name ?? order.recipient_name ?? "Pesanan"}
            </h2>
            <p className="text-sm text-slate-400">
              {order.customer_phone ?? order.recipient_phone ?? "—"}
              {" · "}
              {order.source ?? "—"}
              {" · "}
              status <span className="text-slate-200">{order.status}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Total</p>
            <p className="font-display text-2xl font-bold text-white">
              {order.total ? rupiah(Number(order.total)) : "—"}
            </p>
            <p className="text-[10px] text-slate-500">
              {order.subtotal ? `Sub ${rupiah(Number(order.subtotal))}` : ""}
              {order.shipping_cost ? ` + ongkir ${rupiah(Number(order.shipping_cost))}` : ""}
            </p>
          </div>
        </div>
      </div>

      <OrderEditor
        orderId={order.id}
        code={order.code}
        customerName={order.customer_name}
        customerPhone={order.customer_phone}
        delivered={!!order.delivered_at}
        initialItems={order.items ?? []}
      />
    </div>
  );
}
