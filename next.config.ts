import type { NextConfig } from "next";

// Comma-separated list of external origins allowed to call server actions.
// Required when Next.js runs behind a reverse proxy (e.g. Hostinger nginx).
// Example: ALLOWED_ORIGINS=emmafotos.com,www.emmafotos.com
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean)
  : [];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
      allowedOrigins,
    },
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
