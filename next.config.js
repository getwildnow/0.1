/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure fetch works properly
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Ensure proper runtime configuration for Railway
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},
}

module.exports = nextConfig

