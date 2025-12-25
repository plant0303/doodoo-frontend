import { StockItem } from "@/types/StockItem";
import { UploadResponse } from "@/types/UploadResponse";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

const WORKERS_API_URL = process.env.NEXT_PUBLIC_WORKERS_API_URL;
const R2_API_URL = process.env.NEXT_PUBLIC_R2_URL;

export interface ImageItem {
  id: string;
  thumb_url: string;
  title: string;
  category: string;
  uploaded_at: string;
  views: string;
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

// 
// --- 사용자 API ---
// 

// 검색
export async function searchImages({
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

// 상세 이미지 보기
export async function getImageById(id: string): Promise<DetailedImageItem | null> {
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

// 유사이미지 출력
export async function getSimilarImages(id: string) {
  console.log(id);
  const url = `${WORKERS_API_URL}/api/similar?id=${id}`;

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) return null;

  return res.json();
}

// 
// --- 관리자 API ---
// 
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 관리자 인증
export async function verifyAdminRole(token: string): Promise<{ isAdmin: boolean; error: string | null }> {
  try {
    const response = await fetch(`http://127.0.0.1:8787/admin/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { isAdmin: data.isAdmin === true, error: null };
    }

    // 에러 상태 처리 (401, 403 등)
    const errorData = await response.json().catch(() => ({}));
    return {
      isAdmin: false,
      error: errorData.error || `권한 검증 실패 (상태 코드: ${response.status})`
    };

  } catch (e) {
    console.error('Verify Admin Error:', e);
    return { isAdmin: false, error: '서버 연결 오류가 발생했습니다.' };
  }
}

// 관리자 로그아웃
export async function logout(): Promise<void> {
  try {
    // 1. 백엔드 로그아웃 API 호출 (로그 기록이나 세션 무효화 처리를 위해)
    await fetch(`http://127.0.0.1:8787/admin/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    await supabase.auth.signOut();
    window.location.href = '/admin/login'; // 관리자 로그인 페이지로 리다이렉트
  }
}


// 관리자 이미지 업로드
export const uploadBulkImages = async (category: string, items: StockItem[]) => {
  const formData = new FormData();
  formData.append('category', category);

  // 전송용 데이터 구조화
  const payload = items.map((item, index) => {
    // 1. 소스 파일들 추가 (ai, psd 등)
    const sourceFileData = item.sourceFiles.map((f, fileIdx) => {
      const key = `file_${index}_source_${fileIdx}`;
      formData.append(key, f.file);
      return {
        formKey: key,
        extension: f.extension,
        fileSizeMb: f.fileSizeMb,
        width: f.width,
        height: f.height,
        dpi: f.dpi,
      };
    });

    // 2. 프리뷰 파일 추가 (있을 경우)
    let previewKey = null;
    if (item.previewFile) {
      previewKey = `file_${index}_preview`;
      formData.append(previewKey, item.previewFile);
    }

    // 3. 썸네일 파일 추가 (있을 경우)
    let thumbKey = null;
    if (item.thumbFile) {
      thumbKey = `file_${index}_thum`;
      formData.append(thumbKey, item.thumbFile);
    }

    return {
      title: item.title,
      keywords: item.keywords,
      previewFormKey: previewKey,
      thumbFormKey: thumbKey,
      files: sourceFileData,
    };
  });

  formData.append('metadata', JSON.stringify(payload));

  const response = await fetch(`${WORKERS_API_URL}/admin/images/upload`, {
    method: 'POST',
    body: formData,
  });

  return await response.json();
};

// 관리자 이미지 리스트 불러오기
export const fetchImages = async (): Promise<ImageItem[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  
  const response = await fetch(`http://127.0.0.1:8787/admin/images`, {
    cache: 'no-store',
    headers: {
      'Authorization': `Bearer ${token}`, // 이 부분이 반드시 있어야 합니다!
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('이미지 목록을 불러오는데 실패했습니다.');
  }

  const result = await response.json();

  return result.data || [];
};

// 
// admin 스톡 개별수정
// 데이터 불러오기
export const getStockDetail = async (id: string) => {

  const res = await fetch(`${WORKERS_API_URL}/admin/images/edit/${id}`);
  return res.json();
};

// 메타데이터(제목, 키워드) 저장
export const updateStockMetadata = async (id: string, title: string, keywords: string[]) => {
  const res = await fetch(`${WORKERS_API_URL}/admin/images/edit/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, keywords }),
  });
  return res.json();
};

// 파일 삭제
export const deleteStockFile = async (stockId: string, fileId: string, r2Path: string, file_type_id: string) => {
  const res = await fetch(`${WORKERS_API_URL}/admin/images/edit/${stockId}?fileId=${fileId}&r2Path=${encodeURIComponent(r2Path)}&fileType=${file_type_id}`, {
    method: 'DELETE',
  });
  return res.json();
};

// 새 파일 추가
export const addStockFile = async (stockId: string, formData: FormData) => {
  const res = await fetch(`${WORKERS_API_URL}/admin/images/edit/${stockId}`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
};

// 
// 

// admin 스톡 삭제
export const deleteImages = async (ids: string[]) => {
  const res = await fetch(`${WORKERS_API_URL}/admin/images/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || '삭제 작업에 실패했습니다.');
  }

  return res.json();
};