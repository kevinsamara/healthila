"use client";
import { useParams } from "next/navigation";

const articles: Record<string, {
  title: string; category: string; date: string; readTime: string;
  icon: string; bg: string; tagColor: string; excerpt: string;
  content: string[]; tags: string[];
}> = {
  'manfaat-jus-lemon': {
    title: '5 Manfaat Jus Lemon untuk Kesehatan Harian',
    category: 'Edukasi Buah', date: '12 Mei 2024', readTime: '4 menit',
    icon: '🍋', bg: '#fffbeb', tagColor: '#d97706',
    excerpt: 'Lemon bukan sekadar pelengkap minuman. Kandungan vitamin C dan antioksidannya menjadikan jus lemon sebagai minuman superfood.',
    content: [
      'Lemon adalah salah satu buah paling kaya nutrisi yang mudah ditemukan. Meski rasanya asam, manfaatnya untuk kesehatan sangat luar biasa.',
      '**1. Meningkatkan Imunitas Tubuh**\nLemon mengandung vitamin C yang sangat tinggi — sekitar 53mg per 100ml. Vitamin C adalah antioksidan kuat yang membantu tubuh melawan infeksi dan menjaga sistem imun tetap optimal.',
      '**2. Membantu Pencernaan**\nAsam sitrat dalam lemon merangsang produksi enzim pencernaan di hati. Minum air lemon hangat di pagi hari dapat membantu memperlancar pencernaan dan mencegah sembelit.',
      '**3. Menyegarkan dan Menghidrasi**\nJus lemon memiliki rasa segar yang membuatmu ingin minum lebih banyak air. Ini sangat baik untuk menjaga hidrasi tubuh sepanjang hari.',
      '**4. Menjaga Kesehatan Kulit**\nVitamin C dalam lemon berperan penting dalam produksi kolagen — protein yang menjaga kulit tetap kencang dan elastis. Konsumsi rutin dapat membuat kulit lebih glowing.',
      '**5. Membantu Detoksifikasi**\nLemon memiliki sifat diuretik ringan yang membantu ginjal membuang racun lebih efisien. Kandungan flavonoidnya juga mendukung fungsi hati dalam proses detoks.',
      'Cara terbaik mengonsumsi jus lemon adalah dengan mencampurkannya ke air hangat atau air biasa. Hindari menambahkan gula berlebihan untuk mendapatkan manfaat maksimal.',
    ],
    tags: ['Lemon', 'Vitamin C', 'Imunitas', 'Detox', 'Jus Sehat'],
  },
  'cara-pilih-buah-segar': {
    title: 'Cara Memilih Buah Segar yang Benar di Pasar',
    category: 'Edukasi Buah', date: '10 Mei 2024', readTime: '5 menit',
    icon: '🍎', bg: '#fff1f2', tagColor: '#e11d48',
    excerpt: 'Tidak semua buah yang terlihat cantik itu segar. Pelajari cara membaca tanda-tanda kesegaran buah.',
    content: [
      'Memilih buah segar bukan sekadar soal penampilan. Ada beberapa hal penting yang perlu diperhatikan agar kamu mendapatkan buah dengan kualitas terbaik.',
      '**1. Perhatikan Warna**\nWarna buah yang segar biasanya cerah dan merata. Hindari buah dengan bintik-bintik coklat kehitaman (kecuali pisang matang) yang menandakan kerusakan.',
      '**2. Cium Aromanya**\nBuah matang dan segar memiliki aroma khas yang harum. Jika tidak ada aroma sama sekali, kemungkinan buah dipetik terlalu dini atau sudah terlalu lama disimpan.',
      '**3. Raba Teksturnya**\nBuah yang baik memiliki tekstur yang tepat — tidak terlalu keras (belum matang) dan tidak terlalu lembek (terlalu matang atau rusak). Setiap jenis buah memiliki standar tekstur yang berbeda.',
      '**4. Cek Beratnya**\nBuah yang segar dan berair biasanya terasa berat untuk ukurannya. Buah yang terasa ringan mungkin sudah kehilangan banyak kelembaban.',
      '**5. Periksa Tangkai dan Kulit**\nTangkai buah yang masih segar dan kulit yang mulus tanpa luka adalah tanda buah berkualitas baik.',
      'Di Healthila, setiap buah melewati quality check ketat sebelum dikemas. Kamu tidak perlu khawatir soal kualitas karena kami memilihkan yang terbaik untukmu!',
    ],
    tags: ['Tips Belanja', 'Buah Segar', 'Quality Check', 'Panduan'],
  },
  'hamper-buah-hadiah': {
    title: 'Tips Memilih Hamper Buah untuk Orang Tersayang',
    category: 'Gifting & Parcel', date: '8 Mei 2024', readTime: '3 menit',
    icon: '🧺', bg: '#fef3c7', tagColor: '#f59e0b',
    excerpt: 'Parcel buah makin populer sebagai hadiah karena sehat dan elegan.',
    content: [
      'Parcel buah adalah hadiah yang sempurna — sehat, elegan, dan selalu diterima dengan suka cita. Tapi bagaimana cara memilih yang tepat?',
      '**1. Sesuaikan dengan Occasion**\nUntuk ulang tahun, pilih parcel dengan dekorasi meriah. Untuk get well soon, pilih buah yang kaya vitamin C seperti jeruk dan kiwi. Untuk lebaran, pilih yang bernuansa tradisional.',
      '**2. Pertimbangkan Budget**\nParcel buah tersedia dalam berbagai range harga. Tentukan budget terlebih dahulu, lalu pilih yang memberikan value terbaik dalam budget tersebut.',
      '**3. Perhatikan Preferensi Penerima**\nJika penerima suka buah eksotis, pilih hamper dengan shine muscat atau buah import. Jika mereka lebih suka buah lokal, pilih kombinasi mangga, jeruk, dan apel.',
      '**4. Pilih Kemasan yang Elegan**\nKemasan adalah kesan pertama. Pilih parcel dengan kemasan yang rapi, elegan, dan disertai kartu ucapan personal.',
      '**5. Pastikan Ada Garansi Kesegaran**\nPilih penyedia parcel yang menjamin kesegaran buah sampai ke tangan penerima.',
      'Semua parcel Healthila dibuat fresh sesuai pesanan dengan kemasan premium dan kartu ucapan gratis. Hubungi kami untuk konsultasi parcel yang sempurna!',
    ],
    tags: ['Parcel', 'Hamper', 'Gifting', 'Tips Hadiah'],
  },
  'cold-pressed-vs-jus-biasa': {
    title: 'Kenapa Cold-Pressed Lebih Baik dari Jus Biasa?',
    category: 'Gaya Hidup Sehat', date: '6 Mei 2024', readTime: '6 menit',
    icon: '🥤', bg: '#f0fdf4', tagColor: '#059669',
    excerpt: 'Perbedaan cold-pressed dan jus biasa sangat signifikan dari segi nutrisi dan rasa.',
    content: [
      'Cold-pressed juice sedang jadi tren gaya hidup sehat. Tapi apa yang membuatnya begitu berbeda dari jus biasa yang kita kenal?',
      '**Apa itu Cold-Pressed?**\nCold-pressed adalah metode membuat jus menggunakan hydraulic press yang memberikan tekanan tinggi pada buah tanpa menghasilkan panas. Berbeda dengan blender atau juicer biasa yang menghasilkan gesekan dan panas.',
      '**Perbedaan Utama dari Segi Nutrisi**\nProses panas dari juicer biasa merusak enzim dan vitamin yang sensitif terhadap suhu. Cold-pressed mempertahankan hingga 3-5x lebih banyak nutrisi, enzim, dan antioksidan dibanding jus biasa.',
      '**Soal Rasa**\nCold-pressed memiliki rasa yang lebih murni, segar, dan kaya karena tidak ada kontaminasi panas. Setiap tegukan terasa seperti menggigit buah segar langsung.',
      '**Ketahanan**\nJus cold-pressed tanpa pengawet bertahan 3-5 hari dalam kulkas, sementara jus blender biasa hanya bertahan beberapa jam sebelum teroksidasi.',
      '**Apakah Worth It?**\nUntuk mereka yang menginginkan manfaat nutrisi maksimal dari buah, cold-pressed jelas pilihan terbaik. Ini investasi untuk kesehatan yang sangat sepadan.',
      'Healthila memproduksi cold-pressed juice fresh setiap hari tanpa pengawet dan tanpa gula tambahan. Pesan sebelum jam 10 pagi untuk same-day delivery!',
    ],
    tags: ['Cold-Pressed', 'Nutrisi', 'Jus Sehat', 'Gaya Hidup'],
  },
  'resep-smoothie-bowl': {
    title: 'Resep Smoothie Bowl Cantik ala Healthila',
    category: 'Resep', date: '4 Mei 2024', readTime: '7 menit',
    icon: '🫐', bg: '#fdf2f8', tagColor: '#db2777',
    excerpt: 'Smoothie bowl bukan hanya cantik untuk difoto, tapi juga padat nutrisi.',
    content: [
      'Smoothie bowl adalah salah satu cara paling menyenangkan untuk menikmati buah segar. Cantik, bergizi, dan mengenyangkan!',
      '**Bahan-bahan (1 porsi):**\n- 1 cup blueberry beku\n- 1/2 cup strawberry beku\n- 1 buah pisang beku\n- 3 sdm yogurt plain\n- 2 sdm susu almond',
      '**Topping:**\n- Granola secukupnya\n- Irisan pisang segar\n- Blueberry segar\n- Potongan strawberry\n- Madu secukupnya\n- Biji chia',
      '**Cara Membuat:**\nBlender semua bahan dasar hingga halus dan creamy. Konsistensinya harus lebih kental dari smoothie biasa — tambahkan buah beku lebih banyak jika terlalu cair.',
      '**Penyajian:**\nTuang ke dalam mangkuk. Tata topping dengan cantik di atasnya. Mulai dari granola sebagai base, lalu susun buah-buahan berwarna-warni, dan akhiri dengan drizzle madu.',
      '**Tips:**\nGunakan buah yang sudah dibekukan sebelumnya untuk tekstur yang lebih kental dan creamy. Sajikan segera setelah dibuat untuk menjaga kesegaran dan teksturnya.',
      'Butuh buah segar premium untuk smoothie bowl-mu? Healthila menyediakan berbagai buah segar berkualitas tinggi yang siap dikirim ke rumahmu!',
    ],
    tags: ['Resep', 'Smoothie Bowl', 'Buah Beku', 'Sehat & Lezat'],
  },
};

