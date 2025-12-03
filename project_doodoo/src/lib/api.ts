
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
  preview_url: string;
  file_size_mb: number;
  keywords: string[];
}

interface SearchResponse {
  images: ImageItem[];
  total_count: number;
  page: number;
  limit: number;
}

export interface FileDownloadOption {
  file_type_id: number;
  extension: string;
  label: string;
  mime_type: string;
  file_size_mb: number;
  width: number;
  height: number;
  dpi: number;
}

export interface DetailedImageItem extends ImageItem {
  category: string;
  preview_url: string;
  keywords: string[];
  // 💡 개별 필드 제거됨 (가장 큰/기본 옵션에서 추출 예정)
  // width: number;
  // height: number;
  // dpi: number;
  // file_size_mb: number;

  // ✅ 새로운 필드: 지원하는 모든 파일 형식 목록
  download_options: FileDownloadOption[];
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

async function getImageById(id: string): Promise<DetailedImageItem | null> {

  if (!WORKERS_API_URL) {
    console.error("NEXT_PUBLIC_WORKERS_API_URL is not set.");
    return null;
  }

  const url = `${WORKERS_API_URL}/api/photo?id=${id}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 * 60 * 24 } // 24시간 캐시 유지
    });

    if (!response.ok) {
      console.error(`Failed to fetch image detail for ID ${id}. Status: ${response.status}`);
      return null;
    }

    const data: DetailedImageItem = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching image detail for ID ${id}:`, error);
    return null;
  }
}


export { searchImages, getImageById };