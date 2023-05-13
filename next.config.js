/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/de6cikuab/**",
      },
    ],
  },
};

module.exports = nextConfig;

// https://res.cloudinary.com/de6cikuab/image/upload/v1683918048/next-ecommerce/jMuQVW66JHwD2b2tNOuM9U9d_ij0d9i.png
