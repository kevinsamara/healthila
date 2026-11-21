"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "saas_access";
const COOKIE_VALUE = "ok";

function expectedCode(): string {
  return (process.env.SAAS_ACCESS_CODE || "151515").trim();
}

export async function hasAccess(): Promise<boolean> {
  const c = await cookies();
  return c.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}

export async function submitAccessCodeAction(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const code = String(formData.get("code") ?? "").trim();
  if (code !== expectedCode()) {
    return { ok: false, error: "Kode akses salah" };
  }
  const c = await cookies();
  c.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/saas",
    maxAge: 60 * 60 * 24 * 30, // 30 hari
  });
  redirect("/saas");
}

export async function clearAccessAction() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
  redirect("/saas");
}
