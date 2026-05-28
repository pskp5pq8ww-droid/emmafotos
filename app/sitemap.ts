import type { MetadataRoute } from "next";
import { projects } from "@/lib/public-content";

const BASE_URL = "https://photographeraustralia.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },

    // Service landing pages
    { url: `${BASE_URL}/wedding-photography-brisbane`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE_URL}/couple-photography-brisbane`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/event-photography-brisbane`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/drone-photography-brisbane`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/personal-branding-photography-brisbane`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/maternity-photography-brisbane`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/portrait-photography-brisbane`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },

    // Guide/blog pages
    { url: `${BASE_URL}/best-locations-for-couple-photos-brisbane`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/how-much-does-a-wedding-photographer-cost-brisbane`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE_URL}/what-to-wear-for-a-couple-photoshoot`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${BASE_URL}/best-time-of-day-for-photos-brisbane`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${BASE_URL}/drone-photography-for-weddings-queensland`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const portfolioPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/portfolio/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...portfolioPages];
}
