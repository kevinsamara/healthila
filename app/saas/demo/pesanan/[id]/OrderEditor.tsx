"use client";

import { useState, useTransition } from "react";
import { Check, Plus, Save, Send, Trash2 } from "lucide-react";
import { saveOrderItemsAction, sendDeliveryNoticeAction } from "../../actions";
import type { OrderItemOp, SaasOrderItem } from "@/lib/saas/orders";

type LocalItem = {
  id?: string;
  original?: SaasOrderItem;
  raw_text: string;
  quantity: number;
  unit: string;
  unit_price: number;
  line_total: number;
  removed?: boolean;
  isNew?: boolean;
};

function toLocal(items: SaasOrderItem[]): LocalItem[] {
  return items.map((it) => ({
    id: it.id,
    original: it,
    raw_text: it.raw_text ?? "",
    quantity: Number(it.quantity ?? 0),
    unit: it.unit ?? "pcs",
    unit_price: Number(it.unit_price ?? 0),
    line_total: Number(it.line_total ?? 0),
  }));
}

function money(n: number) {
  return new Intl.NumberFormat("id-ID").format(Math.round(n));
}

export function OrderEditor({
  orderId,
  code,
  customerName,
  customerPhone,
  delivered,
  initialItems,
}: {
  orderId: string;
  code: string;
  customerName: string | null;
  customerPhone: string | null;
  delivered: boolean;
  initialItems: SaasOrderItem[];
}) {
  const [items, setItems] = useState<LocalItem[]>(toLocal(initialItems));
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const [sending, startSend] = useTransition();
  const [sendMsg, setSendMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [noticeText, setNoticeText] = useState<string>("");
  const [isDelivered, setIsDelivered] = useState<boolean>(delivered);

  function patch(i: number, u: Partial<LocalItem>) {
    setItems((prev) => {
      const next = [...prev];
      const merged: LocalItem = { ...next[i], ...u };
      if (u.quantity !== undefined || u.unit_price !== undefined) {
        merged.line_total = Math.round((merged.quantity || 0) * (merged.unit_price || 0));
      }
      next[i] = merged;
      return next;
    });
  }

  function addRow() {
    setItems((prev) => [
      ...prev,
      {
        raw_text: "",
        quantity: 1,
        unit: "pcs",
        unit_price: 0,
        line_total: 0,
        isNew: true,
      },
    ]);
  }

  function removeRow(i: number) {
    setItems((prev) => {
      const next = [...prev];
      if (next[i].isNew) {
        next.splice(i, 1);
      } else {
        next[i] = { ...next[i], removed: !next[i].removed };
      }
      return next;
    });
  }

  function diffOps(): OrderItemOp[] {
    const ops: OrderItemOp[] = [];
    for (const it of items) {
      if (it.isNew && !it.removed) {
        if (!it.raw_text.trim() && it.unit_price === 0) continue;
        ops.push({
          op: "add",
          raw_text: it.raw_text || "(item)",
          quantity: it.quantity,
          unit: it.unit,
          unit_price: it.unit_price,
          line_total: it.line_total,
        });
      } else if (it.id && it.removed) {
        ops.push({ op: "delete", id: it.id });
      } else if (it.id && it.original) {
        const o = it.original;
        const changed =
          String(o.raw_text ?? "") !== it.raw_text ||
          Number(o.quantity ?? 0) !== it.quantity ||
          Number(o.unit_price ?? 0) !== it.unit_price ||
          Number(o.line_total ?? 0) !== it.line_total;
        if (changed) {
          ops.push({
            op: "update",
            id: it.id,
            raw_text: it.raw_text,
            quantity: it.quantity,
            unit_price: it.unit_price,
            line_total: it.line_total,
          });
        }
      }
    }
    return ops;
  }

  const ops = diffOps();
  const dirty = ops.length > 0;
  const visibleTotal = items
    .filter((i) => !i.removed)
    .reduce((s, i) => s + (i.line_total || 0), 0);

  function save() {
    setSaveMsg(null);
    startTransition(async () => {
      const res = await saveOrderItemsAction(orderId, ops);
      if (res.ok) {
        setSaveMsg({ ok: true, text: `Tersimpan (${res.changed} perubahan)` });
      } else {
        setSaveMsg({ ok: false, text: res.error });
      }
    });
  }

  function sendNotice() {
    if (!customerPhone) {
      setSendMsg({ ok: false, text: "Pelanggan tidak punya nomor WA" });
      return;
    }
    setSendMsg(null);
    startSend(async () => {
      const res = await sendDeliveryNoticeAction({
        orderId,
        phone: customerPhone,
        customerName,
        code,
        message: noticeText.trim() || undefined,
      });
      if (res.ok) {
        setSendMsg({ ok: true, text: res.delivered ? "WA terkirim, status jadi delivered ✓" : "WA terkirim." });
        setIsDelivered(true);
      } else {
        setSendMsg({ ok: false, text: res.error });
      }
    });
  }

  const defaultNotice = `Halo ${customerName ?? "Kak"} 👋\n\nPesanan *${code}* sudah dikirim dan sebentar lagi sampai. Terima kasih sudah belanja di Healthila 🧡`;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Item belanjaan</p>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white hover:bg-white/10"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah item
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/5">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Item</th>
                <th className="w-20 px-2 py-2 text-right font-medium">Qty</th>
                <th className="w-16 px-2 py-2 text-left font-medium">Unit</th>
                <th className="w-32 px-2 py-2 text-right font-medium">Harga</th>
                <th className="w-32 px-2 py-2 text-right font-medium">Subtotal</th>
                <th className="w-8 px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr
                  key={it.id ?? `new-${i}`}
                  className={
                    "border-t border-white/5 " +
                    (it.removed ? "bg-rose-900/10 opacity-50 line-through" : it.isNew ? "bg-emerald-500/5" : "")
                  }
                >
                  <td className="px-3 py-1.5">
                    <input
                      value={it.raw_text}
                      onChange={(e) => patch(i, { raw_text: e.target.value })}
                      disabled={it.removed}
                      className="w-full rounded border border-transparent bg-transparent px-2 py-1 text-sm text-white focus:border-indigo-400 focus:bg-white/5 focus:outline-none"
                      placeholder="Nama item"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      step="0.01"
                      value={it.quantity}
                      onChange={(e) => patch(i, { quantity: Number(e.target.value) })}
                      disabled={it.removed}
                      className="w-full rounded border border-transparent bg-transparent px-2 py-1 text-right text-sm text-white focus:border-indigo-400 focus:bg-white/5 focus:outline-none"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      value={it.unit}
                      onChange={(e) => patch(i, { unit: e.target.value })}
                      disabled={it.removed}
                      className="w-full rounded border border-transparent bg-transparent px-2 py-1 text-sm text-slate-300 focus:border-indigo-400 focus:bg-white/5 focus:outline-none"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={it.unit_price}
                      onChange={(e) => patch(i, { unit_price: Number(e.target.value) })}
                      disabled={it.removed}
                      className="w-full rounded border border-transparent bg-transparent px-2 py-1 text-right text-sm text-white focus:border-indigo-400 focus:bg-white/5 focus:outline-none"
                    />
                  </td>
                  <td className="px-2 py-1.5 text-right font-mono text-sm text-white">
                    {money(it.line_total)}
                  </td>
                  <td className="px-2 py-1.5 text-right">
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      title={it.removed ? "Batalkan hapus" : it.isNew ? "Buang" : "Hapus item"}
                      className={
                        "rounded-md p-1 transition " +
                        (it.removed ? "text-emerald-300 hover:bg-emerald-400/10" : "text-rose-400 hover:bg-rose-400/10")
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-xs text-slate-500">
                    Tidak ada item. Klik "Tambah item" untuk mulai.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10 bg-white/[0.02]">
                <td colSpan={4} className="px-3 py-2 text-right text-xs text-slate-400">
                  Subtotal item setelah edit
                </td>
                <td className="px-2 py-2 text-right font-display text-sm font-bold text-white">
                  Rp {money(visibleTotal)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            {dirty
              ? `${ops.length} perubahan belum disimpan`
              : "Belum ada perubahan"}
          </p>
          <div className="flex items-center gap-2">
            {saveMsg && (
              <span className={"text-xs " + (saveMsg.ok ? "text-emerald-300" : "text-rose-300")}>{saveMsg.text}</span>
            )}
            <button
              type="button"
              disabled={!dirty || pending}
              onClick={save}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" /> {pending ? "Menyimpan…" : "Simpan perubahan"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-emerald-500/5 to-slate-900/60 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">Kirim bukti kirim via WA</p>
            <p className="text-xs text-slate-400">
              Pesan dikirim ke nomor pelanggan (<span className="text-slate-300">{customerPhone ?? "—"}</span>) via Fonnte Healthila.
              Setelah terkirim, status pesanan otomatis jadi <code>delivered</code>.
            </p>
          </div>
          {isDelivered && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
              <Check className="h-3 w-3" /> Delivered
            </span>
          )}
        </div>

        <textarea
          value={noticeText}
          onChange={(e) => setNoticeText(e.target.value)}
          rows={4}
          placeholder={defaultNotice}
          className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/40 p-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
        />

        <div className="mt-3 flex items-center justify-between">
          {sendMsg ? (
            <span className={"text-xs " + (sendMsg.ok ? "text-emerald-300" : "text-rose-300")}>{sendMsg.text}</span>
          ) : (
            <span className="text-xs text-slate-500">Pesan kosong = pakai template default di atas</span>
          )}
          <button
            type="button"
            onClick={sendNotice}
            disabled={sending || !customerPhone}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" /> {sending ? "Mengirim…" : "Kirim bukti & tandai delivered"}
          </button>
        </div>
      </div>
    </div>
  );
}
