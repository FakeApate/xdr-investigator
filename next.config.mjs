/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '127.0.0.1:3000']
};

export default nextConfig;
