
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
  full_url: any;
  category: string;
  preview_url: string;
  keywords: string[];
  download_options: FileDownloadOption[];
  description: string;
}


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
      next: { revalidate: 86400 } // 24시간 캐시 유지
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

export async function verifyAdminRole(token: string): Promise<{ isAdmin: boolean; error: string | null }> {
  try {
    const response = await fetch(`${WORKERS_API_URL}/api/admin/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    // 200 OK: 권한 확인 성공
    if (response.status === 200) {
      const data = await response.json();
      return { isAdmin: data.isAdmin === true, error: null };
    }

    // 401, 403 등 오류 응답 처리
    const errorData = await response.json();
    const errorMessage = errorData.error || `권한 검증 실패: HTTP ${response.status}`;
    
    return { isAdmin: false, error: errorMessage };

  } catch (e) {
    // 네트워크 오류, CORS 오류 등이 발생했을 경우
    console.error("Workers API 연결 오류:", e);
    return { isAdmin: false, error: '서버 연결 오류가 발생했습니다. (Workers API)' };
  }
}

export { searchImages, getImageById };