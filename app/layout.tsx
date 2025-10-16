import type React from "react";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";

const mona_sans = Mona_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MubXpress - Student Campus Marketplace",
  description:
    "Your trusted, student-only campus marketplace app for buying, selling, and trading within your local campus community.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${mona_sans.className}  antialiased`}>{children}</body>
    </html>
  );
}
