import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/profile";
import { site, waLink } from "@/lib/site";
import { BirthDateForm } from "./BirthDateForm";
import { Cake, Lock } from "lucide-react";

export const metadata: Metadata = { title: "Tanggal Lahir", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Asked once right after the first login. Once set, tanggal lahir TERKUNCI —
 * perubahan harus lewat admin (anti fraud voucher ulang tahun). */
export default async function TanggalLahirPage({ searchParams }: PageProps<"/profil/tanggal-lahir">) {
  const raw = (await searchParams).next;
  const next = typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/akun";
  const profile = await getProfile();
  if (!profile) redirect(`/masuk?next=${encodeURIComponent("/profil/tanggal-lahir?next=" + next)}`);

  if (profile.locked && profile.birth_date) {
    const fmt = new Date(profile.birth_date + "T00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    return (
      <div className="mx-auto max-w-md px-4 py-14">
        <div className="rounded-3xl bg-white p-8 ring-1 ring-leaf-100">
          <Lock className="h-10 w-10 text-leaf-700" strokeWidth={1.6} />
          <h1 className="mt-3 text-2xl font-extrabold text-ink">Tanggal lahir sudah tersimpan</h1>
          <p className="mt-2 text-muted">
            <b className="text-ink">{fmt}</b>
          </p>
          <p className="mt-3 text-sm text-muted">
            Tanggal lahir hanya dapat diisi sekali untuk mencegah penyalahgunaan voucher ulang tahun.
            Kalau ada kesalahan, hubungi admin via WhatsApp — kami bantu koreksi.
          </p>
          <a
            href={waLink(`Halo Healthila, saya ingin mengubah tanggal lahir di akun saya (${site.whatsappDisplay} / nomor WA login).`)}
            target="_blank" rel="noopener noreferrer"
            className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-leaf-700 px-6 font-bold text-white hover:bg-leaf-900"
          >
            Chat admin
          </a>
          <Link href={next} className="mt-3 block text-center text-sm text-muted hover:text-ink">Kembali</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-3xl bg-white p-8 ring-1 ring-leaf-100">
        <Cake className="h-12 w-12 text-plum-700" strokeWidth={1.5} />
        <h1 className="mt-3 text-3xl font-extrabold text-ink">Kapan ulang tahun Kakak?</h1>
        <p className="mt-2 text-muted">
          Di hari ulang tahun Kakak, kami kirim <b className="text-ink">voucher spesial</b> lewat WhatsApp. Tanggal lahir hanya dipakai untuk itu.
        </p>
        <p className="mt-2 text-xs text-muted">
          Catatan: tanggal lahir hanya bisa diisi sekali. Pastikan sudah benar sebelum simpan — perubahan setelah ini perlu dibantu admin.
        </p>
        <BirthDateForm next={next} initial={profile.birth_date} allowSkip={!profile.birth_date} />
      </div>
    </div>
  );
}
