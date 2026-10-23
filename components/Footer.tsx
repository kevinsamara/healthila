import Link from "next/link";
import { site, waLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 bg-leaf-900 text-leaf-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xl font-extrabold text-white">Healthila</p>
          <p className="mt-1 text-sm text-lime-300">{site.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-leaf-200">
            Toko buah & parcel buah di Malang. Buah segar, hampers, jus & dessert — delivery se-Malang, konfirmasi lewat WhatsApp.
          </p>
        </div>
        <FooterCol
          title="Belanja"
          links={[
            { href: "/buah-segar", label: "Buah Segar" },
            { href: "/jus-dessert", label: "Jus & Dessert" },
            { href: "/parcel", label: "Parcel & Hampers" },
            { href: "/lainnya", label: "Lainnya" },
            { href: "/katalog", label: "Semua Produk" },
            { href: "/langganan", label: "Langganan Buah" },
            { href: "/acara", label: "Buah untuk Acara" },
            { href: "/korporat", label: "Pesanan Korporat" },
          ]}
        />
        <FooterCol
          title="Informasi"
          links={[
            { href: "/tentang", label: "Tentang Kami" },
            { href: "/artikel", label: "Artikel" },
            { href: "/garansi", label: "Garansi" },
            { href: "/faq", label: "FAQ" },
            { href: "/syarat-ketentuan", label: "Syarat & Ketentuan" },
            { href: "/kebijakan-privasi", label: "Kebijakan Privasi" },
          ]}
        />
        <div>
          <p className="text-sm font-semibold text-white">Hubungi Kami</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp {site.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Instagram @healthila.id
              </a>
            </li>
            <li>
              <Link href="/kontak" className="hover:text-white">
                Lokasi & jam buka
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-leaf-200">
        © {new Date().getFullYear()} Healthila. Semua hak dilindungi.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
