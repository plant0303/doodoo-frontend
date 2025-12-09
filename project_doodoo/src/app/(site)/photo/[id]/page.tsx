import React, { use, useEffect, useState } from 'react'
import DownloadDropdown from './DownloadDropdown';
import ListClient from '../../list/ListClient';
import { getImageById, searchImages } from '@/lib/api';
import { notFound } from 'next/navigation';
import SimilarImages from './SimilarImages';
import KeywordList from './KeywordList';

// 캐싱 유지: 24시간
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // NOTE: Assuming 'getImageById' is a function defined elsewhere that fetches image data.
  const item = await getImageById(id);

  if (!item) {
    return {
      title: "Image Not Found",
      description: "The image you requested could not be found.",
    };
  }

  // Set default title if item.title is missing
  const baseTitle = item.title || "Image Details";

  // Format the title for the specific image page
  const title = `${baseTitle} | Unlimited Free Images - doodoo`;

  // Set the description, using keywords if available
  const description =
    item.description ||
    `High-quality free image related to ${baseTitle}. Keywords: ${item.keywords?.join(", ") || "photo, background, stock image"
    }`;

  // Base keywords for all image detail pages
  const baseKeywords = [
    "free image",
    "stock image",
    "commercially usable",
    "high quality photo",
  ];

  // Combine base keywords with specific item keywords
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
      // Use the full_url for the Open Graph image preview
      images: item.full_url ? [{ url: item.full_url }] : undefined,
      type: "article", // 'article' is suitable for specific content pages
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
      <section className="mx-auto py-10 flex flex-col md:flex-row gap-10">

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
          <section className="mb-6">
            {/* License Header: 이미지처럼 크게, 메인 색상으로 강조 */}
            <h2 className="font-bold text-md mb-4 text-[var(--primary-color)]">
              License
            </h2>

            {/* Allowed / Not Allowed 그리드 레이아웃 */}
            <div className="grid grid-cols-2">

              {/* 왼쪽: Allowed (허용) */}
              <div className="flex flex-col">
                {/* Allowed Checkbox Header */}
                <div className="flex items-center mb-2">
                  {/* 체크 아이콘 (Styled as checkbox checked) */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1 text-gray-500">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-500 font-semibold">Allowed</span>
                </div>

                {/* Allowed 상세 내용 */}
                <p className="text-gray-500 font-medium">
                  Commercial use
                </p>
              </div>

              {/* 오른쪽: Not Allowed (금지) */}
              <div className="flex flex-col">
                {/* Not Allowed Checkbox Header */}
                <div className="flex items-center mb-2">
                  {/* 빈 체크박스 아이콘 (Styled as checkbox unchecked) */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1 text-gray-400">
                    <path fillRule="evenodd" d="M3.75 3A2.75 2.75 0 0 0 1 5.75v8.5A2.75 2.75 0 0 0 3.75 17h8.5a2.75 2.75 0 0 0 2.75-2.75v-8.5A2.75 2.75 0 0 0 12.25 3h-8.5Zm0 1.5h8.5c.69 0 1.25.56 1.25 1.25v8.5c0 .69-.56 1.25-1.25 1.25h-8.5c-.69 0-1.25-.56-1.25-1.25v-8.5c0-.69.56-1.25 1.25-1.25Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-500 font-semibold">Not Allowed</span>
                </div>

                {/* Not Allowed 상세 목록 (회색 톤의 점 목록) */}
                <ul className="text-gray-500 text-sm space-y-1">
                  <li className="flex items-start">
                    <span className="mr-1 mt-0.5 text-gray-500">•</span>
                    Resell or redistribute the file
                  </li>
                  <li className="flex items-start">
                    <span className="mr-1 mt-0.5 text-gray-500">•</span>
                    Upload to other stock platforms
                  </li>
                  <li className="flex items-start">
                    <span className="mr-1 mt-0.5 text-gray-500">•</span>
                    Use for trademarks/logos (as is)
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Info */}
          <section>
            <h2 className="font-semibold text-md mb-1 text-[var(--primary-color)]">Info</h2>

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
      </section>
      <KeywordList keywords={item.keywords ?? []} />
      {/* 추가이미지 */}
      <section>
        <h2 className='py-4 text-lg text-[var(--primary-color)]'>
          Similar
        </h2>
        <SimilarImages imageId={id} />
      </section>

      <section className="mt-12 mb-16 p-6 border border-gray-100 rounded-lg">
        <h2 className="text-lg font-bold mb-5 text-gray-600 flex items-center border-b border-gray-200 pb-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-gray-400">
            <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L18.44 12l-6.47-6.47a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M7.47 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L12.94 12 6.47 5.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
          DooDoo License Policy
        </h2>

        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          All content downloaded from **DooDoo** may be used for commercial purposes under the terms below.
          <span className="font-semibold text-gray-600">No attribution is required.</span>
        </p>

        {/* --- Allowed Uses --- */}
        <h3 className="text-sm font-bold mb-3 text-gray-600 border-l-2 border-gray-300 pl-2">
          Allowed Uses
        </h3>

        <ul className="list-none space-y-2 mb-8 pl-0">
          {[
            "Online content: ads, marketing, social media, blogs, websites",
            "Video production: YouTube, shorts, broadcasts, corporate/agency promos",
            "Printed materials: flyers, posters, banners, brochures",
            "App, game, and UI/UX design",
            "Product packaging & brand materials (※ cannot be registered as a trademark/logo)",
            "Templates, thumbnails, presentations, and other derivative works",
          ].map((item, index) => (
            <li key={`allowed-${index}`} className="flex items-start text-xs text-gray-500">
              <span className="text-gray-400 font-bold mr-2 mt-0.5">·</span>
              {item}
            </li>
          ))}
        </ul>

        {/* --- Not Allowed --- */}
        <h3 className="text-sm font-bold mb-3 text-gray-600 border-l-2 border-gray-300 pl-2">
          Not Allowed
        </h3>

        <ul className="list-none space-y-2 pl-0">
          {[
            "Reselling, redistributing, or uploading the content to other stock platforms",
            "Using the content “as is” to create or register a trademark or logo",
            "Use in pornographic, violent, defamatory, or illegal content",
            "Using the content for AI training, model learning, or dataset creation",
            "Uses that violate privacy or publicity rights for identifiable persons",
          ].map((item, index) => (
            <li key={`not-allowed-${index}`} className="flex items-start text-xs text-gray-500">
              <span className="text-gray-400 font-bold mr-2 mt-0.5">·</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            For complete and detailed terms, please visit the official <a href="/license" className="text-gray-600 hover:text-gray-700 font-medium underline transition duration-150">DooDoo License Page</a>.
          </p>
        </div>
      </section>
    </div>
  );
}

