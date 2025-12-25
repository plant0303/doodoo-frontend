// src/types/StockItem.ts

export interface FileDetail {
  file: File;
  extension: string;
  fileSizeMb: string;
  width: number | null; 
  height: number | null;
  dpi?: number | null;
  r2Path: string;
}

export interface StockItem {
  id: string; // 클라이언트 측 관리를 위한 고유 ID (파일명 등)
  title: string;
  category: string;
  keywords: string[];
  previewUrl: string; // 대표 미리보기 (주로 JPG/PNG)
  thumbUrl: string;
  previewFile?: File; 
  thumbFile?: File;   
  // 그룹화된 파일들
  sourceFiles: FileDetail[];
}