import type { Metadata } from "next";
import { Barlow_Condensed, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { StoreJsonLd } from "@/components/JsonLd";
import { site } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Toko Buah Malang — Buah Segar, Parcel Buah & Hampers | Healthila",
    template: "%s | Healthila",
  },
  description: site.description,
  keywords: [
    "toko buah malang",
    "buah malang",
    "buah online malang",
    "delivery buah malang",
    "parcel buah malang",
    "parcel malang",
    "hampers malang",
    "hampers buah malang",
    "jus buah malang",
    "buah impor malang",
  ],
  // "./" resolves to each page's own path, so every page is its own canonical.
  alternates: { canonical: "./" },
  // Google Search Console ownership (HTML-tag method), set on Vercel.
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: site.name,
    url: "./",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} ${barlow.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
        <StoreJsonLd />
      </body>
    </html>
  );
}
