import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  webpack: (config) => {
    config.watchOptions = {
      ignored: ["**/backend/**", "**/node_modules/**"],
    };
    return config;
  },
};

export default nextConfig;
