import 'server-only'; 

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
async function searchImages(q: string, page: number = 1, perPage: number): Promise<ImageItem[]> {
  if (!WORKERS_API_URL) {
    console.error("NEXT_PUBLIC_WORKERS_API_URL is not set.");
    return [];
  }

  const url = `${WORKERS_API_URL}/api/search?q=${encodeURIComponent(q)}&p=${page}&limit=${perPage}`;

  try {
    const response = await fetch(url, {
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: SearchResponse = await response.json();
    return result.images;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
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