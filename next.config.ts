import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/fr/radars',
  output: 'export',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
