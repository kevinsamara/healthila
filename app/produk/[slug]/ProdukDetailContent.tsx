"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Product = {
  id: number; nama: string; kategori: string; harga: number;
  harga_label: string; deskripsi: string; deskripsi_panjang: string;
  icon: string; foto_url: string; slug: string; tersedia: boolean;
};
type Varian = {
  id: number; produk_id: number; nama: string;
  harga: number; harga_label: string; tersedia: boolean;
};

const bgMap: Record<string, string> = {
  'Buah Segar': '#fff7ed', 'Buah Eksotis': '#faf5ff',
  'Jus & Dessert': '#f0fdf4', 'Parcel': '#fef3c7',
};

export default function ProdukDetailContent() {
  const params = useParams();
  const slug = params?.slug as string || '';
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Varian[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Varian | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      try {
        const { data, error } = await supabase.from('produk').select('*').eq('slug', slug).single();
        if (error) throw error;
        setProduct(data);
        if (data) {
          const { data: varianData } = await supabase.from('varian').select('*').eq('produk_id', data.id).eq('tersedia', true).order('harga', { ascending: true });
          if (varianData && varianData.length > 0) { setVariants(varianData); setSelectedVariant(varianData[0]); }
          const { data: rel } = await supabase.from('produk').select('*').eq('tersedia', true).neq('slug', slug).limit(4);
          setRelated(rel || []);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchProduct();
  }, [slug]);

  if (loading) return (
    <div style={{minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#faf7f2'}}>
      <div style={{textAlign: 'center'}}><div style={{fontSize: '3rem', marginBottom: '1rem'}}>🌿</div><p style={{color: '#1a5c2e', fontWeight: '600'}}>Memuat produk...</p></div>
    </div>
  );

  if (!product) return (
    <main style={{backgroundColor: '#faf7f2', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem'}}>
      <div style={{fontSize: '4rem'}}>🔍</div>
      <h2 style={{color: '#1a1a1a', fontWeight: '700'}}>Produk tidak ditemukan</h2>
      <a href="/katalog" style={{color: '#1a5c2e', fontWeight: '600', textDecoration: 'none'}}>Kembali ke Katalog →</a>
    </main>
  );

  const bg = bgMap[product.kategori] || '#f9fafb';
  const activeHarga = selectedVariant ? selectedVariant.harga : product.harga;
  const activeHargaLabel = selectedVariant ? selectedVariant.harga_label : product.harga_label;
  const totalPrice = (activeHarga * qty).toLocaleString('id-ID');
  const varianText = selectedVariant ? `%0AVarian: ${selectedVariant.nama}` : '';
  const waMessage = `Halo Healthila! 🌿%0ASaya ingin memesan:%0A%0AProduk: ${product.nama}${varianText}%0AJumlah: ${qty}%0ATotal: Rp ${totalPrice}%0A%0AMohon konfirmasi ketersediaan. Terima kasih!`;

  return (
    <main style={{backgroundColor: '#faf7f2', minHeight: '100vh'}}>
      <style>{`
        .detail-wrap { max-width: 1000px; margin: 0 auto; padding: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start; }
        .order-box { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.07); display: flex; flex-direction: column; gap: 1.25rem; }
        .varian-btn { padding: 0.65rem 1rem; border-radius: 10px; border: 2px solid #e5e7eb; background: white; cursor: pointer; text-align: left; transition: all 0.15s; width: 100%; }
        .varian-btn.active { border-color: #1a5c2e; background: #e8f5e9; }
        .varian-btn:hover { border-color: #1a5c2e; }
        .qty-btn { width: 40px; height: 40px; border-radius: 50%; font-size: 1.2rem; font-weight: 700; cursor: pointer; border: 2px solid #1a5c2e; }
        @media (max-width: 768px) { .detail-wrap { grid-template-columns: 1fr; padding: 1.25rem; gap: 1.5rem; } }
      `}</style>

      {/* BREADCRUMB */}
      <div style={{backgroundColor: 'white', padding: '0.9rem 2rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
          <a href="/" style={{color: '#1a5c2e', textDecoration: 'none'}}>Beranda</a>
          <span style={{color: '#9ca3af'}}>›</span>
          <a href="/katalog" style={{color: '#1a5c2e', textDecoration: 'none'}}>Katalog</a>
          <span style={{color: '#9ca3af'}}>›</span>
          <span style={{color: '#6b7280'}}>{product.nama}</span>
        </div>
      </div>

      <div className="detail-wrap">
        {/* KIRI */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
          <div style={{borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
            {product.foto_url ? (
              <img src={product.foto_url} alt={product.nama} style={{width: '100%', height: '300px', objectFit: 'cover', display: 'block'}} />
            ) : (
              <div style={{backgroundColor: bg, padding: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem', height: '280px'}}>{product.icon || '🍎'}</div>
            )}
          </div>

          <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)'}}>
            <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem', fontSize: '0.95rem'}}>📦 Info Produk</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.6rem'}}>
              {[
                { label: 'Kategori', value: product.kategori, badge: true },
                { label: 'Ketersediaan', value: '✓ Tersedia', color: '#25D366' },
                { label: 'Pengiriman', value: 'Same-day Malang' },
                ...(variants.length > 0 ? [{ label: 'Varian', value: `${variants.length} pilihan` }] : []),
              ].map((item, i, arr) => (
                <div key={item.label} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none', paddingBottom: i < arr.length - 1 ? '0.5rem' : '0'}}>
                  <span style={{color: '#6b7280', fontSize: '0.85rem'}}>{item.label}</span>
                  {item.badge ? (
                    <span style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.15rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600'}}>{item.value}</span>
                  ) : (
                    <span style={{color: item.color || '#1a1a1a', fontWeight: '600', fontSize: '0.85rem'}}>{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {product.deskripsi_panjang && (
            <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)'}}>
              <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.75rem', fontSize: '0.95rem'}}>📝 Deskripsi</p>
              <p style={{color: '#374151', fontSize: '0.88rem', lineHeight: 1.75, whiteSpace: 'pre-wrap'}}>{product.deskripsi_panjang}</p>
            </div>
          )}
        </div>

        {/* KANAN */}
        <div className="order-box">
          <div>
            <span style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600'}}>{product.kategori}</span>
            <h1 style={{fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: '800', color: '#1a1a1a', marginTop: '0.6rem', marginBottom: '0.4rem', lineHeight: 1.3}}>{product.nama}</h1>
            <p style={{color: '#6b7280', fontSize: '0.88rem', lineHeight: 1.6}}>{product.deskripsi}</p>
          </div>

          <div style={{backgroundColor: bg, borderRadius: '12px', padding: '1rem 1.25rem'}}>
            <p style={{color: '#6b7280', fontSize: '0.8rem', marginBottom: '0.2rem'}}>{selectedVariant ? `Harga — ${selectedVariant.nama}` : 'Harga'}</p>
            <p style={{color: '#1a5c2e', fontWeight: '800', fontSize: '1.9rem', lineHeight: 1}}>{activeHargaLabel}</p>
          </div>

          {/* VARIAN */}
          {variants.length > 0 && (
            <div>
              <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.75rem', fontSize: '0.95rem'}}>Pilih Varian</p>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                {variants.map((v) => (
                  <button key={v.id} onClick={() => setSelectedVariant(v)}
                    className={`varian-btn${selectedVariant?.id === v.id ? ' active' : ''}`}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.9rem', marginBottom: '0.1rem'}}>{v.nama}</p>
                        {selectedVariant?.id === v.id && <p style={{color: '#1a5c2e', fontSize: '0.75rem', fontWeight: '600'}}>✓ Dipilih</p>}
                      </div>
                      <p style={{color: '#1a5c2e', fontWeight: '800', fontSize: '0.95rem'}}>{v.harga_label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* JUMLAH */}
          <div>
            <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.6rem', fontSize: '0.95rem'}}>Jumlah</p>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="qty-btn" style={{backgroundColor: 'white', color: '#1a5c2e'}}>-</button>
              <span style={{fontSize: '1.3rem', fontWeight: '700', minWidth: '28px', textAlign: 'center'}}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="qty-btn" style={{backgroundColor: '#1a5c2e', color: 'white'}}>+</button>
            </div>
          </div>

          {/* TOTAL */}
          <div style={{backgroundColor: '#e8f5e9', borderRadius: '12px', padding: '0.9rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <p style={{color: '#1a5c2e', fontWeight: '600', fontSize: '0.85rem'}}>Total Estimasi</p>
              {selectedVariant && <p style={{color: '#6b7280', fontSize: '0.75rem'}}>{selectedVariant.nama} x {qty}</p>}
            </div>
            <span style={{color: '#1a5c2e', fontWeight: '800', fontSize: '1.25rem'}}>Rp {totalPrice}</span>
          </div>

          <a href={`https://wa.me/628123456789?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
            style={{backgroundColor: '#25D366', color: 'white', padding: '0.9rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem', textAlign: 'center', display: 'block'}}>
            📱 Order via WhatsApp
          </a>
          <p style={{color: '#9ca3af', fontSize: '0.78rem', textAlign: 'center', marginTop: '-0.5rem'}}>Pesan WA otomatis terisi nama, varian, jumlah & total</p>

          <div style={{borderTop: '1px solid #f3f4f6', paddingTop: '1rem'}}>
            <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.75rem', fontSize: '0.88rem'}}>Cara Order:</p>
            {['Pilih varian yang diinginkan', 'Klik tombol Order via WA', 'Konfirmasi pesanan dengan admin', 'Produk dikirim fresh ke kamu!'].map((step, i) => (
              <div key={i} style={{display: 'flex', gap: '0.6rem', marginBottom: '0.5rem', alignItems: 'flex-start'}}>
                <span style={{backgroundColor: '#1a5c2e', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', flexShrink: 0, marginTop: '1px'}}>{i + 1}</span>
                <span style={{color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.4}}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section style={{backgroundColor: 'white', padding: '2.5rem 2rem', marginTop: '1rem'}}>
          <div style={{maxWidth: '1000px', margin: '0 auto'}}>
            <h2 style={{fontWeight: '800', color: '#1a1a1a', marginBottom: '1.25rem', fontSize: '1.2rem'}}>Produk Lainnya 🌿</h2>
            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
              {related.map((p) => (
                <a key={p.id} href={`/produk/${p.slug || p.id}`}
                  style={{backgroundColor: bgMap[p.kategori] || '#f9fafb', borderRadius: '12px', padding: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1', minWidth: '180px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
                  {p.foto_url ? (
                    <img src={p.foto_url} alt={p.nama} style={{width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0}} />
                  ) : (
                    <span style={{fontSize: '2rem', flexShrink: 0}}>{p.icon || '🍎'}</span>
                  )}
                  <div>
                    <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.85rem', marginBottom: '0.2rem'}}>{p.nama}</p>
                    <p style={{color: '#1a5c2e', fontWeight: '700', fontSize: '0.82rem'}}>{p.harga_label}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}