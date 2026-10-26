import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccount, type AccountOrder } from "@/lib/session";
import { rupiah } from "@/lib/format";
import { logout } from "../masuk/actions";
import { getProfile } from "@/lib/profile";
import { getAccountOverview, type AccountOverview } from "@/lib/account-overview";
import { getProducts, type Product } from "@/lib/catalog";
import { manageReminders, manageSubscriptions } from "./actions";
import { RemindersPanel, SubscriptionsPanel } from "./RetentionPanels";
import { AccountShell, type TabDef } from "./AccountShell";
import { RedeemButton } from "./RedeemButton";
import { Cake, Camera, CircleCheck, Lock, Sparkles, Ticket, Heart, Lightbulb, MapPin } from "lucide-react";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = { title: "Akun Saya", robots: { index: false } };

export default async function AkunPage() {
  const account = await getAccount();
  if (!account) redirect("/masuk?next=/akun");
  const [reminders, subscriptions, profile, overview, allProducts] = await Promise.all([
    manageReminders("list"), manageSubscriptions("list"), getProfile(), getAccountOverview(), getProducts(),
  ]);

  const firstName = account.name ? account.name.split(" ")[0] : null;
  const overviewSafe: AccountOverview = overview ?? { loyalty_points: 0, loyalty_history: [], vouchers: [], redeemable_vouchers: [], favorites: [] };
  const activeOrders = account.orders.filter((o) => o.status !== "cancelled" && o.status !== "completed").length;
  const vouchersCount = overviewSafe.vouchers.length;

  const tabs: TabDef[] = [
    { key: "ringkasan", label: "Ringkasan" },
    { key: "pesanan", label: "Pesanan", badge: activeOrders || null },
    { key: "loyalty", label: "Loyalty" },
    { key: "voucher", label: "Voucher", badge: vouchersCount || null },
    { key: "favorit", label: "Buah Kesukaan" },
    { key: "rekomendasi", label: "Rekomendasi" },
    { key: "langganan", label: "Langganan" },
    { key: "pengingat", label: "Pengingat" },
    { key: "alamat", label: "Alamat" },
  ];

  const header = (
    // Wrap di container yang sama lebarnya dengan AccountShell (max-w-6xl +
    // px-4) supaya "Halo, X" dan tombol Keluar tidak nempel ke tepi layar.
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-leaf-900">
            {firstName ? `Halo, ${firstName}` : "Akun Saya"}
          </h1>
          <p className="mt-1 text-sm text-muted">WhatsApp {account.phone}</p>
        </div>
        <form action={logout}>
          <button className="rounded-full border border-leaf-200 px-4 py-2 text-sm font-semibold text-muted hover:text-plum-700">
            Keluar
          </button>
        </form>
      </div>
    </div>
  );

  // Picks for rekomendasi: 4 produk aktif, prefer section buah/jus, skip
  // yang sudah ada di favorit customer supaya rekomendasi terasa "baru".
  const favoriteNames = new Set(overviewSafe.favorites.map((f) => f.name.toLowerCase()));
  const recommendations = allProducts
    .filter((p) => p.in_stock && !favoriteNames.has(p.name.toLowerCase()))
    .filter((p) => p.section === "buah" || p.section === "jus")
    .slice(0, 6);

  return (
    <>
      {header}
      <AccountShell
        tabs={tabs}
        sections={{
          ringkasan: <Ringkasan account={account} profile={profile} overview={overviewSafe} />,
          pesanan: <PesananList orders={account.orders} />,
          loyalty: <LoyaltyPanel overview={overviewSafe} />,
          voucher: <VoucherPanel overview={overviewSafe} />,
          favorit: <FavoritPanel overview={overviewSafe} />,
          rekomendasi: <RekomendasiPanel products={recommendations} />,
          langganan: <SubscriptionsPanel initial={subscriptions.ok ? subscriptions.data : []} />,
          pengingat: <RemindersPanel initial={reminders.ok ? reminders.data : []} />,
          alamat: <AlamatPanel addresses={account.addresses} />,
        }}
      />
    </>
  );
}

/* ─────────────────────────── SECTIONS ─────────────────────────── */

