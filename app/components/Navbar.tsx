"use client";
import { useState } from "react";
import CartIcon from "./CartIcon";

const menus = [
  { label: 'Beranda', href: '/' },
  { label: 'Parcel', href: '/parcel' },
  { label: 'Jus & Dessert', href: '/jus-dessert' },
  { label: 'Buah Segar', href: '/katalog' },
  { label: 'Artikel', href: '/artikel' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'Kontak', href: '/kontak' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{backgroundColor: '#1a5c2e', position: 'sticky', top: 0, zIndex: 100}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'}}>

        {/* Logo */}
        <a href="/" style={{color: 'white', fontSize: '1.4rem', fontWeight: '800', textDecoration: 'none', flexShrink: 0}}>
          🌿 Healthila
        </a>

        {/* Menu Desktop */}
        <div style={{display: 'flex', gap: '1.25rem', alignItems: 'center'}} className="desktop-menu">
          {menus.map((item) => (
            <a key={item.label} href={item.href}
              style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.88rem', whiteSpace: 'nowrap'}}>
              {item.label}
            </a>
          ))}
        </div>

        {/* Kanan: Cart + WA */}
        <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0}} className="desktop-menu">
          <CartIcon />
          <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer"
            style={{backgroundColor: '#25D366', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '999px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap'}}>
            📱 Order via WA
          </a>
        </div>

        {/* Hamburger Mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{display: 'none', backgroundColor: 'transparent', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer', padding: '0'}}
          className="mobile-menu-btn">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{backgroundColor: '#1a5c2e', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.5rem'}}>
          {menus.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
              style={{display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '1rem'}}>
              {item.label}
            </a>
          ))}
          <div style={{display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap'}}>
            <a href="/keranjang" style={{flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.7rem 1rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '600', textAlign: 'center'}}>
              🛒 Keranjang
            </a>
            <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer"
              style={{flex: 1, backgroundColor: '#25D366', color: 'white', padding: '0.7rem 1rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '600', textAlign: 'center'}}>
              📱 Order WA
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}