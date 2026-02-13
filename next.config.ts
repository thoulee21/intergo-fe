import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,

  output: "standalone",

  images: {
    unoptimized: false,
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error"], 
          }
        : false,
  },
};

export default nextConfig;
