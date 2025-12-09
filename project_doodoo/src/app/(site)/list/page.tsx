// src/app/list/page.tsx (SSR 렌더)
export const revalidate = 300; // 캐시 만료시간 5분 (300초) 

import React, { Suspense } from 'react';
import ListClient from './ListClient';
import { searchImages } from '@/lib/api';

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
    query?: string;
    category?: string;
    page: number;
    perPage: number;
}): Promise<SearchResponse> {
    const response = await searchImages({ query, category, page, perPage }) as SearchResponse;
    return response;
}

type SearchParamsType = {
    q?: string;
    category?: string;
    p?: string;
};

type PageProps = {
    searchParams: Promise<SearchParamsType>;
};

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams;

    const query = params.q ?? "";
    const category = params.category ?? "";
    const page = parseInt(params.p ?? "1", 10);

    let initialImages: ImageItem[] = [];
    let initialPage = page;
    let initialTotalPages = 1;
    let perPage = DEFAULT_PER_PAGE;
    let totalCount = 0;

    if (query || category) {
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
            <div className="container xl:max-w-[1200px] min-h-screen mx-auto px-4 py-4">

                <Suspense fallback={<div>검색 결과를 불러오는 중...</div>}>
                    <ListClient
                        initialImages={initialImages}
                        initialQuery={finalQueryOrCategory}
                        initialPage={initialPage}
                        initialTotalPages={initialTotalPages}
                        perPage={perPage}
                        isCategorySearch={isCategorySearch}
                    />
                </Suspense>
            </div>
        </>
    );
}


//  Metadata 생성
export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<SearchParamsType>;
}) {
    const params = await searchParams;

    const query = params.q ?? "";
    const page = params.p ?? "1";
    const category = params.category ?? "";

    const siteName = "doodoo";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://doodoo.com';

    const finalSearchTerm = query || category;

    const title = finalSearchTerm
        ? `Free Image Search Results for ${finalSearchTerm} | ${siteName}`
        : `High-Quality Free Image Search and Download | ${siteName}`;


    const description = finalSearchTerm
        ? `Download high-resolution free images for "${finalSearchTerm}". Providing copyright-free photos available for commercial use.`
        : `Search and download millions of high-quality images for free on doodoo. Available for commercial use.`;

    const canonicalUrl = `${baseUrl}/list${query || category ? `?${query ? `q=${encodeURIComponent(query)}` : ''}${category ? `${query ? '&' : ''}category=${encodeURIComponent(category)}` : ''}&p=${page}` : ''}`;

    const baseKeywords = [
        'free images',
        'stock photos',
        'high resolution',
        'commercial use',
        'doodoo'
    ];

    const keywords = finalSearchTerm
        ? [finalSearchTerm, ...baseKeywords]
        : baseKeywords;

    return {
        title: title,
        description: description,
        keywords: keywords,
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
            icon: '/favicon.ico',
        },
    };
}