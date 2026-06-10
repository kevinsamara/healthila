"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const parcels = [
  { id: 'parcel-segar-s', icon: '🧺', name: 'Parcel Buah Segar S', category: 'Buah Segar', price: 'Mulai Rp 120.000', bg: '#fff7ed', badge: 'Terlaris', badgeColor: '#f59e0b', longDesc: 'Parcel buah segar ukuran Small cocok untuk berbagai kesempatan. Berisi 5 jenis buah pilihan yang segar dan berkualitas, dikemas dalam keranjang anyaman cantik dengan ribbon elegan.', includes: ['Jeruk Pontianak 500gr', 'Mangga Harum Manis 500gr', 'Apel Fuji 3 buah', 'Anggur Merah 250gr', 'Pir Hijau 2 buah', 'Keranjang anyaman', 'Ribbon & kartu ucapan'], sizeOptions: [{ label: 'Small (5 buah)', price: 'Rp 120.000' }, { label: 'Custom isi', price: 'Hubungi kami' }], occasions: ['Ulang tahun', 'Pernikahan', 'Arisan', 'Hampers biasa'], notes: 'Ketersediaan buah menyesuaikan musim. Kami akan konfirmasi substitusi jika ada.' },
  { id: 'parcel-segar-m', icon: '🧺', name: 'Parcel Buah Segar M', category: 'Buah Segar', price: 'Mulai Rp 220.000', bg: '#fff7ed', badge: null, badgeColor: '', longDesc: 'Parcel buah segar ukuran Medium adalah pilihan paling populer. Berisi 8 jenis buah pilihan yang segar dan berkualitas tinggi, dikemas dalam keranjang anyaman premium.', includes: ['Jeruk Pontianak 500gr', 'Mangga Harum Manis 500gr', 'Strawberry 250gr', 'Anggur Merah 250gr', 'Pir Hijau 2 buah', 'Apel Fuji 3 buah', 'Kiwi 3 buah', 'Melon 1 buah', 'Keranjang premium', 'Ribbon & kartu ucapan'], sizeOptions: [{ label: 'Medium (8 buah)', price: 'Rp 220.000' }, { label: 'Custom isi', price: 'Hubungi kami' }], occasions: ['Ulang tahun', 'Wisuda', 'Pernikahan', 'Get well soon'], notes: 'Tersedia same-day delivery untuk wilayah Malang kota.' },
  { id: 'parcel-segar-l', icon: '🧺', name: 'Parcel Buah Segar L', category: 'Buah Segar', price: 'Mulai Rp 380.000', bg: '#fff7ed', badge: 'Premium', badgeColor: '#1a5c2e', longDesc: 'Parcel buah segar ukuran Large adalah pilihan mewah untuk kesan yang tak terlupakan. Berisi 12 jenis buah premium dalam keranjang besar elegan.', includes: ['12 buah pilihan premium', 'Keranjang anyaman besar', 'Ribbon eksklusif', 'Kartu ucapan premium', 'Wrapping cantik', 'Bisa request buah tertentu'], sizeOptions: [{ label: 'Large (12 buah)', price: 'Rp 380.000' }, { label: 'Extra Large (15 buah)', price: 'Rp 480.000' }, { label: 'Custom isi', price: 'Hubungi kami' }], occasions: ['Anniversary', 'Pernikahan', 'Corporate gift', 'Ulang tahun spesial'], notes: 'Untuk pemesanan corporate (10+ parcel) tersedia diskon khusus.' },
  { id: 'parcel-eksotis', icon: '🍇', name: 'Parcel Buah Eksotis', category: 'Buah Eksotis', price: 'Mulai Rp 350.000', bg: '#faf5ff', badge: 'Eksklusif', badgeColor: '#7c3aed', longDesc: 'Parcel Buah Eksotis menghadirkan koleksi buah-buahan premium import yang langka dan mewah. Setiap buah dipilih dengan teliti untuk memastikan kualitas terbaik.', includes: ['Shine Muscat Import 500gr', 'Persik Import 3 buah', 'Blueberry Fresh 250gr', 'Strawberry Premium 250gr', 'Anggur Hijau Seedless 250gr', 'Keranjang premium', 'Ribbon eksklusif'], sizeOptions: [{ label: 'Standard (5 buah eksotis)', price: 'Rp 350.000' }, { label: 'Premium (7 buah eksotis)', price: 'Rp 550.000' }, { label: 'Custom isi', price: 'Hubungi kami' }], occasions: ['Hadiah mewah', 'Anniversary', 'Corporate gift', 'Ulang tahun spesial'], notes: 'Ketersediaan buah import terbatas. Disarankan pesan H-2 untuk memastikan stok.' },
  { id: 'parcel-ultah', icon: '🎂', name: 'Parcel Ulang Tahun', category: 'Ulang Tahun', price: 'Mulai Rp 280.000', bg: '#fef3c7', badge: 'Spesial', badgeColor: '#f59e0b', longDesc: 'Parcel Ulang Tahun Healthila hadir untuk membuat hari spesialmu semakin berkesan. Kombinasi buah premium dengan dekorasi ulang tahun yang meriah.', includes: ['8 buah pilihan premium', 'Dekorasi balon mini', 'Kartu ucapan HBD custom', 'Ribbon warna-warni', 'Box premium', 'Bisa tambah jus cold-pressed'], sizeOptions: [{ label: 'Standard (8 buah)', price: 'Rp 280.000' }, { label: 'Premium (12 buah)', price: 'Rp 420.000' }, { label: 'Custom isi', price: 'Hubungi kami' }], occasions: ['Ulang tahun anak', 'Ulang tahun dewasa', 'Sweet 17', 'Milestone birthday'], notes: 'Bisa tambahkan nama dan pesan personal di kartu ucapan. Gratis!' },
  { id: 'parcel-getwellsoon', icon: '💚', name: 'Parcel Get Well Soon', category: 'Get Well Soon', price: 'Mulai Rp 200.000', bg: '#f0fdf4', badge: 'Menyehatkan', badgeColor: '#1a5c2e', longDesc: 'Parcel Get Well Soon dirancang khusus untuk mendukung pemulihan orang yang kita sayangi. Berisi buah-buahan tinggi vitamin C dan antioksidan.', includes: ['Jeruk Vitamin C tinggi 1kg', 'Jus Cold-Pressed 2 botol', 'Madu alami 1 botol', 'Apel Fuji 3 buah', 'Kiwi 3 buah', 'Kartu ucapan hangat'], sizeOptions: [{ label: 'Basic (buah + jus)', price: 'Rp 200.000' }, { label: 'Complete (+ madu & suplemen)', price: 'Rp 320.000' }, { label: 'Custom isi', price: 'Hubungi kami' }], occasions: ['Sakit', 'Pasca operasi', 'Pemulihan', 'Doa kesembuhan'], notes: 'Tersedia pengiriman ke rumah sakit. Hubungi kami untuk konfirmasi.' },
  { id: 'parcel-lebaran', icon: '🌙', name: 'Parcel Lebaran Premium', category: 'Lebaran', price: 'Mulai Rp 320.000', bg: '#fef3c7', badge: 'Edisi Lebaran', badgeColor: '#d97706', longDesc: 'Parcel Lebaran Premium Healthila hadir untuk mempererat silaturahmi di momen Idul Fitri. Dikemas cantik dengan nuansa Islami yang elegan.', includes: ['Kurma premium 500gr', 'Buah segar 6 jenis', 'Kemasan nuansa Lebaran', 'Kartu ucapan Idul Fitri', 'Ribbon emas', 'Box premium'], sizeOptions: [{ label: 'Standard (6 buah + kurma)', price: 'Rp 320.000' }, { label: 'Premium (10 buah + kurma)', price: 'Rp 500.000' }, { label: 'Corporate (min. 10 pcs)', price: 'Hubungi kami' }], occasions: ['Idul Fitri', 'Idul Adha', 'Silaturahmi', 'Hampers kantor'], notes: 'Pemesanan Lebaran dibuka 2 minggu sebelum hari H. Stok terbatas!' },
  { id: 'parcel-bunga-hampers', icon: '💐', name: 'Parcel Bunga & Hampers', category: 'Bunga & Hampers', price: 'Mulai Rp 400.000', bg: '#fdf2f8', badge: 'Romantis', badgeColor: '#db2777', longDesc: 'Parcel Bunga & Hampers adalah hadiah paling romantis dan berkesan. Kombinasi sempurna antara rangkaian bunga segar yang indah dan buah-buahan eksotis premium.', includes: ['Rangkaian bunga segar (10-15 tangkai)', 'Buah eksotis 4 jenis', 'Box hampers premium', 'Pita satin', 'Kartu ucapan eksklusif', 'Bisa custom warna bunga'], sizeOptions: [{ label: 'Romantic (bunga + 4 buah)', price: 'Rp 400.000' }, { label: 'Grand (bunga besar + 6 buah)', price: 'Rp 650.000' }, { label: 'Custom tema', price: 'Hubungi kami' }], occasions: ['Valentine', 'Anniversary', 'Pernikahan', 'Wisuda', 'Ulang tahun'], notes: 'Jenis bunga menyesuaikan ketersediaan. Bisa request warna tema tertentu.' },
  { id: 'parcel-coldpressed', icon: '🥤', name: 'Hampers Cold-Pressed', category: 'Cold-Pressed', price: 'Mulai Rp 250.000', bg: '#f0fdf4', badge: 'Healthy', badgeColor: '#059669', longDesc: 'Hampers Cold-Pressed adalah hadiah gaya hidup sehat yang paling trendi. Berisi botol-botol jus cold-pressed premium tanpa gula tambahan dan tanpa pengawet.', includes: ['6 botol jus cold-pressed (350ml)', 'Berbagai rasa', 'Tanpa gula tambahan', 'Tanpa pengawet', 'Box premium', 'Kartu edukasi gizi'], sizeOptions: [{ label: 'Mini (3 botol)', price: 'Rp 150.000' }, { label: 'Standard (6 botol)', price: 'Rp 250.000' }, { label: 'Premium (12 botol)', price: 'Rp 450.000' }], occasions: ['Hadiah sehat', 'Detox program', 'Corporate wellness', 'Ulang tahun'], notes: 'Cold-pressed harus disimpan dalam kulkas. Ketahanan 3-5 hari setelah diproduksi.' },
  { id: 'fruit-cake-semangka', icon: '🍉', name: 'Fruit Cake Semangka', category: 'Fruit Cake', price: 'Mulai Rp 180.000', bg: '#fff1f2', badge: 'Unik', badgeColor: '#e11d48', longDesc: 'Fruit Cake Semangka adalah kreasi unik dan sehat dari Healthila. Dibuat dari semangka segar utuh yang dibentuk layaknya kue, lalu didekorasi dengan berbagai buah-buahan segar warna-warni.', includes: ['Semangka segar 5-7kg', 'Dekorasi strawberry & kiwi', 'Blueberry & anggur', 'Topping mangga', 'Tanpa tepung & gula tambahan', 'Box cantik'], sizeOptions: [{ label: 'Small (semangka 3kg)', price: 'Rp 180.000' }, { label: 'Medium (semangka 5kg)', price: 'Rp 250.000' }, { label: 'Large (semangka 7kg)', price: 'Rp 350.000' }], occasions: ['Ulang tahun anak', 'Baby shower', 'Acara sehat', 'Gathering'], notes: 'Fruit cake dibuat fresh dan harus segera dikonsumsi pada hari yang sama.' },
  { id: 'parcel-custom', icon: '✨', name: 'Parcel Custom', category: 'Custom', price: 'Harga sesuai request', bg: '#e8f5e9', badge: 'Custom', badgeColor: '#1a5c2e', longDesc: 'Dengan layanan Parcel Custom Healthila, kamu bisa menentukan sendiri isi, kemasan, tema, dan dekorasi parcelmu. Tim kami siap membantu mewujudkan parcel impianmu.', includes: ['Buah sesuai pilihan kamu', 'Kemasan custom sesuai tema', 'Dekorasi sesuai request', 'Kartu ucapan personal', 'Bisa antar ke lokasi', 'Konsultasi gratis'], sizeOptions: [{ label: 'Budget Rp 100rb - 200rb', price: 'Hubungi kami' }, { label: 'Budget Rp 200rb - 500rb', price: 'Hubungi kami' }, { label: 'Budget lebih dari Rp 500rb', price: 'Hubungi kami' }], occasions: ['Semua kesempatan', 'Corporate order', 'Wedding favor', 'Event khusus'], notes: 'Untuk pemesanan custom, minimal H-3 sebelum tanggal dibutuhkan.' },
];

