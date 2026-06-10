"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Product = {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  harga_label: string;
  deskripsi: string;
  deskripsi_panjang: string;
  icon: string;
  foto_url: string;
  slug: string;
  tersedia: boolean;
};

const bgMap: Record<string, string> = {
  'Buah Segar': '#fff7ed',
  'Buah Eksotis': '#faf5ff',
  'Jus & Dessert': '#f0fdf4',
  'Parcel': '#fef3c7',
};

export default function ProdukDetailContent() {
  const params = useParams();
  const slug = params?.slug as string || '';
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from('produk')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setProduct(data);

        if (data) {
          const { data: relatedData } = await supabase
            .from('produk')
            .select('*')
            .eq('tersedia', true)
            .neq('slug', slug)
            .limit(4);
          setRelated(relatedData || []);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#faf7f2'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🌿</div>
          <p style={{color: '#1a5c2e', fontWeight: '600'}}>Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <main style={{backgroundColor: '#faf7f2', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem'}}>
        <div style={{fontSize: '4rem'}}>🔍</div>
        <h2 style={{color: '#1a1a1a', fontWeight: '700'}}>Produk tidak ditemukan</h2>
        <a href="/katalog" style={{color: '#1a5c2e', fontWeight: '600', textDecoration: 'none'}}>Kembali ke Katalog →</a>
      </main>
    );
  }

  const bg = bgMap[product.kategori] || '#f9fafb';
  const totalPrice = (product.harga * qty).toLocaleString('id-ID');
  const waMessage = `Halo Healthila! 🌿%0ASaya ingin memesan:%0A%0AProduk: ${product.nama}%0AJumlah: ${qty}%0ATotal: Rp ${totalPrice}%0A%0AMohon konfirmasi ketersediaan. Terima kasih!`;

  return (
    <main style={{backgroundColor: '#faf7f2', minHeight: '100vh'}}>
      <style>{`
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; max-width: 1000px; margin: 0 auto; padding: 3rem 2rem; }
        @media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; gap: 1.5rem; padding: 1.5rem; } }
      `}</style>

      {/* BREADCRUMB */}
      <div style={{backgroundColor: 'white', padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '0.5rem', fontSize: '0.85rem', flexWrap: 'wrap'}}>
          <a href="/" style={{color: '#1a5c2e', textDecoration: 'none'}}>Beranda</a>
          <span style={{color: '#6b7280'}}>›</span>
          <a href="/katalog" style={{color: '#1a5c2e', textDecoration: 'none'}}>Katalog</a>
          <span style={{color: '#6b7280'}}>›</span>
          <span style={{color: '#1a1a1a'}}>{product.nama}</span>
        </div>
      </div>

      <div className="detail-grid">
        {/* KIRI */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
          <div style={{backgroundColor: bg, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
            {product.foto_url ? (
              <img src={product.foto_url} alt={product.nama}
                style={{width: '100%', height: '320px', objectFit: 'cover'}} />
            ) : (
              <div style={{padding: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10rem', minHeight: '280px'}}>
                {product.icon || '🍎'}
              </div>
            )}
          </div>

          <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
            <h3 style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.75rem', fontSize: '0.95rem'}}>📦 Info Produk</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              {[
                { label: 'Kategori', value: product.kategori },
                { label: 'Ketersediaan', value: '✓ Tersedia', color: '#25D366' },
                { label: 'Pengiriman', value: 'Same-day Malang' },
              ].map((item) => (
                <div key={item.label} style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#6b7280', fontSize: '0.85rem'}}>{item.label}</span>
                  <span style={{fontWeight: '600', color: item.color || '#1a1a1a', fontSize: '0.85rem'}}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KANAN */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div>
            <span style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600'}}>
              {product.kategori}
            </span>
            <h1 style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: '#1a1a1a', marginTop: '0.75rem', marginBottom: '0.5rem'}}>
              {product.nama}
            </h1>
            <p style={{color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6}}>{product.deskripsi}</p>
          </div>

          {product.deskripsi_panjang && (
            <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
              <p style={{color: '#374151', fontSize: '0.9rem', lineHeight: 1.7}}>{product.deskripsi_panjang}</p>
            </div>
          )}

          <div style={{backgroundColor: bg, borderRadius: '12px', padding: '1rem 1.25rem'}}>
            <p style={{color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.25rem'}}>Harga</p>
            <p style={{color: '#1a5c2e', fontWeight: '800', fontSize: '2rem'}}>{product.harga_label}</p>
          </div>

          <div>
            <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.75rem'}}>Jumlah</p>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}
                style={{width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #1a5c2e', backgroundColor: 'white', color: '#1a5c2e', fontSize: '1.3rem', fontWeight: '700', cursor: 'pointer'}}>
                -
              </button>
              <span style={{fontSize: '1.3rem', fontWeight: '700', minWidth: '30px', textAlign: 'center'}}>{qty}</span>
              <button onClick={() => setQty(qty + 1)}
                style={{width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #1a5c2e', backgroundColor: '#1a5c2e', color: 'white', fontSize: '1.3rem', fontWeight: '700', cursor: 'pointer'}}>
                +
              </button>
            </div>
          </div>

          <div style={{backgroundColor: '#e8f5e9', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{color: '#1a5c2e', fontWeight: '600'}}>Total Estimasi</span>
            <span style={{color: '#1a5c2e', fontWeight: '800', fontSize: '1.3rem'}}>Rp {totalPrice}</span>
          </div>

          <a href={`https://wa.me/628123456789?text=${waMessage}`}
            target="_blank" rel="noopener noreferrer"
            style={{backgroundColor: '#25D366', color: 'white', padding: '1rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', textAlign: 'center', display: 'block'}}>
            📱 Order via WhatsApp
          </a>
          <p style={{color: '#6b7280', fontSize: '0.8rem', textAlign: 'center'}}>
            Pesan WA otomatis terisi nama produk, jumlah & total harga
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section style={{backgroundColor: 'white', padding: '3rem 2rem'}}>
          <div style={{maxWidth: '1000px', margin: '0 auto'}}>
            <h2 style={{fontWeight: '800', color: '#1a1a1a', marginBottom: '1.5rem', fontSize: '1.3rem'}}>Produk Lainnya</h2>
            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
              {related.map((p) => (
                <a key={p.id} href={`/produk/${p.slug || p.id}`}
                  style={{backgroundColor: bgMap[p.kategori] || '#f9fafb', borderRadius: '12px', padding: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1', minWidth: '180px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
                  {p.foto_url ? (
                    <img src={p.foto_url} alt={p.nama} style={{width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover'}} />
                  ) : (
                    <span style={{fontSize: '2rem'}}>{p.icon || '🍎'}</span>
                  )}
                  <div>
                    <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.85rem'}}>{p.nama}</p>
                    <p style={{color: '#1a5c2e', fontWeight: '700', fontSize: '0.85rem'}}>{p.harga_label}</p>
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