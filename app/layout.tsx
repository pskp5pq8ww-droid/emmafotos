import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Great_Vibes } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-signature",
  display: "swap",
});

const BASE_URL = "https://photographeraustralia.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Emmanuel Rojas Photographer | Brisbane Wedding, Event & Portrait Photographer",
    template: "%s | Emmanuel Rojas Photographer",
  },
  description:
    "Brisbane-based photographer and visual storyteller capturing weddings, events, portraits, couple sessions, maternity, personal branding and drone photography across Australia and worldwide.",
  keywords: [
    "Brisbane photographer",
    "wedding photographer Brisbane",
    "event photographer Brisbane",
    "couple photographer Brisbane",
    "portrait photographer Brisbane",
    "maternity photographer Brisbane",
    "personal branding photographer Brisbane",
    "drone photographer Brisbane",
    "cinematic photography Brisbane",
    "Emmanuel Rojas photographer",
  ],
  authors: [{ name: "Emmanuel Rojas", url: BASE_URL }],
  creator: "Emmanuel Rojas",
  publisher: "Emmanuel Rojas Photographer",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: BASE_URL,
    siteName: "Emmanuel Rojas Photographer",
    title: "Emmanuel Rojas Photographer | Brisbane Wedding, Event & Portrait Photographer",
    description:
      "Brisbane-based photographer and visual storyteller. Weddings, events, portraits, couples, maternity, personal branding and drone photography across Australia and worldwide.",
    images: [
      {
        url: "/assets/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Emmanuel Rojas Photographer — Brisbane, Australia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emmanuel Rojas Photographer | Brisbane Wedding, Event & Portrait Photographer",
    description:
      "Brisbane-based photographer crafting cinematic weddings, events, portraits and brand stories across Australia and worldwide.",
    images: ["/assets/og-preview.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg" }, { url: "/favicon.png" }],
    apple: "/favicon.png",
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    // Add your Google Search Console verification token here when ready:
    // google: "YOUR_VERIFICATION_TOKEN",
  },
};

// Global JSON-LD structured data
const jsonLdBusiness = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${BASE_URL}/#business`,
  name: "Emmanuel Rojas Photographer",
  url: BASE_URL,
  image: `${BASE_URL}/assets/og-preview.png`,
  logo: `${BASE_URL}/assets/er-logo-white.png`,
  telephone: "+61412763107",
  email: "emmanuelrojas-23@hotmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brisbane",
    addressRegion: "QLD",
    addressCountry: "AU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -27.4698,
    longitude: 153.0251,
  },
  areaServed: [
    { "@type": "City", name: "Brisbane" },
    { "@type": "State", name: "Queensland" },
    { "@type": "Country", name: "Australia" },
    "Worldwide",
  ],
  description:
    "Brisbane-based photographer and visual storyteller specialising in weddings, events, couple sessions, maternity portraits, personal branding, portraits and drone photography.",
  founder: {
    "@type": "Person",
    name: "Emmanuel Rojas",
    jobTitle: "Photographer and Visual Storyteller",
    worksFor: { "@type": "Organization", name: "Emmanuel Rojas Photographer" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brisbane",
      addressRegion: "QLD",
      addressCountry: "AU",
    },
    sameAs: ["https://www.instagram.com/emmanuel_r0jas_/"],
  },
  sameAs: ["https://www.instagram.com/emmanuel_r0jas_/"],
  priceRange: "$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "09:00",
    closes: "20:00",
  },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "Emmanuel Rojas Photographer",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/portfolio?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={`${cormorant.variable} ${inter.variable} ${greatVibes.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBusiness) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
