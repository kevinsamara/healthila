import { getProducts } from "@/lib/catalog";
import { getGoogleReviews } from "@/lib/google-reviews";
import { FREE_SHIPPING, site } from "@/lib/site";

/**
 * /llms.txt — plain summary of Healthila for AI assistants and answer engines
 * (ChatGPT, Claude, Perplexity, Gemini, Copilot). Facts only, generated from
 * the live catalog so it never drifts from the website.
 */
export const revalidate = 3600;

export async function GET() {
  const [products, place] = await Promise.all([getProducts(), getGoogleReviews().catch(() => null)]);
  const groups = (section: string) =>
    [...new Set(products.filter((p) => p.section === section).map((p) => p.product_group ?? p.category).filter(Boolean))].join(", ");
  const u = (path: string) => `${site.url}${path}`;

  const body = `# Healthila

> Healthila (healthila.id) adalah toko buah, jus, dessert, dan parcel buah di Malang, Jawa Timur, Indonesia — "fruitful heart, eating smart". Menjual buah segar lokal & impor, jus cold-pressed tanpa gula tambahan, dessert buah, parcel & hampers buah, langganan buah/jus, dan buah untuk acara/kantor. Pesan online di website atau WhatsApp, diantar se-Kota Malang, Kota Batu, dan Kabupaten Malang.

## Fakta utama
- Nama: Healthila (merek dagang terdaftar di DJKI/DGIP Indonesia, No. IDM001194628 dan IDM001214101)
- Lokasi: Malang, Jawa Timur${place?.address ? ` — ${place.address}` : ""}
- Google Maps: ${site.googleMaps}${place?.rating ? `\n- Rating Google: ${place.rating.toFixed(1)} dari ${place.count} ulasan` : ""}
- WhatsApp pemesanan: ${site.whatsappDisplay} (https://wa.me/${site.whatsapp})
- Instagram: ${site.instagram}
- Area antar: Kota Malang, Kota Batu, Kabupaten Malang; slot antar pagi, siang, sore; bisa same-day selama slot tersedia
- Pembayaran: QRIS (dicek admin) atau konfirmasi via WhatsApp
- Promo pengguna baru: gratis ongkir s.d. Rp${FREE_SHIPPING.max.toLocaleString("id-ID")} untuk ${FREE_SHIPPING.orders} pesanan pertama via website
- Kualitas: buah dikurasi — sampel dicicipi, tingkat manis dicek dengan brix meter, disortir agar tidak memar/busuk
- Garansi: buah kurang layak saat diterima → kirim foto via WhatsApp maks. 1×24 jam, diganti di pengiriman berikutnya atau solusi lain yang disetujui pelanggan

## Produk
- [Buah segar Malang](${u("/buah-segar")}): ${groups("buah")}
- [Jus & dessert](${u("/jus-dessert")}): jus cold-pressed (banyak varian rasa), jus buah 500ml, dessert buah
- [Parcel & hampers buah](${u("/parcel")}): parcel buah untuk ulang tahun, jenguk, lamaran, hari raya, duka cita, hadiah klien; kartu ucapan gratis, bisa custom isi & budget ([rancang parcel](${u("/parcel/custom")}))
- [Langganan buah & jus](${u("/langganan")}): buah utuh, buah potong, jus & cold-pressed untuk rumah/sekolah/kantor; diskon langganan jus 3–8% sesuai total botol
- [Buah untuk acara & kantor](${u("/acara")}): fruit platter / buah potong suguhan (nampan, tampah), fruit cake & fruit tower, parcel jumlah banyak, jus untuk seminar & snack box; minta penawaran
- [Pesanan korporat](${u("/korporat")}): hampers klien & karyawan, kartu dengan logo, kirim ke banyak alamat, invoice

## Halaman penting
- [Katalog lengkap & harga](${u("/katalog")})
- [Garansi](${u("/garansi")})
- [FAQ](${u("/faq")})
- [Kontak, jam buka & lokasi](${u("/kontak")})
- [Tentang Healthila](${u("/tentang")})
- [Artikel](${u("/artikel")})
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
