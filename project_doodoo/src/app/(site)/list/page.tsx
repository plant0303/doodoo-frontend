// src/app/list/page.tsx (SSR 렌더)
export const revalidate = 300; // 캐시 만료시간  5분 (300초)

import Pagination from '@/components/common/Pagination';
import React, { useEffect, useState } from 'react'
import ListClient from './ListClient';
import { searchImages } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';

interface ImageItem {
  id: string;
  thumb_url: string;
  title: string;
}

// 한 페이지당 30장씩 로드
const PER_PAGE = 30;
const TOTAL_COUNT = 1000;



export async function generateMetadata({ searchParams }: { searchParams: { q?: string, p?: string } }): Promise<Metadata> {
  const finalSearchParams = await (searchParams as any);
  const query = finalSearchParams.q || '';
  const page = searchParams.p || '1';
  const siteName = "doodoo";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://doodoo.com'; // 실제 도메인으로 변경 필요

  // 검색어가 있을 경우와 없을 경우의 메타데이터 분기
  const title = query
    ? `${query} 관련 무료 이미지 검색 | ${siteName}`
    : `고품질 무료 이미지 검색 및 다운로드 | ${siteName}`;


  const description = query
    ? `${query}에 대한 고화질 무료 이미지를 다운로드하세요. 상업적 사용 가능한 저작권 없는 사진 제공.`
    : `doodoo에서 수백만 장의 고품질 이미지를 무료로 검색하고 다운로드하세요. 상업적 이용 가능.`;

  const canonicalUrl = `${baseUrl}/list${query ? `?q=${encodeURIComponent(query)}&p=${page}` : ''}`;

  return {
    title: title,
    description: description,
    keywords: query ? [query, '무료 이미지', '고화질', '상업적 이용', siteName] : ['무료 이미지', '스톡 사진', '고화질', '상업적 이용', 'doodoo'],
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      siteName: siteName,
      type: 'website',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function Page({ searchParams }: { searchParams: { q?: string, p?: string } }) {
  // 검색어 추출
  // 비동기적으로 처리해야하기 때문에 await으로 런타임 문제 해결
  const finalSearchParams = await (searchParams as any);
  const query = finalSearchParams.q || '';

  // 검색어가 있을 때만 API 호출 (SSR)
  let initialImages: ImageItem[] = [];
  let initialPage = 1;
  let initialTotalPages = Math.ceil(TOTAL_COUNT / PER_PAGE);

  if (query) {
    initialPage = parseInt(finalSearchParams.p || '1', 10);
    initialImages = await searchImages(query, initialPage, PER_PAGE);
    initialTotalPages = Math.ceil(TOTAL_COUNT / PER_PAGE);
  }


  return (
    <>
      <div className="container xl:max-w-[1200px] h-screen mx-auto px-4 py-4">
        {/* ▼ Search Filter Bar ▼ */}
        {/* <div
          aria-label="search filter bar"
          className="
          flex flex-col sm:flex-row
          items-start sm:items-center justify-between 
          gap-2 sm:gap-0
          mx-auto py-2
        "
        >
          <button
            type="button"
            className="
            flex items-center text-[#3C4DF8] font-bold text-sm 
            transition-colors px-5 py-1 border-2 border-[#3C4DF8] rounded-full
            w-max
          "
          >
            Filter &gt;
          </button>

          <div className="flex items-center gap-2 text-sm sm:text-base">
            <span className="font-bold">Sort by</span>
            {["New", "Popular", "Download"].map((item) => (
              <button
                key={item}
                type="button"
                className="
                px-1 py-1 rounded-md 
                text-gray-400 hover:text-[#3C4DF8] transition-colors
              "
              >
                {item}
              </button>
            ))}
          </div>
        </div> */}

        <ListClient
          initialImages={initialImages}
          initialQuery={query}
          initialPage={initialPage}
          initialTotalPages={initialTotalPages}
          perPage={PER_PAGE}
        />
      </div>
    </>
  );
}