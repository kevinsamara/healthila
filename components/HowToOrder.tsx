import Link from "next/link";
import { UserCheck } from "lucide-react";
import { SectionTitle } from "./HomeSections";

/**
 * "Cara Order" on the home page: three illustrated steps — ordering from a
 * phone, the delivery scooter, the fruit arriving at the house. Inline SVG
 * (no emoji, no extra requests); gentle motion that respects reduced motion.
 */
const steps = [
  {
    title: "Pilih Produk",
    text: "Pilih buah, jus, atau parcel favoritmu dari katalog — langsung dari HP.",
    bg: "bg-[#fff4cc]",
    Art: PhoneArt,
  },
  {
    title: "Isi Data",
    text: "Masukkan nomor WhatsApp, nama, dan alamat pengiriman.",
    bg: "bg-[#ffe6d5]",
    Art: ScooterArt,
    login: true,
  },
  {
    title: "Produk Dikirim",
    text: "Admin konfirmasi via WhatsApp, pesanan diproses & diantar sampai ke rumah.",
    bg: "bg-[#ddf8e6]",
    Art: HouseArt,
  },
];

export function HowToOrder() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 py-20">
        <SectionTitle title="Cara Order" subtitle="Pesan dari HP, kami antar sampai depan rumah" />
        <ol className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-28 -right-8 z-10 hidden w-8 border-t-[3px] border-dashed border-leaf-200 md:block"
                />
              )}
              <div className="flex h-full flex-col rounded-[2rem] bg-white p-5 text-center shadow-lg ring-1 shadow-leaf-900/5 ring-leaf-100">
                <div className={`relative overflow-hidden rounded-[1.5rem] ${s.bg}`}>
                  <s.Art />
                  <span className="absolute top-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-leaf-700 font-display text-2xl font-bold text-white shadow-md">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-3xl font-bold text-ink">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-muted">{s.text}</p>
                {s.login && (
                  <p className="mx-auto mt-4 flex max-w-xs items-start gap-2 rounded-2xl bg-leaf-50 px-4 py-3 text-left text-sm text-leaf-900">
                    <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-leaf-700" />
                    <span>
                      <b>Sudah login?</b> Nama, nomor & alamat tersimpan langsung terisi — nggak perlu ketik ulang.{" "}
                      <Link href="/masuk" className="font-semibold text-leaf-700 underline-offset-2 hover:underline">
                        Masuk
                      </Link>
                    </span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const SKIN = "#f2c4a0";
const INK = "#1d2420";

function PhoneArt() {
  return (
    <svg viewBox="0 0 240 170" className="block h-auto w-full" role="img" aria-label="Orang memesan buah lewat HP">
      <circle cx="120" cy="96" r="70" fill="#fff" opacity=".55" />
      {/* person */}
      <path d="M70 170c0-38 18-56 50-56s50 18 50 56Z" fill="#5fd38d" />
      <rect x="111" y="98" width="18" height="20" rx="6" fill={SKIN} />
      <circle cx="120" cy="80" r="26" fill={SKIN} />
      <path d="M94 80c-2-22 12-32 27-32 17 0 30 10 26 32-6-12-18-16-29-15-10 1-18 6-24 15Z" fill="#3b2a20" />
      <path d="M109 84q4 3 8 0M125 84q4 3 8 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M114 95q7 5 14 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="106" cy="92" r="4" fill="#f47fb1" opacity=".45" />
      <circle cx="136" cy="92" r="4" fill="#f47fb1" opacity=".45" />
      {/* phone in hand */}
      <g className="howto-bob">
        <g transform="rotate(-8 142 136)">
          <rect x="126" y="104" width="34" height="58" rx="7" fill={INK} />
          <rect x="129" y="110" width="28" height="44" rx="3" fill="#fff" />
          <circle cx="136" cy="119" r="4" fill="#ff4d5e" />
          <circle cx="146" cy="119" r="4" fill="#ff9a52" />
          <circle cx="141" cy="128" r="4" fill="#b5f60a" />
          <rect x="132" y="141" width="22" height="7" rx="3.5" fill="#04724a" />
        </g>
      </g>
      <path d="M86 150c10 6 30 6 44-4" stroke="#5fd38d" strokeWidth="13" fill="none" strokeLinecap="round" />
      <circle cx="132" cy="146" r="7" fill={SKIN} />
      {/* chat bubble */}
      <g className="howto-pop">
        <rect x="168" y="30" width="50" height="34" rx="12" fill="#fff" />
        <path d="M176 62l-4 12 14-10Z" fill="#fff" />
        <path d="M183 47l7 7 13-13" stroke="#04724a" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M196 100c-6-8 6-14 9-5 3-9 15-3 9 5l-9 9Z" fill="#ff4d5e" opacity=".7" className="howto-pop" />
    </svg>
  );
}

function ScooterArt() {
  return (
    <svg viewBox="0 0 240 170" className="block h-auto w-full" role="img" aria-label="Kurir motor mengantar pesanan">
      <circle cx="120" cy="96" r="70" fill="#fff" opacity=".55" />
      <path d="M10 156H230" stroke={INK} strokeOpacity=".15" strokeWidth="3" strokeDasharray="12 10" strokeLinecap="round" className="howto-road" />
      {/* speed lines */}
      <g stroke={INK} strokeOpacity=".25" strokeWidth="3" strokeLinecap="round" className="howto-speed">
        <path d="M14 102h26M8 116h30M18 130h22" />
      </g>
      <g className="howto-bob">
        {/* delivery box */}
        <rect x="42" y="68" width="40" height="36" rx="6" fill="#04724a" />
        <rect x="42" y="68" width="40" height="9" rx="4" fill="#138a5c" />
        <circle cx="62" cy="91" r="8" fill="#ff9a52" />
        <path d="M62 83q4-6 9-5-2 6-9 5Z" fill="#b5f60a" />
        {/* rider */}
        <path d="M108 118l18 12 4 18" stroke="#33415c" strokeWidth="11" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M92 108l14-38c4-9 18-9 20 1l-4 37Z" fill="#00b1ff" />
        <path d="M120 78l26 10" stroke="#00b1ff" strokeWidth="10" strokeLinecap="round" />
        <circle cx="148" cy="89" r="5" fill={SKIN} />
        <circle cx="124" cy="56" r="17" fill="#ffd23f" />
        <path d="M128 50h14a3 3 0 0 1 0 12h-12Z" fill={INK} opacity=".85" />
        <path d="M108 54a17 17 0 0 1 30-9" stroke="#fff" strokeOpacity=".6" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* scooter */}
        <path d="M70 128c0-14 10-22 26-22h20v22Z" fill="#f47fb1" />
        <rect x="84" y="102" width="40" height="9" rx="4.5" fill={INK} />
        <rect x="100" y="124" width="56" height="10" rx="5" fill="#f47fb1" />
        <path d="M148 134l12-50h11l-7 50Z" fill="#f47fb1" />
        <path d="M164 86l-8-12" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <circle cx="174" cy="92" r="5" fill="#ffd23f" />
      </g>
      <circle cx="84" cy="140" r="17" fill={INK} />
      <circle cx="84" cy="140" r="7" fill="#d1d5db" />
      <circle cx="170" cy="140" r="17" fill={INK} />
      <circle cx="170" cy="140" r="7" fill="#d1d5db" />
    </svg>
  );
}

function HouseArt() {
  return (
    <svg viewBox="0 0 240 170" className="block h-auto w-full" role="img" aria-label="Pesanan buah tiba di rumah">
      <circle cx="120" cy="96" r="70" fill="#fff" opacity=".55" />
      <path d="M10 156H230" stroke={INK} strokeOpacity=".15" strokeWidth="3" strokeLinecap="round" />
      {/* bushes */}
      <circle cx="38" cy="146" r="14" fill="#5fd38d" />
      <circle cx="54" cy="150" r="10" fill="#138a5c" />
      <circle cx="206" cy="148" r="12" fill="#5fd38d" />
      {/* house */}
      <rect x="146" y="50" width="14" height="26" fill="#c65f2a" />
      <rect x="70" y="88" width="104" height="68" fill="#fff8ef" />
      <path d="M58 94l64-52 64 52Z" fill="#ff9a52" />
      <path d="M58 94l64-52 64 52" stroke="#c65f2a" strokeWidth="4" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <rect x="110" y="114" width="26" height="42" rx="4" fill="#04724a" />
      <circle cx="131" cy="136" r="2.5" fill="#ffd23f" />
      <rect x="80" y="104" width="22" height="20" rx="3" fill="#bfe9ff" />
      <path d="M91 104v20M80 114h22" stroke="#fff" strokeWidth="2.5" />
      <rect x="146" y="104" width="20" height="20" rx="3" fill="#bfe9ff" />
      <path d="M156 104v20M146 114h20" stroke="#fff" strokeWidth="2.5" />
      {/* fruit basket at the door */}
      <circle cx="150" cy="140" r="7" fill="#ff9a52" />
      <circle cx="160" cy="137" r="7" fill="#ff4d5e" />
      <circle cx="170" cy="141" r="6" fill="#b5f60a" />
      <path d="M142 142h36l-5 14h-26Z" fill="#c98b4f" />
      <path d="M146 148h28" stroke="#a16a3a" strokeWidth="2" />
      {/* location pin */}
      <g className="howto-pin">
        <path d="M122 4c-11 0-19 8-19 18 0 13 19 30 19 30s19-17 19-30c0-10-8-18-19-18Z" fill="#ff4d5e" />
        <path d="M114 22l6 6 10-11" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
