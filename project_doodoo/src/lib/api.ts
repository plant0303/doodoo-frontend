
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
  download_options: FileDownloadOption[];
}

/**
 * @param params 검색에 필요한 파라미터 객체
 * @param params.query 검색어 (선택 사항)
 * @param params.category 카테고리 이름 (선택 사항, query가 없으면 category로 검색)
 * @param params.page 페이지 번호 (기본값 1)
 * @param params.perPage 한 페이지당 항목 수
 * @returns SearchResponse 객체
 */
async function searchImages({
  query,
  category,
  page,
  perPage,
}: {
  query?: string;
  category?: string;
  page: number;
  perPage: number;
}): Promise<SearchResponse> {
  if (!WORKERS_API_URL) {
    console.error("NEXT_PUBLIC_WORKERS_API_URL is not set.");
    return { images: [], total_count: 0, page: page, limit: perPage };
  }

  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (category && category !== "all") {
    params.set("category", category);
  }

  params.set("p", page.toString());
  params.set("limit", perPage.toString());

  const url = `${WORKERS_API_URL}/api/search?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: SearchResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching images:", error);
    return { images: [], total_count: 0, page: page, limit: perPage };
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

export async function getSimilarImages(id: string) {
  console.log(id);
  const url = `${WORKERS_API_URL}/api/similar?id=${id}`;

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) return null;

  return res.json();
}

export { searchImages, getImageById };