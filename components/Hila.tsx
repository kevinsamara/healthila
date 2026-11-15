import Image from "next/image";

/**
 * Hila — Healthila's orange mascot and the face of CS 24 Jam. Stickers live in
 * public/hila (560×512 webp, transparent); each pose already carries its own
 * speech bubble, so pick the pose whose words fit the moment.
 */
export type HilaPose =
  | "halo"
  | "aku-hila"
  | "selamat-datang"
  | "siap-membantu"
  | "siap"
  | "bisa-banget"
  | "cek"
  | "cari"
  | "diproses"
  | "perjalanan"
  | "selesai"
  | "berhasil"
  | "terima-kasih"
  | "terima-kasih-review"
  | "senang-suka"
  | "senangnya"
  | "maaf";

const ALT: Record<HilaPose, string> = {
  halo: "Hila menyapa: Halo!",
  "aku-hila": "Aku Hila, CS Healthila 24 jam",
  "selamat-datang": "Hila: Selamat datang di Healthila!",
  "siap-membantu": "Hila: Siap membantu!",
  siap: "Hila: Siap!",
  "bisa-banget": "Hila: Bisa banget!",
  cek: "Hila: Sedang saya cek ya!",
  cari: "Hila: Saya cari dulu ya!",
  diproses: "Hila: Pesananmu sedang diproses!",
  perjalanan: "Hila: Dalam perjalanan ya!",
  selesai: "Hila: Sudah selesai!",
  berhasil: "Hila: Yeay! Berhasil!",
  "terima-kasih": "Hila: Terima kasih!",
  "terima-kasih-review": "Hila: Terima kasih reviewnya!",
  "senang-suka": "Hila: Senang Kakak suka!",
  senangnya: "Hila: Wah, senangnya!",
  maaf: "Hila: Maaf ya…",
};

export function Hila({ pose, className = "w-48", priority = false }: { pose: HilaPose; className?: string; priority?: boolean }) {
  return (
    <Image
      src={`/hila/${pose}.webp`}
      alt={ALT[pose]}
      width={560}
      height={512}
      sizes="(min-width: 640px) 280px, 60vw"
      priority={priority}
      className={`h-auto select-none ${className}`}
      draggable={false}
    />
  );
}

/** Round face of Hila for chat bubbles and the CS button. */
export function HilaAvatar({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <Image
      src="/hila/avatar.webp"
      alt="Hila"
      width={160}
      height={160}
      className={`shrink-0 rounded-full bg-[#fff1d6] object-cover ring-2 ring-white ${className}`}
    />
  );
}
