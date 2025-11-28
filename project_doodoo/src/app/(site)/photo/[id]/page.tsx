import React, { use, useEffect, useState } from 'react'
import DownloadDropdown from './DownloadDropdown';
import ListClient from '../../list/ListClient';
import { getImageById, searchImages } from '@/lib/api';

// 캐싱 유지: 24시간
export const revalidate = 60 * 60 * 24;

// ------------------------------------------------
// 🔥 generateMetadata: SEO + API 로딩
// ------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getImageById(id);

  if (!item) {
    return {
      title: "이미지를 찾을 수 없습니다",
      description: "요청하신 이미지를 찾을 수 없습니다.",
    };
  }

  const baseTitle = item.title || "이미지 상세 정보";
  const title = `${baseTitle} | 무제한 무료 이미지 - 두두 doodoo`;

  const description =
    item.description ||
    `${baseTitle} 관련 고화질 무료 이미지입니다. 키워드: ${
      item.keywords?.join(", ") || "사진, 배경, 스톡 이미지"
    }`;

  const baseKeywords = [
    "무료 이미지",
    "스톡 이미지",
    "상업적 이용 가능",
    "고화질 사진",
  ];

  const keywords = item.keywords
    ? [...baseKeywords, ...item.keywords]
    : baseKeywords;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: item.full_url ? [{ url: item.full_url }] : undefined,
      type: "article",
    },
  };
}

// ------------------------------------------------
// 🔥 Page Component
// generateMetadata()에서 이미 API 호출을 했으므로
// 여기서는 다시 API를 호출할 필요가 없음!
// 대신 Layout에서 fetch된 데이터를 받도록 구조 변경 가능
// ------------------------------------------------
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ❗ generateMetadata와 중복 호출 방지를 위해 여기서 API를 다시 호출하지 않는 게 좋지만
  // Next.js는 generateMetadata → Page 간에 데이터 공유 API가 없음.
  // 그래서 "중복 호출 최소화"를 위해 soft 캐싱된 fetch가 자동 재사용 됨 (Next.js fetch 캐시)

  const item = await getImageById(id);

  if (!item) {
    return notFound();
  }
  return (
    <div className='container'>
      {/* 이미지 영역 */}
      <div className="mx-auto py-10 flex flex-col md:flex-row gap-10">

        {/* 왼쪽: 이미지 */}
        <div className="flex-1 flex space-between">
          <img
            src={item?.preview_url}
            alt={item?.title || "이미지 상세"}
            className="w-full h-auto object-contain max-h-[80vh] rounded-xl shadow-2xl"
          />
        </div>

        {/* 오른쪽: 설명 영역 */}
        <div className="w-full md:w-1/3 flex flex-col flex-space-between gap-6">

          {/* Title */}
          <h1 className="text-2xl text-lg font-bold text-[var(--primary-color)]">
            {item?.title}
          </h1>

          {/* License */}
          <section>
            <h2 className="font-semibold text-lg mb-1 text-[var(--primary-color)]">License</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Free to use under the Unsplash License.
              No attribution required.
            </p>
          </section>

          {/* Info */}
          <section>
            <h2 className="font-semibold text-lg mb-1 text-[var(--primary-color)]">Info</h2>

            <p className="text-gray-600 text-sm">
              {item?.width} * {item?.height} | {item?.dpi}dpi | {item?.file_size_mb}mb
            </p>
          </section>

          {/* Download button */}
          {/* <DownloadDropdown urls={1} /> */}
        </div>
      </div>
      {/* 추가이미지 */}
      <div>
        <h2 className='py-4 text-lg text-[var(--primary-color)]'>
          Similar
        </h2>
        {/* <ListClient /> */}
      </div>
    </div>
  );
}

