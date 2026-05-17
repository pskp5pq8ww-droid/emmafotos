import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Emmanuel Rojas · Wedding Photographer Brisbane",
    template: "%s | Emmanuel Rojas",
  },
  description:
    "Wedding photographer based in Brisbane, Australia. Natural, emotional and cinematic imagery for couples who value meaningful memories. 4+ years, 200+ events worldwide.",
  metadataBase: new URL("https://photographeraustralia.com"),
  openGraph: {
    title: "Emmanuel Rojas · Wedding Photographer Brisbane",
    description:
      "Wedding photography crafted with elegance, emotion and timeless intention. Brisbane, Australia · Worldwide.",
    images: ["/assets/og-preview.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
