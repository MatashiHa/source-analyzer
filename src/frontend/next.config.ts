import type { NextConfig } from 'next';
import { env } from 'node:process';

const nextConfig: NextConfig = {
  /* config options here */
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
export default nextConfig;
