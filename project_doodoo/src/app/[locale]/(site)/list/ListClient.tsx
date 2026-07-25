'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PromptItem, SearchResponse,  } from '../../../../types/prompt';
import { searchPrompts } from '../../../../lib/api';

const Pagination = ({ page, totalPages, setPage }: { page: number, totalPages: number, setPage: (p: number) => void }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-12 space-x-2">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
      >
        이전
      </button>
      <span className="px-4 py-2 text-sm text-gray-700 font-medium">페이지 {page} / {totalPages}</span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
      >
        다음
      </button>
    </div>
  );
};

// 클라이언트 메모리 캐시 저장소
const promptsCache: { [key: string]: PromptItem[] } = {};

interface ListClientProps {
  initialData: SearchResponse;
  initialQuery: string;
  initialPage: number;
  initialTotalPages: number;
  perPage: number;
  isCategorySearch: boolean;
}

export default function ListClient({
  initialData,
  initialQuery,
  initialPage,
  initialTotalPages,
  perPage,
  isCategorySearch,
}: ListClientProps) {
  const router = useRouter();

  const safeInitialPrompts = initialData?.prompts || [];

  const [prompts, setPrompts] = useState<PromptItem[]>(safeInitialPrompts);
  const [currentTerm, setCurrentTerm] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [isCategory, setIsCategory] = useState(isCategorySearch);

  // 서버 데이터 캐시 등록 및 URL(Props) 변경 시에만 동기화
  useEffect(() => {
    const keyPrefix = isCategorySearch ? 'category' : 'q';
    const cacheKey = `${keyPrefix}=${initialQuery}&p=${initialPage}`;

    // 서버 데이터를 캐시에 즉시 보관
    if (safeInitialPrompts.length > 0 && !promptsCache[cacheKey]) {
      promptsCache[cacheKey] = safeInitialPrompts;
    }

    // 뒤로가기/앞으로가기나 URL direct input으로 Props가 바뀔 때만 State 업데이트
    setPrompts(safeInitialPrompts);
    setPage(initialPage);
    setCurrentTerm(initialQuery);
    setIsCategory(isCategorySearch);
    setLoading(false);
  }, [initialData, initialQuery, initialPage, isCategorySearch]);

  // 3. 페이지네이션 버튼 클릭 시 호출되는 API (캐시 확인 후 없으면만 패칭)
  const fetchPrompts = useCallback(
    async (newPage: number, term: string, isCategorySearch: boolean) => {
      const keyPrefix = isCategorySearch ? 'category' : 'q';
      const cacheKey = `${keyPrefix}=${term}&p=${newPage}`;

      // [Cache Hit] 캐시에 있으면 API 요청 안 함!
      if (promptsCache[cacheKey]) {
        console.log(`[Cache Hit] Loaded from cache: ${cacheKey}`);
        setPrompts(promptsCache[cacheKey]!);
        setPage(newPage);
        setLoading(false);
        return;
      }

      // [Cache Miss] API 호출
      console.log(`[Cache Miss] Calling Search API: ${cacheKey}`);
      setLoading(true);

      try {
        const apiParams = {
          page: newPage,
          perPage,
          ...(isCategorySearch ? { category: term } : { query: term }),
        };

        const response: SearchResponse = await searchPrompts(apiParams);

        const fetchedPrompts = response.prompts || [];

        promptsCache[cacheKey] = fetchedPrompts;
        setPrompts(fetchedPrompts);
        setPage(newPage);
      } catch (error) {
        console.error('Failed to fetch prompts:', error);
        setPrompts([]);
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  const handleSetPage = useCallback(
    (newPage: number) => {
      if (newPage !== page) {
        // 클라이언트에서 먼저 캐시/패칭으로 데이터를 즉시 렌더링
        fetchPrompts(newPage, currentTerm, isCategory);

        // URL 쿼리 파라미터 업데이트 (뒤로가기 및 공유 가능한 주소 유지)
        const params = new URLSearchParams();
        if (isCategory) {
          params.set('category', currentTerm);
        } else {
          params.set('q', currentTerm);
        }
        params.set('p', newPage.toString());

        router.push(`/list?${params.toString()}`, { scroll: false });
      }
    },
    [page, currentTerm, isCategory, fetchPrompts, router]
  );

  const showNoResults = prompts.length === 0 && !loading;
  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* 검색 결과 헤더 정보 (SEO 및 사용자 인지용) */}
      <div className="hidden mb-8">
        {initialQuery && (
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            "{initialQuery}" {isCategory ? '카테고리' : '검색'} 결과
            <span className="text-sm font-normal text-gray-500 ml-2">
              (총 {initialData.total_count}개)
            </span>
          </h1>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        </div>
      )}

      {!loading && showNoResults && (
        <div className="text-center py-24 text-lg text-gray-500">
          "{currentTerm}"에 대한 검색 결과가 없습니다.
        </div>
      )}

      {/* 핀터레스트 스타일 Masonry 그리드 렌더링 */}
      {!loading && !showNoResults && (

        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 space-y-6">
          {prompts.map((prompt) => {
            // R2 저장소 풀 주소 조립
            return (
              <div
                key={prompt.id}
                className="break-inside-avoid bg-white border border-gray-100  hover:shadow-xl rounded-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <Link href={`prompt/${prompt.slug}`} target='_blank'>
                  <div className="relative overflow-hidden bg-gray-100">
                    <img
                      src={prompt.imageThumbnailKey}
                      alt={prompt.imageAlt || prompt.title}
                      className="w-full h-auto object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://placehold.co/600x900/f3f4f6/9ca3af?text=No+Image`;
                      }}
                    />

                    {/* 카테고리 태그 오버레이 */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white bg-black/60 backdrop-blur-md rounded-full uppercase">
                        {prompt.category.name}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {initialQuery && !loading && !showNoResults && (
        <Pagination
          page={page}
          totalPages={initialTotalPages}
          setPage={handleSetPage}
        />
      )}
    </div>
  );
}