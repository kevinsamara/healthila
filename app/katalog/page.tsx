"use client";
import { useState } from "react";
import { products } from "../produk/data";

const categories = ['Semua', 'Buah Segar', 'Buah Eksotis', 'Jus & Dessert', 'Parcel'];

export default function KatalogPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) => {
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
        .product-card { background-color: var(--bg); border-radius: 16px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06); display: flex; flex-direction: column; gap: 0.75rem; transition: transform 0.2s, box-shadow 0.2s; }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        @media (max-width: 1024px) { .katalog-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .katalog-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* HEADER */}
      <section style={{backgroundColor: '#1a5c2e', padding: '3rem 2rem', textAlign: 'center'}}>
        <h1 style={{color: 'white', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', marginBottom: '0.5rem'}}>
          Katalog Produk 🌿
        </h1>
        <p style={{color: 'rgba(255,255,255,0.8)'}}>Buah segar, jus sehat, dan parcel elegan pilihan Healthila</p>
      </section>

      <section style={{padding: '2rem 2rem 0', maxWidth: '1100px', margin: '0 auto'}}>
        <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
          <input type="text" placeholder="🔍 Cari produk..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="search-input" />
        </div>
        <div className="filter-bar" style={{marginBottom: '2rem'}}>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '0.5rem 1.25rem', borderRadius: '999px',
              border: '2px solid #1a5c2e',
              backgroundColor: activeCategory === cat ? '#1a5c2e' : 'white',
              color: activeCategory === cat ? 'white' : '#1a5c2e',
              fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer',
            }}>
              {cat}
            </button>
          ))}
        </div>
        <p style={{color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem'}}>
          Menampilkan <strong style={{color: '#1a5c2e'}}>{filtered.length}</strong> produk
        </p>
      </section>

      <section style={{padding: '0 2rem 4rem', maxWidth: '1100px', margin: '0 auto'}}>
        {filtered.length === 0 ? (
          <div style={{textAlign: 'center', padding: '4rem', color: '#6b7280'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🔍</div>
            <p>Produk tidak ditemukan</p>
          </div>
        ) : (
          <div className="katalog-grid">
            {filtered.map((product) => (
              <div key={product.id} style={{backgroundColor: product.bg, borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'transform 0.2s'}}>
                <div style={{fontSize: '3rem', textAlign: 'center'}}>{product.icon}</div>
                <span style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600', width: 'fit-content'}}>
                  {product.category}
                </span>
                <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '1rem'}}>{product.name}</p>
                <p style={{color: '#6b7280', fontSize: '0.85rem'}}>{product.desc}</p>
                <p style={{color: '#1a5c2e', fontWeight: '800', fontSize: '1.1rem'}}>{product.priceLabel}</p>
                <div style={{display: 'flex', gap: '0.5rem', marginTop: 'auto'}}>
                  <a href={`/produk/detail?id=${product.id}`}
                    style={{flex: 1, backgroundColor: 'white', color: '#1a5c2e', padding: '0.65rem 1rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', fontSize: '0.85rem', textAlign: 'center', border: '2px solid #1a5c2e'}}>
                    Lihat Detail
                  </a>
                  <a href={`https://wa.me/628123456789?text=Halo Healthila, saya ingin pesan: ${product.name} - ${product.priceLabel}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{flex: 1, backgroundColor: '#25D366', color: 'white', padding: '0.65rem 1rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', fontSize: '0.85rem', textAlign: 'center'}}>
                    Order WA
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{backgroundColor: '#1a5c2e', padding: '3rem 2rem', textAlign: 'center'}}>
        <h2 style={{color: 'white', fontWeight: '800', fontSize: '1.5rem', marginBottom: '0.5rem'}}>Tidak menemukan yang kamu cari?</h2>
        <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem'}}>Chat langsung untuk request produk spesial</p>
        <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer"
          style={{backgroundColor: '#25D366', color: 'white', padding: '0.9rem 2rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem'}}>
          Chat WhatsApp Sekarang
        </a>
      </section>
    </main>
  );
}