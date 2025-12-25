import { useState } from 'react';
import { StockItem, FileDetail } from '../types/StockItem';

export const useFileGrouper = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const getImageDimensions = (file: File): Promise<{ w: number; h: number }> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) return resolve({ w: 0, h: 0 });
      const img = new Image();
      img.onload = () => {
        const dimensions = { w: img.width, h: img.height };
        URL.revokeObjectURL(img.src);
        resolve(dimensions);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const groupFiles = async (files: File[]): Promise<StockItem[]> => {
    setIsProcessing(true);
    const groupMap = new Map<string, StockItem>();

    for (const file of files) {
      // 1. 확장자 및 파일명 분리
      const lastDotIndex = file.name.lastIndexOf('.');
      const fileNameOnly = lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name;
      const extension = lastDotIndex !== -1 ? file.name.substring(lastDotIndex + 1).toLowerCase() : '';

      // 2. 그룹 키 생성 (_preview, _thum 제거)
      const groupKey = fileNameOnly.replace(/(_preview|_thum)$/, '');

      const dimensions = await getImageDimensions(file);
      const fileDetail: FileDetail = {
        file,
        extension,
        fileSizeMb: (file.size / (1024 * 1024)).toFixed(2),
        width: dimensions.w > 0 ? dimensions.w : null,
        height: dimensions.h > 0 ? dimensions.h : null,
        dpi: 300,
        r2Path: '',
      };

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          id: crypto.randomUUID(),
          title: groupKey,
          category: "",
          keywords: [],
          previewUrl: "", // 초기값 빈 문자열 (또는 null)
          thumbUrl: "",   // 초기값 빈 문자열 (또는 null)
          sourceFiles: [],
        });
      }

      const existing = groupMap.get(groupKey)!;

      // 3. 네이밍 규칙에 따른 분기 처리
      // _preview가 붙은 파일만 previewUrl에 할당
      if (fileNameOnly.endsWith('_preview')) {
        existing.previewUrl = URL.createObjectURL(file);
        existing.previewFile = file; // 원본 파일 저장
      } else if (fileNameOnly.endsWith('_thum')) {
        existing.thumbUrl = URL.createObjectURL(file);
        existing.thumbFile = file; // 원본 파일 저장
      } else {
        existing.sourceFiles.push(fileDetail);
      }
    }

    setIsProcessing(false);
    return Array.from(groupMap.values());
  };

  return { groupFiles, isProcessing };
};