const defaultArticle = {
  title: 'Artikel Sedang Dalam Proses',
  category: 'Info', date: '-', readTime: '-',
  icon: '📝', bg: '#f0fdf4', tagColor: '#059669',
  excerpt: 'Artikel ini sedang disiapkan.',
  content: ['Artikel ini sedang dalam proses penulisan. Silakan kunjungi kembali nanti untuk membaca konten lengkapnya.', 'Sementara itu, kamu bisa membaca artikel lain yang sudah tersedia di halaman artikel kami.'],
  tags: [],
};

export default function ArtikelContent() {
  const params = useParams();
  const slug = params?.slug as string || '';
  const article = articles[slug] || defaultArticle;

  return (
    <main style={{backgroundColor: '#faf7f2', minHeight: '100vh'}}>
      {/* BREADCRUMB */}
      <div style={{backgroundColor: 'white', padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb'}}>
        <div style={{maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '0.5rem', fontSize: '0.85rem', flexWrap: 'wrap'}}>
          <a href="/" style={{color: '#1a5c2e', textDecoration: 'none'}}>Beranda</a>
          <span style={{color: '#6b7280'}}>›</span>
          <a href="/artikel" style={{color: '#1a5c2e', textDecoration: 'none'}}>Artikel</a>
          <span style={{color: '#6b7280'}}>›</span>
          <span style={{color: '#1a1a1a'}}>{article.title}</span>
        </div>
      </div>

      {/* ARTIKEL CONTENT */}
      <article style={{maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem'}}>
        {/* Header */}
        <div style={{backgroundColor: article.bg, borderRadius: '20px', padding: '2.5rem', textAlign: 'center', marginBottom: '2rem'}}>
          <div style={{fontSize: '6rem', marginBottom: '1rem'}}>{article.icon}</div>
          <span style={{backgroundColor: article.tagColor, color: 'white', padding: '0.3rem 0.85rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '700'}}>
            {article.category}
          </span>
          <h1 style={{color: '#1a1a1a', fontWeight: '800', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', marginTop: '1rem', marginBottom: '1rem', lineHeight: 1.3}}>
            {article.title}
          </h1>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <span style={{color: '#6b7280', fontSize: '0.85rem'}}>📅 {article.date}</span>
            <span style={{color: '#6b7280', fontSize: '0.85rem'}}>⏱ {article.readTime} baca</span>
          </div>
        </div>

        {/* Excerpt */}
        <p style={{color: '#374151', fontSize: '1.05rem', lineHeight: 1.8, fontStyle: 'italic', borderLeft: '4px solid #1a5c2e', paddingLeft: '1.25rem', marginBottom: '2rem', backgroundColor: 'white', padding: '1.25rem 1.25rem 1.25rem 1.5rem', borderRadius: '0 12px 12px 0'}}>
          {article.excerpt}
        </p>

        {/* Content */}
        <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '2rem'}}>
          {article.content.map((para, i) => {
            if (para.startsWith('**') && para.includes('\n')) {
              const [heading, ...rest] = para.split('\n');
              return (
                <div key={i} style={{marginBottom: '1.5rem'}}>
                  <h3 style={{color: '#1a5c2e', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem'}}>
                    {heading.replace(/\*\*/g, '')}
                  </h3>
                  <p style={{color: '#374151', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line'}}>{rest.join('\n')}</p>
                </div>
              );
            }
            return (
              <p key={i} style={{color: '#374151', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.25rem'}}>
                {para}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div style={{marginBottom: '2rem'}}>
            <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.75rem', fontSize: '0.9rem'}}>Tags:</p>
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              {article.tags.map((tag) => (
                <span key={tag} style={{backgroundColor: '#e8f5e9', color: '#1a5c2e', padding: '0.3rem 0.85rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: '600'}}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{backgroundColor: '#1a5c2e', borderRadius: '16px', padding: '2rem', textAlign: 'center'}}>
          <h3 style={{color: 'white', fontWeight: '800', fontSize: '1.2rem', marginBottom: '0.5rem'}}>
            Mau buah segar premium dikirim ke rumahmu? 🌿
          </h3>
          <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '1.25rem', fontSize: '0.9rem'}}>
            Healthila menyediakan buah segar, jus cold-pressed, dan parcel premium untuk seluruh wilayah Malang
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <a href="/katalog" style={{backgroundColor: 'white', color: '#1a5c2e', padding: '0.75rem 1.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem'}}>
              Lihat Produk
            </a>
            <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer"
              style={{backgroundColor: '#25D366', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem'}}>
              Order via WA
            </a>
          </div>
        </div>

        {/* Back */}
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
          <a href="/artikel" style={{color: '#1a5c2e', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem'}}>
            ← Kembali ke Semua Artikel
          </a>
        </div>
      </article>
    </main>
  );
}