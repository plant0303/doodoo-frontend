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

export interface SearchResponse {
  query: string;
  prompts: PromptItem[];
  total_count: number;
}