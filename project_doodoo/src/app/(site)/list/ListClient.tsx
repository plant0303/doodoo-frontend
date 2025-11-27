// src/app/(site)/list/ListClient.tsx
"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ImageItem, searchImages } from '@/lib/api';
import Pagination from '@/components/common/Pagination';
import { useRouter } from 'next/navigation'; 

// Workers API
interface ListClientProps {
  initialImages: ImageItem[];
  initialQuery: string;
  initialPage: number;
  initialTotalPages: number;
  perPage: number;
}

export default function ListClient({ initialImages, initialQuery, initialPage, initialTotalPages, perPage }: ListClientProps) {
  const router = useRouter();
  // 클라이언트 상태 관리
  const [images, setImages] = useState(initialImages);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(initialQuery);

  // 페이지 변경 시 CSR로 데이터를 가져오는 함수
  const fetchImages = useCallback(async (newPage: number, currentQuery: string) => {
    setLoading(true);
    // CSR API 호출
    const newImages = await searchImages(currentQuery, newPage, perPage);

    setImages(newImages);
    setPage(newPage);
    setLoading(false);

  }, [perPage]);


  // SSR Props 변경 감지 및 상태 동기화 (새 검색이나 URL 변경 발생 시)
  useEffect(() => {
    // initialQuery 또는 initialPage가 변경되면 (SSR 재실행으로 인한 Props 업데이트)
    if (initialQuery !== query || initialPage !== page || initialImages !== images) {
      setImages(initialImages);
      setPage(initialPage);
      setQuery(initialQuery);
      setLoading(false);
    }
  }, [initialQuery, initialPage, initialImages, query, page]);


  const handleSetPage = useCallback((newPage: number) => {
    if (newPage !== page) {
      // 1. 새로운 데이터를 CSR로 가져옵니다.
      fetchImages(newPage, query);

      // 2. URL 쿼리 파라미터를 업데이트합니다. (URLSearchParams 사용)
      const params = new URLSearchParams();
      params.set('q', query);
      params.set('p', newPage.toString());

      // 3. 브라우저의 URL 주소를 업데이트합니다. (페이지 전환 효과 없이)
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