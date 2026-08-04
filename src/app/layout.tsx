import type { Metadata } from "next";
import { Suspense } from 'react';
import Script from 'next/script';
import "./globals.css";
import { Open_Sans, Poppins } from "next/font/google";

import ReduxProvider from "@/store/ReduxProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import DiwaliBanner from "@/components/DiwaliBanner";
import { AuthProvider } from '@/contexts/AuthContext';
import AdminAccessDeniedWrapper from '@/components/AdminAccessDeniedWrapper';
import AuthErrorBoundary from '@/components/AuthErrorBoundary';

import GoogleAnalytics from '@/components/GoogleAnalytics';
import MetaPixel from '@/components/MetaPixel';
import { Analytics } from "@vercel/analytics/next";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-poppins",
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kislaynaturals.com'),
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
      url: '/logo/favicon.png',
    },
    {
      rel: 'icon',
      type: 'image/png', 
      sizes: '16x16',
      url: '/logo/favicon.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/logo/favicon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '512x512',
      url: '/logo/favicon.png',
    }
  ],
  openGraph: {
    title: "Kislay Naturals – Monk Fruit Sweeteners",
    description: "Kislay Naturals offers pure monk fruit-based sweeteners for a healthy, sustainable lifestyle.",
    type: 'website',
    siteName: 'Kislay Naturals',
    images: [
      {
        url: '/logo-transparent.png',
        width: 1200,
        height: 630,
        alt: 'Kislay Naturals Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Kislay Naturals – Monk Fruit Sweeteners",
    description: "Kislay Naturals offers pure monk fruit-based sweeteners for a healthy, sustainable lifestyle.",
    images: ['/logo-transparent.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className={`${poppins.variable} ${openSans.variable} font-sans`}>
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          <Suspense fallback={null}>
            <MetaPixel />
          </Suspense>
          <Analytics />
          <AuthProvider>
            <AuthErrorBoundary>
              <ReduxProvider>
                {/* <DiwaliBanner /> */}
                <Navbar />
                <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
                {children}
                <Footer />
                
                <Suspense fallback={null}>
                  <AdminAccessDeniedWrapper />
                </Suspense>

                <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
              </ReduxProvider>
            </AuthErrorBoundary>
          </AuthProvider>
      </body>
    </html>
  );
}
