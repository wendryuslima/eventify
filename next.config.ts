import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  webpack: (config) => {
    // Ignorar completamente a pasta backend
    config.watchOptions = {
      ignored: ["**/backend/**", "**/node_modules/**"],
    };
    
    // Excluir backend do build
    config.externals = config.externals || [];
    config.externals.push({
      'backend': 'commonjs backend'
    });
    
    return config;
  },
  // Excluir backend do build
  experimental: {
    outputFileTracingExcludes: {
      '*': ['./backend/**/*']
    }
  }
};

export default nextConfig;
