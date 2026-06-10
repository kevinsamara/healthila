"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { parcels, getParcelById } from "../data";

export default function ParcelDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const parcel = getParcelById(id);
  const [selectedSize, setSelectedSize] = useState(0);
  const [note, setNote] = useState('');

  if (!parcel) {
    return (
      <main style={{backgroundColor: '#faf7f2', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem'}}>
        <div style={{fontSize: '4rem'}}>🔍</div>
        <h2 style={{color: '#1a1a1a', fontWeight: '700'}}>Parcel tidak ditemukan</h2>
        <a href="/parcel" style={{color: '#1a5c2e', fontWeight: '600', textDecoration: 'none'}}>Kembali ke Parcel →</a>
      </main>
    );
  }

  const selectedSizeLabel = parcel.sizeOptions[selectedSize].label;
  const selectedSizePrice = parcel.sizeOptions[selectedSize].price;
  const waMessage = `Halo Healthila! 🎁%0ASaya ingin memesan parcel:%0A%0ANama Parcel: ${parcel.name}%0APilihan: ${selectedSizeLabel}%0AHarga: ${selectedSizePrice}%0A${note ? `Catatan: ${note}%0A` : ''}%0AMohon konfirmasi ketersediaan dan detail pengiriman. Terima kasih!`;

  return (
    <main style={{backgroundColor: '#faf7f2', minHeight: '100vh'}}>
      <style>{`
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; max-width: 1000px; margin: 0 auto; padding: 3rem 2rem; }
        .size-btn { padding: 0.6rem 1.25rem; border-radius: 12px; border: 2px solid #1a5c2e; background: white; color: #1a5c2e; font-weight: 600; cursor: pointer; font-size: 0.85rem; text-align: left; transition: all 0.2s; }
        .size-btn.active { background: #1a5c2e; color: white; }
        .occasion-tag { background: #e8f5e9; color: #1a5c2e; padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; }
        .other-parcel { background: var(--bg); border-radius: 12px; padding: 1rem; text-decoration: none; display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 180px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: transform 0.2s; }
        .other-parcel:hover { transform: translateY(-2px); }
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr; gap: 1.5rem; padding: 1.5rem; }
        }
      `}</style>

      {/* BREADCRUMB */}
      <div style={{backgroundColor: 'white', padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: '#6b7280', flexWrap: 'wrap'}}>
          <a href="/" style={{color: '#1a5c2e', textDecoration: 'none'}}>Beranda</a>
          <span>›</span>
          <a href="/parcel" style={{color: '#1a5c2e', textDecoration: 'none'}}>Parcel</a>
          <span>›</span>
          <span style={{color: '#1a1a1a'}}>{parcel.name}</span>
        </div>
      </div>

      <div className="detail-grid">
        {/* KIRI — Visual & Isi */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
          {/* Icon Display */}
          <div style={{backgroundColor: parcel.bg, borderRadius: '24px', padding: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', position: 'relative'}}>
            {parcel.badge && (
              <div style={{position: 'absolute', top: '1rem', right: '1rem', backgroundColor: parcel.badgeColor, color: 'white', padding: '0.3rem 0.85rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700'}}>
                {parcel.badge}
              </div>
            )}
            {parcel.icon}
          </div>

          {/* Isi Parcel */}
          <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
            <h3 style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem', fontSize: '1rem'}}>
              🎁 Isi Parcel
            </h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              {parcel.includes.map((item) => (
                <div key={item} style={{display: 'flex', alignItems: 'flex-start', gap: '0.5rem'}}>
                  <span style={{color: '#25D366', fontWeight: '700', marginTop: '1px'}}>✓</span>
                  <span style={{color: '#374151', fontSize: '0.88rem', lineHeight: 1.5}}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cocok untuk */}
          <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
            <h3 style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem', fontSize: '1rem'}}>
              💝 Cocok untuk
            </h3>
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              {parcel.occasions.map((occ) => (
                <span key={occ} className="occasion-tag">{occ}</span>
              ))}
            </div>
          </div>
        </div>

        {/* KANAN — Info & Order */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          {/* Nama & Kategori */}
          <div>
            <span style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600'}}>
              {parcel.category}
            </span>
            <h1 style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: '#1a1a1a', marginTop: '0.75rem', marginBottom: '0.75rem'}}>
              {parcel.name}
            </h1>
            <p style={{color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.7}}>{parcel.longDesc}</p>
          </div>

          {/* Harga */}
          <div style={{backgroundColor: parcel.bg, borderRadius: '12px', padding: '1rem 1.25rem'}}>
            <p style={{color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.25rem'}}>Harga</p>
            <p style={{color: '#1a5c2e', fontWeight: '800', fontSize: '1.6rem'}}>{parcel.price}</p>
          </div>

          {/* Pilih Paket */}
          <div>
            <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.75rem'}}>Pilih Paket</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              {parcel.sizeOptions.map((opt, i) => (
                <button key={opt.label} onClick={() => setSelectedSize(i)}
                  className={`size-btn${selectedSize === i ? ' active' : ''}`}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span>{opt.label}</span>
                    <span style={{fontWeight: '800'}}>{opt.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Catatan/Pesan Personal */}
          <div>
            <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.5rem'}}>
              Pesan / Catatan (opsional)
            </p>
            <textarea
              placeholder="Contoh: Untuk ulang tahun mama, mohon tambahkan tulisan Happy Birthday di kartu..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                fontSize: '0.88rem',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Paket Terpilih */}
          <div style={{backgroundColor: '#e8f5e9', borderRadius: '12px', padding: '1rem 1.25rem'}}>
            <p style={{color: '#1a5c2e', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.25rem'}}>Paket yang dipilih:</p>
            <p style={{color: '#1a5c2e', fontWeight: '800', fontSize: '1.1rem'}}>{selectedSizeLabel}</p>
            <p style={{color: '#1a5c2e', fontWeight: '700'}}>{selectedSizePrice}</p>
          </div>

          {/* Tombol Order WA */}
          <a href={`https://wa.me/628123456789?text=${waMessage}`}
            target="_blank" rel="noopener noreferrer"
            style={{backgroundColor: '#25D366', color: 'white', padding: '1rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', textAlign: 'center', display: 'block'}}>
            📱 Pesan via WhatsApp
          </a>
          <p style={{color: '#6b7280', fontSize: '0.8rem', textAlign: 'center'}}>
            Pesan WA akan terisi otomatis dengan detail parcel dan catatanmu
          </p>

          {/* Catatan Penting */}
          <div style={{backgroundColor: '#fef3c7', borderRadius: '12px', padding: '1rem 1.25rem', border: '1px solid #fde68a'}}>
            <p style={{color: '#92400e', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.25rem'}}>📌 Catatan Penting</p>
            <p style={{color: '#92400e', fontSize: '0.82rem', lineHeight: 1.6}}>{parcel.notes}</p>
          </div>
        </div>
      </div>

      {/* PARCEL LAINNYA */}
      <section style={{backgroundColor: 'white', padding: '3rem 2rem'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
          <h2 style={{fontWeight: '800', color: '#1a1a1a', marginBottom: '1.5rem', fontSize: '1.3rem'}}>
            Parcel Lainnya
          </h2>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            {parcels.filter((p) => p.id !== parcel.id).slice(0, 4).map((p) => (
              <a key={p.id} href={`/parcel/detail?id=${p.id}`}
                style={{backgroundColor: p.bg, borderRadius: '12px', padding: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1', minWidth: '180px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
                <span style={{fontSize: '2rem'}}>{p.icon}</span>
                <div>
                  <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.85rem'}}>{p.name}</p>
                  <p style={{color: '#1a5c2e', fontWeight: '700', fontSize: '0.8rem'}}>{p.price}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}