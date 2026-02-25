'use client';
import React, { useCallback, useState } from 'react';
import { StockItem } from '../../../../../types/StockItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useFileGrouper } from '@/hooks/useFileGrouper';

export default function FileUploader({ onUpload, onBack }: { onUpload: (items: StockItem[]) => void; onBack: () => void }) {
  const { groupFiles, isProcessing } = useFileGrouper();
  const [isDragging, setIsDragging] = useState(false);

  // 2. 공통 파일 처리 함수
  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    const groupedItems = await groupFiles(files);
    onUpload(groupedItems);
  }, [groupFiles, onUpload]);

  // 3. 드래그 이벤트 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isProcessing) return;

    // 드롭된 파일 리스트 추출
    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const getImageDimensions = (file: File): Promise<{ w: number; h: number }> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) return resolve({ w: 0, h: 0 });
      const img = new Image();
      img.onload = () => resolve({ w: img.width, h: img.height });
      img.src = URL.createObjectURL(file);
    });
  };


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const groupedItems = await groupFiles(files);
    onUpload(groupedItems);
  };

  return (
    <div className="mx-auto animate-fadeIn">
      <button onClick={onBack} className="mb-6 text-gray-500 hover:text-indigo-600">
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> 카테고리 다시 선택
      </button>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-4 border-dashed rounded-3xl p-20 text-center transition-all duration-200
          ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.01]' : 'border-gray-200 bg-gray-50'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          id="files"
          multiple
          hidden
          onChange={handleFileChange}
          disabled={isProcessing}
        />
        <label htmlFor="files" className="cursor-pointer block">
          <FontAwesomeIcon
            icon={isProcessing ? faSpinner : faCloudUploadAlt}
            className={`text-7xl text-indigo-200 mb-6 ${isProcessing ? 'animate-spin' : ''}`}
          />
          <h2 className="text-2xl font-bold mb-2">
            {isProcessing ? '파일 분석 중...' : '파일들을 드래그하거나 클릭하세요'}
          </h2>
          <p className="text-gray-500 mb-8">
            파일명이 같은 파일과 _preview, _thum 파일은 자동으로 그룹화됩니다.
          </p>
          {!isProcessing && (
            <div className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold inline-block">
              파일 선택하기
            </div>
          )}
        </label>
      </div>
    </div>
  );
}