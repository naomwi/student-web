import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Cho phép tất cả subdomain của supabase
      },
    ],
  },
};

export default nextConfig;