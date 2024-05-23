/** @type {import('next').NextConfig} */
const webpack = require("webpack"); // eslint-disable-line

const nextConfig = {
  webpack(config) {
    config.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }));
    return config;
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  output: "export"
};

module.exports = nextConfig;
