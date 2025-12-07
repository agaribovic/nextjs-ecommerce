import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lwmchmwtdietfkcnhyab.supabase.co",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ["*"] },
    turbo: {
      resolveExtensions: [".js", ".ts", ".tsx", ".jsx"],
    },
  },
};

export default nextConfig;
