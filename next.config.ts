import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
    
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Custom redirects for route aliases
  async redirects() {
    return [
      // Redirect /signin to /auth/signin (if you want to keep both working)
      {
        source: '/signin',
        destination: '/auth/signin',
        permanent: false, // Use false for temporary redirects (307)
      },
      // Add more redirects as needed
      // {
      //   source: '/login',
      //   destination: '/auth/signin',
      //   permanent: false,
      // },
    ];
  },
  
};

export default nextConfig;
