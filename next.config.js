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
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.kislaynaturals.com',
          },
        ],
        destination: 'https://kislaynaturals.com/:path*',
        permanent: true,
      },
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
      {
        source: '/blog/monk-fruit-1',
        destination: '/blog/best-natural-sugar-substitute-india',
        permanent: true,
      },
      {
        source: '/blog/monk-fruit-2',
        destination: '/blog/monk-fruit-sweetener-good-for-diabetics',
        permanent: true,
      },
      {
        source: '/blog/monk-fruit-3',
        destination: '/blog/5-reasons-switch-sugar-to-monk-fruit',
        permanent: true,
      },
      {
        source: '/blog/monk-fruit-daily-uses',
        destination: '/blog/7-easy-ways-use-monk-fruit-sweetener',
        permanent: true,
      },
      {
        source: '/blog/monk-fruit-weight-loss',
        destination: '/blog/monk-fruit-sweetener-weight-loss',
        permanent: true,
      },
      {
        source: '/blog/monk-fruit-diabetics-guide',
        destination: '/blog/is-monk-fruit-safe-for-diabetics',
        permanent: true,
      },
      {
        source: '/blog/monk-fruit-vs-artificial-sweeteners',
        destination: '/blog/monk-fruit-vs-artificial-sweeteners-healthier',
        permanent: true,
      },
      {
        source: '/blog/monk-fruit-gut-health',
        destination: '/blog/monk-fruit-sweetener-gut-health',
        permanent: true,
      },
      {
        source: '/blog/monk-fruit-sugar-cravings',
        destination: '/blog/monk-fruit-sweetener-reduce-sugar-cravings',
        permanent: true,
      },
      {
        source: '/blog/best-sugar-alternatives-for-diabetics-in-india',
        destination: '/blog/best-sugar-alternatives-diabetics-india',
        permanent: true,
      },
      {
        source: '/blog/monk-fruit-for-indian-cooking',
        destination: '/blog/monk-fruit-sweetener-indian-cooking',
        permanent: true,
      },
      {
        source: '/blog/artificial-sweeteners-health-risks',
        destination: '/blog/hidden-health-risks-artificial-sweeteners',
        permanent: true,
      },
      {
        source: '/blog/quit-sugar-naturally-monk-fruit',
        destination: '/blog/how-to-quit-sugar-naturally',
        permanent: true,
      },
      {
        source: '/recipes/1',
        destination: '/recipes/sugar-free-lemonade',
        permanent: true,
      },
      {
        source: '/recipes/2',
        destination: '/recipes/healthy-oatmeal',
        permanent: true,
      },
      {
        source: '/recipes/3',
        destination: '/recipes/fruit-smoothie',
        permanent: true,
      },
      {
        source: '/recipes/4',
        destination: '/recipes/chia-pudding',
        permanent: true,
      },
      {
        source: '/recipes/5',
        destination: '/recipes/sugar-free-iced-tea',
        permanent: true,
      },
      {
        source: '/recipes/6',
        destination: '/recipes/protein-pancakes',
        permanent: true,
      }
    ];
  },
};

module.exports = nextConfig;