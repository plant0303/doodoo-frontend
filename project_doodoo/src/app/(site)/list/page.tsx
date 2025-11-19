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
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Collage Gallery</h1>

      {/* Masonry Grid */}
      <ListClient/>
    </div>
  );
}