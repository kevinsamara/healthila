import type { Metadata } from "next";
import { getAccount } from "@/lib/session";
import { getDeliverySlots } from "@/lib/slots";
import { getSubscriptionItems, getSubscriptionPlans } from "@/lib/subscriptions";
import { SubscribeWizard } from "./SubscribeWizard";
import { CalendarDays, CirclePause, Grape, type LucideIcon } from "lucide-react";
import { DynIcon } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Langganan Buah & Jus Cold-Pressed Malang",
  description:
    "Langganan buah utuh, buah potong, dan jus cold-pressed di Malang — untuk rumah, sekolah, atau kantor. Pilih jumlah pax, budget, hari & jam antar. Bisa jeda kapan saja.",
};

export const dynamic = "force-dynamic";

const PERKS: [LucideIcon, string, string][] = [
  [CalendarDays, "Rutin tanpa repot", "Tiap minggu, 2 minggu sekali, atau beberapa hari seminggu untuk kantor & sekolah."],
  [Grape, "Dipilihkan yang terbaik", "Isi menyesuaikan musim dan preferensi Kakak — tidak bosan."],
  [CirclePause, "Fleksibel", "Jeda saat liburan, lanjutkan atau berhenti kapan saja dari halaman Akun."],
];

export default async function LanggananPage() {
  const [account, slots, plans, items] = await Promise.all([getAccount(), getDeliverySlots(), getSubscriptionPlans(), getSubscriptionItems()]);
  return (
    <>
      <section className="bg-gradient-to-br from-leaf-900 via-leaf-700 to-[#5fcf8f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <p className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide uppercase">Langganan</p>
          <h1 className="mt-3 text-5xl font-extrabold sm:text-6xl">Buah & jus segar, rutin diantar</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/90">
            Buah utuh, buah potong siap santap, atau jus cold-pressed — untuk rumah, sekolah, maupun kantor di Malang. Atur sekali, kami antar rutin.
          </p>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_340px]">
        <SubscribeWizard
          plans={plans}
          items={items}
          slots={slots.filter((s) => s.enabled)}
          loggedIn={!!account}
          name={account?.name ?? ""}
          addresses={account?.addresses.map((a) => a.address) ?? []}
        />
        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          {PERKS.map(([icon, title, text]) => (
            <div key={title} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-leaf-100">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-leaf-700"><DynIcon icon={icon} className="h-5 w-5" strokeWidth={1.8} /></span>
              <div>
                <p className="font-bold text-ink">{title}</p>
                <p className="mt-0.5 text-sm text-muted">{text}</p>
              </div>
            </div>
          ))}
          <div className="rounded-2xl bg-leaf-50 p-4 text-sm text-muted">
            <p className="font-bold text-ink">Cara kerjanya</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>Pilih jenis, untuk siapa, jumlah pax, paket & jadwal.</li>
              <li>Dua hari sebelum jadwal, pesanan dibuat otomatis dan Kakak dapat WhatsApp.</li>
              <li>Admin konfirmasi isi, ongkir & pembayaran — lalu diantar.</li>
            </ol>
          </div>
        </aside>
      </div>
    </>
  );
}
