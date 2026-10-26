import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "rkagmdyjikujenzxngmm.supabase.co";

const nextConfig: NextConfig = {
  // Payment proof photos are resized in the browser to well under this.
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
  images: {
    // Own resizer (app/img) instead of Vercel's quota-limited optimizer.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    remotePatterns: [
      { protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
