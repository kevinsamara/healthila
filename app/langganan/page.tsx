import type { Metadata } from "next";
import Link from "next/link";
import { getAccount } from "@/lib/session";
import { getDeliverySlots } from "@/lib/slots";
import { SubscribeForm } from "./SubscribeForm";

export const metadata: Metadata = {
  title: "Langganan Buah Mingguan Malang",
  description:
    "Langganan buah segar mingguan di Malang — pilih budget, hari & jam antar. Isi dipilih tim Healthila sesuai musim dan selera Kakak. Bisa jeda atau berhenti kapan saja.",
};

export const dynamic = "force-dynamic";

const PERKS = [
  ["🗓️", "Rutin tanpa repot", "Tiap minggu (atau 2 minggu sekali) di hari & jam pilihan Kakak."],
  ["🍇", "Dipilihkan yang terbaik", "Isi buah menyesuaikan musim, budget, dan preferensi — tidak bosan."],
  ["⏸️", "Fleksibel", "Jeda saat liburan, lanjutkan atau berhenti kapan saja dari halaman Akun."],
  ["🏢", "Cocok untuk kantor", "Buah untuk pantry kantor atau keluarga besar — tinggal atur budget."],
];

export default async function LanggananPage() {
  const [account, slots] = await Promise.all([getAccount(), getDeliverySlots()]);
  return (
    <>
      <section className="bg-gradient-to-br from-leaf-900 via-leaf-700 to-[#5fcf8f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <p className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide uppercase">Langganan buah</p>
          <h1 className="mt-3 text-5xl font-extrabold sm:text-6xl">Buah segar, rutin diantar</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/90">
            Pilih budget dan jadwal sekali saja. Tim kami memilihkan buah terbaik minggu itu dan mengantarnya ke rumah atau kantor Kakak di Malang.
          </p>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_460px]">
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            {PERKS.map(([icon, title, text]) => (
              <div key={title} className="rounded-2xl bg-white p-5 ring-1 ring-leaf-100">
                <span className="text-3xl">{icon}</span>
                <p className="mt-2 font-bold text-ink">{title}</p>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
          <h2 className="mt-10 text-xl font-bold text-ink">Cara kerjanya</h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
            <li>Pilih budget per kiriman, hari & jam antar, dan tulis preferensi (mis. tidak suka pepaya).</li>
            <li>Dua hari sebelum jadwal, pesanan dibuat otomatis dan Kakak dapat WhatsApp.</li>
            <li>Admin konfirmasi isi buah, ongkir, dan pembayaran — lalu buah diantar.</li>
          </ol>
          <p className="mt-4 text-xs text-muted">Ongkir dihitung per kiriman sesuai alamat. Budget adalah nilai buah per kiriman.</p>
        </div>

        {account ? (
          <SubscribeForm
            slots={slots.filter((s) => s.enabled)}
            name={account.name ?? ""}
            addresses={account.addresses.map((a) => a.address)}
          />
        ) : (
          <div className="h-fit rounded-3xl bg-white p-6 text-center ring-1 ring-leaf-100">
            <p className="text-lg font-bold text-ink">Mulai berlangganan</p>
            <p className="mt-2 text-sm text-muted">Masuk dengan nomor WhatsApp dulu, supaya Kakak bisa mengatur, menjeda, atau menghentikan langganan sendiri.</p>
            <Link href="/masuk?next=/langganan" className="mt-5 inline-flex h-12 items-center rounded-full bg-leaf-700 px-7 font-bold text-white hover:bg-leaf-900">
              Masuk dengan WhatsApp
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
