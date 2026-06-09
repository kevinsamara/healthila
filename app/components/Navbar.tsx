"use client";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menus = ['Beranda','Parcel','Jus & Dessert','Buah Segar','Artikel','Tentang','Kontak'];

  return (
    <nav style={{backgroundColor: '#1a5c2e', position: 'sticky', top: 0, zIndex: 100}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        
        {/* Logo */}
        <div style={{color: 'white', fontSize: '1.4rem', fontWeight: '800'}}>
          🌿 Healthila
        </div>

        {/* Menu Desktop */}
        <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}} className="desktop-menu">
          {menus.map((item) => (
            <a key={item} href="#" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem'}}>
              {item}
            </a>
          ))}
        </div>

        {/* Tombol WA Desktop */}
        <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer"
          style={{backgroundColor: '#25D366', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '999px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold'}}
          className="desktop-menu">
          📱 Order via WA
        </a>

        {/* Hamburger Mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{display: 'none', backgroundColor: 'transparent', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer', padding: '0'}}
          className="mobile-menu-btn">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Dropdown Mobile */}
      {menuOpen && (
        <div style={{backgroundColor: '#1a5c2e', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.5rem'}} className="mobile-dropdown">
          {menus.map((item) => (
            <a key={item} href="#" onClick={() => setMenuOpen(false)}
              style={{display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '1rem'}}>
              {item}
            </a>
          ))}
          <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer"
            style={{display: 'block', backgroundColor: '#25D366', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 'bold', textAlign: 'center', marginTop: '1rem'}}>
            📱 Order via WA
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}