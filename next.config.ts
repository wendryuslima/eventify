import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: __dirname,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  webpack: (config) => {
    config.watchOptions = {
      ignored: ["**/backend/**", "**/node_modules/**"],
    };

    config.externals = config.externals || [];
    config.externals.push({
      backend: "commonjs backend",
    });

    return config;
  },
};

export default nextConfig;
