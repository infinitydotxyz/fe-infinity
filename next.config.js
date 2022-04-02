/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: 'build',
  images: {
    domains: ['lh3.googleusercontent.com']
  }
};

module.exports = nextConfig;
