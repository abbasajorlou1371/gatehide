import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.gatehide.com',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
