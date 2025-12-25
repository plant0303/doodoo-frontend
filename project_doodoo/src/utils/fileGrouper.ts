// utils/fileGrouper.ts
import { StockItem } from '@/types/StockItem';

export const groupFilesByName = (files: File[]): Partial<StockItem>[] => {
  const groupMap: Record<string, { files: File[] }> = {};

  files.forEach((file) => {
    // 확장자 제거 (마지막 마침표 기준)
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    
    if (!groupMap[fileName]) {
      groupMap[fileName] = { files: [] };
    }
    groupMap[fileName].files.push(file);
  });

  return Object.entries(groupMap).map(([name, group]) => {
    // 대표 미리보기는 JPG 또는 PNG 우선, 없으면 첫 번째 파일
    const previewFile = group.files.find(f => 
      ['image/jpeg', 'image/png'].includes(f.type)
    ) || group.files[0];

    return {
      title: name,
      previewUrl: URL.createObjectURL(previewFile),
      // 나중에 DB 저장을 위해 파일들을 확장자와 함께 저장
      stockFiles: group.files.map(f => ({
        file: f,
        extension: f.name.split('.').pop()?.toLowerCase() || '',
        fileSizeMb: parseFloat((f.size / (1024 * 1024)).toFixed(2))
      })),
      keywords: [],
      dpi: 72 // 기본값
    };
  });
};