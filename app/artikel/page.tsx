"use client";
import { useState } from "react";

const categories = ['Semua', 'Edukasi Buah', 'Gaya Hidup Sehat', 'Resep', 'Gifting & Parcel', 'Info & Promo'];

const articles = [
  {
    id: 'manfaat-jus-lemon',
    title: '5 Manfaat Jus Lemon untuk Kesehatan Harian',
    category: 'Edukasi Buah',
    date: '12 Mei 2024',
    readTime: '4 menit',
    icon: '🍋',
    bg: '#fffbeb',
    tagColor: '#d97706',
    excerpt: 'Lemon bukan sekadar pelengkap minuman. Kandungan vitamin C dan antioksidannya menjadikan jus lemon sebagai minuman superfood yang wajib ada dalam rutinitas harianmu.',
    featured: true,
  },
  {
    id: 'cara-pilih-buah-segar',
    title: 'Cara Memilih Buah Segar yang Benar di Pasar',
    category: 'Edukasi Buah',
    date: '10 Mei 2024',
    readTime: '5 menit',
    icon: '🍎',
    bg: '#fff1f2',
    tagColor: '#e11d48',
    excerpt: 'Tidak semua buah yang terlihat cantik itu segar. Pelajari cara membaca tanda-tanda kesegaran buah dari warna, aroma, hingga teksturnya agar tidak salah beli.',
    featured: false,
  },
  {
    id: 'hamper-buah-hadiah',
    title: 'Tips Memilih Hamper Buah untuk Orang Tersayang',
    category: 'Gifting & Parcel',
    date: '8 Mei 2024',
    readTime: '3 menit',
    icon: '🧺',
    bg: '#fef3c7',
    tagColor: '#f59e0b',
    excerpt: 'Parcel buah makin populer sebagai hadiah karena sehat dan elegan. Simak tips memilih hamper buah yang tepat sesuai occasion dan budget yang kamu miliki.',
    featured: false,
  },
  {
    id: 'cold-pressed-vs-jus-biasa',
    title: 'Kenapa Cold-Pressed Lebih Baik dari Jus Biasa?',
    category: 'Gaya Hidup Sehat',
    date: '6 Mei 2024',
    readTime: '6 menit',
    icon: '🥤',
    bg: '#f0fdf4',
    tagColor: '#059669',
    excerpt: 'Banyak yang bertanya-tanya, apa bedanya cold-pressed dengan jus biasa? Ternyata perbedaannya sangat signifikan dari segi nutrisi, rasa, hingga ketahanan.',
    featured: false,
  },
  {
    id: 'resep-smoothie-bowl',
    title: 'Resep Smoothie Bowl Cantik ala Healthila',
    category: 'Resep',
    date: '4 Mei 2024',
    readTime: '7 menit',
    icon: '🫐',
    bg: '#fdf2f8',
    tagColor: '#db2777',
    excerpt: 'Smoothie bowl bukan hanya cantik untuk difoto, tapi juga padat nutrisi. Ikuti resep mudah ini untuk membuat smoothie bowl Berry Blast yang creamy dan menyehatkan.',
    featured: false,
  },
  {
    id: 'buah-untuk-imunitas',
    title: '7 Buah Terbaik untuk Meningkatkan Imunitas Tubuh',
    category: 'Edukasi Buah',
    date: '2 Mei 2024',
    readTime: '5 menit',
    icon: '🍊',
    bg: '#fff7ed',
    tagColor: '#ea580c',
    excerpt: 'Di tengah cuaca yang tidak menentu, menjaga imunitas tubuh sangat penting. Konsumsi 7 buah ini secara rutin untuk menjaga daya tahan tubuhmu tetap optimal.',
    featured: false,
  },
  {
    id: 'promo-lebaran',
    title: 'Promo Spesial Parcel Lebaran — Pesan Sekarang!',
    category: 'Info & Promo',
    date: '1 Mei 2024',
    readTime: '2 menit',
    icon: '🌙',
    bg: '#fef3c7',
    tagColor: '#d97706',
    excerpt: 'Sambut Lebaran dengan parcel buah premium dari Healthila. Dapatkan diskon spesial dan gratis kartu ucapan untuk setiap pemesanan selama periode promo berlangsung.',
    featured: false,
  },
  {
    id: 'gaya-hidup-sehat-buah',
    title: 'Mulai Gaya Hidup Sehat dengan Konsumsi Buah Harian',
    category: 'Gaya Hidup Sehat',
    date: '29 April 2024',
    readTime: '5 menit',
    icon: '🌿',
    bg: '#f0fdf4',
    tagColor: '#059669',
    excerpt: 'Memulai gaya hidup sehat tidak harus mahal atau rumit. Cukup dengan menambahkan satu porsi buah segar setiap hari, kamu sudah melangkah ke arah yang lebih baik.',
    featured: false,
  },
  {
    id: 'resep-jus-detox',
    title: 'Resep Jus Detox 3 Hari untuk Tubuh Lebih Segar',
    category: 'Resep',
    date: '27 April 2024',
    readTime: '8 menit',
    icon: '🥬',
    bg: '#ecfdf5',
    tagColor: '#059669',
    excerpt: 'Program detox 3 hari dengan jus buah dan sayuran bisa membantu membersihkan racun dalam tubuh, meningkatkan energi, dan membuat kulit lebih glowing.',
    featured: false,
  },
  {
    id: 'parcel-ultah-ide',
    title: '5 Ide Parcel Ulang Tahun yang Unik dan Berkesan',
    category: 'Gifting & Parcel',
    date: '25 April 2024',
    readTime: '4 menit',
    icon: '🎂',
    bg: '#fef9c3',
    tagColor: '#ca8a04',
    excerpt: 'Bosan kasih kado yang itu-itu saja? Parcel buah premium bisa jadi pilihan hadiah ulang tahun yang unik, sehat, dan pasti diingat oleh penerimanya.',
    featured: false,
  },
  {
    id: 'shine-muscat-tips',
    title: 'Mengenal Shine Muscat — Anggur Premium yang Sedang Viral',
    category: 'Edukasi Buah',
    date: '23 April 2024',
    readTime: '4 menit',
    icon: '🍇',
    bg: '#faf5ff',
    tagColor: '#7c3aed',
    excerpt: 'Shine Muscat tiba-tiba jadi buah paling dicari. Apa yang membuatnya begitu spesial? Dari rasa, kandungan nutrisi, hingga cara memilih yang benar — semua ada di sini.',
    featured: false,
  },
  {
    id: 'fruit-cake-semangka-resep',
    title: 'Cara Membuat Fruit Cake Semangka yang Keren',
    category: 'Resep',
    date: '20 April 2024',
    readTime: '10 menit',
    icon: '🍉',
    bg: '#fff1f2',
    tagColor: '#e11d48',
    excerpt: 'Fruit cake semangka adalah tren dessert sehat yang sedang naik daun. Tampak seperti kue sungguhan, tapi 100% dari buah segar! Pelajari cara membuatnya di sini.',
    featured: false,
  },
];

