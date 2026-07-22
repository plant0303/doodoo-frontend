'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// 카테고리 객체 타입 정의
interface CategoryInfo {
  id?: string;
  slug: string;
  name: string;
}

interface DetailBreadcrumbProps {
  title: string;          // 상세 아이템 제목/프롬프트 이름
  categoryName?: CategoryInfo | string;  // 해당 아이템의 기본 카테고리
}

export default function DetailBreadcrumb({ title, categoryName }: DetailBreadcrumbProps) {
  const searchParams = useSearchParams();

  // 이전 목록 페이지의 상태(검색어, 카테고리, 페이지 번호) 유지를 위한 파라미터 추출
  const fromQuery = searchParams.get('q');
  const fromCategory = searchParams.get('category');
  const fromPage = searchParams.get('p') || '1';

  const categoryDisplayName = typeof categoryName === 'object' ? categoryName.name : categoryName;
  const categorySlug = typeof categoryName === 'object' ? categoryName.slug : categoryName;
  
  return (
    <nav className="flex lg:justify-end items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6 py-3  overflow-x-auto whitespace-nowrap md:justify-start ">
      <Link href="/" className="hover:text-blue-700 transition-colors flex-shrink-0">
        홈
      </Link>

      <span className="text-gray-300 flex-shrink-0">/</span>

      {fromQuery ? (
        <>
          <Link
            href={`/list?q=${encodeURIComponent(fromQuery)}&p=${fromPage}`}
            className="hover:text-blue-700 transition-colors flex-shrink-0 max-w-[120px] sm:max-w-[180px] truncate"
          >
            '{fromQuery}' 검색 결과
          </Link>
          <span className="text-gray-300 flex-shrink-0">/</span>
        </>
      ) : fromCategory ? (
        <>
          {/* <Link
            href={`/list?category=${encodeURIComponent(fromCategory)}&p=${fromPage}`}
            className="hover:text-blue-700 transition-colors flex-shrink-0"
          > */}
            {fromCategory}
          {/* </Link> */}
          <span className="text-gray-300 flex-shrink-0">/</span>
        </>
      ) : categoryName ? (
        <>
          {/* <Link
            href={`/list?category=${encodeURIComponent(categorySlug || '')}`}
            className="hover:text-blue-700 transition-colors flex-shrink-0"
          > */}
            {categoryDisplayName}
          {/* </Link> */}
          <span className="text-gray-300 flex-shrink-0">/</span>
        </>
      ) : null}

      <span className="font-semibold text-gray-900 flex-shrink-0 max-w-[200px] sm:max-w-[300px] truncate">
        {title}
      </span>
    </nav>
  );
}