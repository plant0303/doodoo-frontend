// src/app/list/page.tsx (SSR 렌더 - 프롬프트 스펙 반영)
export const revalidate = 300; // 캐시 만료시간 5분 (300초) 

import React, { Suspense } from 'react';
import ListClient from './ListClient';
import { searchPrompts } from '@/lib/api'; // searchImages에서 searchPrompts로 변경
import { SearchResponse } from '@/types/prompt';
import { init } from 'next/dist/compiled/webpack/webpack';

const DEFAULT_PER_PAGE = 30;

type SearchParamsType = {
  q?: string;
  category?: string;
  p?: string;
};

type PageProps = {
  searchParams: Promise<SearchParamsType>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const query = params.q ?? "";
  const category = params.category ?? "";
  const page = parseInt(params.p ?? "1", 10);

  // 새로운 타입 규격에 따른 초기값 세팅
  let initialData: SearchResponse = {
    query: query || category || "", // 💡 string 타입이므로 undefined 방지용 fallback 처리
    prompts: [],
    total_count: 0
  };

  let initialPage = page;
  let initialTotalPages = 1;
  let perPage = DEFAULT_PER_PAGE;

  // 검색어나 카테고리가 있을 때만 데이터 패칭 진행
  if (query || category) {
    try {
      const response = await searchPrompts({
        query: query || undefined,
        category: category || undefined,
        page: initialPage,
        perPage: DEFAULT_PER_PAGE
      });

      initialData = response;
      const totalCount = response.total_count;
      initialTotalPages = Math.ceil(totalCount / perPage);
    } catch (error) {
      console.error("Error fetching prompts during SSR: ", error);
    }
  }

  const finalQueryOrCategory = query || category;
  const isCategorySearch = !!category && !query;


  return (
    <div className="container xl:max-w-[1280px] min-h-screen mx-auto px-4 py-4">
      <div className="flex items-center gap-2 text-sm text-gray-500 ">
        <a href="/" className="hover:text-blue-700 transition-colors">홈</a>

        <span className="text-gray-300">/</span>

        {isCategorySearch && (
          <>
            <a href="/categories" className="hover:text-blue-700 transition-colors">카테고리</a>
            <span className="text-gray-300">/</span>
          </>
        )}

        {/* 현재 위치: 검색어 강조 */}
        <span className="font-medium text-gray-900">
          '{query}'' 검색 결과
          <span className="text-gray-400 font-normal ml-1">
            ({initialData?.total_count.toLocaleString()}개)
          </span>
        </span>
      </div>
      <Suspense fallback={<div className="text-center py-24 text-gray-500">검색 결과를 불러오는 중...</div>}>
        <ListClient
          initialData={initialData}
          initialQuery={finalQueryOrCategory}
          initialPage={initialPage}
          initialTotalPages={initialTotalPages}
          perPage={perPage}
          isCategorySearch={isCategorySearch}
        />
      </Suspense>
    </div>
  );
}