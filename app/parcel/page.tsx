"use client";
import { useState } from "react";

const parcelCategories = ['Semua', 'Buah Segar', 'Buah Eksotis', 'Ulang Tahun', 'Get Well Soon', 'Lebaran', 'Bunga & Hampers', 'Cold-Pressed', 'Fruit Cake'];

const parcels = [
  { id: 'parcel-segar-s', icon: '🧺', name: 'Parcel Buah Segar S', category: 'Buah Segar', price: 'Mulai Rp 120.000', bg: '#fff7ed', badge: 'Terlaris', badgeColor: '#f59e0b', desc: 'Berisi 5 buah segar pilihan dalam keranjang anyaman cantik.' },
  { id: 'parcel-segar-m', icon: '🧺', name: 'Parcel Buah Segar M', category: 'Buah Segar', price: 'Mulai Rp 220.000', bg: '#fff7ed', badge: null, badgeColor: '', desc: 'Berisi 8 buah segar pilihan dengan kemasan premium.' },
  { id: 'parcel-segar-l', icon: '🧺', name: 'Parcel Buah Segar L', category: 'Buah Segar', price: 'Mulai Rp 380.000', bg: '#fff7ed', badge: 'Premium', badgeColor: '#1a5c2e', desc: 'Berisi 12 buah segar pilihan dalam keranjang besar elegan.' },
  { id: 'parcel-eksotis', icon: '🍇', name: 'Parcel Buah Eksotis', category: 'Buah Eksotis', price: 'Mulai Rp 350.000', bg: '#faf5ff', badge: 'Eksklusif', badgeColor: '#7c3aed', desc: 'Koleksi buah eksotis import pilihan dalam kemasan mewah.' },
  { id: 'parcel-ultah', icon: '🎂', name: 'Parcel Ulang Tahun', category: 'Ulang Tahun', price: 'Mulai Rp 280.000', bg: '#fef3c7', badge: 'Spesial', badgeColor: '#f59e0b', desc: 'Rayakan hari spesial dengan parcel buah premium berdekorasi ulang tahun.' },
  { id: 'parcel-getwellsoon', icon: '💚', name: 'Parcel Get Well Soon', category: 'Get Well Soon', price: 'Mulai Rp 200.000', bg: '#f0fdf4', badge: 'Menyehatkan', badgeColor: '#1a5c2e', desc: 'Tunjukkan kepedulianmu dengan parcel buah segar menyehatkan.' },
  { id: 'parcel-lebaran', icon: '🌙', name: 'Parcel Lebaran Premium', category: 'Lebaran', price: 'Mulai Rp 320.000', bg: '#fef3c7', badge: 'Edisi Lebaran', badgeColor: '#d97706', desc: 'Sambut Lebaran dengan parcel buah premium bernuansa Islami.' },
  { id: 'parcel-bunga-hampers', icon: '💐', name: 'Parcel Bunga & Hampers', category: 'Bunga & Hampers', price: 'Mulai Rp 400.000', bg: '#fdf2f8', badge: 'Romantis', badgeColor: '#db2777', desc: 'Kombinasi bunga segar dan buah premium dalam satu hampers elegan.' },
  { id: 'parcel-coldpressed', icon: '🥤', name: 'Hampers Cold-Pressed', category: 'Cold-Pressed', price: 'Mulai Rp 250.000', bg: '#f0fdf4', badge: 'Healthy', badgeColor: '#059669', desc: 'Hampers eksklusif berisi botol-botol jus cold-pressed premium.' },
  { id: 'fruit-cake-semangka', icon: '🍉', name: 'Fruit Cake Semangka', category: 'Fruit Cake', price: 'Mulai Rp 180.000', bg: '#fff1f2', badge: 'Unik', badgeColor: '#e11d48', desc: 'Kreasi unik cake dari semangka yang didekorasi buah-buahan segar.' },
  { id: 'parcel-custom', icon: '✨', name: 'Parcel Custom', category: 'Buah Segar', price: 'Harga sesuai request', bg: '#e8f5e9', badge: 'Custom', badgeColor: '#1a5c2e', desc: 'Buat parcel sesuai keinginanmu sendiri!' },
];

