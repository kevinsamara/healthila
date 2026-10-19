/**
 * Articles live in code for now (edited via git). Each body block is a
 * paragraph, a heading ("## ") or a bullet list ("- " lines).
 */

export type Article = {
  slug: string;
  title: string;
  category: "Kesehatan" | "Hadiah Sehat" | "Tips Harian";
  excerpt: string;
  date: string; // YYYY-MM-DD
  readMinutes: number;
  cover: { emoji: string; gradient: string };
  related: { label: string; href: string };
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "manfaat-jus-lemon-tiap-pagi",
    title: "Minum Jus Lemon Tiap Pagi: Apa Saja Manfaatnya untuk Kulit & Berat Badan?",
    category: "Kesehatan",
    excerpt:
      "Air lemon hangat jadi ritual pagi banyak orang. Ini manfaat yang realistis — dan cara minumnya supaya tetap aman untuk lambung dan gigi.",
    date: "2026-10-10",
    readMinutes: 4,
    cover: { emoji: "🍋", gradient: "from-sun-300 to-sun-500" },
    related: { label: "Lihat jus cold-pressed", href: "/jus-dessert" },
    body: [
      "Segelas air lemon di pagi hari sering disebut sebagai rahasia kulit cerah dan badan lebih ringan. Tidak ada minuman ajaib, tapi kebiasaan kecil ini memang bisa membantu kalau dibarengi pola makan dan tidur yang baik.",
      "## Kaya vitamin C",
      "Lemon mengandung vitamin C, antioksidan yang berperan dalam pembentukan kolagen dan menjaga daya tahan tubuh. Kulit butuh kolagen supaya tetap kenyal, jadi asupan vitamin C yang cukup ikut mendukung kesehatan kulit dari dalam.",
      "## Membantu hidrasi",
      "Banyak orang kurang minum air karena rasanya hambar. Sedikit perasan lemon membuat air lebih segar sehingga lebih mudah memenuhi kebutuhan cairan harian — dan tubuh yang terhidrasi baik membantu kulit tidak kusam.",
      "## Bagaimana dengan berat badan?",
      "Air lemon tidak membakar lemak secara langsung. Manfaatnya lebih ke kebiasaan: mengganti minuman manis di pagi hari dengan air lemon tanpa gula berarti kalori harian berkurang. Itulah yang dalam jangka panjang membantu menjaga berat badan.",
      "## Tips minum yang aman",
      "- Encerkan: perasan setengah lemon untuk satu gelas air hangat.\n- Jangan tambahkan gula; madu secukupnya bila perlu.\n- Minum dengan sedotan dan kumur air putih sesudahnya untuk melindungi enamel gigi.\n- Bila punya maag atau GERD, minum setelah sarapan, bukan saat perut kosong.",
      "Ingin praktis? Jus cold-pressed jeruk dan lemon Healthila dibuat fresh setiap hari tanpa gula tambahan.",
    ],
  },
  {
    slug: "kado-hampers-buah",
    title: "Pengen Kasih Kado yang Beda dari Cokelat & Bunga? Coba Hampers Buah.",
    category: "Hadiah Sehat",
    excerpt:
      "Hampers buah cantik dilihat, menyehatkan, dan bisa dinikmati sekeluarga. Ini cara memilih isinya sesuai momen dan penerima.",
    date: "2026-10-05",
    readMinutes: 3,
    cover: { emoji: "🧺", gradient: "from-plum-500 to-coral-500" },
    related: { label: "Lihat parcel & hampers", href: "/parcel" },
    body: [
      "Cokelat dan bunga sudah terlalu sering. Hampers buah memberi kesan lebih personal: terlihat mewah, bisa dinikmati bersama keluarga, dan menunjukkan kamu peduli pada kesehatan penerimanya.",
      "## Sesuaikan dengan momennya",
      "- Get well soon: pilih buah yang lembut dan mudah dimakan seperti anggur, jeruk, dan pear.\n- Ulang tahun & anniversary: kombinasikan buah premium berwarna cerah — apel merah, anggur, dan kiwi.\n- Lebaran & hari raya: ukuran besar dengan buah tahan lama seperti apel dan jeruk, cocok untuk keluarga besar.",
      "## Perhatikan kesegarannya",
      "Hampers yang baik dirangkai di hari pengiriman, bukan disiapkan berhari-hari sebelumnya. Di Healthila, setiap parcel dirangkai fresh dan buahnya melewati sortir kualitas terlebih dahulu.",
      "## Tambahkan sentuhan personal",
      "Kartu ucapan kecil membuat hadiah jadi berkesan. Tulis pesanmu di catatan saat memesan, kami sertakan di dalam parcel.",
    ],
  },
  {
    slug: "jus-biasa-vs-cold-pressed",
    title: "Jus Biasa vs Cold-Pressed: Apa Bedanya untuk Gula Darah?",
    category: "Tips Harian",
    excerpt:
      "Sama-sama jus buah, tapi cara pembuatan dan tambahan gulanya bisa membuat efeknya berbeda. Ini yang perlu kamu tahu sebelum memilih.",
    date: "2026-09-28",
    readMinutes: 4,
    cover: { emoji: "🧃", gradient: "from-leaf-500 to-[#5fcf8f]" },
    related: { label: "Lihat jus cold-pressed", href: "/jus-dessert" },
    body: [
      "Jus sering dianggap pasti sehat. Padahal jus kemasan atau jus yang dibuat dengan banyak gula dan sirup bisa membuat gula darah cepat naik. Cara pembuatan dan isinya sangat menentukan.",
      "## Gula tambahan adalah kuncinya",
      "Jus pinggir jalan dan jus kemasan sering ditambah gula, sirup, atau susu kental manis supaya lebih manis. Inilah penyumbang terbesar lonjakan gula darah — bukan buahnya.",
      "## Apa itu cold-pressed?",
      "Jus cold-pressed dibuat dengan cara ditekan perlahan, bukan diblender dengan pisau berkecepatan tinggi. Prosesnya minim panas sehingga rasa dan aroma buah lebih terjaga. Jus cold-pressed yang baik juga tidak ditambah gula, air, maupun pengawet.",
      "## Tetap bijak meminumnya",
      "- Jus tetap mengandung gula alami buah, jadi cukup satu botol per hari.\n- Kombinasikan buah dengan sayuran (bayam, bit, wortel) untuk menurunkan kadar gula.\n- Minum setelah makan berat, bukan sebagai pengganti makan.\n- Penderita diabetes sebaiknya berkonsultasi dengan dokter.",
      "Jus cold-pressed Healthila dibuat fresh setiap hari dari buah dan sayur pilihan, tanpa gula tambahan.",
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug) ?? null;
}

export const categoryTone: Record<Article["category"], string> = {
  Kesehatan: "text-leaf-700",
  "Hadiah Sehat": "text-sun-500",
  "Tips Harian": "text-sky-600",
};
