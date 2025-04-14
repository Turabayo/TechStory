/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ This disables the build from failing on ESLint errors
  },
};

export default nextConfig;
