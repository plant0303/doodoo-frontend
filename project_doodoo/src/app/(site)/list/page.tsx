"use client";
import Pagination from '@/components/common/Pagination';
import React, { useEffect, useState } from 'react'
import ListClient from './ListClient';

// CSR 렌더링

const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export default function Page() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(
          `https://api.unsplash.com/photos?page=1&per_page=30&client_id=${ACCESS_KEY}`
        );
        const data = await res.json();
        setImages(data);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);


  return (
    <>

      <div className="container mx-auto px-4 py-4">
        {/* ▼ Search Filter Bar ▼ */}
        <div
          aria-label="search filter bar"
          className="
          flex flex-col sm:flex-row
          items-start sm:items-center justify-between 
          gap-2 sm:gap-0
          mx-auto py-2
        "
        >
          {/* 왼쪽: Filter 버튼 */}
          <button
            type="button"
            className="
            flex items-center text-[#3C4DF8] font-bold text-sm 
            transition-colors px-5 py-1 border-2 border-[#3C4DF8] rounded-full
            w-max
          "
          >
            Filter &gt;
          </button>

          {/* 오른쪽: Sort By */}
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <span className="font-bold">Sort by</span>
            {["New", "Popular", "Download"].map((item) => (
              <button
                key={item}
                type="button"
                className="
                px-1 py-1 rounded-md 
                text-gray-400 hover:text-[#3C4DF8] transition-colors
              "
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-6">Collage Gallery</h1>

        {/* Masonry Grid */}
        <ListClient />
      </div>
    </>
  );
}