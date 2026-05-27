export const revalidate = 43200;

import { MetadataRoute } from 'next'

const WORKERS_API_URL = process.env.NEXT_PUBLIC_WORKERS_API_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.doodoostock.com'; // 사이트 메인 도메인
  const r2PublicUrl = 'https://img.doodoostock.com'; // R2 이미지 도메인

  // DB에서 이미지 데이터 호출
  // const photos = await getAllPhotos(); 


  // 1. 기본 정적 페이지들
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/list`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  try {
    // 1. Worker API 호출
    const response = await fetch(`${WORKERS_API_URL}/api/sitemap-data`, {
    });

    if (!response.ok) throw new Error('Worker fetch failed');

    const photos = await response.json();

    // 2. 이미지 상세 페이지 경로 생성
    const photoRoutes = photos.map((photo: any) => {
      const optimizedPreviewUrl = photo.preview_url.replace(
        'https://pub-c23d57f0578646659d59cf9f1ba3e49c.r2.dev',
        'https://img.doodoostock.com'
      );

      return {
        url: `${baseUrl}/photo/${photo.id}`,
        lastModified: new Date(photo.uploaded_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
        images: [optimizedPreviewUrl],
      };
    });

    // 3. 기본 정적 페이지와 합치기
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/list`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      ...photoRoutes,
    ];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    // 에러 발생 시 최소한 메인 페이지만이라도 반환하여 SEO 단절 방지
    return [
      { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    ];
  }


}