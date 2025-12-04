"use client";

import React, { useCallback, useEffect, useState } from 'react';
interface ImageItem {
  id: string;
  title: string;
  thumb_url: string;
}
interface SearchResponse {
  images: ImageItem[];
  total_count: number;
  page: number;
  limit: number;
}
const searchImages = async (params: any): Promise<SearchResponse> => {
  console.log("Mock API Call with params:", params);
  return {
    images: [],
    total_count: 0,
    page: params.page,
    limit: params.perPage,
  };
};

const Pagination = ({ page, totalPages, setPage }: { page: number, totalPages: number, setPage: (p: number) => void }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8 space-x-2">
      <button 
        onClick={() => setPage(page - 1)} 
        disabled={page === 1}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg disabled:bg-gray-400"
      >
        이전
      </button>
      <span className="px-4 py-2 text-sm text-gray-700">페이지 {page} / {totalPages}</span>
      <button 
        onClick={() => setPage(page + 1)} 
        disabled={page === totalPages}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg disabled:bg-gray-400"
      >
        다음
      </button>
    </div>
  );
};

const useRouter = () => ({
  push: (url: string) => { console.log(`[Router Mock] Pushing to ${url}`); }
});
const Link = (props: any) => <a {...props} href={props.href}>{props.children}</a>;


const imagesCache: { [key: string]: ImageItem[] } = {};

interface ListClientProps {
  initialImages: ImageItem[] | { images: ImageItem[], total_count: number, page: number, limit: number };
  initialQuery: string;
  initialPage: number;
  initialTotalPages: number;
  perPage: number;
  isCategorySearch: boolean;
}

const extractImages = (data: ListClientProps['initialImages']): ImageItem[] => {
  if (Array.isArray(data)) {
    return data;
  }
  if (typeof data === 'object' && data !== null && 'images' in data && Array.isArray(data.images)) {
    return data.images;
  }
  return [];
};

export default function ListClient({
  initialImages: rawInitialImages,
  initialQuery,
  initialPage,
  initialTotalPages,
  perPage,
  isCategorySearch,
}: ListClientProps) {
  const router = useRouter();

  const safeInitialImages = extractImages(rawInitialImages);

  // 클라이언트 상태 관리
  const [images, setImages] = useState<ImageItem[]>(safeInitialImages); 
  const [currentTerm, setCurrentTerm] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [isCategory, setIsCategory] = useState(isCategorySearch);

  // 서버에서 받은 초기 데이터를 캐시에 저장하여 재요청 막기
  useEffect(() => {
    const keyPrefix = isCategorySearch ? 'category' : 'q';
    const initialKey = `${keyPrefix}=${initialQuery}&p=${initialPage}`;
    if (safeInitialImages.length > 0 && !imagesCache[initialKey]) {
      imagesCache[initialKey] = safeInitialImages;
    }
  }, [safeInitialImages, initialPage, initialQuery, isCategorySearch]);

  const fetchImages = useCallback(async (newPage: number, term: string, isCategorySearch: boolean) => {
    const keyPrefix = isCategorySearch ? 'category' : 'q';
    const cacheKey = `${keyPrefix}=${term}&p=${newPage}`;

    if (imagesCache[cacheKey]) {
      console.log(`[Cache Hit] Data loaded from cache for ${cacheKey}`);
      setImages(imagesCache[cacheKey]!);
      setPage(newPage);
      setLoading(false);
      return;
    }

    // 캐시 Miss
    console.log(`[Cache Miss] Calling API for ${cacheKey}`);
    setLoading(true);

    try {
      const apiParams: { page: number, perPage: number, category?: string, query?: string } = {
        page: newPage,
        perPage: perPage
      };

      if (isCategorySearch) {
        apiParams.category = term;
      } else {
        apiParams.query = term;
      }

      const newImagesResponse = await searchImages(apiParams);

      imagesCache[cacheKey] = newImagesResponse.images;

      setImages(newImagesResponse.images);
      setPage(newPage);

    } catch (error) {
      console.error("Failed to fetch and cache images:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }

  }, [perPage]);


  // SSR Props 변경 감지 및 상태 동기화
  useEffect(() => {
    const newImages = extractImages(rawInitialImages);

    if (initialQuery !== currentTerm || initialPage !== page || isCategorySearch !== isCategory) {
      setImages(newImages);
      setPage(initialPage);
      setCurrentTerm(initialQuery);
      setIsCategory(isCategorySearch);
      setLoading(false);

      const keyPrefix = isCategorySearch ? 'category' : 'q';
      const newKey = `${keyPrefix}=${initialQuery}&p=${initialPage}`;
      if (newImages.length > 0) {
        imagesCache[newKey] = newImages;
      }
    }
  }, [initialQuery, initialPage, rawInitialImages, currentTerm, page, isCategorySearch, isCategory]);

  const handleSetPage = useCallback((newPage: number) => {
    if (newPage !== page) {
      fetchImages(newPage, currentTerm, isCategory);

      const params = new URLSearchParams();
      if (isCategory) {
        params.set('category', currentTerm);
      } else {
        params.set('q', currentTerm);
      }

      params.set('p', newPage.toString());

      router.push(`/list?${params.toString()}`);
    }
  }, [page, currentTerm, isCategory, fetchImages, router]);


  // ✅ 검색 결과 없음 상태 계산
  const showNoResults = images.length === 0 && !loading;


  return (
    <>
      {/* 현재 검색어 및 페이지 정보 표시 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-6">
          "{initialQuery}"에 대한 {isCategory ? '카테고리' : '검색'} 결과
        </h2>
        {
          loading && (
            <p className="text-sm text-gray-500 mt-1">
              현재 페이지: {initialPage} / {initialTotalPages}
            </p>
          )
        }
      </div>


      {!loading && showNoResults && (
        <div className="block w-full text-center py-16 text-lg text-gray-600">
          "{currentTerm}"에 대한 검색 결과가 없습니다.
        </div>
      )}
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
        {loading && (
          <div className="text-center w-full col-span-full py-16 text-lg text-blue-500 animate-pulse">
            데이터 로딩 중...
          </div>
        )}

        {!loading && !showNoResults && (
          images.map((img: ImageItem) => (
            <Link
              key={img.id}
              href={`/photo/${img.id}`}
              className="group block mb-4 break-inside-avoid shadow-lg rounded-xl overflow-hidden transition duration-300 transform hover:scale-[1.01] hover:shadow-2xl"
            >
              <div className="relative overflow-hidden">
                {/* 이미지 표시 */}
                <img
                  src={img.thumb_url}
                  alt={img.title || `Image ${img.id}`}
                  className="w-full h-auto object-cover transition duration-300 group-hover:opacity-80"
                  loading="lazy"
                  // 이미지 로드 실패 시 대체 이미지
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://placehold.co/400x300/e5e7eb/7f7f7f?text=No+Image`;
                  }}
                />
                {/* 이미지 위에 제목 오버레이 */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-2 px-3 opacity-0 group-hover:opacity-100 transition duration-300">
                  <p className="text-white text-xs font-semibold truncate">
                    {img.title}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )
        }
      </div>

      {initialQuery && !loading && !showNoResults && (
        <Pagination
          page={page}
          totalPages={initialTotalPages}
          setPage={handleSetPage}
        />
      )}
    </>
  );
}