
"use client";
// mainpage
import React, { useState } from 'react'
import styles from '@/styles/components/HeroSection.module.scss';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';
import SearchBar from '../common/SearchBar';
import Ballpit from './Ballpit';
import Link from 'next/link';


function HeroSection() {
  const router = useRouter();

  const categories = ["Photo", "Illustration", "Template", "Icon", "Sticker"];

  const sampleImages = [
    {
      id: "7ae37435-ad0a-4d91-a587-792ad8ae76cb",
      url: "https://pub-c23d57f0578646659d59cf9f1ba3e49c.r2.dev/photo/pinkmhuly15_thum.jpg",
      title: "Pink Muhly Grass Autumn Field",
    },
    {
      id: "df38850a-dde1-4a88-80dd-6fb0b7a7cdfb",
      url: "https://pub-c23d57f0578646659d59cf9f1ba3e49c.r2.dev/photo/pinkmhuly19_thum.jpg",
      title: "Pink Muhly Grass 19",
    },
    {
      id: "f8fff30b-1897-4d13-9522-3833dee6d671",
      url: "https://pub-c23d57f0578646659d59cf9f1ba3e49c.r2.dev/photo/pinkmhuly1_thum.jpg",
      title: "Pink Muhly Grass 1",
    },
    {
      id: "5585b366-2dc6-48c2-98f3-1adef6d2d174",
      url: "https://pub-c23d57f0578646659d59cf9f1ba3e49c.r2.dev/photo/pinkmhuly2_thum.jpg",
      title: "Pink Muhly Grass 2",
    },
  ];


  const handleCategoryClick = (categoryName) => {
    const categoryParam = categoryName.toLowerCase();

    const params = new URLSearchParams();
    params.set('category', categoryParam);

    router.push(`/list?${params.toString()}`);
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden">

      {/* 메인 컨테이너 */}
      <section
        className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1400px] rounded-3xl bg-[#fff]/20 backdrop-blur-xl border border-white/20 px-6 py-10 sm:px-14 sm:py-18 "
      >

        {/* TOP 영역 */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-10 text-[var(--primary-color)]">

          {/* LEFT TITLE */}
          <div className="hidden md:block flex-[1] text-center sm:text-left">
            <p className="text-5xl opacity-80 tracking-tight mb-2 animate-slideDown font-light hidden sm:block">
              You can get
            </p>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight animate-slideDown delay-100 tracking-tighter hidden sm:block">
              Unlimited<br />Free sources
            </h1>
          </div>
          {/* RIGHT SEARCH & LOGO 그룹 */}
          <div className="flex flex-col items-center w-full sm:w-1/2 gap-6 flex-[1.5]">

            {/* 로고 */}
            <a href="/" aria-label="Home">
              <img src="/logo/doodoo_logo.png" alt="DooDoo Logo" className="w-[110px] sm:w-[120px]" />
            </a>

            {/* 메뉴 */}
            <nav className="w-full">
              <ul className="flex justify-between text-lg font-semibold tracking-tight px-0 sm:px-6">
                {categories.map((item, i) => (
                  <li
                    key={i}
                    onClick={() => handleCategoryClick(item)}
                    className="cursor-pointer hover:text-[var(--primary-hover)]transition-colors duration-200" >
                    {item}
                  </li>
                ))}
              </ul>
            </nav>

            {/* 검색창 */}
            <SearchBar />
          </div>
        </header>

        {/* GALLERY GRID */}
        <div className="mt-8">
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 overflow-hidden">
            {sampleImages.map((img) => (
              <li key={img.id}>
                <Link
                  href={`/photo/${img.id}`}
                  className="group block mb-4 break-inside-avoid shadow-lg rounded-xl overflow-hidden transition duration-300 transform hover:scale-[1.01] hover:shadow-2xl"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-auto object-cover transition duration-300 group-hover:opacity-80"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://placehold.co/400x300/e5e7eb/7f7f7f?text=No+Image`;
                      }}
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-2 px-3 opacity-0 group-hover:opacity-100 transition duration-300">
                      <p className="text-white text-xs font-semibold truncate">
                        {img.title}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </section>
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', maxHeight: '100%', zIndex: '-999' }}>
        <Ballpit
          count={15}
          gravity={0.01}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={true}

          // ball design
          // colors={['#FFF18D', '#FFA578', '#FFD2D2']}
          // ambientColor={16777215} //주변광 색
          // ambientIntensity={0} //주변광 정도
          minSize={0.5} // 최소사이즈
          maxSize={2} // 최대사이즈
        >
        </Ballpit>
      </div>
    </div>
  );
}

export default HeroSection;