// src/app/list/page.tsx (SSR 렌더)
export const revalidate = 300; // 캐시 만료시간  5분 (300초)

import Pagination from '@/components/common/Pagination';
import React, { useEffect, useState } from 'react'
import ListClient from './ListClient';
import { searchImages } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';

const DEFAULT_PER_PAGE = 30;

interface ImageItem {
  id: string;
  thumb_url: string;
  title: string;
}

interface SearchResponse {
  images: ImageItem[];
  total_count: number;
  limit: number;
}

async function fetchImages({
  query,
  category,
  page,
  perPage
}: {
  query?: string,
  category?: string,
  page: number,
  perPage: number
}): Promise<SearchResponse> {
  const response = await searchImages({ query, category, page, perPage }) as SearchResponse;
  return response;
}

export default async function Page({ searchParams }: { searchParams: { q?: string, category?: string, p?: string } }) {
  const finalSearchParams = await (searchParams as any);
  const query = finalSearchParams.q || '';
  const category = finalSearchParams.category || '';

  let initialImages: ImageItem[] = [];
  let initialPage = 1;
  let initialTotalPages = 1;
  let perPage = DEFAULT_PER_PAGE;
  let totalCount = 0;

  if (query || category) {
    initialPage = parseInt(finalSearchParams.p || '1', 10);
    try {
      const response = await fetchImages({
        query,
        category,
        page: initialPage,
        perPage: DEFAULT_PER_PAGE
      });

      initialImages = response.images;
      totalCount = response.total_count;
      perPage = response.limit;
      initialTotalPages = Math.ceil(totalCount / (perPage || 1));

    } catch (error) {
      console.error("Error fetching images: ", error);
    }
  }

  const finalQueryOrCategory = query || category;
  const isCategorySearch = !!category && !query;

  return (
    <>
      <div className="container xl:max-w-[1200px] h-screen mx-auto px-4 py-4">
        {/* ▼ Search Filter Bar ▼ */}
        {/* <div
          aria-label="search filter bar"
          className="
          flex flex-col sm:flex-row
          items-start sm:items-center justify-between 
          gap-2 sm:gap-0
          mx-auto py-2
        "
        >
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
        </div> */}

        <ListClient
          initialImages={initialImages}
          initialQuery={finalQueryOrCategory}
          initialPage={initialPage}
          initialTotalPages={initialTotalPages}
          perPage={perPage}
          isCategorySearch={isCategorySearch} // ✅ 새로운 Prop 전달
        />
      </div>
    </>
  );
}


export async function generateMetadata({ searchParams }: { searchParams: { q?: string, p?: string } }): Promise<Metadata> {
  const finalSearchParams = await (searchParams as any);
  const query = finalSearchParams.q || '';
  const page = searchParams.p || '1';
  const siteName = "doodoo";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://doodoo.com'; // **Change to your actual domain**

  // Metadata branching based on the presence of a search query
  const title = query
    ? `Free Image Search Results for ${query} | ${siteName}`
    : `High-Quality Free Image Search and Download | ${siteName}`;


  const description = query
    ? `Download high-resolution free images for "${query}". Providing copyright-free photos available for commercial use.`
    : `Search and download millions of high-quality images for free on doodoo. Available for commercial use.`;

  const canonicalUrl = `${baseUrl}/list${query ? `?q=${encodeURIComponent(query)}&p=${page}` : ''}`;

  return {
    title: title,
    description: description,
    keywords: query 
      ? [query, 'free images', 'high resolution', 'commercial use', siteName] 
      : ['free images', 'stock photos', 'high resolution', 'commercial use', 'doodoo'],
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      siteName: siteName,
      type: 'website',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: '/favicon.ico', // Root path in the public folder
    },
  };
}