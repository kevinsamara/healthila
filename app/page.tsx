"use client";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

const badges = ['Buah Segar Pilihan', 'Tanpa Pengawet', 'Dikemas Higienis', 'Pengiriman Cepat'];
const categories = [
  { icon: '🧺', label: 'Parcel', href: '/parcel' },
  { icon: '🥤', label: 'Jus & Dessert', href: '/jus-dessert' },
  { icon: '🍊', label: 'Buah Segar', href: '/katalog' },
  { icon: '🍇', label: 'Buah Eksotis', href: '/katalog' },
  { icon: '🌿', label: 'Produk Lokal', href: '/katalog' },
];
const steps = [
  { icon: '🛒', title: 'Pilih Produk', desc: 'Pilih produk favoritmu dari katalog kami' },
  { icon: '💬', title: 'Chat via WA', desc: 'Konfirmasi dan konsultasi pesanan' },
  { icon: '🚚', title: 'Terima & Nikmati', desc: 'Pesanan dikirim fresh setiap hari' },
];
const testimonials = [
  { name: 'Evi Asluti', city: 'Malang', text: 'Buahnya segar banget dan kemasannya cantik. Cocok banget buat kado!' },
  { name: 'Ari Pratama', city: 'Malang', text: 'Jus cold-pressed-nya enak, tidak ada rasa gula tambahan. Recommended!' },
  { name: 'Dian Safitri', city: 'Malang', text: 'Parcel buahnya elegan banget, teman-teman pada suka. Pasti order lagi!' },
];

const bgMap: Record<string, string> = {
  'Buah Segar': '#fff7ed', 'Buah Eksotis': '#faf5ff',
  'Jus & Dessert': '#f0fdf4', 'Parcel': '#fef3c7',
};

type Produk = {
  id: number; nama: string; kategori: string;
  harga_label: string; deskripsi: string; icon: string;
  foto_url: string; slug: string;
};
type Artikel = {
  id: number; judul: string; slug: string; kategori: string;
  ringkasan: string; icon: string; tanggal: string;
};

const tagColors: Record<string, string> = {
  'Edukasi Buah': '#ea580c', 'Gaya Hidup Sehat': '#059669',
  'Resep': '#db2777', 'Gifting & Parcel': '#f59e0b', 'Info & Promo': '#7c3aed',
};

