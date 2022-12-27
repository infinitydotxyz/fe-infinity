/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NODE_ENV === 'development' ? 'build-dev' : 'build',
  async redirects() {
    return [
      {
        source: '/v3/collection/:name',
        destination: '/v3/collection/:name/items',
        permanent: true
      },
      {
        source: '/v3/profile/:address',
        destination: '/v3/profile/:address/items', //todo: this doesn't seem to work if :address starts with 0x
        permanent: true
      }
    ];
  }
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer(nextConfig);
