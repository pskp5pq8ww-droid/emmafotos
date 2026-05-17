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
    default: "Emmanuel Rojas Studio",
    template: "%s | Emmanuel Rojas Studio",
  },
  description:
    "Creative Direction, Visual Production and Digital Identity by Emmanuel Rojas.",
  metadataBase: new URL("https://emmanuelrojas.studio"),
  openGraph: {
    title: "Emmanuel Rojas Studio",
    description:
      "Premium photography, private galleries and visual production.",
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
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
