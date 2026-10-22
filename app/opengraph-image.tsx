import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** 1200×630 share image (WhatsApp, Facebook, Google) for every page without its own photo. */
export const alt = "Healthila — Toko Buah & Parcel Buah Malang";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const mark = await readFile(join(process.cwd(), "public/healthila-mark.png"));
  const src = `data:image/png;base64,${mark.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "0 90px",
          background: "linear-gradient(135deg, #04724a 0%, #0b5d3d 55%, #ff8a3d 140%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <img src={src} width={220} height={220} alt="" style={{ borderRadius: 999, background: "white" }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#c8f560", letterSpacing: 2 }}>HEALTHILA · MALANG</div>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.08, marginTop: 12 }}>Toko Buah &amp; Parcel Buah Malang</div>
          <div style={{ fontSize: 32, marginTop: 22, opacity: 0.9 }}>Buah segar · Hampers · Jus · Delivery se-Malang</div>
          <div style={{ fontSize: 30, marginTop: 26, fontWeight: 700 }}>healthila.id</div>
        </div>
      </div>
    ),
    size,
  );
}
