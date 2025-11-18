"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const gnbItems = ["Photo", "Illustration", "Template", "Icon", "Sticker"];

  return (
    <header className={`w-full border-b border-gray-200 bg-white`}>
      <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col gap-4">

        {/* 로고 */}
        <h1 className="flex justify-center leading-none  text-center">
          <Link href="/">
            <img
              src="/logo/doodoo_logo.png"  // public/logo/doodoo_logo.png
              alt="DooDoo Logo"
              className="h-10 text-center"
            />
          </Link>
        </h1>

        {/* 검색창 */}
        <form
          role="search"
          aria-label="search"
          className="flex items-center w-full bg-white px-4 py-2 border-2 border-[var(--sub-color)] rounded-full"
        >
          {/* 필터 선택 */}
          <label htmlFor="search-filter" className="sr-only">
            검색 카테고리 선택
          </label>
          <select
            id="search-filter"
            className="mr-3 bg-transparent text-gray-700 outline-none"
          >
            <option value="all">All</option>
            <option value="photo">Photo</option>
            <option value="illustration">Illustration</option>
            <option value="template">Template</option>
            <option value="icon">Icon</option>
            <option value="sticker">Sticker</option>
          </select>

          {/* 검색 입력창 */}
          <label htmlFor="header-search" className="sr-only">
            검색어 입력
          </label>
          <input
            id="header-search"
            type="search"
            placeholder="검색어를 입력하세요"
            className="flex-1 bg-transparent outline-none"
          />

          {/* 돋보기 버튼 */}
          <button
            type="submit"
            className="ml-3 text-gray-700 hover:text-black"
            aria-label="검색"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>

        {/* GNB */}
        <nav aria-label="global" className="w-full bg-white">
          <ul className="flex items-center justify-between max-w-7xl mx-auto py-2">
            {gnbItems.map((item, idx) => (
              <li
                key={item}
                className={`w-full border-r border-[var(--primary-color)] ${idx === gnbItems.length - 1 ? "border-r-0" : ""}`}
              >
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="flex items-center justify-center w-full text-[var(--primary-color)] hover:text-[var(--primary-hover)] transition-colors duration-200 py-1 text-lg"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          aria-label="search filter bar"
          className="w-full flex items-center justify-between mx-auto py-2"
        >
          {/* 왼쪽: Filter 버튼 */}
          <button
            type="button"
            className="flex items-center text-[#3C4DF8] font-bold font-sm transition-colors duration-200 px-5 py-0.5 border-2 border-[#3C4DF8] rounded-full"
          >
            Filter &gt;
          </button>

          {/* 오른쪽: Sort By */}
          <div className="flex items-center gap-2">
            <span className="font-bold">Sort by</span>
            {["New", "Popular", "Download"].map((item) => (
              <button
                key={item}
                type="button"
                className="px-1 py-1 rounded-md text-gray-400 hover:text-[#3C4DF8] transition-colors duration-200"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

      </div>
    </header>
  );
}
