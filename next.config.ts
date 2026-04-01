import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Required for MongoDB on Vercel serverless
  serverExternalPackages: ['mongoose'],
};

export default nextConfig;
