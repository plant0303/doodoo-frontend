// API에서 반환되는 이미지 항목의 타입 정의 (모든 속성 포함)
export interface ImageItem {
  id: string;
  title: string;
  thumb_url: string;
  preview_url: string; 
  width: number;       
  height: number;      
  category: string;    
}

const WORKERS_API_URL = process.env.NEXT_PUBLIC_WORKERS_API_URL;

/**
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

  const url = `${WORKERS_API_URL}/api/search?q=${encodeURIComponent(q)}&p=${page}&limit=${perPage}`;

  try {
    const response = await fetch(url, {
      // cache: 'no-store', 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ImageItem[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}