export default function ArtikelPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');

  const featuredArticle = articles.find((a) => a.featured);
  const filtered = articles.filter((a) => {
    const matchCat = activeCategory === 'Semua' || a.category === activeCategory;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && !a.featured;
  });

  const showFeatured = activeCategory === 'Semua' && search === '';

  return (
    <main style={{backgroundColor: '#faf7f2', minHeight: '100vh'}}>
      <style>{`
        .articles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .article-card { border-radius: 18px; overflow: hidden; box-shadow: 0 2px 14px rgba(0,0,0,0.07); display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; text-decoration: none; }
        .article-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        .search-input { width: 100%; max-width: 500px; padding: 0.75rem 1.25rem; border-radius: 999px; border: 2px solid #e5e7eb; font-size: 1rem; outline: none; }
        .search-input:focus { border-color: #1a5c2e; }
        @media (max-width: 1024px) { .articles-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .articles-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* HERO */}
      <section style={{background: 'linear-gradient(135deg, #1a5c2e 0%, #2d7a47 60%, #86efac 100%)', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 6rem)', textAlign: 'center'}}>
        <div style={{display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', marginBottom: '1rem'}}>
          📚 Tips & Edukasi Sehat
        </div>
        <h1 style={{color: 'white', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '800', marginBottom: '1rem'}}>
          Artikel Edukasi Healthila
        </h1>
        <p style={{color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.7}}>
          Tips hidup sehat, edukasi buah, resep lezat, dan inspirasi gifting — semua ada di sini!
        </p>
        <input
          type="text"
          placeholder="🔍 Cari artikel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{backgroundColor: 'white'}}
        />
      </section>

      {/* FILTER KATEGORI */}
      <section style={{padding: '2rem 2rem 0', maxWidth: '1100px', margin: '0 auto'}}>
        <div style={{display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem'}}>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '0.5rem 1.1rem', borderRadius: '999px',
              border: '2px solid #1a5c2e',
              backgroundColor: activeCategory === cat ? '#1a5c2e' : 'white',
              color: activeCategory === cat ? 'white' : '#1a5c2e',
              fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
            }}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      {showFeatured && featuredArticle && (
        <section style={{padding: '0 2rem 2rem', maxWidth: '1100px', margin: '0 auto'}}>
          <p style={{color: '#1a5c2e', fontWeight: '700', fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
            ⭐ Artikel Pilihan
          </p>
          <a href={`/artikel/${featuredArticle.id}`} style={{textDecoration: 'none', display: 'block'}}>
            <div style={{backgroundColor: featuredArticle.bg, borderRadius: '20px', padding: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'transform 0.2s'}}>
              <div style={{fontSize: '8rem', minWidth: '120px', textAlign: 'center'}}>{featuredArticle.icon}</div>
              <div style={{flex: 1, minWidth: '250px'}}>
                <span style={{backgroundColor: featuredArticle.tagColor, color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700'}}>
                  {featuredArticle.category}
                </span>
                <h2 style={{color: '#1a1a1a', fontWeight: '800', fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', marginTop: '0.75rem', marginBottom: '0.75rem', lineHeight: 1.3}}>
                  {featuredArticle.title}
                </h2>
                <p style={{color: '#6b7280', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.95rem'}}>
                  {featuredArticle.excerpt}
                </p>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                  <span style={{color: '#6b7280', fontSize: '0.85rem'}}>📅 {featuredArticle.date}</span>
                  <span style={{color: '#6b7280', fontSize: '0.85rem'}}>⏱ {featuredArticle.readTime} baca</span>
                  <span style={{color: '#1a5c2e', fontWeight: '700', fontSize: '0.9rem'}}>Baca Selengkapnya →</span>
                </div>
              </div>
            </div>
          </a>
        </section>
      )}

      {/* GRID ARTIKEL */}
      <section style={{padding: '0 2rem 4rem', maxWidth: '1100px', margin: '0 auto'}}>
        {search && (
          <p style={{color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem'}}>
            Hasil pencarian untuk <strong style={{color: '#1a5c2e'}}>"{search}"</strong> — {filtered.length} artikel ditemukan
          </p>
        )}
        {!search && (
          <p style={{color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem'}}>
            Menampilkan <strong style={{color: '#1a5c2e'}}>{filtered.length}</strong> artikel
            {activeCategory !== 'Semua' && ` dalam kategori "${activeCategory}"`}
          </p>
        )}

        {filtered.length === 0 ? (
          <div style={{textAlign: 'center', padding: '4rem', color: '#6b7280'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📭</div>
            <p style={{fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem'}}>Artikel tidak ditemukan</p>
            <p style={{fontSize: '0.9rem'}}>Coba kata kunci lain atau pilih kategori berbeda</p>
          </div>
        ) : (
          <div className="articles-grid">
            {filtered.map((article) => (
              <a key={article.id} href={`/artikel/${article.id}`} className="article-card">
                {/* Header card */}
                <div style={{backgroundColor: article.bg, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', minHeight: '140px'}}>
                  {article.icon}
                </div>
                {/* Content */}
                <div style={{backgroundColor: 'white', padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem'}}>
                  <span style={{backgroundColor: article.tagColor, color: 'white', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '700', width: 'fit-content'}}>
                    {article.category}
                  </span>
                  <h3 style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.95rem', lineHeight: 1.4}}>{article.title}</h3>
                  <p style={{color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.6, flex: 1}}>{article.excerpt}</p>
                  <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #f3f4f6'}}>
                    <span style={{color: '#9ca3af', fontSize: '0.78rem'}}>📅 {article.date}</span>
                    <span style={{color: '#9ca3af', fontSize: '0.78rem'}}>⏱ {article.readTime}</span>
                  </div>
                  <span style={{color: '#1a5c2e', fontWeight: '700', fontSize: '0.85rem'}}>Baca Selengkapnya →</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* NEWSLETTER CTA */}
      <section style={{backgroundColor: '#1a5c2e', padding: '3rem 2rem', textAlign: 'center'}}>
        <h2 style={{color: 'white', fontWeight: '800', fontSize: '1.5rem', marginBottom: '0.5rem'}}>
          Dapatkan Tips Sehat Terbaru! 🌿
        </h2>
        <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem'}}>
          Follow Instagram kami untuk update artikel dan promo terbaru dari Healthila
        </p>
        <a href="https://instagram.com/healthila.id" target="_blank" rel="noopener noreferrer"
          style={{backgroundColor: 'white', color: '#1a5c2e', padding: '1rem 2.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '800', fontSize: '1rem', display: 'inline-block'}}>
          Follow @healthila.id
        </a>
      </section>
    </main>
  );
}