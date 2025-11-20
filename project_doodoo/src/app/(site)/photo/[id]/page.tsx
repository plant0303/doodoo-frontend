"use client";

import React, { use, useEffect, useState } from 'react'
import DownloadDropdown from './DownloadDropdown';
import Link from 'next/link';
import ListClient from '../../list/ListClient';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '무제한 무료 이미지 - 두두 doodoo',
  description: '무제한 무료 이미지 스톡 사이트. 상업적으로 사용 가능한 고화질 사진을 지금 다운로드하세요.',
  openGraph: {
    title: '고화질 무료 이미지 - 두두 doodoo',
    description: '📸 두두(doodoo)에서 영감을 주는 무료 이미지를 발견하고 프로젝트를 빛내세요!',
    // url: 'https://your-domain.com',
    type: 'website',
    // og:image 등 추가 가능
  },
  keywords: [
    '무료 이미지',
    '스톡 이미지',
    '상업적 이용 가능',
    '고화질 사진',
    '두두',
  ],
};

export default function page(props: { params: Promise<{ id: string }> }) {
  const [items, setItems] = useState<UnsplashItem[]>([]);
  return (
    <div className='container'>
      {/* 이미지 영역 */}
      <div className="mx-auto py-10 flex flex-col md:flex-row gap-10">

        {/* 왼쪽: 이미지 */}
        <div className="flex-1 flex space-between">
          <img
            src="/images.png"
            alt=""
            className="w-full"
          />
        </div>

        {/* 오른쪽: 설명 영역 */}
        <div className="w-full md:w-1/3 flex flex-col flex-space-between gap-6">

          {/* Title */}
          <h1 className="text-2xl text-lg font-bold text-[var(--primary-color)]">
            Title
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
              1234*1234 | 300dpi | 23.9MB
            </p>
          </section>

          {/* Download button */}
          <DownloadDropdown urls={1} />
        </div>
      </div>
      {/* 추가이미지 */}
      <div>
        <h2 className='py-4 text-lg text-[var(--primary-color)]'>
          Similar
        </h2>
        <ListClient />
      </div>
    </div>
  );
}

