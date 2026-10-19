import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccount } from "@/lib/session";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Masuk", robots: { index: false } };

export default async function MasukPage({ searchParams }: PageProps<"/masuk">) {
  const raw = (await searchParams).next;
  // Only same-site paths, never "//evil.com".
  const next = typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/akun";
  if (await getAccount()) redirect(next);

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-extrabold tracking-tight text-leaf-900">Masuk</h1>
      <p className="mt-2 text-muted">
        Cukup pakai nomor WhatsApp. Kami kirim kode 6 digit — tanpa password.
      </p>
      <LoginForm next={next} />
    </div>
  );
}
