// app/page.js

import ListClient from './ListClient';
import type { Metadata } from 'next';

//  메타데이터는 서버 컴포넌트에서 export (SEO 핵심)
// 이 데이터는 페이지를 렌더링하기 전에 서버에서 <head> 태그에 삽입됩니다.
export const metadata: Metadata = {
  title: '무제한 무료 이미지 - 두두 doodoo',
  description: '무제한 무료 이미지 스톡 사이트. 상업적으로 사용 가능한 고화질 사진을 지금 다운로드하세요.',
  openGraph: {
    title: '두두 doodoo | 고화질 무료 이미지',
    description: '📸 두두(doodoo)에서 영감을 주는 무료 이미지를 발견하고 프로젝트를 빛내세요!',
    url: 'https://your-domain.com', // ⚠️ 실제 도메인으로 변경하세요.
    type: 'website',
    // og:image 등 추가 가능
  },
  keywords: [
    '무료 이미지',
    '스톡 이미지',
    '상업적 이용 가능',
    '고화질 사진',
    '두두',
  ],
};

const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

// 데이터 페칭 SSR 
async function fetchInitialImages() {
  try {
    console.log("--- 🚀 Unsplash API를 호출합니다 (캐시 재검증) ---");
    const res = await fetch(
      `https://api.unsplash.com/photos?page=1&per_page=30&client_id=${ACCESS_KEY}`,
      {
        // 5분(300초) 동안 캐시를 유지하도록 설정
        next: { revalidate: 300 }
      }
    );

    if (!res.ok) {
      // 에러 처리
      throw new Error('Failed to fetch images');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Image fetch error:", error);
    return [];
  }
}

// 💡 4. Page 컴포넌트는 서버에서 실행되므로 "use client"가 필요 없습니다.
export default async function ImageGalleryPage() {

  // 서버에서 초기 데이터를 비동기로 가져옵니다.
  const initialImages = await fetchInitialImages();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Collage Gallery</h1>

      {/* 💡 5. 클라이언트 컴포넌트에 초기 데이터를 props로 전달 */}
      {/* ListClient는 이제 초기 데이터 렌더링과 추가 로딩을 담당합니다. */}
      <ListClient initialImages={initialImages} />
    </div>
  );
}