/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NODE_ENV === 'development' ? 'build-dev' : 'build',
  // eslint-disable-next-line require-await
  async redirects() {
    return [
      {
        source: '/',
        destination: '/trending',
        permanent: true
      },
      {
        source: '/collection/:name',
        destination: '/collection/:name/items',
        permanent: true
      },
      {
        source: '/profile/:address',
        destination: '/profile/:address/items',
        permanent: true
      }
    ];
  }
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer(nextConfig);
