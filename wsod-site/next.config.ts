import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wsod-media.fra1.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "wsod-media.fra1.cdn.digitaloceanspaces.com",
      },
    ],
  },
};

export default nextConfig;
