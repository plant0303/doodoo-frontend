// mainpage
import HeroSection from "@/components/home/HeroSection";
import Image from "next/image";
import type { Metadata } from 'next'

// metadate 정의하기
export const metadata: Metadata = {
  title: '무제한 무료 이미지 - 두두 doodoo',
  // 검색 결과에 표시
  description: '무제한 무료 이미지 스톡 사이트. 상업적으로 사용 가능한 고화질 사진을 무료로 다운로드하세요.',
  // 대표 OG 이미지, URL 등 설정
  openGraph: {
    title: '무제한 무료 이미지 - 두두 doodoo',
    description: '두두(doodoo)에서 영감을 주는 무료 이미지를 발견하고 프로젝트를 빛내세요!',
    // url: 'https://your-domain.com',
    type: 'website',
  },
  // 트위터 카드 설정
  twitter: {
    // card: 'summary_large_image',
    title: '무제한 무료 이미지 - 두두 doodoo',
    description: '무제한 무료 이미지 스톡 사이트. 상업적으로 사용 가능한 고화질 사진을 무료로 다운로드하세요.',
  },
  // 기타 일반 메타태그
  keywords: [
    '무료 이미지',
    '스톡 이미지',
    '상업적 이용 가능',
    '저작권 무료',
    '고화질 사진',
    '일러스트',
    '벡터',
    '디자인 소스',
    '두두',
    'doodoo'
  ],
}

export default function Home() {
  return (
    <>
      <HeroSection />
    </>
  );
}
