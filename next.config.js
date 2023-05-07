/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["loremflickr.com", "images.pexels.com"],
  },
};

module.exports = nextConfig;
