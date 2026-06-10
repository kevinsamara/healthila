"use client";
import { useState, useEffect } from "react";
import { getCartCount } from "../lib/cartStore";

export default function CartIcon() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCartCount());
    const handler = () => setCount(getCartCount());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  return (
    <a href="/keranjang" style={{
      position: 'relative',
      backgroundColor: 'rgba(255,255,255,0.15)',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '999px',
      textDecoration: 'none',
      fontSize: '0.9rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      border: '1px solid rgba(255,255,255,0.3)',
    }}>
      🛒
      {count > 0 && (
        <span style={{
          backgroundColor: '#f59e0b',
          color: 'white',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          fontWeight: '800',
          position: 'absolute',
          top: '-6px',
          right: '-6px',
        }}>
          {count > 99 ? '99+' : count}
        </span>
      )}
      Keranjang
    </a>
  );
}