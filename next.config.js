/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Add any other Next.js config options here
};

module.exports = nextConfig;