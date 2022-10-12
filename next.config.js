/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NODE_ENV === 'development' ? 'build-dev' : 'build'
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer(nextConfig);
