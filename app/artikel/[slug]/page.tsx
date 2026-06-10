import { Suspense } from "react";
import ArtikelContent from "./ArtikelContent";

export default function ArtikelDetailPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#faf7f2'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📖</div>
          <p style={{color: '#1a5c2e', fontWeight: '600'}}>Memuat artikel...</p>
        </div>
      </div>
    }>
      <ArtikelContent />
    </Suspense>
  );
}