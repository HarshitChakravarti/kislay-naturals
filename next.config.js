/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    // Add any experimental features here if needed
  },
  reactStrictMode: true,
  // Explicitly set trailingSlash to false to match sitemap URLs
  // This ensures consistency between sitemap and actual URLs
  trailingSlash: false,
  // Add any other Next.js config options here
  async redirects() {
    return [
      {
        source: '/lab-report', // The URL on the box
        destination: 'https://qbubtexkhvhrrakoohiu.supabase.co/storage/v1/object/public/public_docs/labreport.pdf', // The actual file
        permanent: false, // Keep this FALSE so you can change it later!
      },
      {
        source: '/manufacturer-details',
        destination: 'https://qbubtexkhvhrrakoohiu.supabase.co/storage/v1/object/public/public_docs/Batch%20-%20Manufacturer%20Details.pdf',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;