// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LetsMarket - AI Website Analyzer",
  description: "Analyze your website and get AI-powered copy that converts",
};

// Pages that should NOT show the footer (authenticated app pages)
const AUTH_PAGES = ['/dashboard', '/analyze', '/connections', '/posts', '/campaigns', '/profile'];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';

  // Hide footer on authenticated app pages only
  const isAuthPage = AUTH_PAGES.some(p => pathname.startsWith(p));

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          {children}
        </main>
        {!isAuthPage && <Footer />}
      </body>
    </html>
  );
}