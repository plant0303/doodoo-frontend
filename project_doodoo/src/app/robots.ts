import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'], // 관리자 페이지와 API는 제외
    },
    // 실제 운영 환경 도메인으로 수정하세요
    sitemap: 'https://doodoostock.com/sitemap.xml', 
  }
}