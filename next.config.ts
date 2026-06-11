import type { NextConfig } from "next";

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean)
  : [];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevent MIME-sniffing attacks on uploaded/served files
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Block the site from being embedded in iframes (clickjacking)
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Don't leak full URLs (gallery slugs / admin paths) to third parties
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Force HTTPS for a year once visited over HTTPS
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Disable powerful APIs the site never uses
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },

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
