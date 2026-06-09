"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { products, getProductById } from "../data";

export default function DetailProduk() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const product = getProductById(id);

  const [selectedWeight, setSelectedWeight] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <main style={{backgroundColor: '#faf7f2', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem'}}>
        <div style={{fontSize: '4rem'}}>🔍</div>
        <h2 style={{color: '#1a1a1a', fontWeight: '700'}}>Produk tidak ditemukan</h2>
        <a href="/katalog" style={{color: '#1a5c2e', fontWeight: '600', textDecoration: 'none'}}>Kembali ke Katalog →</a>
      </main>
    );
  }

  const totalPrice = (product.price * qty).toLocaleString('id-ID');
  const waMessage = `Halo Healthila! 🌿%0ASaya ingin memesan:%0A%0AProduk: ${product.name}%0AUkuran: ${product.weightOptions[selectedWeight]}%0AJumlah: ${qty} ${product.unit}%0ATotal: Rp ${totalPrice}%0A%0AMohon konfirmasi ketersediaan. Terima kasih!`;

  return (
    <main style={{backgroundColor: '#faf7f2', minHeight: '100vh'}}>
      <style>{`
        .detail-container { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; max-width: 1000px; margin: 0 auto; padding: 3rem 2rem; }
        .weight-btn { padding: 0.5rem 1.25rem; border-radius: 999px; border: 2px solid #1a5c2e; background: white; color: #1a5c2e; font-weight: 600; cursor: pointer; font-size: 0.9rem; }
        .weight-btn.active { background: #1a5c2e; color: white; }
        .nutrition-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        @media (max-width: 768px) {
          .detail-container { grid-template-columns: 1fr; gap: 1.5rem; padding: 1.5rem; }
          .nutrition-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* BREADCRUMB */}
      <div style={{backgroundColor: 'white', padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: '#6b7280'}}>
          <a href="/" style={{color: '#1a5c2e', textDecoration: 'none'}}>Beranda</a>
          <span>›</span>
          <a href="/katalog" style={{color: '#1a5c2e', textDecoration: 'none'}}>Katalog</a>
          <span>›</span>
          <span style={{color: '#1a1a1a'}}>{product.name}</span>
        </div>
      </div>

      <div className="detail-container">
        {/* KIRI — Gambar/Icon */}
        <div>
          <div style={{
            backgroundColor: product.bg,
            borderRadius: '24px',
            padding: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10rem',
            marginBottom: '1rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            {product.icon}
          </div>
          {/* Manfaat */}
          <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
            <h3 style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem', fontSize: '1rem'}}>Manfaat Produk</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              {product.benefits.map((b) => (
                <div key={b} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <span style={{color: '#1a5c2e', fontWeight: '700'}}>✓</span>
                  <span style={{color: '#374151', fontSize: '0.9rem'}}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KANAN — Info & Order */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          {/* Kategori & Nama */}
          <div>
            <span style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600'}}>
              {product.category}
            </span>
            <h1 style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: '#1a1a1a', marginTop: '0.75rem', marginBottom: '0.5rem'}}>
              {product.name}
            </h1>
            <p style={{color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.7}}>{product.longDesc}</p>
          </div>

          {/* Harga */}
          <div style={{backgroundColor: product.bg, borderRadius: '12px', padding: '1rem 1.25rem'}}>
            <p style={{color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.25rem'}}>Harga mulai dari</p>
            <p style={{color: '#1a5c2e', fontWeight: '800', fontSize: '1.8rem'}}>{product.priceLabel}</p>
            <p style={{color: '#6b7280', fontSize: '0.8rem'}}>per {product.unit}</p>
          </div>

          {/* Pilih Ukuran/Berat */}
          <div>
            <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.75rem'}}>Pilih Ukuran</p>
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              {product.weightOptions.map((w, i) => (
                <button key={w} onClick={() => setSelectedWeight(i)}
                  className={`weight-btn${selectedWeight === i ? ' active' : ''}`}>
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Pilih Jumlah */}
          <div>
            <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.75rem'}}>Jumlah</p>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}
                style={{width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #1a5c2e', backgroundColor: 'white', color: '#1a5c2e', fontSize: '1.2rem', fontWeight: '700', cursor: 'pointer'}}>
                -
              </button>
              <span style={{fontSize: '1.2rem', fontWeight: '700', minWidth: '30px', textAlign: 'center'}}>{qty}</span>
              <button onClick={() => setQty(qty + 1)}
                style={{width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #1a5c2e', backgroundColor: '#1a5c2e', color: 'white', fontSize: '1.2rem', fontWeight: '700', cursor: 'pointer'}}>
                +
              </button>
              <span style={{color: '#6b7280', fontSize: '0.9rem'}}>{product.weightOptions[selectedWeight]}</span>
            </div>
          </div>

          {/* Total */}
          <div style={{backgroundColor: '#e8f5e9', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{color: '#1a5c2e', fontWeight: '600'}}>Total Estimasi</span>
            <span style={{color: '#1a5c2e', fontWeight: '800', fontSize: '1.3rem'}}>Rp {totalPrice}</span>
          </div>

          {/* Tombol Order WA */}
          <a href={`https://wa.me/628123456789?text=${waMessage}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              backgroundColor: '#25D366',
              color: 'white',
              padding: '1rem',
              borderRadius: '999px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '1.1rem',
              textAlign: 'center',
              display: 'block',
            }}>
            📱 Order via WhatsApp
          </a>
          <p style={{color: '#6b7280', fontSize: '0.8rem', textAlign: 'center'}}>
            Kamu akan diarahkan ke WhatsApp dengan pesan yang sudah terisi otomatis
          </p>

          {/* Nutrisi */}
          <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
            <h3 style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem'}}>Informasi Nutrisi</h3>
            <div className="nutrition-grid">
              {product.nutrition.map((n) => (
                <div key={n.label} style={{backgroundColor: '#faf7f2', borderRadius: '8px', padding: '0.75rem'}}>
                  <p style={{color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.25rem'}}>{n.label}</p>
                  <p style={{color: '#1a1a1a', fontWeight: '700', fontSize: '0.9rem'}}>{n.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PRODUK LAINNYA */}
      <section style={{backgroundColor: 'white', padding: '3rem 2rem'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
          <h2 style={{fontWeight: '800', color: '#1a1a1a', marginBottom: '1.5rem', fontSize: '1.3rem'}}>Produk Lainnya</h2>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            {products.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
              <a key={p.id} href={`/produk/detail?id=${p.id}`}
                style={{
                  backgroundColor: p.bg,
                  borderRadius: '12px',
                  padding: '1rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flex: '1',
                  minWidth: '200px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                <span style={{fontSize: '2rem'}}>{p.icon}</span>
                <div>
                  <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.85rem'}}>{p.name}</p>
                  <p style={{color: '#1a5c2e', fontWeight: '700', fontSize: '0.85rem'}}>{p.priceLabel}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}