import type { NextConfig } from "next";

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean)
  : [];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,

  // Skip linting and type-check during build to reduce CPU on server
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

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
