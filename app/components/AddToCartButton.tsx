"use client";
import { useState } from "react";
import { addToCart } from "../lib/cartStore";

type Props = {
  produkId: number;
  nama: string;
  varian: string | null;
  harga: number;
  hargaLabel: string;
  qty: number;
  foto: string;
  icon: string;
};

export default function AddToCartButton({ produkId, nama, varian, harga, hargaLabel, qty, foto, icon }: Props) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart({ produkId, nama, varian, harga, hargaLabel, qty, foto, icon });
    window.dispatchEvent(new Event('cart-updated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button onClick={handleAdd} style={{
      backgroundColor: added ? '#1a5c2e' : 'white',
      color: added ? 'white' : '#1a5c2e',
      padding: '0.9rem 1rem',
      borderRadius: '999px',
      border: '2px solid #1a5c2e',
      fontWeight: '700',
      fontSize: '1rem',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    }}>
      {added ? '✓ Ditambahkan!' : '🛒 Tambah ke Keranjang'}
    </button>
  );
}