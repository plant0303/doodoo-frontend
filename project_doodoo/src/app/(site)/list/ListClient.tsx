"use client";

import Pagination from "@/components/common/Pagination";
import Link from "next/link";
import { useState, useEffect } from "react";

interface UnsplashItem {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string | null;
}

const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export default function ListClient() {
  const [items, setItems] = useState<UnsplashItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const TOTAL_PAGES = 50;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // 페이지 변경 시 Unsplash 요청
  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.unsplash.com/photos?page=${page}&per_page=30&client_id=${ACCESS_KEY}`
        );
        const data = await res.json();
        setItems(data);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [page]);
  return (
    <>
      < div className="columns-1 sm:columns-3 md:columns-4 gap-4" >
        {
          items.map((img: any, idx: number) => (
            <Link
              key={img.id}
              href={`/photo/${img.id}`}
            >
              <div key={idx} className="mb-4 break-inside-avoid">
                <img
                  src={img.urls.small}
                  alt={img.alt_description || `Image ${idx + 1}`}
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
            </Link>
          ))
        }
      </div>
      <Pagination page={page} totalPages={TOTAL_PAGES} setPage={setPage} />
    </>
  );
}
