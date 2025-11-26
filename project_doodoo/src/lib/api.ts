// src/lib/api.ts

// API에서 반환되는 이미지 항목의 타입 정의
export interface ImageItem {
  id: string;
  title: string;
  thumb_url: string;
  preview_url: string;
  width: number;
  height: number;
  category: string;
}

// 환경 변수에서 API URL을 가져옵니다.
// 이 코드는 서버와 클라이언트 모두에서 실행될 수 있으며, 환경 변수를 사용합니다.
const WORKERS_API_URL = process.env.NEXT_PUBLIC_WORKERS_API_URL;

/**
 * Workers API에서 이미지를 검색하고 가져옵니다.
 * API가 배열을 반환한다고 가정하고, 오류 처리 로직을 포함합니다.
 * @param q 검색어
 * @param page 페이지 번호 (기본값 1)
 * @param perPage 한 페이지당 항목 수
 * @returns ImageItem 배열
 */
export async function searchImages(q: string, page: number = 1, perPage: number): Promise<ImageItem[]> {
  if (!WORKERS_API_URL) {
    console.error("NEXT_PUBLIC_WORKERS_API_URL is not set.");
    return [];
  }

  // API 호출 URL을 구성합니다.
  const url = `${WORKERS_API_URL}/api/search?q=${encodeURIComponent(q)}&p=${page}&limit=${perPage}`;

  try {
    const response = await fetch(url, {
      // SSR 시 캐시를 비활성화 (필요에 따라 cache: 'force-cache'로 변경 가능)
      cache: 'no-store', 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // API 응답은 ImageItem[] 배열 형식입니다.
    const data: ImageItem[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching images:", error);
    return []; // 오류 발생 시 빈 배열 반환
  }
}