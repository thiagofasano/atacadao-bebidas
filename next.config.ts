import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.gestaoclick.com" },
      { protocol: "https", hostname: "**.gestaoclick.com" },
      { protocol: "http", hostname: "api.gestaoclick.com" },
    ],
  },
};

export default nextConfig;
