
"use client";
// mainpage
import React, { Suspense, useState } from 'react'
import styles from '@/styles/components/HeroSection.module.scss';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from "next-intl";
import SearchBar from '@/components/common/SearchBar';
import TypewriterText from './TypewriterText';


function HeroSection() {
  const router = useRouter();

  const t = useTranslations("hero");
  const tCategory = useTranslations("category");

  // Popular Categories 데이터 정의
  const CATEGORIES = [
    { key: "all", value: "all" },
    { key: "marketing", value: "marketing" },
    { key: "branding", value: "branding" },
    { key: "mockup", value: "mockup" },
    { key: "typography", value: "typography" },
    { key: "photo", value: "photo" },
    { key: "sns", value: "sns" },
    { key: "illustration", value: "illustration" },
  ];

  const KEYWORDS = [
    'designs?',
    '3D Assets?',
    'Icons?',
    'Posters?',
    'Graphics?',
    'Illustrations?',
  ];

  // 2. 이미지 그리드 영역을 위한 가상 카드 데이터 (높이와 비율 다양화)
  const DESIGN_CARDS = [
    { id: 1, aspect: 'aspect-[3/4]' },
    { id: 2, aspect: 'aspect-square' },
    { id: 3, aspect: 'aspect-[3/4]' },
    { id: 4, aspect: 'aspect-square' },
    { id: 5, aspect: 'aspect-[3/2]' },
    { id: 6, aspect: 'aspect-[4/5]' },
    { id: 7, aspect: 'aspect-[16/10]' },
    { id: 8, aspect: 'aspect-[3/4]' },
  ];

  const handleCategoryClick = (categoryName: string) => {
    const categoryParam = categoryName.toLowerCase();

    const params = new URLSearchParams();
    params.set('category', categoryParam);

    router.push(`/list?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen bg-white text-gray-900 overflow-x-hidden flex flex-col justify-between">

      {/* 3. 상단 무드 그라데이션 백그라운드 블러 (요청 색상 반영) */}
      <div className="z-0 absolute top-[-180px] left-1/2 w-[700px] h-[450px] pointer-events-none z-0">
        {/* 핑크 오로라 (#FF7BCA) */}
        <div
          className="z-0 absolute w-[500px] h-[350px] rounded-full blur-[90px] opacity-50 bg-[#FF7BCA] animate-aurora-pink mix-blend-multiply"
        />

        {/* 오렌지 오로라 (#FFC56F) */}
        <div
          className="z-0 absolute w-[500px] h-[350px] rounded-full blur-[90px] opacity-60 bg-[#FFC56F] animate-aurora-orange mix-blend-multiply"
        />
      </div>

      <div className="z-40 max-w-7xl mx-auto w-full px-6 md:px-12 pt-16 flex-1">

        {/* 헤더 섹션: 로고 & 검색창 */}
        <header className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-4">
          {/* 심볼 로고 (DooDoo) */}
          <a href='/' className="flex items-center pr-0 gap-1 md:flex justify-center">
            <img src="/logo/doodoo_logo.png" alt={t("logoAlt")} className="w-[90px] sm:w-[100px]" />
          </a>
        </header>

        {/* 메인 타이틀 히어로 */}
        <section className="grid mt-10 mb-10 md:grid-cols-[2fr_1fr] items-center">
          <h1 className="text-3xl h-[92px] sm:text-4xl mb-10 font-light tracking-tight leading-snug max-w-xl text-center md:text-left mx-auto md:mx-0 md:mb-0">
            <span>Ready To Make<br />Amazing </span>
            {/* 타이포 애니메이션 영역 */}
            <div className="inline-flex items-center justify-center md:justify-start min-h-[1.3em]">
              <TypewriterText words={KEYWORDS} />
            </div>
          </h1>

          {/* 비전 검색창 */}
          <SearchBar />
        </section>

        {/* 카테고리 탭 섹션 */}
        <section className="mb-5">
          <h2 className="text-base font-semibold mb-4 text-gray-900">{t("popularCategories")}</h2>
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((category) => (
              <button
                key={category.key}
                className={`cursor-pointer px-4 py-2 rounded-sm text-xs font-medium transition-all ${category.active
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {/* 💡 tCategory(key)를 통해 ko/en 자동 변환 */}
                {tCategory(category.key)}
              </button>
            ))}
          </div>
        </section>

        {/* 이미지 그리드 메이슨리 스켈레톤 영역 (요청 2번 반영) */}
        <section className="columns-2 md:columns-4 gap-4 space-y-4 mb-16">
          {DESIGN_CARDS.map((card) => (
            <div
              key={card.id}
              className={`w-full ${card.aspect} bg-gray-100 rounded-2xl border border-gray-200/60 shadow-inner break-inside-avoid transition-all hover:opacity-90 flex items-center justify-center text-xs text-gray-300`}
            >
              Image Area
            </div>
          ))}
        </section>

        {/* 더 보기 버튼 */}
        <div className="flex justify-center mb-24">
          <button className="cursor-pointer px-8 py-3 rounded-full border border-blue-900 text-blue-900 text-xs font-medium hover:bg-blue-50/50 transition-all">
            {t("loadMore")}
          </button>
        </div>
      </div>

    </div>
  );
}

export default HeroSection;