/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NODE_ENV === 'development' ? 'build-dev' : 'build',
  async redirects() {
    return [
      {
        source: '/collection/:name',
        destination: '/collection/:name/items',
        permanent: true
      },
      {
        source: '/profile/:address',
        destination: '/profile/:address/items', //todo: this doesn't seem to work if :address starts with 0x
        permanent: true
      }
    ];
  }
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer(nextConfig);
