/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    // Allow unoptimized images since next/image optimization requires a server
    unoptimized: true,
  },
};

export default nextConfig;
