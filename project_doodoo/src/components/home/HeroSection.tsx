
"use client";
// mainpage
import React, { useState } from 'react'
import styles from '@/styles/components/HeroSection.module.scss';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';


function HeroSection() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const categories = ["Photo", "Illustration", "Template", "Icon", "Sticker"];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params = new URLSearchParams();
    params.set('q', query.trim());

    router.push(`/list?${params.toString()}`);
  };

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
        className="
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[90vw] max-w-[1400px]
        rounded-3xl shadow-lg bg-[var(--sub-color)]/90
        backdrop-blur-xl
        border border-white/20
        px-6 py-10 sm:px-14 sm:py-18
        "
      >

        {/* TOP 영역 */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-10 text-[var(--primary-color)]">

          {/* LEFT TITLE */}
          <div className="flex-[1] text-center sm:text-left">
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
              <img
                src="/logo/doodoo_logo.png"
                alt="DooDoo Logo"
                className="
                  w-[110px] sm:w-[120px]
                "
              />
            </a>

            {/* 메뉴 */}
            <nav className="w-full">
              <ul className="flex justify-between text-lg font-semibold tracking-tight px-6">
                {categories.map((item, i) => (
                  <li
                    key={i}
                    // ✅ 클릭 이벤트 핸들러 연결
                    onClick={() => handleCategoryClick(item)}
                    className="
                              cursor-pointer hover:text-[var(--primary-hover)]
                              transition-colors duration-200
                            "
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </nav>

            {/* 검색창 */}
            <form
              role="search"
              method="get"
              className="
                flex items-center w-full
                bg-white border border-white/20 backdrop-blur-xl
                rounded-full h-12 px-4
                inset-shadow-xs
                focus-within:border-[var(--sub-hover)]
              "
              action="/list" // 실제 검색 페이지 경로 지정
              onSubmit={handleSearch} // 라우팅 함수 연결
            >
              <input
                type="text"
                name="q"
                placeholder="Search..."
                aria-label="search"
                className="
                  w-full px-2 border-none outline-none
                  placeholder-white/60 text-gray-800
                "
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" aria-label="검색">
                <FontAwesomeIcon icon={faSearch} className="w-5 y-5 text-[var(--primary-color)] cursor-pointer" />
              </button>
            </form>

          </div>
        </header>

        {/* GALLERY GRID */}
        <div className="mt-8">
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <li key={i}>
                <div
                  className="
                    w-full h-[120px] sm:h-[150px]
                    rounded-xl bg-white backdrop-blur-lg
                    shadow-inner
                    animate-fadeInUp
                    hover:bg-white/50 transition duration-300
                    cursor-pointer
                  "
                >
                </div>
              </li>
            ))}
          </ul>
        </div>

      </section>
    </div>
  );
}

export default HeroSection;