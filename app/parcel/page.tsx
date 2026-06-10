"use client";
import { useState } from "react";

const parcelCategories = ['Semua', 'Buah Segar', 'Buah Eksotis', 'Ulang Tahun', 'Get Well Soon', 'Lebaran', 'Bunga & Hampers', 'Cold-Pressed', 'Fruit Cake'];

const parcels = [
  {
    id: 'parcel-segar-s',
    icon: '🧺',
    name: 'Parcel Buah Segar S',
    category: 'Buah Segar',
    price: 'Mulai Rp 120.000',
    desc: 'Berisi 5 buah segar pilihan dalam keranjang anyaman cantik. Cocok untuk hadiah sehari-hari.',
    includes: ['Jeruk Pontianak', 'Mangga Harum Manis', 'Apel Fuji', 'Anggur Merah', 'Pir Hijau'],
    bg: '#fff7ed',
    badge: 'Terlaris',
    badgeColor: '#f59e0b',
  },
  {
    id: 'parcel-segar-m',
    icon: '🧺',
    name: 'Parcel Buah Segar M',
    category: 'Buah Segar',
    price: 'Mulai Rp 220.000',
    desc: 'Berisi 8 buah segar pilihan dengan kemasan premium. Pilihan terbaik untuk hadiah spesial.',
    includes: ['Jeruk Pontianak', 'Mangga Harum Manis', 'Strawberry', 'Anggur Merah', 'Pir Hijau', 'Apel Fuji', 'Kiwi', 'Melon'],
    bg: '#fff7ed',
    badge: null,
    badgeColor: '',
  },
  {
    id: 'parcel-segar-l',
    icon: '🧺',
    name: 'Parcel Buah Segar L',
    category: 'Buah Segar',
    price: 'Mulai Rp 380.000',
    desc: 'Berisi 12 buah segar pilihan dalam keranjang besar elegan. Kesan mewah untuk penerimanya.',
    includes: ['12 buah pilihan premium', 'Keranjang anyaman besar', 'Ribbon eksklusif', 'Kartu ucapan'],
    bg: '#fff7ed',
    badge: 'Premium',
    badgeColor: '#1a5c2e',
  },
  {
    id: 'parcel-eksotis',
    icon: '🍇',
    name: 'Parcel Buah Eksotis',
    category: 'Buah Eksotis',
    price: 'Mulai Rp 350.000',
    desc: 'Koleksi buah eksotis import pilihan — Shine Muscat, Persik, Blueberry, dan lainnya dalam kemasan mewah.',
    includes: ['Shine Muscat Import', 'Persik Import', 'Blueberry Fresh', 'Strawberry Premium', 'Ribbon premium'],
    bg: '#faf5ff',
    badge: 'Eksklusif',
    badgeColor: '#7c3aed',
  },
  {
    id: 'parcel-ultah',
    icon: '🎂',
    name: 'Parcel Ulang Tahun',
    category: 'Ulang Tahun',
    price: 'Mulai Rp 280.000',
    desc: 'Rayakan hari spesial dengan parcel buah premium berdekorasi ulang tahun yang meriah dan berkesan.',
    includes: ['Buah pilihan premium', 'Dekorasi balon mini', 'Kartu ucapan HBD', 'Ribbon warna-warni', 'Box premium'],
    bg: '#fef3c7',
    badge: 'Spesial',
    badgeColor: '#f59e0b',
  },
  {
    id: 'parcel-getwellsoon',
    icon: '💚',
    name: 'Parcel Get Well Soon',
    category: 'Get Well Soon',
    price: 'Mulai Rp 200.000',
    desc: 'Tunjukkan kepedulianmu dengan parcel buah segar menyehatkan. Doa terbaik untuk kesembuhan.',
    includes: ['Jeruk Vitamin C tinggi', 'Jus Cold-Pressed', 'Madu alami', 'Kartu ucapan', 'Kemasan hangat'],
    bg: '#f0fdf4',
    badge: 'Menyehatkan',
    badgeColor: '#1a5c2e',
  },
  {
    id: 'parcel-lebaran',
    icon: '🌙',
    name: 'Parcel Lebaran Premium',
    category: 'Lebaran',
    price: 'Mulai Rp 320.000',
    desc: 'Sambut Lebaran dengan parcel buah premium bernuansa Islami. Hadiah terbaik untuk keluarga tercinta.',
    includes: ['Kurma premium', 'Buah segar pilihan', 'Kemasan nuansa Lebaran', 'Kartu ucapan Lebaran', 'Ribbon emas'],
    bg: '#fef3c7',
    badge: 'Edisi Lebaran',
    badgeColor: '#d97706',
  },
  {
    id: 'parcel-bunga-hampers',
    icon: '💐',
    name: 'Parcel Bunga & Hampers',
    category: 'Bunga & Hampers',
    price: 'Mulai Rp 400.000',
    desc: 'Kombinasi bunga segar dan buah premium dalam satu hampers elegan. Hadiah paling romantis dan berkesan.',
    includes: ['Rangkaian bunga segar', 'Buah eksotis pilihan', 'Box hampers premium', 'Pita satin', 'Kartu ucapan eksklusif'],
    bg: '#fdf2f8',
    badge: 'Romantis',
    badgeColor: '#db2777',
  },
  {
    id: 'parcel-coldpressed',
    icon: '🥤',
    name: 'Hampers Cold-Pressed',
    category: 'Cold-Pressed',
    price: 'Mulai Rp 250.000',
    desc: 'Hampers eksklusif berisi botol-botol jus cold-pressed premium tanpa gula tambahan. Gaya hidup sehat terbaik.',
    includes: ['6 botol jus cold-pressed', 'Berbagai rasa', 'Tanpa gula tambahan', 'Box premium', 'Kartu edukasi gizi'],
    bg: '#f0fdf4',
    badge: 'Healthy',
    badgeColor: '#059669',
  },
  {
    id: 'fruit-cake-semangka',
    icon: '🍉',
    name: 'Fruit Cake Semangka',
    category: 'Fruit Cake',
    price: 'Mulai Rp 180.000',
    desc: 'Kreasi unik cake dari semangka yang didekorasi buah-buahan segar. Pengganti kue ulang tahun yang lebih sehat!',
    includes: ['Semangka segar utuh', 'Dekorasi buah-buahan', 'Topping strawberry & kiwi', 'Tanpa tepung & gula tambahan', 'Box cantik'],
    bg: '#fff1f2',
    badge: 'Unik',
    badgeColor: '#e11d48',
  },
  {
    id: 'parcel-custom',
    icon: '✨',
    name: 'Parcel Custom',
    category: 'Buah Segar',
    price: 'Harga sesuai request',
    desc: 'Buat parcel sesuai keinginanmu! Pilih buah, kemasan, dan dekorasi sendiri. Kami siap wujudkan.',
    includes: ['Buah sesuai pilihan', 'Kemasan custom', 'Dekorasi sesuai tema', 'Kartu ucapan personal', 'Bisa antar ke lokasi'],
    bg: '#e8f5e9',
    badge: 'Custom',
    badgeColor: '#1a5c2e',
  },
];

