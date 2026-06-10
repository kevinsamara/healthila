"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const categories = ['Semua', 'Edukasi Buah', 'Gaya Hidup Sehat', 'Resep', 'Gifting & Parcel', 'Info & Promo'];

const fallbackArticles = [
  { id: 1, judul: '5 Manfaat Jus Lemon untuk Kesehatan Harian', slug: 'manfaat-jus-lemon', kategori: 'Edukasi Buah', ringkasan: 'Lemon bukan sekadar pelengkap minuman. Kandungan vitamin C dan antioksidannya menjadikan jus lemon sebagai minuman superfood.', icon: '🍋', tanggal: '12 Mei 2024', dipublish: true },
  { id: 2, judul: 'Cara Memilih Buah Segar yang Benar di Pasar', slug: 'cara-pilih-buah-segar', kategori: 'Edukasi Buah', ringkasan: 'Tidak semua buah yang terlihat cantik itu segar. Pelajari cara membaca tanda-tanda kesegaran buah.', icon: '🍎', tanggal: '10 Mei 2024', dipublish: true },
  { id: 3, judul: 'Tips Memilih Hamper Buah untuk Orang Tersayang', slug: 'hamper-buah-hadiah', kategori: 'Gifting & Parcel', ringkasan: 'Parcel buah makin populer sebagai hadiah karena sehat dan elegan.', icon: '🧺', tanggal: '8 Mei 2024', dipublish: true },
  { id: 4, judul: 'Kenapa Cold-Pressed Lebih Baik dari Jus Biasa?', slug: 'cold-pressed-vs-jus-biasa', kategori: 'Gaya Hidup Sehat', ringkasan: 'Perbedaan cold-pressed dan jus biasa sangat signifikan dari segi nutrisi dan rasa.', icon: '🥤', tanggal: '6 Mei 2024', dipublish: true },
  { id: 5, judul: 'Resep Smoothie Bowl Cantik ala Healthila', slug: 'resep-smoothie-bowl', kategori: 'Resep', ringkasan: 'Smoothie bowl bukan hanya cantik untuk difoto, tapi juga padat nutrisi.', icon: '🫐', tanggal: '4 Mei 2024', dipublish: true },
  { id: 6, judul: '7 Buah Terbaik untuk Meningkatkan Imunitas Tubuh', slug: 'buah-untuk-imunitas', kategori: 'Edukasi Buah', ringkasan: 'Konsumsi 7 buah ini secara rutin untuk menjaga daya tahan tubuhmu tetap optimal.', icon: '🍊', tanggal: '2 Mei 2024', dipublish: true },
];

const tagColors: Record<string, string> = {
  'Edukasi Buah': '#ea580c',
  'Gaya Hidup Sehat': '#059669',
  'Resep': '#db2777',
  'Gifting & Parcel': '#f59e0b',
  'Info & Promo': '#7c3aed',
};

const bgColors: Record<string, string> = {
  'Edukasi Buah': '#fff7ed',
  'Gaya Hidup Sehat': '#f0fdf4',
  'Resep': '#fdf2f8',
  'Gifting & Parcel': '#fef3c7',
  'Info & Promo': '#faf5ff',
};

