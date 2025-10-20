'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from "react"
import Script from "next/script"

// Provide a type for the global gtag function to satisfy TypeScript on the client
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

// Read the Measurement ID from environment variables
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics(){
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views when the route changes
  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      const queryString = searchParams.toString();
      const url = `${pathname}${queryString ? `?${queryString}` : ''}`;
      window.gtag?.('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);


  // If no Measurement ID is found, don't render anything
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Load the Google Analytics script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      {/* Initialize Google Analytics */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            ${GA_MEASUREMENT_ID ? `gtag('config', '${GA_MEASUREMENT_ID}');` : ''}
          `,
        }}
      />
    </>
  )
}