export default function ParcelPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = parcels.filter((p) =>
    activeCategory === 'Semua' || p.category === activeCategory
  );

  return (
    <main style={{backgroundColor: '#faf7f2', minHeight: '100vh'}}>
      <style>{`
        .parcel-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .filter-scroll { display: flex; gap: 0.6rem; flex-wrap: wrap; justify-content: center; }
        .parcel-card { border-radius: 20px; padding: 1.75rem; box-shadow: 0 2px 16px rgba(0,0,0,0.07); display: flex; flex-direction: column; gap: 1rem; transition: transform 0.2s, box-shadow 0.2s; }
        .parcel-card:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(0,0,0,0.12); }
        .includes-list { display: flex; flex-direction: column; gap: 0.35rem; }
        @media (max-width: 1024px) { .parcel-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .parcel-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* HERO BANNER */}
      <section style={{background: 'linear-gradient(135deg, #1a5c2e 0%, #2d7a47 60%, #86efac 100%)', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 6rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem'}}>
        <div>
          <div style={{display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', marginBottom: '1rem'}}>
            🎁 Kirim sehat, bukan sekadar hadiah
          </div>
          <h1 style={{color: 'white', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '800', lineHeight: 1.2, marginBottom: '1rem'}}>
            Parcel & Hampers<br/>
            <span style={{color: '#86efac'}}>Premium Healthila</span>
          </h1>
          <p style={{color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '1.5rem'}}>
            Dari parcel buah segar, bunga & hampers, cold-pressed, hingga fruit cake semangka unik. Semua bisa custom sesuai kebutuhanmu!
          </p>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
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

      {/* PROMO BANNER */}
      <section style={{backgroundColor: '#fef3c7', padding: '1rem 2rem', textAlign: 'center', borderBottom: '2px dashed #f59e0b'}}>
        <p style={{color: '#92400e', fontWeight: '700', fontSize: '0.95rem'}}>
          🎉 Gratis kartu ucapan untuk setiap pemesanan parcel! Order via WhatsApp sekarang.
        </p>
      </section>

      {/* FILTER */}
      <section style={{padding: '2rem 2rem 0', maxWidth: '1100px', margin: '0 auto'}}>
        <div className="filter-scroll" style={{marginBottom: '2rem'}}>
          {parcelCategories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '999px',
              border: '2px solid #1a5c2e',
              backgroundColor: activeCategory === cat ? '#1a5c2e' : 'white',
              color: activeCategory === cat ? 'white' : '#1a5c2e',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>
              {cat}
            </button>
          ))}
        </div>
        <p style={{color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem'}}>
          Menampilkan <strong style={{color: '#1a5c2e'}}>{filtered.length}</strong> jenis parcel
        </p>
      </section>

      {/* GRID PARCEL */}
      <section style={{padding: '0 2rem 4rem', maxWidth: '1100px', margin: '0 auto'}}>
        <div className="parcel-grid">
          {filtered.map((parcel) => (
            <div key={parcel.id} className="parcel-card" style={{backgroundColor: parcel.bg}}>
              {/* Badge */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{fontSize: '3.5rem'}}>{parcel.icon}</div>
                {parcel.badge && (
                  <span style={{backgroundColor: parcel.badgeColor, color: 'white', padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '700', height: 'fit-content'}}>
                    {parcel.badge}
                  </span>
                )}
              </div>

              {/* Kategori */}
              <span style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600', width: 'fit-content'}}>
                {parcel.category}
              </span>

              {/* Nama & Harga */}
              <div>
                <h3 style={{fontWeight: '800', color: '#1a1a1a', fontSize: '1.05rem', marginBottom: '0.25rem'}}>{parcel.name}</h3>
                <p style={{color: '#1a5c2e', fontWeight: '800', fontSize: '1rem'}}>{parcel.price}</p>
              </div>

              {/* Deskripsi */}
              <p style={{color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6}}>{parcel.desc}</p>

              {/* Isi Parcel Toggle */}
              <div>
                <button onClick={() => setExpandedId(expandedId === parcel.id ? null : parcel.id)}
                  style={{backgroundColor: 'transparent', border: 'none', color: '#1a5c2e', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                  {expandedId === parcel.id ? '▲' : '▼'} Lihat isi parcel
                </button>
                {expandedId === parcel.id && (
                  <div className="includes-list" style={{marginTop: '0.75rem', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '10px'}}>
                    {parcel.includes.map((item) => (
                      <div key={item} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <span style={{color: '#1a5c2e', fontWeight: '700', fontSize: '0.8rem'}}>✓</span>
                        <span style={{color: '#374151', fontSize: '0.82rem'}}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tombol */}
              <div style={{display: 'flex', gap: '0.5rem', marginTop: 'auto'}}>
                <a href={`https://wa.me/628123456789?text=Halo Healthila! 🌿%0ASaya tertarik dengan ${parcel.name} (${parcel.price})%0AMohon info ketersediaan dan detail pemesanan. Terima kasih!`}
                  target="_blank" rel="noopener noreferrer"
                  style={{flex: 1, backgroundColor: '#25D366', color: 'white', padding: '0.7rem 1rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', fontSize: '0.85rem', textAlign: 'center', display: 'block'}}>
                  📱 Pesan via WA
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CARA ORDER */}
      <section style={{backgroundColor: 'white', padding: '3rem 2rem', textAlign: 'center'}}>
        <h2 style={{fontWeight: '800', color: '#1a1a1a', fontSize: '1.5rem', marginBottom: '0.5rem'}}>Cara Pesan Parcel</h2>
        <p style={{color: '#6b7280', marginBottom: '2.5rem'}}>Mudah, cepat, dan aman</p>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', maxWidth: '700px', margin: '0 auto'}}>
          {[
            { num: '1', icon: '👆', text: 'Pilih parcel yang diinginkan' },
            { num: '2', icon: '💬', text: 'Chat WA — kami bantu konsultasi' },
            { num: '3', icon: '💳', text: 'Konfirmasi & pembayaran' },
            { num: '4', icon: '🚚', text: 'Parcel dikirim fresh ke tujuan' },
          ].map((step, i) => (
            <div key={step.num} style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <div style={{textAlign: 'center', minWidth: '120px'}}>
                <div style={{width: '56px', height: '56px', backgroundColor: '#1a5c2e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 0.5rem'}}>
                  {step.icon}
                </div>
                <p style={{fontWeight: '600', color: '#1a1a1a', fontSize: '0.85rem', lineHeight: 1.4}}>{step.text}</p>
              </div>
              {i < 3 && <div style={{color: '#1a5c2e', fontSize: '1.2rem', fontWeight: 'bold'}}>→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{backgroundColor: '#1a5c2e', padding: '3rem 2rem', textAlign: 'center'}}>
        <h2 style={{color: 'white', fontWeight: '800', fontSize: '1.5rem', marginBottom: '0.5rem'}}>
          Mau parcel yang lebih personal? 🎁
        </h2>
        <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem'}}>
          Kami bisa custom parcel sesuai tema, budget, dan kebutuhanmu
        </p>
        <a href="https://wa.me/628123456789?text=Halo Healthila! Saya mau konsultasi parcel custom 🎁"
          target="_blank" rel="noopener noreferrer"
          style={{backgroundColor: '#25D366', color: 'white', padding: '1rem 2.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'inline-block'}}>
          Konsultasi Parcel Custom
        </a>
      </section>
    </main>
  );
}