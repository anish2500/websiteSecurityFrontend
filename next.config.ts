import type { NextConfig } from "next";

const backendURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
const IsDEV = backendURL.startsWith("http://localhost");

const config: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: IsDEV,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5050',
        pathname: '/profile_pictures/**', // <-- match the actual path
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5050',
        pathname: '/plant_images/**', // Matches the new folder
      },
      
    ],
  },
  experimental : {
    serverActions: {
      bodySizeLimit: '6mb',

    },
  },
}

export default config;
