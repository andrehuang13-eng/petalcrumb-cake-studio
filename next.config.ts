import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Remote image hosts. picsum.photos seeds placeholder cake images;
    // *.public.blob.vercel-storage.com serves admin uploads (Vercel Blob);
    // images.unsplash.com serves the curated real cake photos.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    // Admin cake-image uploads pass through a Server Action; allow larger bodies.
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
