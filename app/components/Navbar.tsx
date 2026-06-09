export default function Navbar() {
  return (
    <nav style={{
      backgroundColor: '#1a5c2e',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        🌿 Healthila
      </div>

      {/* Menu */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
      }}>
        {['Beranda','Parcel','Jus & Dessert','Buah Segar','Artikel','Tentang','Kontak'].map((item) => (
          <a key={item} href="#" style={{
            color: 'rgba(255,255,255,0.85)',
            textDecoration: 'none',
            fontSize: '0.9rem',
          }}>
            {item}
          </a>
        ))}
      </div>

      {/* Tombol WA */}
      <a href="https://wa.me/628123321229"
        target="_blank"
        style={{
          backgroundColor: '#25D366',
          color: 'white',
          padding: '0.6rem 1.2rem',
          borderRadius: '999px',
          textDecoration: 'none',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        📱 Order via WA
      </a>
    </nav>
  );
}