"use client";

import { useState } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function Pagination({ page, totalPages, setPage }: PaginationProps) {

  const [inputValue, setInputValue] = useState(String(page));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      let newPage = Number(inputValue);

      if (newPage < 1) newPage = 1;
      if (newPage > totalPages) newPage = totalPages;

      setPage(newPage);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // 숫자 또는 빈 문자열만 허용
    if (/^\d*$/.test(val)) {
      setInputValue(val);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 py-10">

      {/* 이전 버튼 */}
      <button
        className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        disabled={page <= 1}
        onClick={() => {
          const newPage = Math.max(1, page - 1);
          setPage(newPage);
          setInputValue(String(newPage));
        }}
      >
        이전
      </button>

      {/* 현재 페이지 입력 */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-14 px-2 py-1 border border-gray-300 rounded-md text-center"
        />
        <span>/ {totalPages}</span>
      </div>

      {/* 다음 버튼 */}
      <button
        className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        disabled={page >= totalPages}
        onClick={() => {
          const newPage = Math.min(totalPages, page + 1);
          setPage(newPage);
          setInputValue(String(newPage));
        }}
      >
        다음
      </button>
    </div>
  );
}
