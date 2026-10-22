/**
 * Copy for the occasion landing pages (/hampers/[momen]) — written for
 * searches like "hampers lebaran malang" or "parcel jenguk orang sakit".
 * Dates are the next occurrence; Lebaran follows the government calendar
 * estimate and is labelled as such.
 */
export type OccasionPage = {
  key: string;
  title: string; // <title>
  h1: string;
  description: string;
  intro: string;
  tips: { q: string; a: string }[];
  /** Next date of the occasion (YYYY-MM-DD) for the countdown; seasonal only. */
  date?: string;
  dateNote?: string;
  gradient: string;
};

export const OCCASION_PAGES: OccasionPage[] = [
  {
    key: "lebaran",
    title: "Hampers & Parcel Lebaran Malang",
    h1: "Hampers Lebaran",
    description: "Hampers & parcel buah Lebaran di Malang — buah segar premium, kartu ucapan gratis, kirim ke keluarga, kerabat & klien. Pesan lebih awal, bisa custom budget.",
    intro: "Silaturahmi lebih manis dengan parcel buah segar. Cocok untuk keluarga, tetangga, guru, hingga klien kantor — dirangkai rapi dengan kartu ucapan Idulfitri.",
    tips: [
      { q: "Kapan sebaiknya pesan hampers Lebaran?", a: "Idealnya 1–2 minggu sebelum Lebaran. Mendekati hari H permintaan sangat tinggi, jadi slot pengiriman cepat penuh." },
      { q: "Bisa kirim ke banyak alamat sekaligus?", a: "Bisa. Untuk 10 alamat atau lebih, gunakan form Pesanan Korporat supaya tim kami bantu atur jadwal dan kartu ucapannya." },
    ],
    date: "2027-03-10",
    dateNote: "perkiraan 1 Syawal 1448 H",
    gradient: "from-leaf-900 via-leaf-700 to-[#5fcf8f]",
  },
  {
    key: "natal",
    title: "Hampers & Parcel Natal Malang",
    h1: "Hampers Natal",
    description: "Hampers & parcel buah Natal di Malang — rangkaian buah segar bernuansa Natal, kartu ucapan gratis, kirim same-day se-Malang. Bisa custom isi & budget.",
    intro: "Rayakan Natal dengan hadiah yang segar dan sehat. Parcel buah Healthila dirangkai dengan sentuhan merah-hijau, lengkap dengan kartu ucapan Natal.",
    tips: [
      { q: "Ada pilihan pita & kartu bertema Natal?", a: "Ada. Pilih pita merah atau hijau dan tulis ucapan Natal Kakak — kartu Healthila gratis, desain custom tersedia." },
      { q: "Bisa kirim tanggal 24 atau 25 Desember?", a: "Bisa selama slot masih tersedia. Disarankan pesan minimal H-3 karena permintaan tinggi." },
    ],
    date: "2026-12-25",
    gradient: "from-[#7a1220] via-[#b3202f] to-leaf-700",
  },
  {
    key: "imlek",
    title: "Hampers & Parcel Imlek Malang",
    h1: "Hampers Imlek",
    description: "Hampers & parcel buah Imlek di Malang — jeruk mandarin, apel, anggur premium untuk keberuntungan. Kartu ucapan gratis, kirim se-Malang.",
    intro: "Jeruk mandarin, apel merah, dan anggur — simbol rezeki dan keberuntungan. Kirim parcel buah Imlek untuk keluarga, rekan bisnis, dan sahabat.",
    tips: [
      { q: "Buah apa yang cocok untuk Imlek?", a: "Jeruk mandarin (rezeki), apel (keselamatan), dan anggur (kelimpahan) paling populer. Tim kami bisa sesuaikan isi dengan budget." },
      { q: "Bisa pakai angpao atau dekorasi merah?", a: "Bisa, tulis permintaan Kakak di catatan atau lewat Rancang Parcel — tim kami konfirmasi via WhatsApp." },
    ],
    date: "2027-02-06",
    gradient: "from-[#8b0000] via-[#c8102e] to-sun-400",
  },
  {
    key: "ulang-tahun",
    title: "Parcel Buah Ulang Tahun Malang",
    h1: "Parcel Ulang Tahun",
    description: "Parcel & hampers buah ulang tahun di Malang — kado sehat yang beda dari kue dan bunga. Kartu ucapan gratis, bisa kirim same-day ke alamat penerima.",
    intro: "Kado ulang tahun yang segar, cantik, dan sehat. Kirim langsung ke rumah atau kantor penerima, lengkap dengan kartu ucapan pribadi.",
    tips: [
      { q: "Bisa kirim kejutan di hari yang sama?", a: "Bisa, pilih jam antar di keranjang. Pesan sebelum batas jam same-day yang tertera supaya terkirim hari ini." },
      { q: "Bisa tambah bunga atau kue?", a: "Beberapa parcel sudah termasuk bunga (mis. Sweet Bloom). Untuk permintaan lain, gunakan Rancang Parcel atau chat kami." },
    ],
    gradient: "from-plum-700 via-[#b8245e] to-coral-500",
  },
  {
    key: "jenguk",
    title: "Parcel Buah Jenguk Orang Sakit Malang",
    h1: "Parcel Jenguk & Get Well Soon",
    description: "Parcel buah untuk jenguk orang sakit di Malang — buah segar kaya vitamin, bisa kirim ke rumah sakit atau rumah. Kartu get well soon gratis.",
    intro: "Doa dan semangat lewat buah segar kaya vitamin. Kami bisa antar langsung ke rumah sakit atau rumah di Malang, dengan kartu “Get Well Soon”.",
    tips: [
      { q: "Bisa kirim ke rumah sakit?", a: "Bisa. Tulis nama rumah sakit, nomor kamar, dan nama pasien di alamat; kurir kami akan menitipkan sesuai aturan RS." },
      { q: "Buah apa yang cocok untuk orang sakit?", a: "Buah yang mudah dimakan dan kaya vitamin C seperti jeruk, apel, pir, dan anggur seedless. Hindari buah yang terlalu asam bila pasien punya maag." },
    ],
    gradient: "from-leaf-700 via-[#2f9e6a] to-lime-400",
  },
  {
    key: "lamaran",
    title: "Parcel Buah Lamaran & Seserahan Malang",
    h1: "Parcel Lamaran & Seserahan",
    description: "Parcel buah lamaran & seserahan di Malang — rangkaian buah premium yang elegan untuk lamaran, tunangan, dan pernikahan. Bisa custom tema & warna.",
    intro: "Seserahan buah yang elegan untuk hari bahagia. Kami rangkai sesuai tema dan warna acara Kakak, dengan pilihan buah premium lokal dan impor.",
    tips: [
      { q: "Bisa menyesuaikan warna tema acara?", a: "Bisa, pilih warna pita di Rancang Parcel atau tulis tema di catatan. Untuk beberapa parcel sekaligus, chat kami supaya seragam." },
      { q: "Berapa lama sebelumnya harus pesan?", a: "Disarankan minimal 3–7 hari sebelum acara supaya buah terbaik bisa kami siapkan." },
    ],
    gradient: "from-[#b76e79] via-[#d89aa3] to-sun-300",
  },
  {
    key: "kantor",
    title: "Parcel Buah Kantor & Klien Malang",
    h1: "Parcel untuk Kantor & Klien",
    description: "Parcel buah untuk kantor, klien, dan karyawan di Malang — pesanan jumlah banyak, kartu ucapan dengan nama perusahaan, kirim ke banyak alamat.",
    intro: "Apresiasi klien dan karyawan dengan parcel buah segar. Kami terbiasa melayani pesanan jumlah banyak, kartu ucapan bernama perusahaan, dan kirim ke banyak alamat.",
    tips: [
      { q: "Ada harga khusus untuk jumlah banyak?", a: "Ada. Isi form Pesanan Korporat, tim kami kirim penawaran sesuai jumlah dan budget per paket." },
      { q: "Bisa pakai logo perusahaan di kartu?", a: "Bisa dengan opsi Kartu Custom Desain." },
    ],
    gradient: "from-ink via-leaf-900 to-leaf-700",
  },
  {
    key: "duka",
    title: "Parcel Buah Duka Cita Malang",
    h1: "Parcel Duka Cita",
    description: "Parcel buah duka cita di Malang — tanda simpati yang sederhana dan penuh hormat untuk keluarga yang berduka. Kirim ke rumah duka, kartu ucapan gratis.",
    intro: "Ungkapan simpati yang sederhana dan penuh hormat. Kami antar ke rumah duka di Malang dengan rangkaian yang tenang dan kartu ucapan belasungkawa.",
    tips: [
      { q: "Bisa kirim cepat ke rumah duka?", a: "Kami usahakan di hari yang sama sesuai slot antar yang tersedia. Chat kami bila mendesak." },
      { q: "Warna apa yang sesuai?", a: "Kami sarankan pita putih atau warna lembut; tulis permintaan di catatan." },
    ],
    gradient: "from-slate-700 via-slate-600 to-slate-400",
  },
];

export const occasionPage = (key: string) => OCCASION_PAGES.find((p) => p.key === key) ?? null;