export default function ParcelPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filtered = parcels.filter((p) =>
    activeCategory === 'Semua' || p.category === activeCategory
  );

  return (
    <main style={{backgroundColor: '#faf7f2', minHeight: '100vh'}}>
      <style>{`
        .parcel-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .parcel-card { border-radius: 20px; padding: 1.75rem; box-shadow: 0 2px 16px rgba(0,0,0,0.07); display: flex; flex-direction: column; gap: 1rem; transition: transform 0.2s, box-shadow 0.2s; }
        .parcel-card:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(0,0,0,0.12); }
        @media (max-width: 1024px) { .parcel-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .parcel-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* HERO */}
      <section style={{background: 'linear-gradient(135deg, #1a5c2e 0%, #2d7a47 60%, #86efac 100%)', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 6rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem'}}>
        <div>
          <div style={{display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', marginBottom: '1rem'}}>
            🎁 Kirim sehat, bukan sekadar hadiah
          </div>
          <h1 style={{color: 'white', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '800', lineHeight: 1.2, marginBottom: '1rem'}}>
            Parcel & Hampers<br/>
            <span style={{color: '#86efac'}}>Premium Healthila</span>
          </h1>
          <p style={{color: 'rgba(255,255,255,0.85)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '1.5rem'}}>
            Dari parcel buah segar, bunga & hampers, cold-pressed, hingga fruit cake semangka unik. Semua bisa custom!
          </p>
          <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
            {['🚚 Same-day delivery', '📦 Kemasan premium', '✏️ Bisa custom'].map((item) => (
              <span key={item} style={{backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.3)'}}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
          {['🧺', '💐', '🍉', '🥤'].map((icon, i) => (
            <div key={i} style={{width: '80px', height: '80px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem'}}>
              {icon}
            </div>
          ))}
        </div>
      </section>

      {/* PROMO */}
      <section style={{backgroundColor: '#fef3c7', padding: '1rem 2rem', textAlign: 'center', borderBottom: '2px dashed #f59e0b'}}>
        <p style={{color: '#92400e', fontWeight: '700', fontSize: '0.95rem'}}>
          🎉 Gratis kartu ucapan untuk setiap pemesanan parcel!
        </p>
      </section>

      {/* FILTER */}
      <section style={{padding: '2rem 2rem 0', maxWidth: '1100px', margin: '0 auto'}}>
        <div style={{display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem'}}>
          {parcelCategories.map((cat) => (
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
        <p style={{color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem'}}>
          Menampilkan <strong style={{color: '#1a5c2e'}}>{filtered.length}</strong> jenis parcel
        </p>
      </section>

      {/* GRID */}
      <section style={{padding: '0 2rem 4rem', maxWidth: '1100px', margin: '0 auto'}}>
        <div className="parcel-grid">
          {filtered.map((parcel) => (
            <div key={parcel.id} className="parcel-card" style={{backgroundColor: parcel.bg}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{fontSize: '3.5rem'}}>{parcel.icon}</div>
                {parcel.badge && (
                  <span style={{backgroundColor: parcel.badgeColor, color: 'white', padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '700'}}>
                    {parcel.badge}
                  </span>
                )}
              </div>
              <span style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600', width: 'fit-content'}}>
                {parcel.category}
              </span>
              <div>
                <h3 style={{fontWeight: '800', color: '#1a1a1a', fontSize: '1.05rem', marginBottom: '0.25rem'}}>{parcel.name}</h3>
                <p style={{color: '#1a5c2e', fontWeight: '800', fontSize: '1rem'}}>{parcel.price}</p>
              </div>
              <p style={{color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6}}>{parcel.desc}</p>
              <div style={{display: 'flex', gap: '0.5rem', marginTop: 'auto'}}>
                <a href={`/parcel/detail?id=${parcel.id}`}
                  style={{flex: 1, backgroundColor: 'white', color: '#1a5c2e', padding: '0.7rem 1rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', fontSize: '0.85rem', textAlign: 'center', border: '2px solid #1a5c2e'}}>
                  Lihat Detail
                </a>
                <a href={`https://wa.me/628123456789?text=Halo Healthila! Saya tertarik dengan ${parcel.name} (${parcel.price})`}
                  target="_blank" rel="noopener noreferrer"
                  style={{flex: 1, backgroundColor: '#25D366', color: 'white', padding: '0.7rem 1rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', fontSize: '0.85rem', textAlign: 'center'}}>
                  Pesan WA
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{backgroundColor: '#1a5c2e', padding: '3rem 2rem', textAlign: 'center'}}>
        <h2 style={{color: 'white', fontWeight: '800', fontSize: '1.5rem', marginBottom: '0.5rem'}}>Mau parcel yang lebih personal? 🎁</h2>
        <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem'}}>Kami bisa custom parcel sesuai tema, budget, dan kebutuhanmu</p>
        <a href="https://wa.me/628123456789?text=Halo Healthila! Saya mau konsultasi parcel custom"
          target="_blank" rel="noopener noreferrer"
          style={{backgroundColor: '#25D366', color: 'white', padding: '1rem 2.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'inline-block'}}>
          Konsultasi Parcel Custom
        </a>
      </section>
    </main>
  );
}