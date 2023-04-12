/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false, // running prod build fails with swcMinify: true
  reactStrictMode: true,
  distDir: process.env.NODE_ENV === 'development' ? 'build-dev' : 'build',
  // eslint-disable-next-line require-await
  async redirects() {
    return [];
  }
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer(nextConfig);
