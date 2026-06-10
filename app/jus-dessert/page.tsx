"use client";
import { useState } from "react";

const tabs = ['Semua', 'Jus Cold-Pressed', 'Jus Buah Biasa', 'Smoothie', 'Dessert Buah'];

const products = [
  // JUS COLD-PRESSED
  { id: 'cp-orange', icon: '🍊', name: 'Cold-Pressed Jeruk', category: 'Jus Cold-Pressed', price: 'Rp 35.000', bg: '#fff7ed', badge: 'Bestseller', badgeColor: '#f59e0b', desc: '350ml — Murni jeruk segar, tanpa gula tambahan', benefits: ['Vitamin C tinggi', 'Tanpa pengawet', 'Nutrisi terjaga'] },
  { id: 'cp-green', icon: '🥬', name: 'Green Detox Juice', category: 'Jus Cold-Pressed', price: 'Rp 40.000', bg: '#f0fdf4', badge: 'Detox', badgeColor: '#059669', desc: '350ml — Bayam, apel, lemon, jahe', benefits: ['Detoks tubuh', 'Antioksidan tinggi', 'Segar & menyehatkan'] },
  { id: 'cp-beetroot', icon: '🫐', name: 'Beetroot Boost', category: 'Jus Cold-Pressed', price: 'Rp 42.000', bg: '#fdf2f8', badge: null, badgeColor: '', desc: '350ml — Bit merah, wortel, apel, lemon', benefits: ['Baik untuk darah', 'Energi alami', 'Antioksidan'] },
  { id: 'cp-pineapple', icon: '🍍', name: 'Tropical Glow', category: 'Jus Cold-Pressed', price: 'Rp 38.000', bg: '#fef3c7', badge: null, badgeColor: '', desc: '350ml — Nanas, mangga, jeruk nipis', benefits: ['Pencernaan lancar', 'Vitamin C', 'Menyegarkan'] },
  { id: 'cp-watermelon', icon: '🍉', name: 'Watermelon Fresh', category: 'Jus Cold-Pressed', price: 'Rp 35.000', bg: '#fff1f2', badge: 'Favorit', badgeColor: '#e11d48', desc: '350ml — Semangka murni segar', benefits: ['Hidrasi tubuh', 'Rendah kalori', 'Lycopene tinggi'] },
  { id: 'cp-bundle', icon: '🧃', name: 'Bundle 6 Botol', category: 'Jus Cold-Pressed', price: 'Rp 200.000', bg: '#e8f5e9', badge: 'Hemat', badgeColor: '#1a5c2e', desc: '6x350ml — Pilih 6 rasa favoritmu', benefits: ['Hemat 15%', 'Bebas pilih rasa', 'Cocok untuk seminggu'] },

  // JUS BUAH BIASA
  { id: 'jus-alpukat', icon: '🥑', name: 'Jus Alpukat', category: 'Jus Buah Biasa', price: 'Rp 25.000', bg: '#f0fdf4', badge: null, badgeColor: '', desc: '300ml — Alpukat creamy dengan susu', benefits: ['Lemak sehat', 'Mengenyangkan', 'Vitamin E'] },
  { id: 'jus-mangga', icon: '🥭', name: 'Jus Mangga Segar', category: 'Jus Buah Biasa', price: 'Rp 22.000', bg: '#fffbeb', badge: 'Favorit', badgeColor: '#f59e0b', desc: '300ml — Mangga harum manis pilihan', benefits: ['Vitamin A & C', 'Manis alami', 'Segar'] },
  { id: 'jus-strawberry', icon: '🍓', name: 'Jus Strawberry', category: 'Jus Buah Biasa', price: 'Rp 28.000', bg: '#fff1f2', badge: null, badgeColor: '', desc: '300ml — Strawberry segar dengan madu', benefits: ['Antioksidan', 'Rendah kalori', 'Vitamin C'] },
  { id: 'jus-sirsak', icon: '🍈', name: 'Jus Sirsak', category: 'Jus Buah Biasa', price: 'Rp 25.000', bg: '#f0fdf4', badge: null, badgeColor: '', desc: '300ml — Sirsak lokal segar', benefits: ['Antibakteri alami', 'Menyehatkan', 'Unik & lezat'] },
  { id: 'jus-tomat', icon: '🍅', name: 'Jus Tomat Segar', category: 'Jus Buah Biasa', price: 'Rp 20.000', bg: '#fff7ed', badge: null, badgeColor: '', desc: '300ml — Tomat segar dengan lemon', benefits: ['Lycopene', 'Vitamin C', 'Antioksidan'] },
  { id: 'jus-mix', icon: '🍹', name: 'Jus Mix Buah', category: 'Jus Buah Biasa', price: 'Rp 28.000', bg: '#faf5ff', badge: 'Populer', badgeColor: '#7c3aed', desc: '300ml — Campuran 4 buah pilihan', benefits: ['Multi vitamin', 'Segar', 'Bergizi tinggi'] },

  // SMOOTHIE
  { id: 'smoothie-berry', icon: '🍇', name: 'Berry Blast Smoothie', category: 'Smoothie', price: 'Rp 38.000', bg: '#fdf2f8', badge: 'Bestseller', badgeColor: '#db2777', desc: '350ml — Blueberry, strawberry, raspberry', benefits: ['Antioksidan super', 'Creamy & lezat', 'Protein tinggi'] },
  { id: 'smoothie-green', icon: '🥝', name: 'Green Power Smoothie', category: 'Smoothie', price: 'Rp 40.000', bg: '#f0fdf4', badge: null, badgeColor: '', desc: '350ml — Kiwi, bayam, pisang, madu', benefits: ['Energi boost', 'Serat tinggi', 'Menyehatkan'] },
  { id: 'smoothie-mango', icon: '🥭', name: 'Mango Lassi Smoothie', category: 'Smoothie', price: 'Rp 35.000', bg: '#fffbeb', badge: 'Favorit', badgeColor: '#f59e0b', desc: '350ml — Mangga, yogurt, madu', benefits: ['Probiotik', 'Creamy', 'Vitamin A tinggi'] },
  { id: 'smoothie-banana', icon: '🍌', name: 'Banana Peanut Smoothie', category: 'Smoothie', price: 'Rp 35.000', bg: '#fef3c7', badge: null, badgeColor: '', desc: '350ml — Pisang, selai kacang, susu oat', benefits: ['Tinggi protein', 'Mengenyangkan', 'Energi tahan lama'] },

  // DESSERT BUAH
  { id: 'dessert-salad', icon: '🥗', name: 'Fruit Salad Premium', category: 'Dessert Buah', price: 'Rp 30.000', bg: '#f0fdf4', badge: 'Segar', badgeColor: '#059669', desc: '250gr — Mix 8 buah dengan yogurt madu', benefits: ['Multi vitamin', 'Rendah kalori', 'Segar & kenyang'] },
  { id: 'dessert-pudding', icon: '🍮', name: 'Pudding Buah Segar', category: 'Dessert Buah', price: 'Rp 22.000', bg: '#fef3c7', badge: null, badgeColor: '', desc: '200ml — Pudding susu dengan topping buah', benefits: ['Kalsium tinggi', 'Manis alami', 'Cocok semua usia'] },
  { id: 'dessert-es-buah', icon: '🍧', name: 'Es Buah Premium', category: 'Dessert Buah', price: 'Rp 25.000', bg: '#fff1f2', badge: 'Favorit', badgeColor: '#e11d48', desc: '400ml — Es buah segar dengan cincau & kolang-kaling', benefits: ['Menyegarkan', 'Multi buah', 'Cocok cuaca panas'] },
  { id: 'dessert-bowl', icon: '🫐', name: 'Smoothie Bowl', category: 'Dessert Buah', price: 'Rp 45.000', bg: '#fdf2f8', badge: 'Instagramable', badgeColor: '#db2777', desc: '300gr — Base smoothie berry dengan granola & buah', benefits: ['Tinggi serat', 'Instagramable', 'Mengenyangkan'] },
  { id: 'dessert-wrap', icon: '🌯', name: 'Fruit Wrap Crepe', category: 'Dessert Buah', price: 'Rp 28.000', bg: '#fff7ed', badge: null, badgeColor: '', desc: '1 pcs — Crepe tipis isi buah segar & whipped cream', benefits: ['Unik & lezat', 'Buah segar', 'Dessert spesial'] },
];

