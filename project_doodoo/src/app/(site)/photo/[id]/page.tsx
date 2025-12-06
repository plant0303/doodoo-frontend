import React, { use, useEffect, useState } from 'react'
import DownloadDropdown from './DownloadDropdown';
import ListClient from '../../list/ListClient';
import { getImageById, searchImages } from '@/lib/api';
import { notFound } from 'next/navigation';
import SimilarImages from './SimilarImages';

// 캐싱 유지: 24시간
export const revalidate = 60 * 60 * 24;

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
    `${baseTitle} 관련 고화질 무료 이미지입니다. 키워드: ${item.keywords?.join(", ") || "사진, 배경, 스톡 이미지"
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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await getImageById(id);

  if (!item) {
    return notFound();
  }

  const baseInfo = item.download_options?.[0];

  return (
    <div className='container xl:w-[1200px]'>
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

            {item.download_options.map((i, index) => (
              <p key={`extension${index}`} className="text-gray-600 text-sm">
                {i.extension} | {i.width} * {i.height} | {i.dpi}dpi | {i.file_size_mb}MB
              </p>
            ))}
            {/* {item?.download_options[0].width} * {item?.height} | {item?.dpi}dpi | {item?.file_size_mb}mb */}
          </section>

          {/* Download button */}
          {item.download_options.length > 0 && (
            <DownloadDropdown
              imageId={item.id}
              options={item.download_options}
              defaultLabel={baseInfo?.label || 'Download'}
            />
          )}
        </div>
      </div>
      {/* 추가이미지 */}
      <div>
        <h2 className='py-4 text-lg text-[var(--primary-color)]'>
          Similar
        </h2>
        <SimilarImages imageId={id} />
      </div>
    </div>
  );
}

