import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Montserrat, Open_Sans, Dancing_Script } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "../components/Footer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Kislay Naturals – Monk Fruit Sweeteners</title>
        <meta name="description" content="Kislay Naturals offers pure monk fruit-based sweeteners for a healthy, sustainable lifestyle." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3fa46a" />
      </head>
      <body className={`${montserrat.variable} ${openSans.variable} ${dancingScript.variable} font-sans antialiased scroll-smooth`}>
        <Navbar />
        <div>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
