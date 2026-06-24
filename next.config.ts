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
      {
        // Home is force-dynamic (reads db.json / reviews on every render), so
        // it should never be cached by the Hostinger CDN anyway. Forcing
        // no-store also stops the CDN from pinning a transient 500 ("server-side
        // exception") and serving it to every visitor until the cache is purged.
        source: "/",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" },
          { key: "CDN-Cache-Control", value: "no-store" },
        ],
      },
      {
        // Admin login + dashboard must NEVER be cached by the Hostinger CDN.
        // A prior build prerendered /admin-login statically (s-maxage=1yr) and
        // the CDN pinned a stale/broken copy, returning 403 to real browsers
        // while the origin was healthy. Force the edge to always revalidate.
        source: "/admin-login",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" },
          { key: "CDN-Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" },
          { key: "CDN-Cache-Control", value: "no-store" },
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
