export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// 카드 리스트 및 검색 결과
export interface PromptItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageThumbnailKey: string;     // R2 이미지 경로 (또는 풀 URL)
  imagePreviewKey: string;     // R2 이미지 경로 (또는 풀 URL)
  imageAlt?: string;
  category: Category;
  tags: Tag[];
}

export interface SubOption {
  id: string;
  name: string;
  slug: string;
}

// 상세 페이지 응답 타입
export interface PromptDetailResponse {
  id: string;
  slug: string;
  title: string;
  summary: string;
  base_prompt: string;
  edit_fields: Array<{
    key: string;
    type: string;
    label: string;
    default: string;
    options?: string[];
  }>;
  image_preview_url: string;
  image_thumbnail_url: string;
  image_alt: string;
  category: {
    id: string;
    slug: string;
    name: string;
  };
  sub_option?: SubOption | null;
  tags: Array<{
    id: string;
    slug: string;
    name: string;
    group_name: string;
  }>;
  created_at: string;
}

// 검색 API 응답 타입
export interface SearchResponse {
  prompts: PromptItem[];
  query?: string;
  category?: string;
  lang?: string;
  total_count: number;
  page?: number;
  limit?: number;
  total_pages?: number;
}

export interface SimilarImageItem {
  id: string;
  slug: string;
  title: string;
  images: {
    thumbnail_url: string;
  }
}