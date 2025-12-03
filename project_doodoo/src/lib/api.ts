
const WORKERS_API_URL = process.env.NEXT_PUBLIC_WORKERS_API_URL;

export interface ImageItem {
  id: string;
  thumb_url: string;
  title: string;
}

export interface UnsplashItem extends ImageItem {
  full_url: string;
  width: number;
  height: number;
  description: string;
  license: string;
  dpi: number;
  size_mb: number;
}

interface SearchResponse {
  images: ImageItem[];
  total_count: number;
  page: number;
  limit: number;
}


/**
 * @param q 검색어
 * @param page 페이지 번호 (기본값 1)
 * @param perPage 한 페이지당 항목 수
 * @returns ImageItem 배열
 */
async function searchImages(query: string, page: number, perPage: number): Promise<SearchResponse> {
  if (!WORKERS_API_URL) {
    console.error("NEXT_PUBLIC_WORKERS_API_URL is not set.");
    // 타입에 맞는 기본값 반환
    return { images: [], total_count: 0, page: page, limit: perPage };
  }

  // q를 query로 변경하여 일관성을 유지하고, limit을 perPage로 사용합니다.
  const url = `${WORKERS_API_URL}/api/search?q=${encodeURIComponent(query)}&p=${page}&limit=${perPage}`;

  try {
    const response = await fetch(url, {
      // Next.js Server Component에서 SSR 시 캐시를 사용하지 않도록 no-store를 추가하는 것이 일반적입니다.
      // revalidate = 300이 최상단에 있지만, fetch 옵션도 명시적으로 설정할 수 있습니다.
      // cache: 'force-cache' // 상단의 revalidate = 300 설정이 이 값을 오버라이드합니다.
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: SearchResponse = await response.json();

    // [수정] 이미지 배열이 아닌, SearchResponse 전체 객체를 반환합니다.
    return result;

  } catch (error) {
    console.error("Error fetching images:", error);
    // 에러 발생 시 타입에 맞는 기본값 반환
    return { images: [], total_count: 0, page: page, limit: perPage };
  }
}

async function getImageById(id: string): Promise<UnsplashItem | null> {
  if (!WORKERS_API_URL) {
    console.error("NEXT_PUBLIC_WORKERS_API_URL is not set.");
    return null;
  }

  const url = `${WORKERS_API_URL}/api/photo/${id}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 * 60 * 24 } // 24시간 캐시 유지
    });

    if (!response.ok) {
      console.error(`Failed to fetch image detail for ID ${id}. Status: ${response.status}`);
      return null;
    }

    const data: UnsplashItem = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching image detail for ID ${id}:`, error);
    return null;
  }
}

export { searchImages, getImageById };