"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Header() {
  const gnbItems = ["Photo", "Illustration", "Template", "Icon", "Sticker"];
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params = new URLSearchParams();
    params.set('q', query.trim());

    router.push(`/list?${params.toString()}`);
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container lx:w-[1200px] py-4 flex flex-col gap-4">

        {/* 로고 */}
        <h1 className="flex justify-center leading-none text-center">
          <Link href="/">
            <img
              src="/logo/doodoo_logo.png"
              alt="DooDoo Logo"
              className="h-8 sm:h-10 mx-auto"
            />
          </Link>
        </h1>

        {/* 검색창 */}
        <form
          role="search"
          aria-label="search"
          defaultValue=""
          autoComplete="off"
          method="get"
          action="/list"
          onSubmit={handleSearch}
          className="flex items-center w-full sm:flex-1 bg-white px-3 sm:px-4 py-2 border-2 border-[var(--sub-color)] rounded-full text-sm sm:text-base shadow-sm sm:bg-blue-50"
        >
          {/* 필터 선택 */}
          <select
            id="search-filter"
            defaultValue="all"
            className="mr-2 sm:mr-3 bg-transparent text-gray-700 outline-none"
          >
            <option value="all">All</option>
            <option value="photo">Photo</option>
            <option value="illustration">Illustration</option>
            <option value="template">Template</option>
            <option value="icon">Icon</option>
            <option value="sticker">Sticker</option>
          </select>

          {/* 검색 입력창 */}
          <input
            id="header-search"
            type="search"
            defaultValue=""
            autoComplete="off"
            placeholder="검색어를 입력하세요"
            className="flex-1 bg-transparent outline-none"
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* 돋보기 버튼 */}
          <button
            type="submit"
            className="ml-2 sm:ml-3 text-gray-700 hover:text-black"
            aria-label="검색"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>

        {/* GNB */}
        <nav aria-label="global" className="w-full bg-white hidden sm:block">
          <ul
            className="flex items-center justify-between text-xs sm:text-sm md:text-base"
          >
            {gnbItems.map((item, idx) => (
              <li
                key={item}
                className={`w-full border-r border-[var(--primary-color)] ${idx === gnbItems.length - 1 ? "border-r-0" : ""
                  }`}
              >
                <Link
                  href={`/${item.toLowerCase()}`}
                  // 클래스 이름을 단일 라인으로 정리하여 Hydration Mismatch 해결
                  className="flex items-center justify-center w-full text-gray-700 hover:text-blue-600 transition-colors py-1"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

      </div>
    </header>
  );

}
