// src/app/(site)/list/ListClient.tsx
"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ImageItem, searchImages } from '@/lib/api';
import Pagination from '@/components/common/Pagination';
import { useRouter } from 'next/navigation';

const imagesCache: { [key: string]: ImageItem[] } = {};

interface ListClientProps {
  initialImages: ImageItem[] | { images: ImageItem[], total_count: number, page: number, limit: number };
  initialQuery: string;
  initialPage: number;
  initialTotalPages: number;
  perPage: number;
}

const extractImages = (data: ListClientProps['initialImages']): ImageItem[] => {
  if (Array.isArray(data)) {
    return data;
  }
  // SSR에서 Workers API 응답 전체가 들어올 경우를 대비
  if (typeof data === 'object' && data !== null && 'images' in data && Array.isArray(data.images)) {
    return data.images;
  }
  return [];
};

export default function ListClient({ initialImages: rawInitialImages, initialQuery, initialPage, initialTotalPages, perPage }: ListClientProps) {
  const router = useRouter();

  const safeInitialImages = extractImages(rawInitialImages);

  // 클라이언트 상태 관리
  const [images, setImages] = useState(safeInitialImages);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(initialQuery);

  // 서버에서 받은 초기 데이터를 캐시에 저장하여 재요청 막기
  useEffect(() => {
    const initialKey = `q=${initialQuery}&p=${initialPage}`;
    if (safeInitialImages.length > 0 && !imagesCache[initialKey]) {
      imagesCache[initialKey] = safeInitialImages;
    }
  }, [safeInitialImages, initialPage, initialQuery]);

  /**
   * 페이지 변경 시 CSR로 데이터를 가져오는 함수
   * 캐시를 먼저 확인하고, 없으면 API를 호출한 뒤 캐시에 저장
   */
  const fetchImages = useCallback(async (newPage: number, currentQuery: string) => {
    const cacheKey = `q=${currentQuery}&p=${newPage}`;

    if (imagesCache[cacheKey]) {
      console.log(`[Cache Hit] Data loaded from cache for ${cacheKey}`);
      setImages(imagesCache[cacheKey]);
      setPage(newPage);
      setLoading(false);
      return;
    }

    // 캐시 Miss
    console.log(`[Cache Miss] Calling API for ${cacheKey}`);
    setLoading(true);

    try {
      const newImages = await searchImages(currentQuery, newPage, perPage);

      imagesCache[cacheKey] = newImages;

      setImages(newImages);
      setPage(newPage);
    } catch (error) {
      console.error("Failed to fetch and cache images:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }

  }, [perPage]);



  // SSR Props 변경 감지 및 상태 동기화 (새 검색이나 URL 변경 발생 시)
  useEffect(() => {

    const newImages = extractImages(rawInitialImages);

    // initialQuery 또는 initialPage가 변경되면 (SSR 재실행으로 인한 Props 업데이트)
    if (initialQuery !== query || initialPage !== page) {
      setImages(newImages);
      setPage(initialPage);
      setQuery(initialQuery);
      setLoading(false);

      // 새로운 SSR 데이터가 들어왔을 때도 캐시에 저장
      const newKey = `q=${initialQuery}&p=${initialPage}`;
      if (newImages.length > 0) {
        imagesCache[newKey] = newImages;
      }
    }
  }, [initialQuery, initialPage, rawInitialImages, query, page]);


  const handleSetPage = useCallback((newPage: number) => {
    if (newPage !== page) {
      fetchImages(newPage, query);

      const params = new URLSearchParams();
      params.set('q', query);
      params.set('p', newPage.toString());

      router.push(`/list?${params.toString()}`);
    }
  }, [page, query, fetchImages, router]);



  // 검색 결과가 없는 경우 처리
  const showNoResults = images.length === 0 && !loading;

  return (
    <>
      {/* 현재 검색어 및 페이지 정보 표시 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-6">
          "{initialQuery}"에 대한 검색 결과
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          현재 페이지: {initialPage} / {initialTotalPages}
        </p>
      </div>

      <div className="columns-1 sm:columns-3 md:columns-4 gap-4">
        {loading && (
          <div className="text-center w-full col-span-full py-16 text-lg text-blue-500 animate-pulse">
            데이터 로딩 중... (CSR)
          </div>
        )}

        {!loading && (
          showNoResults ? (
            <div className="text-center w-full col-span-full py-16 text-lg text-gray-500">
              "{query}"에 대한 검색 결과가 없습니다.
            </div>
          ) : (
            images.map((img: ImageItem) => (
              <div
                key={img.id}
                onClick={() => router.push(`/photo/${img.id}`)}
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
              </div>
            ))
          )
        )}
      </div>

      {/* Pagination은 검색 결과가 있고 로딩 중이 아닐 때만 표시 */}
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