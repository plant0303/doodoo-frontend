// src/app/list/page.tsx (SSR 렌더)
import Pagination from '@/components/common/Pagination';
import React, { useEffect, useState } from 'react'
import ListClient from './ListClient';
import { searchImages } from '@/lib/api';

interface ImageItem {
  id: string;
  thumb_url: string;
  title: string;
}
const PER_PAGE = 30; // 한 페이지당 로드할 이미지 수

// API의 total count 정보가 없으므로, total page 계산을 위한 목업 전체 개수입니다.
const MOCK_TOTAL_COUNT = 1000;
export default async function Page({ searchParams }: { searchParams: { q?: string, p?: string } }) {
  // 1. 검색어 및 페이지 번호 추출 (SSR을 위한 초기 상태)
  const query = searchParams.q || '가을';
  const currentPage = parseInt(searchParams.p || '1', 10);

  // 2. 서버 컴포넌트에서 API 호출 및 초기 데이터 로드 (SSR)
  const initialImages = await searchImages(query, currentPage, PER_PAGE);

  
  // 3. 총 페이지 수 계산
  const initialTotalPages = Math.ceil(MOCK_TOTAL_COUNT / PER_PAGE);
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
        <h1 className="text-2xl font-bold mb-6">Collage Gallery</h1>

        <ListClient
          initialImages={initialImages}
          initialQuery={query}
          initialPage={currentPage}
          initialTotalPages={initialTotalPages}
        />
      </div>
    </>
  );
}