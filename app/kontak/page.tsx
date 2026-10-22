import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/WhatsAppFab";
import { getGoogleReviews } from "@/lib/google-reviews";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lokasi Toko Buah Healthila Malang",
  description: "Alamat, jam buka & peta toko buah Healthila di Malang. Pesan via WhatsApp atau datang langsung.",
};

export const revalidate = 3600;

// Google's weekdayDescriptions start on Monday. Use WIB, not the server's UTC.
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const todayIndex = () =>
  DAYS.indexOf(new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "Asia/Jakarta" }).format(new Date()));

export default async function KontakPage() {
  // Address & opening hours come from the Google Maps listing (same lookup as the reviews).
  const place = await getGoogleReviews();
  const today = todayIndex();

  return (
    <>
      <section className="bg-leaf-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <h1 className="text-5xl font-extrabold sm:text-6xl">Hubungi Kami</h1>
          <p className="mt-3 max-w-xl text-lg text-leaf-100">
            Tim kami siap membantu pemesanan, parcel custom, maupun pertanyaan lainnya.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="space-y-4">
          <a
            href={waLink("Halo Healthila")}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-3xl bg-[#25D366] p-6 text-white shadow-sm transition hover:brightness-95"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
              <WhatsAppIcon className="h-7 w-7" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-white/85">WhatsApp — pesan & tanya</span>
              <span className="block text-2xl font-bold text-white">{site.whatsappDisplay}</span>
            </span>
            <span className="ml-auto text-2xl transition group-hover:translate-x-1">→</span>
          </a>

          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:ring-plum-500"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white">
              <InstagramIcon />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-muted">Instagram</span>
              <span className="block text-2xl font-bold text-ink">@healthila.id</span>
            </span>
            <span className="ml-auto text-2xl text-muted transition group-hover:translate-x-1">→</span>
          </a>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="flex items-center gap-2 text-sm font-medium text-muted">
              📍 Lokasi toko
            </p>
            <p className="mt-2 text-lg font-semibold text-ink">
              {place?.address ?? "Healthila — Buah Fresh & Parcel Buah Malang"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={site.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-leaf-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-leaf-900"
              >
                Petunjuk arah
              </a>
              <a
                href={place?.mapsUri ?? site.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-leaf-700 ring-1 ring-leaf-200 hover:bg-leaf-50"
              >
                Buka di Google Maps
              </a>
            </div>
          </div>

          {place && place.hours.length > 0 && (
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <p className="text-sm font-medium text-muted">🕒 Jam buka</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {place.hours.map((line, i) => {
                  const [day, ...rest] = line.split(": ");
                  return (
                    <li
                      key={line}
                      className={`flex justify-between gap-4 rounded-lg px-2 py-1 ${i === today ? "bg-leaf-50 font-bold text-leaf-900" : "text-ink"}`}
                    >
                      <span>{day}</span>
                      <span className="text-right">{rest.join(": ")}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-3xl bg-leaf-50 shadow-sm ring-1 ring-black/5">
          <iframe
            src={site.mapEmbed}
            title="Lokasi Healthila di Google Maps"
            className="h-[420px] w-full border-0 lg:h-full lg:min-h-[560px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
