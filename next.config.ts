import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // The drawings moved onto the home page (Lucent PortfolioPage), so the old
      // gallery route points at that section rather than 404ing old links.
      { source: '/art', destination: '/#drawings', permanent: false },
      { source: '/design-system', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
