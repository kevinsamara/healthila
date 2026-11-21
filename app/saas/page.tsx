import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Check,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Store,
  Users,
  Zap,
} from "lucide-react";
import { DashboardMockup } from "./_components/DashboardMockup";

const FEATURES = [
  {
    icon: ShoppingBag,
    title: "CRM Pesanan",
    desc: "Kelola pesanan masuk dari WA, storefront dan marketplace di satu antrian. Auto-assign kurir, cetak surat jalan, rekap settlement.",
  },
  {
    icon: Boxes,
    title: "Katalog & Stok",
    desc: "Varian produk, paket bundling, harga promo, foto, deskripsi — sync otomatis ke storefront dan POS.",
  },
  {
    icon: MessageCircle,
    title: "Broadcast WhatsApp",
    desc: "Blast promo, kirim bukti bayar, reminder settlement. Template Meta approved. Tracking klik & konversi.",
  },
  {
    icon: Store,
    title: "Storefront Online",
    desc: "Website toko siap pakai dengan SEO, kategori, keranjang dan login OTP WhatsApp. Custom domain + Vercel.",
  },
  {
    icon: Users,
    title: "Database Pelanggan",
    desc: "Segmentasi otomatis: pelanggan setia, baru, churn. Riwayat pesanan, voucher personal, ulang tahun.",
  },
  {
    icon: BarChart3,
    title: "Laporan Real-time",
    desc: "Omzet harian, top produk, CAC per channel, cohort retensi. Export ke Excel atau Google Sheets.",
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "Rp 490rb",
    period: "/bulan",
    highlight: false,
    tagline: "Untuk UMKM yang baru mulai online",
    features: [
      "1 outlet, hingga 500 pesanan/bulan",
      "Storefront + custom domain",
      "CRM pesanan + WA Gateway 1 nomor",
      "Katalog 200 produk",
      "Email support",
    ],
    cta: "Mulai gratis 14 hari",
  },
  {
    name: "Pro",
    price: "Rp 1,9jt",
    period: "/bulan",
    highlight: true,
    tagline: "Untuk brand yang scaling omzet",
    features: [
      "3 outlet, pesanan unlimited",
      "Broadcast WA + Template Meta",
      "Katalog & bundling unlimited",
      "Segmentasi pelanggan + voucher",
      "Laporan + ekspor Excel",
      "Priority WhatsApp support",
    ],
    cta: "Pilih Pro",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    highlight: false,
    tagline: "Multi-outlet, integrasi akuntansi, SLA",
    features: [
      "Outlet & user unlimited",
      "Integrasi Olsera / Moka / Accurate",
      "Custom integration & API",
      "Onboarding + training tim",
      "SLA 99.9% + dedicated AM",
    ],
    cta: "Hubungi sales",
  },
];

const FAQ = [
  {
    q: "Berapa lama proses onboarding?",
    a: "Untuk Starter rata-rata 1–2 hari kerja setelah data produk dan nomor WA diberikan. Pro & Enterprise 3–7 hari karena mencakup migrasi data dan setup template WA.",
  },
  {
    q: "Apakah bisa pakai nomor WhatsApp yang sudah ada?",
    a: "Bisa. Kami pakai WA Gateway (Fonnte) yang support nomor existing, atau WA Business API (Meta Cloud) untuk template resmi. Kami bantu setup keduanya.",
  },
  {
    q: "Datanya disimpan dimana?",
    a: "Database Supabase (Postgres) region Singapore. Semua data pelanggan dan pesanan tetap milik Anda — bisa ekspor kapan saja ke Excel atau Google Sheets.",
  },
  {
    q: "Bisa integrasi dengan sistem kasir yang sudah ada?",
    a: "Paket Enterprise mendukung integrasi dengan Olsera, Moka, Accurate dan sistem lain via API. Kami juga punya connector siap pakai untuk beberapa marketplace.",
  },
];

