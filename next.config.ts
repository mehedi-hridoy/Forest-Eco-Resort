import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: '*.ufs.sh' },
      { protocol: 'https', hostname: '*.uploadthing.com' },
      { protocol: 'https', hostname: 'uploadthing.com' },
    ],
  },
  async rewrites() {
    return {
      // Don't proxy /api/uploadthing — it's a Next.js route handler
      beforeFiles: [],
      afterFiles: [
        { source: '/api/v1/:path*', destination: `${process.env.API_INTERNAL_URL || 'http://127.0.0.1:4000'}/api/v1/:path*` },
      ],
      fallback: [],
    };
  },
  async headers() {
    return [{ source: '/:path*', headers: [{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'X-Frame-Options',value:'DENY'}] }];
  },
};
export default config;