export default function Home() {
  const [products, setProducts] = useState<Produk[]>([]);
  const [articles, setArticles] = useState<Artikel[]>([]);

  useEffect(() => {
    supabase.from('produk').select('id,nama,kategori,harga_label,deskripsi,icon,foto_url,slug').eq('tersedia', true).limit(6).order('created_at', { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setProducts(data); });
    supabase.from('artikel').select('id,judul,slug,kategori,ringkasan,icon,tanggal').eq('dipublish', true).limit(3).order('tanggal', { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setArticles(data); });
  }, []);

  const fallbackProducts = [
    { id: 1, nama: 'Jeruk Pontianak', kategori: 'Buah Segar', harga_label: 'Rp 45.000', deskripsi: '1 kg, manis segar pilihan', icon: '🍊', foto_url: '', slug: 'jeruk-pontianak' },
    { id: 2, nama: 'Strawberry Premium', kategori: 'Buah Segar', harga_label: 'Rp 65.000', deskripsi: '500 gr, import Berastagi', icon: '🍓', foto_url: '', slug: 'strawberry-premium' },
    { id: 3, nama: 'Mangga Harum Manis', kategori: 'Buah Segar', harga_label: 'Rp 55.000', deskripsi: '1 kg, manis legit', icon: '🥭', foto_url: '', slug: 'mangga-harum-manis' },
    { id: 4, nama: 'Shine Muscat Import', kategori: 'Buah Eksotis', harga_label: 'Rp 120.000', deskripsi: '500 gr, seedless premium', icon: '🍇', foto_url: '', slug: 'shine-muscat' },
    { id: 5, nama: 'Jus Cold-Pressed', kategori: 'Jus & Dessert', harga_label: 'Rp 35.000', deskripsi: '350 ml, tanpa gula tambahan', icon: '🧃', foto_url: '', slug: 'jus-cold-pressed' },
    { id: 6, nama: 'Hamper Kesehatan', kategori: 'Parcel', harga_label: 'Rp 250.000', deskripsi: 'Isi 8 buah + jus', icon: '🧺', foto_url: '', slug: 'hamper-kesehatan' },
  ];
  const fallbackArticles = [
    { id: 1, judul: '5 Manfaat Jus Lemon untuk Kesehatan Harian', slug: 'manfaat-jus-lemon', kategori: 'Edukasi Buah', ringkasan: 'Kandungan vitamin C dan antioksidan lemon sangat baik untuk kesehatan.', icon: '🍋', tanggal: '12 Mei 2024' },
    { id: 2, judul: 'Tips Memilih Hamper Buah untuk Orang Tersayang', slug: 'hamper-buah-hadiah', kategori: 'Gifting & Parcel', ringkasan: 'Parcel buah makin populer sebagai hadiah karena sehat dan elegan.', icon: '🧺', tanggal: '8 Mei 2024' },
    { id: 3, judul: 'Kenapa Cold-Pressed Lebih Baik dari Jus Biasa?', slug: 'cold-pressed-vs-jus-biasa', kategori: 'Gaya Hidup Sehat', ringkasan: 'Perbedaan cold-pressed dan jus biasa sangat signifikan dari segi nutrisi.', icon: '🥤', tanggal: '6 Mei 2024' },
  ];

  const displayProducts = products.length > 0 ? products : fallbackProducts;
  const displayArticles = articles.length > 0 ? articles : fallbackArticles;

  return (
    <main>
      <style>{`
        .hero-section { background: linear-gradient(135deg, #1a5c2e 0%, #2d7a47 50%, #e8f5e9 100%); min-height: 90vh; display: flex; align-items: center; padding: 4rem 6rem; overflow: hidden; }
        .hero-image { flex: 1; display: flex; justify-content: center; align-items: center; }
        .products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; max-width: 900px; margin: 0 auto; }
        .articles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 900px; margin: 0 auto; }
        .section-pad { padding: 4rem 6rem; }
        .steps-row { display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 900px; margin: 0 auto; }
        @media (max-width: 1024px) {
          .hero-section { padding: 3rem 3rem; }
          .section-pad { padding: 3rem 3rem; }
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .articles-grid { grid-template-columns: repeat(2, 1fr); }
          .testi-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .hero-section { flex-direction: column; padding: 2rem 1.5rem; min-height: auto; text-align: center; }
          .hero-image { display: none; }
          .section-pad { padding: 3rem 1.5rem; }
          .products-grid { grid-template-columns: 1fr; max-width: 100%; }
          .articles-grid { grid-template-columns: 1fr; }
          .testi-grid { grid-template-columns: 1fr; }
          .steps-row { flex-direction: column; }
          .step-arrow { display: none; }
          .cat-section { padding: 2rem 1.5rem; gap: 1rem; }
          .footer-grid { grid-template-columns: 1fr; }
          .footer-pad { padding: 3rem 1.5rem; }
        }
      `}</style>

      {/* HERO */}
      <section className="hero-section">
        <div style={{flex: 1}}>
          <div style={{display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', marginBottom: '1.5rem'}}>
            Premium Fruit Store Malang
          </div>
          <h1 style={{fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', color: 'white', lineHeight: 1.2, marginBottom: '0.5rem'}}>Pengalaman Rasa</h1>
          <h1 style={{fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', color: '#86efac', lineHeight: 1.2, marginBottom: '1.5rem'}}>Alami. Segar.</h1>
          <p style={{color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', lineHeight: 1.7, maxWidth: '480px', marginBottom: '2rem'}}>
            Premium fruit, cold-pressed juice, hamper elegan dan dessert sehat, dikirim langsung ke pintumu.
          </p>
          <div style={{display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap'}}>
            {badges.map((item) => (
              <span key={item} style={{backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.3)'}}>
                {item}
              </span>
            ))}
          </div>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer"
              style={{backgroundColor: '#25D366', color: 'white', padding: '0.9rem 2rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem'}}>
              Order Sekarang via WA
            </a>
            <a href="/katalog"
              style={{backgroundColor: 'transparent', color: 'white', padding: '0.9rem 2rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem', border: '2px solid white'}}>
              Lihat Produk
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div style={{width: '400px', height: '400px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem'}}>
            🧺
          </div>
        </div>
      </section>

      {/* KATEGORI */}
      <section style={{backgroundColor: 'white', padding: '3rem 6rem', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'}} className="cat-section">
        {categories.map((cat) => (
          <a key={cat.label} href={cat.href} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textDecoration: 'none'}}>
            <div style={{width: '72px', height: '72px', backgroundColor: '#e8f5e9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'}}>
              {cat.icon}
            </div>
            <span style={{color: '#1a5c2e', fontWeight: '600', fontSize: '0.85rem'}}>{cat.label}</span>
          </a>
        ))}
      </section>

      {/* PRODUK UNGGULAN */}
      <section id="produk" className="section-pad" style={{backgroundColor: '#faf7f2'}}>
        <div style={{textAlign: 'center', marginBottom: '2.5rem'}}>
          <h2 style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: '#1a1a1a', marginBottom: '0.5rem'}}>Produk Unggulan 🌿</h2>
          <p style={{color: '#6b7280'}}>Dipilih dengan teliti, disiapkan dengan standar premium</p>
        </div>
        <div className="products-grid">
          {displayProducts.map((product) => (
            <div key={product.id} style={{backgroundColor: bgMap[product.kategori] || '#f9fafb', borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
              {product.foto_url ? (
                <img src={product.foto_url} alt={product.nama} style={{width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0}} />
              ) : (
                <div style={{fontSize: '2.2rem', minWidth: '45px', textAlign: 'center'}}>{product.icon}</div>
              )}
              <div style={{flex: 1, minWidth: 0}}>
                <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.9rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{product.nama}</p>
                <p style={{color: '#1a5c2e', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.6rem'}}>{product.harga_label}</p>
                <a href={`/produk/${product.slug}`}
                  style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.35rem 0.9rem', borderRadius: '999px', textDecoration: 'none', fontSize: '0.78rem', fontWeight: '600'}}>
                  Lihat Detail
                </a>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
          <a href="/katalog" style={{color: '#1a5c2e', fontWeight: '600', textDecoration: 'none'}}>Lihat semua produk →</a>
        </div>
      </section>

      {/* CARA ORDER */}
      <section className="section-pad" style={{backgroundColor: 'white', textAlign: 'center'}}>
        <h2 style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: '#1a1a1a', marginBottom: '0.5rem'}}>Cara Order</h2>
        <p style={{color: '#6b7280', marginBottom: '3rem'}}>3 langkah mudah</p>
        <div className="steps-row">
          {steps.map((step, i) => (
            <div key={step.title} style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{textAlign: 'center', maxWidth: '160px'}}>
                <div style={{width: '64px', height: '64px', backgroundColor: '#1a5c2e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 1rem'}}>
                  {step.icon}
                </div>
                <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.25rem'}}>{step.title}</p>
                <p style={{color: '#6b7280', fontSize: '0.85rem'}}>{step.desc}</p>
              </div>
              {i < steps.length - 1 && <div className="step-arrow" style={{color: '#1a5c2e', fontSize: '1.5rem', fontWeight: 'bold'}}>→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONI */}
      <section className="section-pad" style={{backgroundColor: '#faf7f2', textAlign: 'center'}}>
        <h2 style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: '#1a1a1a', marginBottom: '0.5rem'}}>Kata Mereka</h2>
        <p style={{color: '#6b7280', marginBottom: '3rem'}}>Kirim sehat, bukan sekadar hadiah</p>
        <div className="testi-grid">
          {testimonials.map((t) => (
            <div key={t.name} style={{backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', textAlign: 'left', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
              <div style={{color: '#f59e0b', fontSize: '1.1rem', marginBottom: '0.75rem'}}>★★★★★</div>
              <p style={{color: '#374151', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem', fontStyle: 'italic'}}>{t.text}</p>
              <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.9rem'}}>{t.name}</p>
              <p style={{color: '#6b7280', fontSize: '0.8rem'}}>{t.city}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ARTIKEL */}
      <section className="section-pad" style={{backgroundColor: 'white', textAlign: 'center'}}>
        <h2 style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: '#1a1a1a', marginBottom: '0.5rem'}}>Artikel Edukasi</h2>
        <p style={{color: '#6b7280', marginBottom: '3rem'}}>Tips hidup sehat dari Healthila</p>
        <div className="articles-grid">
          {displayArticles.map((art) => (
            <a key={art.id} href={`/artikel/${art.slug}`} style={{textDecoration: 'none', textAlign: 'left'}}>
              <div style={{backgroundColor: '#f0fdf4', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', height: '100%'}}>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>{art.icon}</div>
                <span style={{backgroundColor: tagColors[art.kategori] || '#1a5c2e', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600'}}>
                  {art.kategori}
                </span>
                <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.95rem', marginTop: '0.75rem', marginBottom: '0.5rem', lineHeight: 1.4}}>{art.judul}</p>
                <p style={{color: '#6b7280', fontSize: '0.8rem'}}>{art.tanggal}</p>
                <p style={{color: '#1a5c2e', fontWeight: '600', fontSize: '0.85rem', marginTop: '0.75rem'}}>Baca Selengkapnya →</p>
              </div>
            </a>
          ))}
        </div>
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
          <a href="/artikel" style={{color: '#1a5c2e', fontWeight: '600', textDecoration: 'none'}}>Lihat semua artikel →</a>
        </div>
      </section>

      {/* CTA WA */}
      <section className="section-pad" style={{backgroundColor: '#1a5c2e', textAlign: 'center'}}>
        <h2 style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: 'white', marginBottom: '0.75rem'}}>Siap Hidup Lebih Sehat? 🌿</h2>
        <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '2rem'}}>Order sekarang dan rasakan perbedaan buah premium Healthila</p>
        <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer"
          style={{backgroundColor: '#25D366', color: 'white', padding: '1rem 2.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'inline-block'}}>
          Chat WhatsApp Sekarang
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{backgroundColor: '#0f3d1e', padding: '3rem 6rem', color: 'rgba(255,255,255,0.7)'}} className="footer-pad">
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '2rem'}} className="footer-grid">
          <div>
            <h3 style={{color: 'white', fontWeight: '800', fontSize: '1.2rem', marginBottom: '0.5rem'}}>🌿 Healthila</h3>
            <p style={{fontSize: '0.85rem', lineHeight: 1.6}}>Fruitful heart, mindful treat.</p>
            <p style={{fontSize: '0.85rem', marginTop: '0.5rem'}}>@healthila.id</p>
          </div>
          <div>
            <h4 style={{color: 'white', fontWeight: '700', marginBottom: '1rem'}}>Menu</h4>
            {[
              { label: 'Beranda', href: '/' },
              { label: 'Parcel', href: '/parcel' },
              { label: 'Jus & Dessert', href: '/jus-dessert' },
              { label: 'Buah Segar', href: '/katalog' },
              { label: 'Artikel', href: '/artikel' },
            ].map((item) => (
              <a key={item.label} href={item.href} style={{display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none'}}>
                {item.label}
              </a>
            ))}
          </div>
          <div>
            <h4 style={{color: 'white', fontWeight: '700', marginBottom: '1rem'}}>Informasi</h4>
            {[
              { label: 'Tentang Kami', href: '/tentang' },
              { label: 'FAQ', href: '/faq' },
              { label: 'Kebijakan Privasi', href: '/kebijakan' },
            ].map((item) => (
              <a key={item.label} href={item.href} style={{display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none'}}>
                {item.label}
              </a>
            ))}
          </div>
          <div>
            <h4 style={{color: 'white', fontWeight: '700', marginBottom: '1rem'}}>Kontak</h4>
            <p style={{fontSize: '0.85rem', marginBottom: '0.4rem'}}>📍 Jl. Tirto Tengah No.15, Malang</p>
            <p style={{fontSize: '0.85rem', marginBottom: '0.4rem'}}>📱 +62 812-3331-2230</p>
            <p style={{fontSize: '0.85rem'}}>✉️ healthila.care@gmail.com</p>
          </div>
        </div>
        <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem'}}>
          2024 Healthila. All rights reserved.
        </div>
      </footer>
    </main>
  );
}