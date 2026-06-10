"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const categories = ['Semua', 'Buah Segar', 'Buah Eksotis', 'Jus & Dessert', 'Parcel'];

const fallbackProducts = [
  { id: 1, nama: 'Jeruk Pontianak', kategori: 'Buah Segar', harga: 45000, harga_label: 'Rp 45.000', deskripsi: '1 kg, manis segar pilihan', icon: '🍊', foto_url: '', tersedia: true },
  { id: 2, nama: 'Strawberry Premium', kategori: 'Buah Segar', harga: 65000, harga_label: 'Rp 65.000', deskripsi: '500 gr, import Berastagi', icon: '🍓', foto_url: '', tersedia: true },
  { id: 3, nama: 'Mangga Harum Manis', kategori: 'Buah Segar', harga: 55000, harga_label: 'Rp 55.000', deskripsi: '1 kg, manis legit', icon: '🥭', foto_url: '', tersedia: true },
  { id: 4, nama: 'Shine Muscat Import', kategori: 'Buah Eksotis', harga: 120000, harga_label: 'Rp 120.000', deskripsi: '500 gr, seedless premium', icon: '🍇', foto_url: '', tersedia: true },
  { id: 5, nama: 'Jus Cold-Pressed', kategori: 'Jus & Dessert', harga: 35000, harga_label: 'Rp 35.000', deskripsi: '350 ml, tanpa gula tambahan', icon: '🧃', foto_url: '', tersedia: true },
  { id: 6, nama: 'Hamper Kesehatan', kategori: 'Parcel', harga: 250000, harga_label: 'Rp 250.000', deskripsi: 'Isi 8 buah + jus', icon: '🧺', foto_url: '', tersedia: true },
];

const bgMap: Record<string, string> = {
  'Buah Segar': '#fff7ed',
  'Buah Eksotis': '#faf5ff',
  'Jus & Dessert': '#f0fdf4',
  'Parcel': '#fef3c7',
};

export default function KatalogPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('produk')
          .select('*')
          .eq('tersedia', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) setProducts(data);
      } catch (err) {
        console.log('Menggunakan data fallback');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'Semua' || p.kategori === activeCategory;
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main style={{backgroundColor: '#faf7f2', minHeight: '100vh'}}>
      <style>{`
        .katalog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
        .search-input { width: 100%; max-width: 500px; padding: 0.75rem 1.25rem; border-radius: 999px; border: 2px solid #e5e7eb; font-size: 1rem; outline: none; }
        .search-input:focus { border-color: #1a5c2e; }
        @media (max-width: 1024px) { .katalog-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .katalog-grid { grid-template-columns: 1fr; } }
      `}</style>

      <section style={{backgroundColor: '#1a5c2e', padding: '3rem 2rem', textAlign: 'center'}}>
        <h1 style={{color: 'white', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', marginBottom: '0.5rem'}}>
          Katalog Produk 🌿
        </h1>
        <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem'}}>Buah segar, jus sehat, dan parcel elegan pilihan Healthila</p>
        <input type="text" placeholder="🔍 Cari produk..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="search-input"
          style={{backgroundColor: 'white'}} />
      </section>

      <section style={{padding: '2rem 2rem 0', maxWidth: '1100px', margin: '0 auto'}}>
        <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem'}}>
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
          {loading ? 'Memuat produk...' : `Menampilkan `}
          {!loading && <strong style={{color: '#1a5c2e'}}>{filtered.length}</strong>}
          {!loading && ' produk'}
        </p>
      </section>

      <section style={{padding: '0 2rem 4rem', maxWidth: '1100px', margin: '0 auto'}}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '4rem', color: '#6b7280'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🌿</div>
            <p>Memuat produk...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign: 'center', padding: '4rem', color: '#6b7280'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🔍</div>
            <p>Produk tidak ditemukan</p>
          </div>
        ) : (
          <div className="katalog-grid">
            {filtered.map((product) => (
              <div key={product.id} style={{
                backgroundColor: bgMap[product.kategori] || '#f9fafb',
                borderRadius: '16px', padding: '1.5rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
              }}>
                {product.foto_url ? (
                  <img src={product.foto_url} alt={product.nama}
                    style={{width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px'}} />
                ) : (
                  <div style={{fontSize: '3rem', textAlign: 'center', padding: '0.5rem'}}>{product.icon}</div>
                )}
                <span style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600', width: 'fit-content'}}>
                  {product.kategori}
                </span>
                <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '1rem'}}>{product.nama}</p>
                <p style={{color: '#6b7280', fontSize: '0.85rem'}}>{product.deskripsi}</p>
                <p style={{color: '#1a5c2e', fontWeight: '800', fontSize: '1.1rem'}}>{product.harga_label}</p>
                <div style={{display: 'flex', gap: '0.5rem', marginTop: 'auto'}}>
                  <a href={`/produk/detail?id=${product.id}`}
                    style={{flex: 1, backgroundColor: 'white', color: '#1a5c2e', padding: '0.65rem 1rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', fontSize: '0.85rem', textAlign: 'center', border: '2px solid #1a5c2e'}}>
                    Lihat Detail
                  </a>
                  <a href={`https://wa.me/628123456789?text=Halo Healthila, saya ingin pesan: ${product.nama} - ${product.harga_label}`}
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