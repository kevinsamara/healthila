import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = { title: "Kontak" };

export default function ContactPage() {
  return (
    <ContentPage title="Hubungi Kami" intro="Tim kami siap membantu pemesanan, parcel custom, maupun pertanyaan lainnya.">
      <div className="not-prose grid gap-4 sm:grid-cols-2">
        <a
          href={waLink("Halo Healthila")}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl bg-leaf-700 p-6 text-white hover:bg-leaf-900"
        >
          <p className="text-sm text-leaf-100">WhatsApp</p>
          <p className="mt-1 text-xl font-bold">{site.whatsappDisplay}</p>
        </a>
        <a
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl bg-white p-6 ring-1 ring-leaf-100 hover:ring-leaf-200"
        >
          <p className="text-sm text-muted">Instagram</p>
          <p className="mt-1 text-xl font-bold text-ink">@healthila.id</p>
        </a>
      </div>
      <a
        href={site.googleMaps}
        target="_blank"
        rel="noopener noreferrer"
        className="not-prose mt-4 block rounded-2xl bg-white p-6 ring-1 ring-leaf-100 hover:ring-leaf-200"
      >
        <p className="text-sm text-muted">Lokasi toko</p>
        <p className="mt-1 text-xl font-bold text-ink">Buka di Google Maps →</p>
      </a>
      {/* TODO: alamat toko & jam buka — menunggu data dari owner */}
    </ContentPage>
  );
}
