import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    ABLY_API_KEY: process.env.ABLY_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
