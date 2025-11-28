import React, { use, useEffect, useState } from 'react'
import DownloadDropdown from './DownloadDropdown';
import Link from 'next/link';
import ListClient from '../../list/ListClient';
import { getImageById, searchImages } from '@/lib/api';

import type { Metadata } from 'next';
import { it } from 'node:test';
import { width } from '@fortawesome/free-solid-svg-icons/fa0';

// export const metadata: Metadata = {
//   title: '무제한 무료 이미지 - 두두 doodoo',
//   description: '무제한 무료 이미지 스톡 사이트. 상업적으로 사용 가능한 고화질 사진을 지금 다운로드하세요.',
//   openGraph: {
//     title: '고화질 무료 이미지 - 두두 doodoo',
//     description: '📸 두두(doodoo)에서 영감을 주는 무료 이미지를 발견하고 프로젝트를 빛내세요!',
//     // url: 'https://your-domain.com',
//     type: 'website',
//     // og:image 등 추가 가능
//   },
//   keywords: [
//     '무료 이미지',
//     '스톡 이미지',
//     '상업적 이용 가능',
//     '고화질 사진',
//     '두두',
//   ],
// };

export async function generateMetadata({ params }: { params: { id: string } }) {

  const { id } = await params;
  const item = await getImageById(id);


  if (!item) {
    return { title: '이미지를 찾을 수 없습니다' };
  }

  const title = item.title ? `${item.title} | 무제한 무료 이미지 - 두두 doodoo` : '이미지 상세 정보';
  const description = item.description || `${item.title} 관련 고화질 무료 이미지입니다. 키워드: ${item.keywords ? item.keywords.join(', ') : '사진, 배경, 스톡 이미지'}`;

  const baseKeywords = [
    '무료 이미지',
    '스톡 이미지',
    '상업적 이용 가능',
    '고화질 사진',
  ];
  const finalKeywords = item.keywords ? [...baseKeywords, ...item.keywords] : baseKeywords;

    return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      // OGP 이미지 설정
      images: item.full_url ? [{ url: item.full_url }] : undefined,
    },
    keywords: finalKeywords,
  };
}

// 24시간 동안 캐시 유지
export const revalidate = 60 * 60 * 24;

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const item = await getImageById(id);

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

