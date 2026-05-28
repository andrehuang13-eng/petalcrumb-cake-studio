import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow remote image hosts. picsum.photos is used for placeholder cake
    // images during M3-M6; we'll likely swap to Vercel Blob (admin uploads)
    // or a curated CDN in M6/M7.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
