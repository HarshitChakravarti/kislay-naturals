import type { Metadata } from "next";
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${openSans.variable} ${dancingScript.variable} font-sans`}>
        <AuthProvider>
          <ReduxProvider>
            <Navbar />
            {children}
            <Footer />
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
