import type { Metadata } from "next";
import Script from 'next/script';
import "./globals.css";
import { Montserrat, Open_Sans, Dancing_Script } from "next/font/google";

import ReduxProvider from "@/store/ReduxProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from '@/contexts/AuthContext';

// Load fonts
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Kislay Naturals – Monk Fruit Sweeteners",
  description: "Kislay Naturals offers pure monk fruit-based sweeteners for a healthy, sustainable lifestyle.",
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/logo.png',
    },
    {
      rel: 'icon',
      type: 'image/png', 
      sizes: '16x16',
      url: '/logo.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/logo.png',
    }
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/kislayfavicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/kislayfavicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/kislayfavicon.png" />
      </head>
      <body className={`${montserrat.variable} ${openSans.variable} ${dancingScript.variable} font-sans`}>
        <AuthProvider>
          <ReduxProvider>
            <Navbar />
            {children}
                        <Footer />
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
