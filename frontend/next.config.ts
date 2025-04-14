import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Disable ESLint during builds (for now)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ...any other config you may have
};

export default nextConfig;
