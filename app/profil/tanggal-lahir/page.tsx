import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/profile";
import { BirthDateForm } from "./BirthDateForm";

export const metadata: Metadata = { title: "Tanggal Lahir", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Asked once right after the first login (and editable from Akun). */
export default async function TanggalLahirPage({ searchParams }: PageProps<"/profil/tanggal-lahir">) {
  const raw = (await searchParams).next;
  const next = typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/akun";
  const profile = await getProfile();
  if (!profile) redirect(`/masuk?next=${encodeURIComponent("/profil/tanggal-lahir?next=" + next)}`);

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-3xl bg-white p-8 ring-1 ring-leaf-100">
        <p className="text-5xl">🎂</p>
        <h1 className="mt-3 text-3xl font-extrabold text-ink">Kapan ulang tahun Kakak?</h1>
        <p className="mt-2 text-muted">
          Di hari ulang tahun Kakak, kami kirim <b className="text-ink">voucher spesial</b> lewat WhatsApp. Tanggal lahir hanya dipakai untuk itu.
        </p>
        <BirthDateForm next={next} initial={profile.birth_date} allowSkip={!profile.birth_date} />
      </div>
    </div>
  );
}
