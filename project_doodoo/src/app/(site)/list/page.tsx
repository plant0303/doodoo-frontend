// src/app/list/page.tsx (SSR 렌더)
import Pagination from '@/components/common/Pagination';
import React, { useEffect, useState } from 'react'
import ListClient from './ListClient';
import { searchImages } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface ImageItem {
  id: string;
  thumb_url: string;
  title: string;
}

// 한 페이지당 30장씩 로드
const PER_PAGE = 30;
const TOTAL_COUNT = 1000;

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
      <div className="container mx-auto px-4 py-4">
        {/* ▼ Search Filter Bar ▼ */}
        <div
          aria-label="search filter bar"
          className="
          flex flex-col sm:flex-row
          items-start sm:items-center justify-between 
          gap-2 sm:gap-0
          mx-auto py-2
        "
        >
          {/* 왼쪽: Filter 버튼 */}
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

          {/* 오른쪽: Sort By */}
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
        </div>

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