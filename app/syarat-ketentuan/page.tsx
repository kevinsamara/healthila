import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat & ketentuan belanja di Healthila Malang: pemesanan online, konfirmasi via WhatsApp, pembayaran, pengiriman, dan retur buah.",
};

export default function TermsPage() {
  return (
    <ContentPage title="Syarat & Ketentuan" updated="18 Oktober 2026">
      <p>
        Dengan memesan melalui healthila.id, Anda menyetujui syarat dan ketentuan berikut.
      </p>
      <h2>1. Pemesanan</h2>
      <ul>
        <li>Pesanan dianggap sah setelah dikonfirmasi admin Healthila melalui WhatsApp.</li>
        <li>Harga di website dapat berubah mengikuti musim; harga final adalah yang dikonfirmasi admin.</li>
        <li>Untuk buah yang dijual per kg, berat aktual dapat sedikit berbeda dan akan disesuaikan saat konfirmasi.</li>
      </ul>
      <h2>2. Pembayaran</h2>
      <ul>
        <li>Pembayaran dilakukan setelah pesanan dikonfirmasi, melalui metode yang diinformasikan admin.</li>
        <li>Pesanan diproses setelah pembayaran diterima, kecuali disepakati lain (mis. bayar di tempat).</li>
      </ul>
      <h2>3. Pengiriman</h2>
      <ul>
        <li>Ongkos kirim dihitung berdasarkan alamat tujuan dan diinformasikan saat konfirmasi.</li>
        <li>Pastikan alamat dan nomor penerima benar. Keterlambatan akibat data yang keliru di luar tanggung jawab kami.</li>
      </ul>
      <h2>4. Keluhan & Pengembalian</h2>
      <ul>
        <li>Keluhan kualitas produk disampaikan maksimal 1×24 jam setelah barang diterima, disertai foto.</li>
        <li>Solusi dapat berupa penggantian produk, voucher, atau pengembalian dana sesuai penilaian tim kami.</li>
      </ul>
      <h2>5. Pembatalan</h2>
      <p>
        Pesanan yang sudah dibayar dan sedang disiapkan—terutama parcel dan produk yang dibuat sesuai pesanan—tidak dapat
        dibatalkan.
      </p>
      <h2>6. Kontak</h2>
      <p>
        Pertanyaan terkait ketentuan ini dapat disampaikan melalui WhatsApp {site.whatsappDisplay} atau email admin@healthila.id.
      </p>
    </ContentPage>
  );
}
