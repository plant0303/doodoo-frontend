'use client';
import React, { useState } from 'react';
import { StockItem } from '../../../../../types/StockItem';
import CategorySelector from './CategorySelector';
import FileUploader from './FileUploader';
import MetadataEditor from './MetadataEditor';

export default function BulkUploadPage() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [items, setItems] = useState<StockItem[]>([]);

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setStep(2);
  };
  
  const handleFilesUploaded = (newItems: StockItem[]) => {
    setItems(newItems);
    setStep(3);
  };
  
  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      {/* 단계 인디케이터 상단 고정 */}
      <div className="flex items-center mb-10 justify-center">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= num ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {num}
            </div>
            {num < 3 && <div className={`w-20 h-1 mx-2 ${step > num ? 'bg-indigo-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* 컴포넌트 전환 */}
      {step === 1 && <CategorySelector onSelect={handleCategorySelect} />}
      {step === 2 && <FileUploader onUpload={handleFilesUploaded} onBack={() => setStep(1)} />}
      {step === 3 && (
        <MetadataEditor 
          items={items} 
          setItems={setItems} 
          category={category} 
          onBack={() => setStep(2)} 
        />
      )}
    </div>
  );
}