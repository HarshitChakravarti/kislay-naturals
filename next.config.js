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
};

module.exports = nextConfig;