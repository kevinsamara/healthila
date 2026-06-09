import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Healthila — Pengalaman Rasa Alami. Segar.",
  description: "Premium fruit, cold-pressed juice, hamper elegan & dessert sehat — dikirim langsung ke pintumu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}