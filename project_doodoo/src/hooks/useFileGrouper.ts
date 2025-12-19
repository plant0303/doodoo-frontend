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
        URL.revokeObjectURL(img.src); // 메모리 해제
        resolve(dimensions);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const groupFiles = async (files: File[]): Promise<StockItem[]> => {
    setIsProcessing(true);
    const groupMap = new Map<string, StockItem>();

    for (const file of files) {
      const lastDotIndex = file.name.lastIndexOf('.');
      const fileNameWithoutExt = lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name;
      const extension = lastDotIndex !== -1 ? file.name.substring(lastDotIndex + 1).toLowerCase() : '';

      const dimensions = await getImageDimensions(file);
      const fileDetail: FileDetail = {
        file,
        extension,
        fileSizeMb: (file.size / (1024 * 1024)).toFixed(2),
        width: dimensions.w > 0 ? dimensions.w : undefined,
        height: dimensions.h > 0 ? dimensions.h : undefined,
        dpi: 300,
      };

      if (groupMap.has(fileNameWithoutExt)) {
        const existing = groupMap.get(fileNameWithoutExt)!;
        existing.sourceFiles.push(fileDetail);
        if (['jpg', 'jpeg', 'png'].includes(extension)) {
          existing.previewUrl = URL.createObjectURL(file);
        }
      } else {
        groupMap.set(fileNameWithoutExt, {
          id: crypto.randomUUID(), // 고유 ID 생성
          title: fileNameWithoutExt,
          category: "",
          keywords: [],
          previewUrl: ['jpg', 'jpeg', 'png'].includes(extension) ? URL.createObjectURL(file) : '',
          sourceFiles: [fileDetail],
        });
      }
    }

    setIsProcessing(false);
    return Array.from(groupMap.values());
  };

  return { groupFiles, isProcessing };
};