function Card({ children, title, hint }: { children: React.ReactNode; title?: string; hint?: string }) {
  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-leaf-100">
      {title && (
        <div className="mb-4">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

function Ringkasan({ account, profile, overview }: {
  account: Awaited<ReturnType<typeof getAccount>>;
  profile: Awaited<ReturnType<typeof getProfile>>;
  overview: AccountOverview;
}) {
  if (!account) return null;
  const birthLocked = !!(profile?.birth_date);
  const birthLabel = profile?.birth_date
    ? new Date(profile.birth_date + "T00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long" })
    : null;
  const activeOrder = account.orders.find((o) => o.status !== "cancelled" && o.status !== "completed");
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Loyalty mini */}
      <div className="rounded-2xl bg-gradient-to-br from-leaf-700 to-leaf-900 p-5 text-white ring-1 ring-leaf-700">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sun-400">
          <Sparkles className="h-4 w-4" /> Loyalty points
        </div>
        <p className="mt-2 text-4xl font-extrabold tabular-nums">{overview.loyalty_points}</p>
        <p className="mt-1 text-xs text-white/80">Setiap Rp100.000 belanja = 1 poin</p>
      </div>

      {/* Voucher mini */}
      <div className="rounded-2xl bg-sun-100 p-5 ring-1 ring-sun-300">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-plum-700">
          <Ticket className="h-4 w-4" /> Voucher aktif
        </div>
        <p className="mt-2 text-4xl font-extrabold tabular-nums text-leaf-900">{overview.vouchers.length}</p>
        <p className="mt-1 text-xs text-leaf-900/70">Siap dipakai di order berikutnya</p>
      </div>

      {/* Tanggal lahir */}
      <div className="rounded-2xl bg-white p-5 ring-1 ring-leaf-100">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-plum-700">
          <Cake className="h-4 w-4" /> Tanggal lahir
        </div>
        <p className="mt-2 text-xl font-bold text-ink">
          {birthLabel ?? <span className="text-muted">Belum diisi</span>}
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs">
          {birthLocked ? (
            <>
              <span className="inline-flex items-center gap-1 text-muted">
                <Lock className="h-3.5 w-3.5" /> Terkunci
              </span>
              <a href={waLink("Halo Healthila, saya ingin mengubah tanggal lahir di akun saya.")} target="_blank" rel="noopener noreferrer" className="font-semibold text-leaf-700 underline">
                Hubungi admin
              </a>
            </>
          ) : (
            <Link href="/profil/tanggal-lahir?next=/akun" className="font-semibold text-leaf-700 underline">
              Isi untuk voucher ulang tahun →
            </Link>
          )}
        </div>
      </div>

      {/* Order aktif */}
      <div className="rounded-2xl bg-white p-5 ring-1 ring-leaf-100">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-plum-700">
          <MapPin className="h-4 w-4" /> Pesanan aktif
        </div>
        {activeOrder ? (
          <>
            <p className="mt-2 font-bold text-ink">{activeOrder.code}</p>
            <p className="text-xs text-muted">Status: {activeOrder.status}</p>
          </>
        ) : (
          <>
            <p className="mt-2 text-xl font-bold text-muted">Tidak ada</p>
            <Link href="/katalog" className="mt-1 inline-block text-xs font-semibold text-leaf-700 underline">Belanja sekarang →</Link>
          </>
        )}
      </div>
    </div>
  );
}

function PesananList({ orders }: { orders: AccountOrder[] }) {
  if (orders.length === 0) {
    return (
      <Card title="Riwayat pesanan">
        <div className="py-6 text-center">
          <p className="text-muted">Belum ada pesanan dengan nomor ini.</p>
          <Link href="/katalog" className="mt-4 inline-block rounded-full bg-leaf-700 px-6 py-3 font-bold text-white hover:bg-leaf-900">
            Mulai belanja
          </Link>
        </div>
      </Card>
    );
  }
  return (
    <Card title="Riwayat pesanan" hint={`${orders.length} order tersimpan`}>
      <ul className="space-y-3">
        {orders.map((o) => <OrderRow key={o.code} o={o} />)}
      </ul>
    </Card>
  );
}