export default function SaasLandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 20% 10%, rgba(99,102,241,0.25), transparent 50%), radial-gradient(circle at 80% 30%, rgba(217,70,239,0.2), transparent 50%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-20 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Dashboard operasi all-in-one untuk UMKM Indonesia
            </div>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
              Jalankan toko, pesanan, dan WhatsApp{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
                dari satu layar.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-slate-300 md:text-lg">
              OpsFlow menggabungkan CRM pesanan, katalog produk, broadcast WhatsApp dan storefront online — siap pakai
              untuk brand F&amp;B, toko buah, hampers, dan D2C lainnya.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/saas/demo"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-indigo-500/10 transition hover:bg-slate-100"
              >
                Coba Demo Interaktif
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a
                href="https://wa.me/6281234567890?text=Halo%20OpsFlow%2C%20saya%20tertarik%20dengan%20sistemnya"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                Hubungi Sales
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Tanpa kartu kredit · Gratis 14 hari · Bantuan setup dari tim kami
            </p>
          </div>

          <div className="mt-14 md:mt-20">
            <DashboardMockup />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-wider text-slate-500">
            <span>Dipakai oleh brand lokal:</span>
            <span className="font-display text-base font-bold text-slate-400">Healthila</span>
            <span className="font-display text-base font-bold text-slate-400">Fruitbox.id</span>
            <span className="font-display text-base font-bold text-slate-400">Juice &amp; Co</span>
            <span className="font-display text-base font-bold text-slate-400">Hampers Lokal</span>
          </div>
        </div>
      </section>

      <section id="fitur" className="border-t border-white/5 bg-slate-950 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300">Fitur lengkap</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              Semua yang dibutuhkan tim operasi, dalam satu sistem
            </h2>
            <p className="mt-3 text-slate-400">
              Tidak perlu lagi copy-paste pesanan dari WhatsApp ke spreadsheet ke resi kurir. Semua terhubung.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 p-2.5 ring-1 ring-white/10">
                  <Icon className="h-5 w-5 text-indigo-200" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-gradient-to-b from-slate-950 to-slate-900 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">Hasil nyata</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                Toko buah Healthila: dari spreadsheet ke operasi otomatis
              </h2>
              <p className="mt-4 text-slate-300">
                Sebelum pakai OpsFlow, satu admin butuh 3 jam/hari rekap pesanan WA ke Excel. Sekarang pesanan masuk
                otomatis, kurir di-assign dengan satu klik, dan settlement malam hari dikirim via WA group.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-emerald-400" />
                  <span>
                    <b className="text-white">70% waktu admin berkurang</b> — tidak ada lagi copy-paste manual
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-emerald-400" />
                  <span>
                    <b className="text-white">Konversi broadcast naik 2.3×</b> — template WA + landing bukti bayar
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-emerald-400" />
                  <span>
                    <b className="text-white">0 pesanan nyangkut</b> — semua pesanan traceable sampai delivered
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-900/60 p-5">
                  <p className="text-xs text-slate-400">Omzet harian</p>
                  <p className="mt-1 font-display text-3xl font-bold text-white">
                    Rp 24,8<span className="text-lg text-slate-400">jt</span>
                  </p>
                  <p className="mt-1 text-xs text-emerald-400">+18% vs minggu lalu</p>
                </div>
                <div className="rounded-xl bg-slate-900/60 p-5">
                  <p className="text-xs text-slate-400">Pesanan selesai</p>
                  <p className="mt-1 font-display text-3xl font-bold text-white">142</p>
                  <p className="mt-1 text-xs text-emerald-400">+12 dari kemarin</p>
                </div>
                <div className="rounded-xl bg-slate-900/60 p-5">
                  <p className="text-xs text-slate-400">AOV</p>
                  <p className="mt-1 font-display text-3xl font-bold text-white">
                    Rp 174<span className="text-lg text-slate-400">rb</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">rata-rata 7 hari</p>
                </div>
                <div className="rounded-xl bg-slate-900/60 p-5">
                  <p className="text-xs text-slate-400">Konversi WA blast</p>
                  <p className="mt-1 font-display text-3xl font-bold text-white">8,4%</p>
                  <p className="mt-1 text-xs text-emerald-400">+2.3× vs baseline</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="harga" className="border-t border-white/5 bg-slate-950 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300">Harga</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              Mulai dari harga langganan Netflix
            </h2>
            <p className="mt-3 text-slate-400">
              Semua paket termasuk hosting, update, dan backup. Bisa upgrade/downgrade kapan saja.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PRICING.map((p) => (
              <div
                key={p.name}
                className={
                  p.highlight
                    ? "relative rounded-3xl border border-indigo-400/50 bg-gradient-to-b from-indigo-500/10 to-slate-900/60 p-6 shadow-2xl shadow-indigo-500/10"
                    : "rounded-3xl border border-white/10 bg-white/[0.02] p-6"
                }
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-indigo-400 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-900">
                    Paling populer
                  </span>
                )}
                <h3 className="font-display text-xl font-bold text-white">{p.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{p.tagline}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-white">{p.price}</span>
                  <span className="text-slate-400">{p.period}</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/saas/demo"
                  className={
                    p.highlight
                      ? "mt-7 inline-flex w-full items-center justify-center gap-1 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                      : "mt-7 inline-flex w-full items-center justify-center gap-1 rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  }
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-white/5 bg-slate-950 py-20">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            Pertanyaan yang sering diajukan
          </h2>
          <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
            {FAQ.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-white">
                  {f.q}
                  <span className="ml-4 text-slate-500 transition group-open:rotate-180">⌃</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-gradient-to-br from-indigo-900/50 via-slate-950 to-fuchsia-900/30 py-20">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
            <Zap className="h-3.5 w-3.5 text-amber-300" /> Siap mencoba?
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
            Lihat sendiri bagaimana OpsFlow menjalankan operasi harian Anda
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Demo interaktif dengan data dummy — klik-klik dashboard, lihat pesanan masuk, kirim broadcast simulasi.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/saas/demo"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
            >
              Buka Demo Sekarang
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
