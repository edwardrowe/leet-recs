/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    domains: [
      "picsum.photos",
      "randomuser.me",
    ],
  },
};

export default nextConfig; 