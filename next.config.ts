import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ['express', 'multer', 'exceljs'],
  images: {
    minimumCacheTTL: 2678400,
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
  async redirects() {
    return [{ source: '/contact', destination: '/get-in-touch', permanent: true }];
  },
  async headers() {
    return [
      { source: '/:path*', headers: [{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'X-Frame-Options',value:'DENY'}] },
      // Let browsers reuse site images and brochures for 30 days. Give a replaced image a new file name so visitors get it at once.
      { source: '/:dir(images|brochures|logos)/:path*', headers: [{key:'Cache-Control',value:'public, max-age=2592000, stale-while-revalidate=86400'}] },
    ];
  },
};
export default config;
