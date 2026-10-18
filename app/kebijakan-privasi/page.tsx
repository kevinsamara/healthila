import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";

export const metadata: Metadata = { title: "Kebijakan Privasi" };

export default function PrivacyPage() {
  return (
    <ContentPage title="Kebijakan Privasi" updated="18 Oktober 2026">
      <p>
        Kebijakan ini menjelaskan bagaimana Healthila mengumpulkan dan menggunakan data Anda saat berbelanja di
        healthila.id.
      </p>
      <h2>1. Data yang kami kumpulkan</h2>
      <ul>
        <li>Nama, nomor WhatsApp, dan alamat pengiriman yang Anda isi saat memesan.</li>
        <li>Isi pesanan: produk, jumlah, tanggal kirim, dan catatan.</li>
        <li>Isi keranjang disimpan di perangkat Anda (localStorage) sampai pesanan dikirim.</li>
      </ul>
      <h2>2. Penggunaan data</h2>
      <ul>
        <li>Memproses dan mengirim pesanan Anda.</li>
        <li>Menghubungi Anda terkait pesanan melalui WhatsApp.</li>
        <li>Meningkatkan layanan kami.</li>
      </ul>
      <p>Kami tidak menjual data Anda kepada pihak ketiga.</p>
      <h2>3. Berbagi data</h2>
      <p>
        Data hanya dibagikan kepada staf Healthila yang berwenang, kurir yang mengantar pesanan (nama, alamat, telepon),
        dan penyedia layanan teknis kami (Supabase, Vercel, penyedia gateway WhatsApp).
      </p>
      <h2>4. Cookies</h2>
      <p>Kami hanya memakai penyimpanan teknis yang diperlukan agar website berfungsi, tanpa cookies iklan pihak ketiga.</p>
      <h2>5. Hak Anda</h2>
      <p>
        Anda dapat meminta akses, koreksi, atau penghapusan data Anda dengan menghubungi admin@healthila.id atau WhatsApp
        kami.
      </p>
    </ContentPage>
  );
}
