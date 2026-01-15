import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone build for Docker (smaller image size)
  output: "standalone",

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Removing experimental turbopack root which was causing issues
  // Next.js 15+ should infer the root correctly from package.json position
};

export default nextConfig;
