
"use client";
// mainpage
import React, { Suspense, useState } from 'react'
import styles from '@/styles/components/HeroSection.module.scss';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from "next-intl";


function HeroSection() {
  const router = useRouter();

  const t = useTranslations("hero");
  
  // 1. Popular Categories 데이터 정의
  const CATEGORIES = [
    { name: 'Modern Minimalist', active: true },
    { name: 'Cyberpunk 2077', active: false },
    { name: 'Pastel Aesthetic', active: false },
    { name: 'Retro Futurism', active: false },
    { name: 'High Contrast B&W', active: false },
    { name: 'Abstract Organic', active: false },
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
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] opacity-40 pointer-events-none bg-gradient-to-tr from-[#FF7BCA] to-[#FFC56F]" />

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-16 flex-1">

        {/* 헤더 섹션: 로고 & 검색창 */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 relative z-10">
          {/* 심볼 로고 (DooDoo) */}
          <a href='/' className="flex items-center gap-1">
            <img src="/logo/doodoo_logo.png" alt={t("logoAlt")} className="w-[110px] sm:w-[120px]" />
          </a>

          {/* 비전 검색창 */}
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="w-full pl-6 pr-12 py-3.5 bg-white border border-gray-200 rounded-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all placeholder-gray-400"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </div>
        </header>

        {/* 메인 타이틀 히어로 */}
        <section className="mb-16 relative z-10">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-tight max-w-xl">
            <span>What Doo you want to</span> <br />
            <span className="text-blue-700 font-normal">create</span> today?
          </h1>
        </section>

        {/* 카테고리 탭 섹션 */}
        <section className="mb-10">
          <h2 className="text-base font-semibold mb-4 text-gray-900">{t("popularCategories")}</h2>
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((category) => (
              <button
                key={category.name}
                className={`cursor-pointer px-4 py-2 rounded-full text-xs font-medium transition-all ${category.active
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {category.name}
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