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
  async redirects() {
    return [
      {
        source: '/lab-report',
        destination: 'https://qbubtexkhvhrrakoohiu.supabase.co/storage/v1/object/public/public_docs/lab-report.pdf',
        permanent: false,
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