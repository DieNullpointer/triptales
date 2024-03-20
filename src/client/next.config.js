/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  distDir: 'build',
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig

