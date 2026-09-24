import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Every quality an <Image> asks for: 75 is next/image's default (the rest of the
    // site), 65 the Drawings wall's thumbnails, 85 a drawing opened in its room.
    qualities: [65, 75, 85],
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