export default function JusDessertPage() {
  const [activeTab, setActiveTab] = useState('Semua');

  const filtered = products.filter((p) =>
    activeTab === 'Semua' || p.category === activeTab
  );

  return (
    <main style={{backgroundColor: '#faf7f2', minHeight: '100vh'}}>
      <style>{`
        .products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
        .product-card { border-radius: 18px; padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; box-shadow: 0 2px 14px rgba(0,0,0,0.07); transition: transform 0.2s, box-shadow 0.2s; }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        .tab-btn { padding: 0.65rem 1.25rem; border-radius: 999px; border: 2px solid #1a5c2e; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: #1a5c2e; color: white; }
        .tab-btn:not(.active) { background: white; color: #1a5c2e; }
        @media (max-width: 1024px) { .products-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .products-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* HERO BANNER */}
      <section style={{background: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #86efac 100%)', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 6rem)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem'}}>
          <div>
            <div style={{display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', marginBottom: '1rem'}}>
              🥤 Sehat setiap tegukan
            </div>
            <h1 style={{color: 'white', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '800', lineHeight: 1.2, marginBottom: '1rem'}}>
              Jus & Dessert<br/>
              <span style={{color: '#d1fae5'}}>Fresh Healthila</span>
            </h1>
            <p style={{color: 'rgba(255,255,255,0.85)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '1.5rem'}}>
              Cold-pressed, jus buah segar, smoothie creamy, dan dessert buah premium. Dibuat fresh setiap hari tanpa pengawet!
            </p>
            <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
              {['🌿 Tanpa pengawet', '🍯 Tanpa gula tambahan', '❄️ Dibuat fresh harian'].map((item) => (
                <span key={item} style={{backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.82rem', border: '1px solid rgba(255,255,255,0.3)'}}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            {['🥤', '🍹', '🧃', '🍧'].map((icon, i) => (
              <div key={i} style={{width: '80px', height: '80px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem'}}>
                {icon}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INFO STRIP */}
      <section style={{backgroundColor: '#d1fae5', padding: '1rem 2rem', textAlign: 'center', borderBottom: '2px dashed #059669'}}>
        <p style={{color: '#065f46', fontWeight: '700', fontSize: '0.95rem'}}>
          ❄️ Cold-pressed tersedia setiap hari — pesan sebelum jam 10 pagi untuk pengiriman hari yang sama!
        </p>
      </section>

      {/* TABS */}
      <section style={{padding: '2rem 2rem 0', maxWidth: '1100px', margin: '0 auto'}}>
        <div style={{display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem'}}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`tab-btn${activeTab === tab ? ' active' : ''}`}>
              {tab === 'Jus Cold-Pressed' && '❄️ '}
              {tab === 'Jus Buah Biasa' && '🍹 '}
              {tab === 'Smoothie' && '🥤 '}
              {tab === 'Dessert Buah' && '🍧 '}
              {tab}
            </button>
          ))}
        </div>

        {/* Deskripsi tab */}
        {activeTab === 'Jus Cold-Pressed' && (
          <div style={{backgroundColor: '#e8f5e9', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', border: '1px solid #a7f3d0'}}>
            <p style={{color: '#065f46', fontSize: '0.88rem', lineHeight: 1.6}}>
              <strong>Cold-pressed</strong> adalah teknik memeras buah dengan tekanan dingin — mempertahankan hingga 3-5x lebih banyak nutrisi dibanding jus biasa. Tanpa panas, tanpa oksidasi, semua vitamin terjaga!
            </p>
          </div>
        )}
        {activeTab === 'Smoothie' && (
          <div style={{backgroundColor: '#fdf2f8', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', border: '1px solid #fbcfe8'}}>
            <p style={{color: '#831843', fontSize: '0.88rem', lineHeight: 1.6}}>
              <strong>Smoothie</strong> kami dibuat dari buah segar yang diblender utuh dengan yogurt atau susu — kaya serat, creamy, dan mengenyangkan. Cocok sebagai sarapan atau pengganti makan ringan!
            </p>
          </div>
        )}
        {activeTab === 'Dessert Buah' && (
          <div style={{backgroundColor: '#fef3c7', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', border: '1px solid #fde68a'}}>
            <p style={{color: '#92400e', fontSize: '0.88rem', lineHeight: 1.6}}>
              <strong>Dessert Buah</strong> Healthila — sajian manis sehat dari buah-buahan segar premium. Tanpa tepung, tanpa lemak jahat. Dessert yang bikin happy tanpa rasa bersalah!
            </p>
          </div>
        )}

        <p style={{color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem'}}>
          Menampilkan <strong style={{color: '#1a5c2e'}}>{filtered.length}</strong> produk
          {activeTab !== 'Semua' && ` dalam kategori "${activeTab}"`}
        </p>
      </section>

      {/* GRID PRODUK */}
      <section style={{padding: '0 2rem 4rem', maxWidth: '1100px', margin: '0 auto'}}>
        <div className="products-grid">
          {filtered.map((product) => (
            <div key={product.id} className="product-card" style={{backgroundColor: product.bg}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{fontSize: '3rem'}}>{product.icon}</div>
                {product.badge && (
                  <span style={{backgroundColor: product.badgeColor, color: 'white', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '700'}}>
                    {product.badge}
                  </span>
                )}
              </div>
              <span style={{backgroundColor: '#065f46', color: 'white', padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600', width: 'fit-content'}}>
                {product.category}
              </span>
              <div>
                <h3 style={{fontWeight: '800', color: '#1a1a1a', fontSize: '1rem', marginBottom: '0.25rem'}}>{product.name}</h3>
                <p style={{color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.5}}>{product.desc}</p>
              </div>
              <div style={{display: 'flex', gap: '0.4rem', flexWrap: 'wrap'}}>
                {product.benefits.map((b) => (
                  <span key={b} style={{backgroundColor: 'rgba(6,95,70,0.08)', color: '#065f46', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '600'}}>
                    {b}
                  </span>
                ))}
              </div>
              <p style={{color: '#059669', fontWeight: '800', fontSize: '1.1rem'}}>{product.price}</p>
              <a href={`https://wa.me/628123456789?text=Halo Healthila! 🥤%0ASaya ingin memesan:%0A%0AProduk: ${product.name}%0AHarga: ${product.price}%0A%0AMohon konfirmasi ketersediaan. Terima kasih!`}
                target="_blank" rel="noopener noreferrer"
                style={{backgroundColor: '#25D366', color: 'white', padding: '0.65rem 1rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', fontSize: '0.88rem', textAlign: 'center', display: 'block', marginTop: 'auto'}}>
                📱 Order via WA
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section style={{backgroundColor: 'white', padding: '3rem 2rem', textAlign: 'center'}}>
        <h2 style={{fontWeight: '800', color: '#1a1a1a', fontSize: '1.5rem', marginBottom: '0.5rem'}}>Kenapa Pilih Jus Healthila?</h2>
        <p style={{color: '#6b7280', marginBottom: '2.5rem'}}>Beda dari yang lain</p>
        <div style={{display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto'}}>
          {[
            { icon: '❄️', title: 'Cold-Pressed', desc: 'Nutrisi terjaga maksimal dengan teknik pengepresan dingin' },
            { icon: '🚫', title: 'Tanpa Pengawet', desc: 'Dibuat fresh setiap hari, tanpa bahan kimia tambahan' },
            { icon: '🍯', title: 'Tanpa Gula Tambahan', desc: 'Manis alami dari buah, tidak ada gula buatan' },
            { icon: '🚚', title: 'Dikirim Fresh', desc: 'Same-day delivery ke seluruh wilayah Malang' },
          ].map((item) => (
            <div key={item.title} style={{textAlign: 'center', maxWidth: '180px'}}>
              <div style={{fontSize: '2.5rem', marginBottom: '0.75rem'}}>{item.icon}</div>
              <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.4rem'}}>{item.title}</p>
              <p style={{color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.5}}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{backgroundColor: '#065f46', padding: '3rem 2rem', textAlign: 'center'}}>
        <h2 style={{color: 'white', fontWeight: '800', fontSize: '1.5rem', marginBottom: '0.5rem'}}>
          Mau langganan jus harian? 🥤
        </h2>
        <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem'}}>
          Dapatkan diskon spesial untuk pemesanan rutin mingguan atau bulanan!
        </p>
        <a href="https://wa.me/628123456789?text=Halo Healthila! Saya tertarik langganan jus harian. Bisa info lebih lanjut?"
          target="_blank" rel="noopener noreferrer"
          style={{backgroundColor: '#25D366', color: 'white', padding: '1rem 2.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'inline-block'}}>
          Chat WhatsApp Sekarang
        </a>
      </section>
    </main>
  );
}