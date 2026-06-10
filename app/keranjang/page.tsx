"use client";
import { useState, useEffect } from "react";
import { CartItem, getCart, updateQty, removeFromCart, clearCart } from "../lib/cartStore";

export default function KeranjangPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [catatan, setCatatan] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getCart());
    const handler = () => setItems(getCart());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  function handleQty(id: string, qty: number) {
    setItems(updateQty(id, qty));
    window.dispatchEvent(new Event('cart-updated'));
  }

  function handleRemove(id: string) {
    setItems(removeFromCart(id));
    window.dispatchEvent(new Event('cart-updated'));
  }

  function handleClear() {
    if (confirm('Kosongkan semua keranjang?')) {
      clearCart();
      setItems([]);
      window.dispatchEvent(new Event('cart-updated'));
    }
  }

  const total = items.reduce((sum, item) => sum + item.harga * item.qty, 0);
  const totalLabel = total.toLocaleString('id-ID');

  function buildWAMessage() {
    const lines = items.map(item =>
      `• ${item.nama}${item.varian ? ` (${item.varian})` : ''} x${item.qty} = ${(item.harga * item.qty).toLocaleString('id-ID')}`
    ).join('%0A');
    const info = nama ? `%0A%0ANama: ${nama}` : '';
    const alamatInfo = alamat ? `%0AAlamat: ${alamat}` : '';
    const catatanInfo = catatan ? `%0ACatatan: ${catatan}` : '';
    return `Halo Healthila! 🌿%0ASaya ingin memesan:%0A%0A${lines}%0A%0ATotal: Rp ${totalLabel}${info}${alamatInfo}${catatanInfo}%0A%0AMohon konfirmasi. Terima kasih!`;
  }

  if (!mounted) return null;

  return (
    <main style={{backgroundColor: '#faf7f2', minHeight: '100vh'}}>
      <style>{`
        .cart-wrap { max-width: 1000px; margin: 0 auto; padding: 2rem; display: grid; grid-template-columns: 1fr 380px; gap: 2rem; align-items: start; }
        .qty-btn { width: 34px; height: 34px; border-radius: '50%'; font-size: '1rem'; font-weight: 700; cursor: pointer; border: 2px solid #1a5c2e; background: white; color: #1a5c2e; border-radius: 50%; }
        .input-field { width: 100%; padding: 0.7rem 1rem; border-radius: 10px; border: 2px solid #e5e7eb; font-size: 0.9rem; outline: none; font-family: inherit; box-sizing: border-box; }
        .input-field:focus { border-color: #1a5c2e; }
        @media (max-width: 768px) { .cart-wrap { grid-template-columns: 1fr; padding: 1.25rem; } }
      `}</style>

      {/* HEADER */}
      <div style={{backgroundColor: '#1a5c2e', padding: '2rem', textAlign: 'center'}}>
        <h1 style={{color: 'white', fontWeight: '800', fontSize: '1.8rem', marginBottom: '0.25rem'}}>
          🛒 Keranjang Belanja
        </h1>
        <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem'}}>
          {items.length === 0 ? 'Keranjang kosong' : `${items.reduce((s, i) => s + i.qty, 0)} item dalam keranjang`}
        </p>
      </div>

      {items.length === 0 ? (
        <div style={{textAlign: 'center', padding: '5rem 2rem'}}>
          <div style={{fontSize: '5rem', marginBottom: '1.5rem'}}>🛒</div>
          <h2 style={{color: '#1a1a1a', fontWeight: '700', marginBottom: '0.5rem'}}>Keranjang Masih Kosong</h2>
          <p style={{color: '#6b7280', marginBottom: '2rem'}}>Yuk mulai belanja produk Healthila!</p>
          <a href="/katalog" style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.9rem 2rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem'}}>
            Lihat Katalog
          </a>
        </div>
      ) : (
        <div className="cart-wrap">

          {/* KIRI — Daftar Item */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2 style={{fontWeight: '800', color: '#1a1a1a', fontSize: '1.1rem'}}>
                Produk dipilih ({items.length})
              </h2>
              <button onClick={handleClear} style={{backgroundColor: 'transparent', border: 'none', color: '#ef4444', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer'}}>
                Kosongkan semua
              </button>
            </div>

            {items.map((item) => (
              <div key={item.id} style={{backgroundColor: 'white', borderRadius: '16px', padding: '1.25rem', display: 'flex', gap: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', alignItems: 'center'}}>
                {/* Foto/Icon */}
                <div style={{width: '72px', height: '72px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {item.foto ? (
                    <img src={item.foto} alt={item.nama} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    <span style={{fontSize: '2rem'}}>{item.icon || '🍎'}</span>
                  )}
                </div>

                {/* Info */}
                <div style={{flex: 1, minWidth: 0}}>
                  <p style={{fontWeight: '700', color: '#1a1a1a', fontSize: '0.95rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                    {item.nama}
                  </p>
                  {item.varian && (
                    <span style={{backgroundColor: '#e8f5e9', color: '#1a5c2e', padding: '0.1rem 0.5rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '600'}}>
                      {item.varian}
                    </span>
                  )}
                  <p style={{color: '#1a5c2e', fontWeight: '700', fontSize: '0.9rem', marginTop: '0.3rem'}}>
                    {item.hargaLabel}
                  </p>
                </div>

                {/* Qty & Hapus */}
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <button onClick={() => handleQty(item.id, item.qty - 1)} className="qty-btn">-</button>
                    <span style={{fontWeight: '700', minWidth: '24px', textAlign: 'center'}}>{item.qty}</span>
                    <button onClick={() => handleQty(item.id, item.qty + 1)} className="qty-btn" style={{backgroundColor: '#1a5c2e', color: 'white', border: '2px solid #1a5c2e'}}>+</button>
                  </div>
                  <p style={{color: '#1a5c2e', fontWeight: '800', fontSize: '0.9rem'}}>
                    Rp {(item.harga * item.qty).toLocaleString('id-ID')}
                  </p>
                  <button onClick={() => handleRemove(item.id)} style={{backgroundColor: 'transparent', border: 'none', color: '#9ca3af', fontSize: '0.78rem', cursor: 'pointer'}}>
                    🗑 Hapus
                  </button>
                </div>
              </div>
            ))}

            <a href="/katalog" style={{color: '#1a5c2e', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
              ← Tambah produk lagi
            </a>
          </div>

          {/* KANAN — Summary & Checkout */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '1rem'}}>

            {/* Form info pengiriman */}
            <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)'}}>
              <h3 style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem', fontSize: '1rem'}}>
                📋 Info Pengiriman
              </h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                <div>
                  <label style={{display: 'block', color: '#6b7280', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.3rem'}}>
                    Nama Pemesan
                  </label>
                  <input type="text" placeholder="Contoh: Budi Santoso"
                    value={nama} onChange={(e) => setNama(e.target.value)}
                    className="input-field" />
                </div>
                <div>
                  <label style={{display: 'block', color: '#6b7280', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.3rem'}}>
                    Alamat Pengiriman
                  </label>
                  <textarea placeholder="Contoh: Jl. Soekarno Hatta No. 5, Malang"
                    value={alamat} onChange={(e) => setAlamat(e.target.value)}
                    rows={2} className="input-field" style={{resize: 'none'}} />
                </div>
                <div>
                  <label style={{display: 'block', color: '#6b7280', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.3rem'}}>
                    Catatan (opsional)
                  </label>
                  <input type="text" placeholder="Contoh: Tolong dikemas rapi"
                    value={catatan} onChange={(e) => setCatatan(e.target.value)}
                    className="input-field" />
                </div>
              </div>
            </div>

            {/* Ringkasan */}
            <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)'}}>
              <h3 style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem', fontSize: '1rem'}}>
                🧾 Ringkasan Pesanan
              </h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem'}}>
                {items.map((item) => (
                  <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem'}}>
                    <span style={{color: '#6b7280', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '0.5rem'}}>
                      {item.nama}{item.varian ? ` (${item.varian})` : ''} x{item.qty}
                    </span>
                    <span style={{color: '#1a1a1a', fontWeight: '600', flexShrink: 0}}>
                      Rp {(item.harga * item.qty).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{borderTop: '2px solid #e8f5e9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontWeight: '700', color: '#1a1a1a'}}>Total</span>
                <span style={{fontWeight: '800', color: '#1a5c2e', fontSize: '1.2rem'}}>Rp {totalLabel}</span>
              </div>
              <p style={{color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem'}}>
                *Ongkir dikonfirmasi via WA
              </p>
            </div>

            {/* Tombol Order WA */}
            <a href={`https://wa.me/628123456789?text=${buildWAMessage()}`}
              target="_blank" rel="noopener noreferrer"
              style={{backgroundColor: '#25D366', color: 'white', padding: '1rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem', textAlign: 'center', display: 'block'}}>
              📱 Order via WhatsApp
            </a>
            <p style={{color: '#9ca3af', fontSize: '0.78rem', textAlign: 'center'}}>
              Semua item akan dikirim dalam 1 pesan WA
            </p>

            {/* Tombol Payment (coming soon) */}
            <button disabled style={{backgroundColor: '#f3f4f6', color: '#9ca3af', padding: '0.9rem', borderRadius: '999px', border: 'none', fontWeight: '700', fontSize: '0.95rem', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'}}>
              💳 Bayar Online
              <span style={{backgroundColor: '#e5e7eb', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem'}}>Segera Hadir</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}