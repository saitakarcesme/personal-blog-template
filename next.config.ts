import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [68, 72, 75, 82],
  },
  serverExternalPackages: ["gray-matter", "turndown"],
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
