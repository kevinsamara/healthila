import { Suspense } from "react";
import DetailContent from "./DetailContent";

export default function DetailProduk() {
  return (
    <Suspense fallback={
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#faf7f2'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🌿</div>
          <p style={{color: '#1a5c2e', fontWeight: '600'}}>Memuat produk...</p>
        </div>
      </div>
    }>
      <DetailContent />
    </Suspense>
  );
}