export default function ParcelDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const parcel = parcels.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState(0);
  const [note, setNote] = useState('');

  if (!parcel) {
    return (
      <main style={{backgroundColor: '#faf7f2', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem'}}>
        <div style={{fontSize: '4rem'}}>🔍</div>
        <h2 style={{color: '#1a1a1a', fontWeight: '700'}}>Parcel tidak ditemukan</h2>
        <a href="/parcel" style={{color: '#1a5c2e', fontWeight: '600', textDecoration: 'none'}}>Kembali ke Parcel</a>
      </main>
    );
  }

  const waMessage = `Halo Healthila! 🎁%0ASaya ingin memesan:%0A%0ANama: ${parcel.name}%0APilihan: ${parcel.sizeOptions[selectedSize].label}%0AHarga: ${parcel.sizeOptions[selectedSize].price}%0A${note ? `Catatan: ${note}%0A` : ''}%0AMohon konfirmasi. Terima kasih!`;

  return (
    <main style={{backgroundColor: '#faf7f2', minHeight: '100vh'}}>
      <style>{`
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; max-width: 1000px; margin: 0 auto; padding: 3rem 2rem; }
        .size-btn { width: 100%; padding: 0.6rem 1.25rem; border-radius: 12px; border: 2px solid #1a5c2e; background: white; color: #1a5c2e; font-weight: 600; cursor: pointer; font-size: 0.85rem; display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
        .size-btn.active { background: #1a5c2e; color: white; }
        @media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; gap: 1.5rem; padding: 1.5rem; } }
      `}</style>

      <div style={{backgroundColor: 'white', padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '0.5rem', fontSize: '0.85rem', flexWrap: 'wrap'}}>
          <a href="/" style={{color: '#1a5c2e', textDecoration: 'none'}}>Beranda</a>
          <span style={{color: '#6b7280'}}>›</span>
          <a href="/parcel" style={{color: '#1a5c2e', textDecoration: 'none'}}>Parcel</a>
          <span style={{color: '#6b7280'}}>›</span>
          <span style={{color: '#1a1a1a'}}>{parcel.name}</span>
        </div>
      </div>

      <div className="detail-grid">
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
          <div style={{backgroundColor: parcel.bg, borderRadius: '24px', padding: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', position: 'relative'}}>
            {parcel.badge && (
              <div style={{position: 'absolute', top: '1rem', right: '1rem', backgroundColor: parcel.badgeColor, color: 'white', padding: '0.3rem 0.85rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700'}}>
                {parcel.badge}
              </div>
            )}
            {parcel.icon}
          </div>
          <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
            <h3 style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem'}}>🎁 Isi Parcel</h3>
            {parcel.includes.map((item) => (
              <div key={item} style={{display: 'flex', gap: '0.5rem', marginBottom: '0.4rem'}}>
                <span style={{color: '#25D366', fontWeight: '700'}}>✓</span>
                <span style={{color: '#374151', fontSize: '0.88rem'}}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
            <h3 style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem'}}>💝 Cocok untuk</h3>
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              {parcel.occasions.map((occ) => (
                <span key={occ} style={{backgroundColor: '#e8f5e9', color: '#1a5c2e', padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '600'}}>
                  {occ}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div>
            <span style={{backgroundColor: '#1a5c2e', color: 'white', padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600'}}>
              {parcel.category}
            </span>
            <h1 style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: '#1a1a1a', marginTop: '0.75rem', marginBottom: '0.75rem'}}>
              {parcel.name}
            </h1>
            <p style={{color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.7}}>{parcel.longDesc}</p>
          </div>
          <div style={{backgroundColor: parcel.bg, borderRadius: '12px', padding: '1rem 1.25rem'}}>
            <p style={{color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.25rem'}}>Harga</p>
            <p style={{color: '#1a5c2e', fontWeight: '800', fontSize: '1.6rem'}}>{parcel.price}</p>
          </div>
          <div>
            <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.75rem'}}>Pilih Paket</p>
            {parcel.sizeOptions.map((opt, i) => (
              <button key={opt.label} onClick={() => setSelectedSize(i)}
                className={`size-btn${selectedSize === i ? ' active' : ''}`}>
                <span>{opt.label}</span>
                <span style={{fontWeight: '800'}}>{opt.price}</span>
              </button>
            ))}
          </div>
          <div>
            <p style={{fontWeight: '700', color: '#1a1a1a', marginBottom: '0.5rem'}}>Pesan / Catatan (opsional)</p>
            <textarea placeholder="Contoh: Untuk ulang tahun mama, tolong tulis Happy Birthday di kartu..." value={note} onChange={(e) => setNote(e.target.value)} rows={3}
              style={{width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '2px solid #e5e7eb', fontSize: '0.88rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
          </div>
          <div style={{backgroundColor: '#e8f5e9', borderRadius: '12px', padding: '1rem 1.25rem'}}>
            <p style={{color: '#1a5c2e', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.25rem'}}>Paket dipilih:</p>
            <p style={{color: '#1a5c2e', fontWeight: '800', fontSize: '1.1rem'}}>{parcel.sizeOptions[selectedSize].label}</p>
            <p style={{color: '#1a5c2e', fontWeight: '700'}}>{parcel.sizeOptions[selectedSize].price}</p>
          </div>
          <a href={`https://wa.me/628123456789?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
            style={{backgroundColor: '#25D366', color: 'white', padding: '1rem', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', textAlign: 'center', display: 'block'}}>
            Pesan via WhatsApp
          </a>
          <p style={{color: '#6b7280', fontSize: '0.8rem', textAlign: 'center'}}>Pesan WA akan terisi otomatis dengan detail parcelmu</p>
          <div style={{backgroundColor: '#fef3c7', borderRadius: '12px', padding: '1rem 1.25rem', border: '1px solid #fde68a'}}>
            <p style={{color: '#92400e', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.25rem'}}>Catatan Penting</p>
            <p style={{color: '#92400e', fontSize: '0.82rem', lineHeight: 1.6}}>{parcel.notes}</p>
          </div>
        </div>
      </div>

      <section style={{backgroundColor: 'white', padding: '3rem 2rem'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
          <h2 style={{fontWeight: '800', color: '#1a1a1a', marginBottom: '1.5rem', fontSize: '1.3rem'}}>Parcel Lainnya</h2>
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