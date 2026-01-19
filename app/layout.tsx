// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import UpgradeModal from "@/components/UpgradeModal";
import PersuasionSection from "@/components/PersuasionSection";
import StatsBanner from "@/components/StatsBanner";
import SocialProofNotifications from "@/components/SocialProofNotifications";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "lez Market - AI Website Analyzer for Conversion Optimization",
  description: "Optimize your website for high conversion rates. Analyze your landing page for Social Proof, Scarcity, Authority and more. Get AI-powered copy that turns visitors into loyal customers.",
  keywords: ["AI website analyzer", "conversion optimization", "marketing psychology", "AI copywriting", "landing page optimization", "conversion rate optimization", "CRO tool"],
  authors: [{ name: "lez Market Team" }],
  openGraph: {
    title: "lez Market - Elevate Your Website's Conversion Potential",
    description: "AI-powered conversion principles analysis and copywriting to transform your website performance.",
    url: "https://lezmarket.vercel.app",
    siteName: "lez Market",
    images: [
      {
        url: "/logo/logo.png",
        width: 800,
        height: 600,
        alt: "lez Market Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "lez Market - AI-Powered Conversion Optimization",
    description: "Analyze your website and get AI-powered copy that converts in seconds.",
    images: ["/logo/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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

          {/* Global Persuasion Zone (Social Proof & Authority) */}
          <div className="max-w-7xl mx-auto px-4 py-24">
            <PersuasionSection showBadges={true} />
          </div>
        </main>
        {!isAuthPage && <Footer />}
        <ChatBot />
        <UpgradeModal />
        <SocialProofNotifications />
      </body>
    </html>
  );
}