function OrderRow({ o }: { o: AccountOrder }) {
  return (
    <li className="rounded-2xl bg-leaf-50/50 p-5 ring-1 ring-leaf-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-bold text-ink">{o.code}</p>
        <StatusBadge order={o} />
      </div>
      <p className="mt-1 text-sm text-muted">
        Dipesan {fmtDate(o.order_date)}
        {o.delivery_date ? ` · Kirim ${fmtDate(o.delivery_date)}` : ""}
      </p>
      {o.items && <p className="mt-2 line-clamp-2 text-sm text-ink">{o.items}</p>}
      {o.status !== "cancelled" ? (
        <Timeline order={o} />
      ) : (
        <p className="mt-3 rounded-xl bg-plum-50 px-3 py-2 text-xs text-plum-700">
          Pesanan ini dibatalkan. Admin kami akan menghubungi Kakak lewat WhatsApp untuk penjelasan & solusinya.
        </p>
      )}
      {((o.previews?.length ?? 0) > 0 || (o.proofs?.length ?? 0) > 0) && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {o.previews?.map((id, i) => (
            <a key={id} href={`${CRM_URL}/foto-parcel/${id}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-lime-100 px-3 py-1 font-semibold text-leaf-900 hover:bg-lime-200">
              <Camera className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
              Foto sebelum kirim{o.previews!.length > 1 ? ` ${i + 1}` : ""}
            </a>
          ))}
          {o.proofs?.map((id, i) => (
            <a key={id} href={`${CRM_URL}/bukti/${id}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-leaf-50 px-3 py-1 font-semibold text-leaf-700 hover:bg-leaf-100">
              <CircleCheck className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
              Bukti sampai{o.proofs!.length > 1 ? ` ${i + 1}` : ""}
            </a>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between text-sm">
        {o.payment_status !== "paid" && o.pay_status === "awaiting" ? (
          <Link href={`/bayar/${o.code}`} className="rounded-full bg-sun-400 px-4 py-1.5 font-bold text-leaf-900 hover:bg-sun-300">
            Bayar QRIS
          </Link>
        ) : (
          <span className={o.payment_status === "paid" ? "font-semibold text-leaf-700" : "text-muted"}>
            {o.payment_status === "paid"
              ? "Lunas"
              : o.pay_status === "submitted"
                ? "Bukti bayar sedang dicek"
                : "Menunggu pembayaran"}
          </span>
        )}
        <span className="font-bold text-ink">{rupiah(Number(o.total))}</span>
      </div>
    </li>
  );
}

function LoyaltyPanel({ overview }: { overview: AccountOverview }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-leaf-700 to-leaf-900 p-6 text-white ring-1 ring-leaf-700">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sun-400">
          <Sparkles className="h-4 w-4" /> Saldo poin
        </div>
        <p className="mt-2 text-5xl font-extrabold tabular-nums">{overview.loyalty_points}</p>
        <p className="mt-3 text-sm text-white/80">
          Setiap <b className="text-white">Rp100.000</b> belanja = <b className="text-white">1 poin</b>. Poin bisa ditukar jadi voucher — buka halaman Voucher untuk cek yang tersedia.
        </p>
      </div>
      <Card title="Riwayat poin terakhir">
        {overview.loyalty_history.length === 0 ? (
          <p className="text-sm text-muted">Belum ada aktivitas. Mulai belanja untuk kumpul poin pertama Kakak!</p>
        ) : (
          <ul className="divide-y divide-leaf-50">
            {overview.loyalty_history.map((h, i) => (
              <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">
                    {h.entry_type === "EARN" ? "Dapat poin" : h.entry_type === "REDEEM" ? "Tukar poin" : h.entry_type === "ADJUSTMENT" ? "Penyesuaian" : "Kedaluwarsa"}
                  </p>
                  {h.notes && <p className="truncate text-xs text-muted">{h.notes}</p>}
                </div>
                <div className="text-right">
                  <p className={`tabular-nums font-bold ${h.points >= 0 ? "text-leaf-700" : "text-plum-700"}`}>
                    {h.points >= 0 ? "+" : ""}{h.points}
                  </p>
                  <p className="text-[11px] text-muted">{h.at}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function VoucherPanel({ overview }: { overview: AccountOverview }) {
  const hasActive = overview.vouchers.length > 0;
  const hasRedeemable = overview.redeemable_vouchers.length > 0;

  if (!hasActive && !hasRedeemable) {
    return (
      <Card title="Voucher Kakak">
        <div className="py-8 text-center">
          <Ticket className="mx-auto h-12 w-12 text-leaf-200" strokeWidth={1.4} />
          <p className="mt-3 font-semibold text-ink">Belum ada voucher aktif</p>
          <p className="mt-1 text-sm text-muted">
            Voucher ulang tahun otomatis diberikan di hari lahir (kalau sudah diisi).
            Voucher promo lain muncul di sini begitu aktif.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {hasActive && (
        <Card title="Voucher Kakak" hint={`${overview.vouchers.length} voucher siap dipakai`}>
          <ul className="space-y-3">
            {overview.vouchers.map((v) => (
              <li key={v.code} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sun-100 to-coral-100 p-4 ring-1 ring-sun-300">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-ink">{v.name}</p>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-plum-700">{v.code}</p>
                    {v.notes && <p className="mt-1 text-xs text-leaf-900/80">{v.notes}</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-plum-700">Diskon</p>
                    <p className="text-xl font-extrabold text-leaf-900">
                      {v.kind === "percent" ? `${v.amount}%` : v.kind === "free_shipping" ? "Ongkir" : rupiah(v.amount)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-leaf-900/80">
                  {v.min_subtotal != null && v.min_subtotal > 0 && <span>Min. belanja {rupiah(v.min_subtotal)}</span>}
                  {v.max_discount != null && v.max_discount > 0 && v.kind === "percent" && <span>Maks. potongan {rupiah(v.max_discount)}</span>}
                  {v.expires_at && <span>Berlaku s/d {v.expires_at}</span>}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {hasRedeemable && (
        <Card title="Tukar Poin Kakak" hint={`Saldo poin: ${overview.loyalty_points}`}>
          <ul className="space-y-3">
            {overview.redeemable_vouchers.map((v) => (
              <li key={v.id} className={`relative overflow-hidden rounded-2xl p-4 ring-1 ${
                v.affordable ? "bg-leaf-50 ring-leaf-200" : "bg-slate-50 ring-slate-200 opacity-80"
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-ink">{v.name}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      Diskon{" "}
                      <b className="text-leaf-700">
                        {v.kind === "percent" ? `${v.amount}%` : v.kind === "free_shipping" ? "Ongkir" : rupiah(v.amount)}
                      </b>
                      {v.min_subtotal != null && v.min_subtotal > 0 && <> · Min. belanja {rupiah(v.min_subtotal)}</>}
                      {v.expires_at && <> · s/d {v.expires_at}</>}
                    </p>
                    {v.notes && <p className="mt-1 text-xs text-muted italic">{v.notes}</p>}
                    <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-plum-100 px-2 py-0.5 text-[11px] font-bold text-plum-700">
                      ⭐ {v.points_cost} poin
                    </p>
                  </div>
                  <RedeemButton
                    voucherId={v.id}
                    pointsCost={v.points_cost}
                    affordable={v.affordable}
                    label={v.name}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted">
            Poin terpotong saat tombol &ldquo;Tukar&rdquo; ditekan. Voucher langsung muncul di daftar atas dan bisa dipakai saat checkout.
          </p>
        </Card>
      )}
    </div>
  );
}

function FavoritPanel({ overview }: { overview: AccountOverview }) {
  if (overview.favorites.length === 0) {
    return (
      <Card title="Buah kesukaan">
        <div className="py-8 text-center">
          <Heart className="mx-auto h-12 w-12 text-leaf-200" strokeWidth={1.4} />
          <p className="mt-3 font-semibold text-ink">Belum ada data favorit</p>
          <p className="mt-1 text-sm text-muted">Setelah beberapa pesanan selesai, buah yang paling sering Kakak ambil muncul di sini.</p>
        </div>
      </Card>
    );
  }
  const max = overview.favorites[0]!.count;
  return (
    <Card title="Buah kesukaan" hint="Berdasarkan riwayat pembelian Kakak">
      <ul className="space-y-3">
        {overview.favorites.map((f, i) => (
          <li key={i} className="rounded-xl bg-leaf-50/60 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="truncate font-semibold text-ink">{f.name}</p>
              <span className="shrink-0 text-xs font-semibold text-leaf-700">{f.count}×</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-leaf-100">
              <div className="h-full rounded-full bg-leaf-700" style={{ width: `${Math.max(10, (f.count / max) * 100)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function RekomendasiPanel({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <Card title="Rekomendasi buat Kakak">
        <p className="text-sm text-muted">Belum ada rekomendasi. Lihat semua buah segar di <Link href="/katalog" className="font-semibold text-leaf-700 underline">katalog</Link>.</p>
      </Card>
    );
  }
  return (
    <Card title="Rekomendasi buat Kakak" hint="Pilihan buah segar & jus yang mungkin cocok untuk pesanan berikutnya">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li key={p.id}>
            <Link href={`/produk/${p.slug}`} className="group block overflow-hidden rounded-2xl bg-leaf-50/60 ring-1 ring-leaf-100 hover:ring-leaf-300">
              {p.photo_url && (
                <div className="relative aspect-square w-full overflow-hidden bg-leaf-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.photo_url} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                </div>
              )}
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-bold text-ink">{p.name}</p>
                {p.price != null && (
                  <p className="mt-1 text-sm font-bold text-leaf-700">{rupiah(p.price)}<span className="text-xs text-muted">/{p.unit}</span></p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/katalog" className="mt-4 inline-block text-sm font-semibold text-leaf-700 underline">Lihat semua →</Link>
    </Card>
  );
}

function AlamatPanel({ addresses }: { addresses: Awaited<ReturnType<typeof getAccount>> extends infer A ? A extends { addresses: infer X } ? X : never : never }) {
  if (!addresses || addresses.length === 0) {
    return (
      <Card title="Alamat tersimpan">
        <p className="text-sm text-muted">Belum ada. Alamat baru otomatis tersimpan saat Kakak memesan.</p>
      </Card>
    );
  }
  return (
    <Card title="Alamat tersimpan" hint="Otomatis tersimpan setiap kali Kakak order">
      <ul className="grid gap-3 sm:grid-cols-2">
        {addresses.map((a) => (
          <li key={a.id} className="rounded-2xl bg-leaf-50/60 p-4 text-sm ring-1 ring-leaf-100">
            <p className="font-semibold text-ink">{a.recipient ?? a.label ?? "Alamat"}</p>
            <p className="mt-1 whitespace-pre-line text-muted">{a.address}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ─────────────────────────── SHARED HELPERS ─────────────────────────── */

const STATUS: Record<string, [string, string]> = {
  scheduled: ["Dijadwalkan", "bg-leaf-100 text-leaf-900"],
  processing: ["Diproses", "bg-lime-300 text-leaf-900"],
  prepared: ["Disiapkan", "bg-lime-300 text-leaf-900"],
  shipped: ["Dikirim", "bg-leaf-700 text-white"],
  cancelled: ["Dibatalkan", "bg-plum-100 text-plum-700"],
};

function StatusBadge({ order }: { order: AccountOrder }) {
  const [label, cls] =
    !order.confirmed && order.status !== "cancelled"
      ? ["Menunggu konfirmasi", "bg-plum-50 text-plum-700"]
      : STATUS[order.status] ?? [order.status, "bg-leaf-50 text-ink"];
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${cls}`}>{label}</span>;
}

const CRM_URL = (process.env.CRM_URL || "https://crm.healthila.id").replace(/\/$/, "");
const STEPS = ["Pesanan masuk", "Dikonfirmasi", "Dikirim", "Sampai"] as const;

function Timeline({ order }: { order: AccountOrder }) {
  const step = order.delivered_at ? 3 : order.dispatched || order.status === "shipped" ? 2 : order.confirmed ? 1 : 0;
  return (
    <ol className="mt-4 grid grid-cols-4 gap-1">
      {STEPS.map((label, i) => (
        <li key={label} className="text-center">
          <div className={`h-1.5 rounded-full ${i <= step ? "bg-leaf-700" : "bg-leaf-100"}`} />
          <p className={`mt-1.5 text-[11px] leading-tight ${i <= step ? "font-semibold text-leaf-900" : "text-muted"}`}>{label}</p>
        </li>
      ))}
    </ol>
  );
}

function fmtDate(d: string) {
  return new Date(d + "T00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
