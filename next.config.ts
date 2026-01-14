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
};

export default nextConfig;
