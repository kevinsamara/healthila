const badges = ['Buah Segar Pilihan', 'Tanpa Pengawet', 'Dikemas Higienis', 'Pengiriman Cepat'];
const categories = [
  { icon: '🧺', label: 'Parcel' },
  { icon: '🥤', label: 'Jus & Dessert' },
  { icon: '🍊', label: 'Buah Segar' },
  { icon: '🍇', label: 'Buah Eksotis' },
  { icon: '🌿', label: 'Produk Lokal' },
];
const products = [
  { icon: '🍊', name: 'Jeruk Pontianak', price: 'Rp 45.000', bg: '#fff7ed' },
  { icon: '🍓', name: 'Strawberry Premium', price: 'Rp 65.000', bg: '#fff1f2' },
  { icon: '🥭', name: 'Mangga Harum Manis', price: 'Rp 55.000', bg: '#fffbeb' },
  { icon: '🍇', name: 'Shine Muscat Import', price: 'Rp 120.000', bg: '#faf5ff' },
  { icon: '🧃', name: 'Jus Cold-Pressed', price: 'Rp 35.000', bg: '#f0fdf4' },
  { icon: '🧺', name: 'Hamper Kesehatan', price: 'Rp 250.000', bg: '#fef3c7' },
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
const articles = [
  { tag: 'EDUKASI BUAH', title: '5 Manfaat Jus Lemon untuk Kesehatan Harian', date: '12 Mei 2024', icon: '🍋' },
  { tag: 'GIFTING', title: 'Tips Memilih Hamper Buah untuk Orang Tersayang', date: '10 Mei 2024', icon: '🧺' },
  { tag: 'GAYA HIDUP', title: 'Kenapa Cold-Pressed Lebih Baik dari Jus Biasa?', date: '8 Mei 2024', icon: '🥤' },
];

export default function Home() {
  return (
    <main>
      <style>{`
        .hero-section {
          background: linear-gradient(135deg, #1a5c2e 0%, #2d7a47 50%, #e8f5e9 100%);
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding: 4rem 6rem;
          overflow: hidden;
        }
        .hero-text { flex: 1; }
        .hero-image { flex: 1; display: flex; justify-content: center; align-items: center; }
        .hero-circle {
          width: 400px; height: 400px;
          background-color: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 8rem;
        }
        .hero-buttons { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-wa {
          background-color: #25D366; color: white;
          padding: 0.9rem 2rem; border-radius: 999px;
          text-decoration: none; font-weight: bold; font-size: 1rem;
        }
        .btn-outline {
          background-color: transparent; color: white;
          padding: 0.9rem 2rem; border-radius: 999px;
          text-decoration: none; font-weight: bold; font-size: 1rem;
          border: 2px solid white;
        }
        .categories-section {
          background-color: white; padding: 3rem 6rem;
          display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .products-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem; max-width: 900px; margin: 0 auto;
        }
        .steps-container { display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 900px; margin: 0 auto; }
        .articles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 900px; margin: 0 auto; }
        .footer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; margin-bottom: 2rem; }
        .section-pad { padding: 4rem 6rem; }

        @media (max-width: 1024px) {
          .hero-section { padding: 3rem 3rem; }
          .categories-section { padding: 2rem 3rem; gap: 2rem; }
          .section-pad { padding: 3rem 3rem; }
          .footer-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .hero-section { flex-direction: column; padding: 2rem 1.5rem; min-height: auto; text-align: center; }
          .hero-image { display: none; }
          .hero-circle { width: 200px; height: 200px; font-size: 4rem; }
          .hero-buttons { justify-content: center; }
          .categories-section { padding: 2rem 1.5rem; gap: 1rem; }
          .products-grid { grid-template-columns: 1fr; max-width: 100%; }
          .steps-container { flex-direction: column; gap: 0.5rem; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .articles-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; }
          .section-pad { padding: 3rem 1.5rem; }
          .step-arrow { display: none; }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
          .articles-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-text">
          <div style={{display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', marginBottom: '1.5rem'}}>
            Premium Fruit Store Malang
          </div>
          <h1 style={{fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', color: 'white', lineHeight: 1.2, marginBottom: '0.5rem'}}>
            Pengalaman Rasa
          </h1>
          <h1 style={{fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', color: '#86efac', lineHeight: 1.2, marginBottom: '1.5rem'}}>
            Alami. Segar.
          </h1>
          <p style={{color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', lineHeight: 1.7, maxWidth: '480px', marginBottom: '2rem'}}>
            Premium fruit, cold-pressed juice, hamper elegan dan dessert sehat, dikirim langsung ke pintumu.
          </p>
          <div style={{display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'inherit'}}>
            {badges.map((item) => (
              <span key={item} style={{backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.3)'}}>
                {item}
              </span>
            ))}
          </div>
          <div className="hero-buttons">
            <a href="https://wa.me/628123321229" target="_blank" rel="noopener noreferrer" className="btn-wa">
              Order Sekarang via WA
            </a>
            <a href="#produk" className="btn-outline">Lihat Produk</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-circle">🧺</div>
        </div>
      </section>

      {/* KATEGORI */}
      <section className="categories-section">
        {categories.map((cat) => (
          <a key={cat.label} href="#" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textDecoration: 'none'}}>
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
          {products.map((product) => (
            <div key={product.name} style={{backgroundColor: product.bg, borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize: '2.2rem', minWidth: '45px', textAlign: 'center'}}>{product.icon}</div>
              <div style={{flex: 1}}>
                <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.9rem', marginBottom: '0.2rem'}}>{product.name}</p>
                <p style={{color: '#1a5c2e', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.6rem'}}>{product.price}</p>
                <a href="https://wa.me/628123321229" target="_blank" rel="noopener noreferrer" style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.35rem 0.9rem', borderRadius: '999px', textDecoration: 'none', fontSize: '0.78rem', fontWeight: '600'}}>
                  Order via WA
                </a>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
          <a href="#" style={{color: '#1a5c2e', fontWeight: '600', textDecoration: 'none'}}>Lihat semua produk →</a>
        </div>
      </section>

      {/* CARA ORDER */}
      <section className="section-pad" style={{backgroundColor: 'white', textAlign: 'center'}}>
        <h2 style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: '#1a1a1a', marginBottom: '0.5rem'}}>Cara Order</h2>
        <p style={{color: '#6b7280', marginBottom: '3rem'}}>3 langkah mudah</p>
        <div className="steps-container">
          {steps.map((step, i) => (
            <div key={step.title} style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{textAlign: 'center', maxWidth: '160px'}}>
                <div style={{width: '64px', height: '64px', backgroundColor: '#1a5c2e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 1rem'}}>
                  {step.icon}
                </div>
                <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.25rem'}}>{step.title}</p>
                <p style={{color: '#6b7280', fontSize: '0.85rem'}}>{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="step-arrow" style={{color: '#1a5c2e', fontSize: '1.5rem', fontWeight: 'bold'}}>→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONI */}
      <section className="section-pad" style={{backgroundColor: '#faf7f2', textAlign: 'center'}}>
        <h2 style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: '#1a1a1a', marginBottom: '0.5rem'}}>Kata Mereka</h2>
        <p style={{color: '#6b7280', marginBottom: '3rem'}}>Kirim sehat, bukan sekadar hadiah</p>
        <div className="testimonials-grid">
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
          {articles.map((art) => (
            <a key={art.title} href="#" style={{textDecoration: 'none', textAlign: 'left'}}>
              <div style={{backgroundColor: '#f0fdf4', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>{art.icon}</div>
                <span style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600'}}>
                  {art.tag}
                </span>
                <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.95rem', marginTop: '0.75rem', marginBottom: '0.5rem', lineHeight: 1.4}}>{art.title}</p>
                <p style={{color: '#6b7280', fontSize: '0.8rem'}}>{art.date}</p>
                <p style={{color: '#1a5c2e', fontWeight: '600', fontSize: '0.85rem', marginTop: '0.75rem'}}>Baca Selengkapnya →</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA WA */}
      <section className="section-pad" style={{backgroundColor: '#1a5c2e', textAlign: 'center'}}>
        <h2 style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: 'white', marginBottom: '0.75rem'}}>Siap Hidup Lebih Sehat? 🌿</h2>
        <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '2rem'}}>Order sekarang dan rasakan perbedaan buah premium Healthila</p>
        <a href="https://wa.me/628123321229" target="_blank" rel="noopener noreferrer" style={{backgroundColor: '#25D366', color: 'white', padding: '1rem 2.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'inline-block'}}>
          Chat WhatsApp Sekarang
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{backgroundColor: '#0f3d1e', padding: '3rem 6rem', color: 'rgba(255,255,255,0.7)'}}>
        <div className="footer-grid">
          <div>
            <h3 style={{color: 'white', fontWeight: '800', fontSize: '1.2rem', marginBottom: '0.5rem'}}>🌿 Healthila</h3>
            <p style={{fontSize: '0.85rem', lineHeight: 1.6}}>Fruitful heart, mindful treat.</p>
            <p style={{fontSize: '0.85rem', marginTop: '0.5rem'}}>@healthila.id</p>
          </div>
          <div>
            <h4 style={{color: 'white', fontWeight: '700', marginBottom: '1rem'}}>Menu</h4>
            {['Beranda','Parcel','Jus & Dessert','Buah Segar','Produk Lokal','Artikel'].map((item) => (
              <p key={item} style={{fontSize: '0.85rem', marginBottom: '0.4rem'}}>{item}</p>
            ))}
          </div>
            <h4 style={{color: 'white', fontWeight: '700', marginBottom: '1rem'}}>Informasi</h4>
            {['Tentang Kami','FAQ','Disclaimer','Kebijakan Privasi'].map((item) => (
              <p key={item} style={{fontSize: '0.85rem', marginBottom: '0.4rem'}}>{item}</p>
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
          © 2024 Healthila. All rights reserved.
        </div>
      </footer>
    </main>
  );
}