export default function ArtikelPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [articles, setArticles] = useState(fallbackArticles);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const { data, error } = await supabase
          .from('artikel')
          .select('*')
          .eq('dipublish', true)
          .order('tanggal', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) setArticles(data);
      } catch (err) {
        console.log('Menggunakan data fallback');
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const featured = articles[0];
  const filtered = articles.filter((a, i) => {
    const matchCat = activeCategory === 'Semua' || a.kategori === activeCategory;
    const matchSearch = a.judul.toLowerCase().includes(search.toLowerCase()) ||
      a.ringkasan.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && i !== 0;
  });

  const showFeatured = activeCategory === 'Semua' && search === '' && featured;

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
        <p style={{color: 'rgba(255,255,255,0.85)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.7}}>
          Tips hidup sehat, edukasi buah, resep lezat, dan inspirasi gifting — semua ada di sini!
        </p>
        <input type="text" placeholder="🔍 Cari artikel..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="search-input"
          style={{backgroundColor: 'white'}} />
      </section>

      {/* FILTER */}
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

      {/* FEATURED */}
      {showFeatured && (
        <section style={{padding: '0 2rem 2rem', maxWidth: '1100px', margin: '0 auto'}}>
          <p style={{color: '#1a5c2e', fontWeight: '700', fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
            ⭐ Artikel Terbaru
          </p>
          <a href={`/artikel/${featured.slug}`} style={{textDecoration: 'none', display: 'block'}}>
            <div style={{backgroundColor: bgColors[featured.kategori] || '#f0fdf4', borderRadius: '20px', padding: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
              <div style={{fontSize: '7rem', minWidth: '120px', textAlign: 'center'}}>{featured.icon}</div>
              <div style={{flex: 1, minWidth: '250px'}}>
                <span style={{backgroundColor: tagColors[featured.kategori] || '#1a5c2e', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700'}}>
                  {featured.kategori}
                </span>
                <h2 style={{color: '#1a1a1a', fontWeight: '800', fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', marginTop: '0.75rem', marginBottom: '0.75rem', lineHeight: 1.3}}>
                  {featured.judul}
                </h2>
                <p style={{color: '#6b7280', lineHeight: 1.7, marginBottom: '1rem'}}>{featured.ringkasan}</p>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'}}>
                  <span style={{color: '#6b7280', fontSize: '0.85rem'}}>📅 {featured.tanggal}</span>
                  <span style={{color: '#1a5c2e', fontWeight: '700'}}>Baca Selengkapnya →</span>
                </div>
              </div>
            </div>
          </a>
        </section>
      )}

      {/* GRID */}
      <section style={{padding: '0 2rem 4rem', maxWidth: '1100px', margin: '0 auto'}}>
        {search && (
          <p style={{color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem'}}>
            Hasil untuk <strong style={{color: '#1a5c2e'}}>"{search}"</strong> — {filtered.length} artikel
          </p>
        )}
        {loading ? (
          <div style={{textAlign: 'center', padding: '4rem', color: '#6b7280'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📖</div>
            <p>Memuat artikel...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign: 'center', padding: '4rem', color: '#6b7280'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📭</div>
            <p style={{fontWeight: '600', marginBottom: '0.5rem'}}>Artikel tidak ditemukan</p>
            <p style={{fontSize: '0.9rem'}}>Coba kata kunci lain atau pilih kategori berbeda</p>
          </div>
        ) : (
          <div className="articles-grid">
            {filtered.map((article) => (
              <a key={article.id} href={`/artikel/${article.slug}`} className="article-card">
                <div style={{backgroundColor: bgColors[article.kategori] || '#f0fdf4', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', minHeight: '140px'}}>
                  {article.icon}
                </div>
                <div style={{backgroundColor: 'white', padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem'}}>
                  <span style={{backgroundColor: tagColors[article.kategori] || '#1a5c2e', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '700', width: 'fit-content'}}>
                    {article.kategori}
                  </span>
                  <h3 style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.95rem', lineHeight: 1.4}}>{article.judul}</h3>
                  <p style={{color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.6, flex: 1}}>{article.ringkasan}</p>
                  <div style={{display: 'flex', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #f3f4f6'}}>
                    <span style={{color: '#9ca3af', fontSize: '0.78rem'}}>📅 {article.tanggal}</span>
                  </div>
                  <span style={{color: '#1a5c2e', fontWeight: '700', fontSize: '0.85rem'}}>Baca Selengkapnya →</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <section style={{backgroundColor: '#1a5c2e', padding: '3rem 2rem', textAlign: 'center'}}>
        <h2 style={{color: 'white', fontWeight: '800', fontSize: '1.5rem', marginBottom: '0.5rem'}}>Dapatkan Tips Sehat Terbaru! 🌿</h2>
        <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem'}}>Follow Instagram kami untuk update artikel dan promo terbaru</p>
        <a href="https://instagram.com/healthila.id" target="_blank" rel="noopener noreferrer"
          style={{backgroundColor: 'white', color: '#1a5c2e', padding: '1rem 2.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '800', fontSize: '1rem', display: 'inline-block'}}>
          Follow @healthila.id
        </a>
      </section>
    </main>
  );
}