import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Pertanyaan yang sering diajukan seputar pemesanan, pengiriman, dan pembayaran di Healthila.",
};

const faqs: { q: string; a: string }[] = [
  {
    q: "Bagaimana cara memesan?",
    a: "Pilih produk di katalog, masukkan ke keranjang, isi detail pengiriman, lalu tekan \"Pesan via WhatsApp\". Pesanan Anda terkirim ke admin kami dan akan dikonfirmasi di chat.",
  },
  {
    q: "Apakah harga di website sudah final?",
    a: "Harga buah mengikuti musim dan bisa berubah. Admin akan mengonfirmasi harga, ketersediaan stok, dan ongkos kirim sebelum Anda membayar.",
  },
  {
    q: "Bagaimana cara pembayarannya?",
    a: "Pembayaran dilakukan melalui transfer bank atau metode lain yang diinformasikan admin setelah pesanan dikonfirmasi.",
  },
  {
    q: "Ke mana saja Healthila mengirim?",
    a: "Kami mengirim dengan kurir sendiri maupun kurir online. Ongkos kirim dihitung berdasarkan alamat tujuan dan dikonfirmasi admin.",
  },
  {
    q: "Bisa pesan untuk dikirim di tanggal tertentu?",
    a: "Bisa. Isi tanggal kirim pada saat checkout. Untuk parcel dan produk yang dibuat sesuai pesanan, mohon pesan minimal H-1.",
  },
  {
    q: "Bagaimana jika buah yang diterima kurang baik?",
    a: "Hubungi kami via WhatsApp maksimal 1×24 jam setelah barang diterima, sertakan foto. Kami akan bantu dengan penggantian atau solusi lain sesuai Syarat & Ketentuan.",
  },
  {
    q: "Bisa custom parcel?",
    a: "Bisa. Ceritakan budget, momen, dan buah favorit penerima melalui WhatsApp, tim kami akan membantu merangkainya.",
  },
];

export default function FaqPage() {
  return (
    <ContentPage title="Pertanyaan yang Sering Diajukan">
      <div className="not-prose space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl bg-white p-5 ring-1 ring-leaf-100 open:ring-leaf-200">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
              {f.q}
              <span className="text-leaf-700 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <p>
        Pertanyaan lain?{" "}
        <a href={waLink("Halo Healthila, saya mau bertanya")} className="font-semibold text-leaf-700 underline">
          Chat kami di WhatsApp {site.whatsappDisplay}
        </a>
        .
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
    </ContentPage>
  );
}
