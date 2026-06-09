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
  { num: '1', icon: '🛒', title: 'Pilih Produk', desc: 'Pilih produk favoritmu dari katalog kami' },
  { num: '2', icon: '💬', title: 'Chat via WA', desc: 'Konfirmasi dan konsultasi pesanan' },
  { num: '3', icon: '🚚', title: 'Terima & Nikmati', desc: 'Pesanan dikirim fresh setiap hari' },
];
const testimonials = [
  { name: 'Evi Asluti', city: 'Malang', stars: 5, text: 'Buahnya segar banget dan kemasannya cantik. Cocok banget buat kado!' },
  { name: 'Ari Pratama', city: 'Malang', stars: 5, text: 'Jus cold-pressed-nya enak, tidak ada rasa gula tambahan. Recommended!' },
  { name: 'Dian Safitri', city: 'Malang', stars: 5, text: 'Parcel buahnya elegan banget, teman-teman pada suka. Pasti order lagi!' },
];
const articles = [
  { tag: 'EDUKASI BUAH', title: '5 Manfaat Jus Lemon untuk Kesehatan Harian', date: '12 Mei 2024', icon: '🍋' },
  { tag: 'GIFTING', title: 'Tips Memilih Hamper Buah untuk Orang Tersayang', date: '10 Mei 2024', icon: '🧺' },
  { tag: 'GAYA HIDUP', title: 'Kenapa Cold-Pressed Lebih Baik dari Jus Biasa?', date: '8 Mei 2024', icon: '🥤' },
];

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section style={{background: 'linear-gradient(135deg, #1a5c2e 0%, #2d7a47 50%, #e8f5e9 100%)', minHeight: '90vh', display: 'flex', alignItems: 'center', padding: '4rem 6rem', overflow: 'hidden'}}>
        <div style={{flex: 1}}>
          <div style={{display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', marginBottom: '1.5rem'}}>
            Premium Fruit Store Malang
          </div>
          <h1 style={{fontSize: '3.5rem', fontWeight: '800', color: 'white', lineHeight: 1.2, marginBottom: '0.5rem'}}>Pengalaman Rasa</h1>
          <h1 style={{fontSize: '3.5rem', fontWeight: '800', color: '#86efac', lineHeight: 1.2, marginBottom: '1.5rem'}}>Alami. Segar.</h1>
          <p style={{color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '480px', marginBottom: '2rem'}}>
            Premium fruit, cold-pressed juice, hamper elegan dan dessert sehat, dikirim langsung ke pintumu.
          </p>
          <div style={{display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap'}}>
            {badges.map((item) => (
              <span key={item} style={{backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.3)'}}>
                {item}
              </span>
            ))}
          </div>
          <div style={{display: 'flex', gap: '1rem'}}>
            <a href="https://wa.me/628123321229" target="_blank" rel="noopener noreferrer" style={{backgroundColor: '#25D366', color: 'white', padding: '0.9rem 2rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem'}}>
              Order Sekarang via WA
            </a>
            <a href="#produk" style={{backgroundColor: 'transparent', color: 'white', padding: '0.9rem 2rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem', border: '2px solid white'}}>
              Lihat Produk
            </a>
          </div>
        </div>
        <div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{width: '400px', height: '400px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem'}}>
            🧺
          </div>
        </div>
      </section>

      {/* KATEGORI */}
      <section style={{backgroundColor: 'white', padding: '3rem 6rem', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'}}>
        {categories.map((cat) => (
          <a key={cat.label} href="#" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textDecoration: 'none'}}>
            <div style={{width: '80px', height: '80px', backgroundColor: '#e8f5e9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem'}}>
              {cat.icon}
            </div>
            <span style={{color: '#1a5c2e', fontWeight: '600', fontSize: '0.9rem'}}>{cat.label}</span>
          </a>
        ))}
      </section>

      {/* PRODUK UNGGULAN */}
      <section id="produk" style={{backgroundColor: '#faf7f2', padding: '4rem 6rem'}}>
        <div style={{textAlign: 'center', marginBottom: '2.5rem'}}>
          <h2 style={{fontSize: '2rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '0.5rem'}}>Produk Unggulan 🌿</h2>
          <p style={{color: '#6b7280'}}>Dipilih dengan teliti, disiapkan dengan standar premium</p>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '900px', margin: '0 auto'}}>
          {products.map((product) => (
            <div key={product.name} style={{backgroundColor: product.bg, borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize: '2.5rem', minWidth: '50px', textAlign: 'center'}}>{product.icon}</div>
              <div style={{flex: 1}}>
                <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.95rem', marginBottom: '0.25rem'}}>{product.name}</p>
                <p style={{color: '#1a5c2e', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.75rem'}}>{product.price}</p>
                <a href="https://wa.me/628123321229" target="_blank" rel="noopener noreferrer" style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.4rem 1rem', borderRadius: '999px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '600'}}>
                  Order via WA
                </a>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
          <a href="#" style={{color: '#1a5c2e', fontWeight: '600', textDecoration: 'none', fontSize: '1rem'}}>Lihat semua produk →</a>
        </div>
      </section>

      {/* CARA ORDER */}
      <section style={{backgroundColor: 'white', padding: '4rem 6rem', textAlign: 'center'}}>
        <h2 style={{fontSize: '2rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '0.5rem'}}>Cara Order</h2>
        <p style={{color: '#6b7280', marginBottom: '3rem'}}>3 langkah mudah</p>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'}}>
          {steps.map((step, i) => (
            <div key={step.num} style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{textAlign: 'center', maxWidth: '160px'}}>
                <div style={{width: '64px', height: '64px', backgroundColor: '#1a5c2e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 1rem'}}>
                  {step.icon}
                </div>
                <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.25rem'}}>{step.title}</p>
                <p style={{color: '#6b7280', fontSize: '0.85rem'}}>{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div style={{color: '#1a5c2e', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0.5rem'}}>→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONI */}
      <section style={{backgroundColor: '#faf7f2', padding: '4rem 6rem', textAlign: 'center'}}>
        <h2 style={{fontSize: '2rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '0.5rem'}}>Kata Mereka</h2>
        <p style={{color: '#6b7280', marginBottom: '3rem'}}>Kirim sehat, bukan sekadar hadiah</p>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '900px', margin: '0 auto'}}>
          {testimonials.map((t) => (
            <div key={t.name} style={{backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', textAlign: 'left', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
              <div style={{color: '#f59e0b', fontSize: '1.1rem', marginBottom: '0.75rem'}}>★★★★★</div>
              <p style={{color: '#374151', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem', fontStyle: 'italic'}}>
                {t.text}
              </p>
              <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.9rem'}}>{t.name}</p>
              <p style={{color: '#6b7280', fontSize: '0.8rem'}}>{t.city}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ARTIKEL */}
      <section style={{backgroundColor: 'white', padding: '4rem 6rem', textAlign: 'center'}}>
        <h2 style={{fontSize: '2rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '0.5rem'}}>Artikel Edukasi</h2>
        <p style={{color: '#6b7280', marginBottom: '3rem'}}>Tips hidup sehat dari Healthila</p>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '900px', margin: '0 auto'}}>
          {articles.map((art) => (
            <a key={art.title} href="#" style={{textDecoration: 'none', textAlign: 'left'}}>
              <div style={{backgroundColor: '#f0fdf4', borderRadius: '16px', padding: '1.5rem', height: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>{art.icon}</div>
                <span style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600'}}>
                  {art.tag}
                </span>
                <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.95rem', marginTop: '0.75rem', marginBottom: '0.5rem', lineHeight: 1.4}}>
                  {art.title}
                </p>
                <p style={{color: '#6b7280', fontSize: '0.8rem'}}>{art.date}</p>
                <p style={{color: '#1a5c2e', fontWeight: '600', fontSize: '0.85rem', marginTop: '0.75rem'}}>Baca Selengkapnya →</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA WHATSAPP */}
      <section style={{backgroundColor: '#1a5c2e', padding: '4rem 6rem', textAlign: 'center'}}>
        <h2 style={{fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '0.75rem'}}>Siap Hidup Lebih Sehat? 🌿</h2>
        <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', fontSize: '1rem'}}>
          Order sekarang dan rasakan perbedaan buah premium Healthila
        </p>
        <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" style={{backgroundColor: '#25D366', color: 'white', padding: '1rem 2.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'inline-block'}}>
          Chat WhatsApp Sekarang
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{backgroundColor: '#0f3d1e', padding: '3rem 6rem', color: 'rgba(255,255,255,0.7)'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '2rem'}}>
          <div>
            <h3 style={{color: 'white', fontWeight: '800', fontSize: '1.2rem', marginBottom: '0.5rem'}}>🌿 Healthila</h3>
            <p style={{fontSize: '0.85rem', lineHeight: 1.6}}>Fruitful heart, mindful treat.</p>
            <p style={{fontSize: '0.85rem', marginTop: '0.5rem'}}>@healthila.id</p>
          </div>
          <div>
            <h4 style={{color: 'white', fontWeight: '700', marginBottom: '1rem'}}>Menu</h4>
            {['Beranda', 'Parcel', 'Jus & Dessert', 'Buah Segar', 'Produk Lokal', 'Artikel'].map((item) => (
              <p key={item} style={{fontSize: '0.85rem', marginBottom: '0.4rem'}}>{item}</p>
            ))}
          </div>
          <div>
            <h4 style={{color: 'white', fontWeight: '700', marginBottom: '1rem'}}>Informasi</h4>
            {['Tentang Kami', 'FAQ', 'Disclaimer', 'Kebijakan Privasi'].map((item) => (
              <p key={item} style={{fontSize: '0.85rem', marginBottom: '0.4rem'}}>{item}</p>
            ))}
          </div>
          <div>
            <h4 style={{color: 'white', fontWeight: '700', marginBottom: '1rem'}}>Kontak</h4>
            <p style={{fontSize: '0.85rem', marginBottom: '0.4rem'}}>📍 Jl. Tidar Tengah No.15, Malang</p>
            <p style={{fontSize: '0.85rem', marginBottom: '0.4rem'}}>📱 +62 812-3321-229</p>
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