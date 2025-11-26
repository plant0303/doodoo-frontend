// src/app/(site)/list/ListClient.tsx
"use client";

import React, { useCallback } from 'react';
import Link from 'next/link';
// App Router에서 클라이언트 라우팅을 위한 올바른 훅
import { useRouter } from 'next/navigation'; 
import { ImageItem } from '@/lib/api';
import Pagination from '@/components/common/Pagination';

// Workers API
interface ListClientProps {
  initialImages: ImageItem[];
  initialQuery: string;
  initialPage: number;
  initialTotalPages: number;
}

const WORKERS_API_URL = process.env.NEXT_PUBLIC_WORKERS_API_URL;
const PER_PAGE = 30; // 한 페이지당 30장 로드


export default function ListClient({ initialImages, initialQuery, initialPage, initialTotalPages }: ListClientProps) {
  const router = useRouter();
  const items = initialImages;
  const loading = false; // 데이터는 SSR로 로드되었으므로 로딩 상태는 false

  // Pagination 컴포넌트에 전달할 setPage 함수
  // 이 함수는 새 페이지 번호를 받아 URL을 업데이트합니다.
  const handleSetPage = useCallback((newPage: number) => {
    // 1. URLSearchParams를 사용하여 새 쿼리 문자열 생성
    const params = new URLSearchParams();
    params.set('q', initialQuery); // 기존 검색어 유지
    params.set('p', newPage.toString()); // 새 페이지 번호 설정
    
    // 2. 새로운 URL로 push하여 SSR을 다시 트리거합니다.
    // 이 작업이 완료되면 page.tsx가 새 데이터로 다시 렌더링됩니다.
    router.push(`/list?${params.toString()}`);
  }, [initialQuery, router]);


  return (
    <>
      {/* 현재 검색어 및 페이지 정보 표시 */}
      <div className="mb-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            "{initialQuery}"에 대한 검색 결과
        </h2>
        <p className="text-sm text-gray-500 mt-1">
            현재 페이지: {initialPage} / {initialTotalPages}
        </p>
      </div>

      <div className="columns-1 sm:columns-3 md:columns-4 gap-4">
        {items.length === 0 && !loading ? (
          <div className="text-center w-full col-span-full py-16 text-lg text-gray-500">
            "{initialQuery}"에 대한 검색 결과가 없습니다.
          </div>
        ) : (
          items.map((img: ImageItem) => (
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
        )}
      </div>
      
      {/* Pagination (페이지네이션) 컴포넌트 연결 */}
      <Pagination 
        page={initialPage} 
        totalPages={initialTotalPages} 
        setPage={handleSetPage} // URL 업데이트 로직을 전달
      />
    </>
  );
}