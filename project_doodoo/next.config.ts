import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.doodoostock.com', // 👈 호스트네임 허용 추가
      },
      // 만약 HTTP 도메인도 사용 가능성이 있다면 추가 (선택)
      {
        protocol: 'http',
        hostname: 'img.doodoostock.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
