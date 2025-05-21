import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: ['localhost', 'trf.trinitysystems.in' , 'cdn.shopify.com',"truereff-bucket.s3.eu-north-1.amazonaws.com"], // Add the domain here
  },
};
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});
const withNextIntl = createNextIntlPlugin();
module.exports = withPWA(withNextIntl(nextConfig));
// export default nextConfig;
