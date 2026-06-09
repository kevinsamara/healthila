"use client";
import { useState } from "react";

const allProducts = [
  { icon: '🍊', name: 'Jeruk Pontianak', price: 'Rp 45.000', category: 'Buah Segar', desc: '1 kg, manis segar pilihan' },
  { icon: '🍓', name: 'Strawberry Premium', price: 'Rp 65.000', category: 'Buah Segar', desc: '500 gr, import Berastagi' },
  { icon: '🥭', name: 'Mangga Harum Manis', price: 'Rp 55.000', category: 'Buah Segar', desc: '1 kg, manis legit' },
  { icon: '🍇', name: 'Shine Muscat Import', price: 'Rp 120.000', category: 'Buah Eksotis', desc: '500 gr, seedless premium' },
  { icon: '🍈', name: 'Melon Golden', price: 'Rp 75.000', category: 'Buah Segar', desc: '1 buah, manis madu' },
  { icon: '🍑', name: 'Persik Import', price: 'Rp 95.000', category: 'Buah Eksotis', desc: '500 gr, lembut & harum' },
  { icon: '🫐', name: 'Blueberry Fresh', price: 'Rp 85.000', category: 'Buah Eksotis', desc: '250 gr, antioksidan tinggi' },
  { icon: '🍋', name: 'Lemon California', price: 'Rp 35.000', category: 'Buah Segar', desc: '500 gr, segar asam manis' },
  { icon: '🧃', name: 'Jus Cold-Pressed Mix', price: 'Rp 35.000', category: 'Jus & Dessert', desc: '350 ml, tanpa gula tambahan' },
  { icon: '🥤', name: 'Green Detox Juice', price: 'Rp 40.000', category: 'Jus & Dessert', desc: '350 ml, sayur + buah' },
  { icon: '🍹', name: 'Tropical Blend', price: 'Rp 38.000', category: 'Jus & Dessert', desc: '350 ml, mangga + nanas' },
  { icon: '🍮', name: 'Pudding Buah Segar', price: 'Rp 25.000', category: 'Jus & Dessert', desc: '1 cup, dessert sehat' },
  { icon: '🧺', name: 'Hamper Kesehatan S', price: 'Rp 150.000', category: 'Parcel', desc: 'Isi 5 buah pilihan' },
  { icon: '🧺', name: 'Hamper Kesehatan M', price: 'Rp 250.000', category: 'Parcel', desc: 'Isi 8 buah + jus' },
  { icon: '🧺', name: 'Hamper Kesehatan L', price: 'Rp 450.000', category: 'Parcel', desc: 'Isi 12 buah premium' },
  { icon: '🎁', name: 'Parcel Ultah Spesial', price: 'Rp 350.000', category: 'Parcel', desc: 'Buah eksotis + ribbon' },
];

const categories = ['Semua', 'Buah Segar', 'Buah Eksotis', 'Jus & Dessert', 'Parcel'];

const bgMap: Record<string, string> = {
  'Buah Segar': '#fff7ed',
  'Buah Eksotis': '#faf5ff',
  'Jus & Dessert': '#f0fdf4',
  'Parcel': '#fef3c7',
};

export default function KatalogPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');

  const filtered = allProducts.filter((p) => {
    const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main style={{backgroundColor: '#faf7f2', minHeight: '100vh'}}>
      <style>{`
        .katalog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
        .filter-bar { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
        .search-input { width: 100%; max-width: 500px; padding: 0.75rem 1.25rem; border-radius: 999px; border: 2px solid #e5e7eb; font-size: 1rem; outline: none; }
        .search-input:focus { border-color: #1a5c2e; }
        @media (max-width: 1024px) { .katalog-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .katalog-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* HEADER */}
      <section style={{backgroundColor: '#1a5c2e', padding: '3rem 2rem', textAlign: 'center'}}>
        <h1 style={{color: 'white', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', marginBottom: '0.5rem'}}>
          Katalog Produk 🌿
        </h1>
        <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '1rem'}}>
          Buah segar, jus sehat, dan parcel elegan pilihan Healthila
        </p>
      </section>

      <section style={{padding: '2rem 2rem 0', maxWidth: '1100px', margin: '0 auto'}}>
        {/* SEARCH */}
        <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
          <input
            type="text"
            placeholder="🔍 Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {/* FILTER */}
        <div className="filter-bar" style={{marginBottom: '2rem'}}>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                border: '2px solid #1a5c2e',
                backgroundColor: activeCategory === cat ? '#1a5c2e' : 'white',
                color: activeCategory === cat ? 'white' : '#1a5c2e',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* JUMLAH PRODUK */}
        <p style={{color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem'}}>
          Menampilkan <strong style={{color: '#1a5c2e'}}>{filtered.length}</strong> produk
          {activeCategory !== 'Semua' && ` dalam kategori "${activeCategory}"`}
        </p>
      </section>

      {/* GRID PRODUK */}
      <section style={{padding: '0 2rem 4rem', maxWidth: '1100px', margin: '0 auto'}}>
        {filtered.length === 0 ? (
          <div style={{textAlign: 'center', padding: '4rem', color: '#6b7280'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🔍</div>
            <p style={{fontSize: '1.1rem'}}>Produk tidak ditemukan</p>
          </div>
        ) : (
          <div className="katalog-grid">
            {filtered.map((product) => (
              <div key={product.name} style={{
                backgroundColor: bgMap[product.category] || '#f9fafb',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                <div style={{fontSize: '3rem', textAlign: 'center'}}>{product.icon}</div>
                <div>
                  <span style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600'}}>
                    {product.category}
                  </span>
                </div>
                <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '1rem'}}>{product.name}</p>
                <p style={{color: '#6b7280', fontSize: '0.85rem'}}>{product.desc}</p>
                <p style={{color: '#1a5c2e', fontWeight: '800', fontSize: '1.1rem'}}>{product.price}</p>
                <a href={`https://wa.me/628123456789?text=Halo Healthila, saya ingin pesan: ${product.name} - ${product.price}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#25D366',
                    color: 'white',
                    padding: '0.65rem 1rem',
                    borderRadius: '999px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    display: 'block',
                  }}>
                  📱 Order via WA
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section style={{backgroundColor: '#1a5c2e', padding: '3rem 2rem', textAlign: 'center'}}>
        <h2 style={{color: 'white', fontWeight: '800', fontSize: '1.5rem', marginBottom: '0.5rem'}}>
          Tidak menemukan yang kamu cari?
        </h2>
        <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem'}}>
          Chat langsung dengan kami untuk request produk spesial
        </p>
        <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer"
          style={{backgroundColor: '#25D366', color: 'white', padding: '0.9rem 2rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem'}}>
          Chat WhatsApp Sekarang
        </a>
      </section>
    </main>
  );
}