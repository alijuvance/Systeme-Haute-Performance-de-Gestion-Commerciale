import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ERP Haute Performance",
  description: "Système de Gestion Commerciale B2B/B2C",
};

import { Providers } from "@/contexts/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#020617] text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
