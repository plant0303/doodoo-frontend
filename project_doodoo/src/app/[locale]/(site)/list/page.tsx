// src/app/list/page.tsx (SSR 렌더 - 프롬프트 스펙 반영)
export const revalidate = 300; // 캐시 만료시간 5분 (300초) 

import React, { Suspense } from 'react';
import ListClient from './ListClient';
import { searchPrompts } from '@/lib/api'; // searchImages에서 searchPrompts로 변경
import { SearchResponse } from '@/types/prompt';

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
    query: query || category,
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
      {/* 초기 뼈대는 즉시 서버에서 완성된 HTML로 전달하고, 
        클라이언트 마운트 시 부드럽게 화면을 채우기 위해 Suspense로 감싸줍니다. 
      */}
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