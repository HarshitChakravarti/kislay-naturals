import type { Metadata } from "next";
import { Suspense } from 'react';
import Script from 'next/script';
import "./globals.css";
import { Montserrat, Open_Sans, Dancing_Script } from "next/font/google";

import ReduxProvider from "@/store/ReduxProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiwaliBanner from "@/components/DiwaliBanner";
import { AuthProvider } from '@/contexts/AuthContext';
import AdminAccessDeniedWrapper from '@/components/AdminAccessDeniedWrapper';
import AuthErrorBoundary from '@/components/AuthErrorBoundary';
import SessionManager from '@/components/SessionManager';
import GoogleAnalytics from '@/components/GoogleAnalytics';

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
  verification: {
    google: 'zsZ85F-izYwXgU0jS73XClOfssfoRjTKDXQQmLp4gPM',
  },
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" type="image/png" sizes="32x32" href="/kislayfavicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/kislayfavicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/kislayfavicon.png" />
      </head>
      <body className={`${montserrat.variable} ${openSans.variable} ${dancingScript.variable} font-sans`}>
        <Suspense fallback={null}>
          <GoogleAnalytics />
          <AuthProvider>
            <AuthErrorBoundary>
              <ReduxProvider>
                <DiwaliBanner />
                <Navbar />
                {children}
                <Footer />
                <AdminAccessDeniedWrapper />
                <SessionManager />
                <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
              </ReduxProvider>
            </AuthErrorBoundary>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
