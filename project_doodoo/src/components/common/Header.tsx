

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const gnbItems = ["Photo", "Illustration", "Template", "Icon", "Sticker"];

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container py-4 flex flex-col gap-4">

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
          className="flex items-center w-full bg-white px-3 sm:px-4 py-2 
          border-2 border-[var(--sub-color)] rounded-full
          text-sm sm:text-base"
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
        <nav aria-label="global" className="w-full bg-white">
          <ul
            className="
            flex items-center justify-between 
            max-w-7xl mx-auto py-2 
            text-xs sm:text-sm md:text-base
          "
          >
            {gnbItems.map((item, idx) => (
              <li
                key={item}
                className={`w-full border-r border-[var(--primary-color)] ${idx === gnbItems.length - 1 ? "border-r-0" : ""
                  }`}
              >
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="
                  flex items-center justify-center w-full 
                  text-[var(--primary-color)] 
                  hover:text-[var(--primary-hover)] transition-colors py-1
                "
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ▼ Search Filter Bar ▼ */}
        <div
          aria-label="search filter bar"
          className="
          w-full flex flex-col sm:flex-row
          items-start sm:items-center justify-between 
          gap-2 sm:gap-0
          mx-auto py-2
        "
        >
          {/* 왼쪽: Filter 버튼 */}
          <button
            type="button"
            className="
            flex items-center text-[#3C4DF8] font-bold text-sm 
            transition-colors px-5 py-1 border-2 border-[#3C4DF8] rounded-full
            w-max
          "
          >
            Filter &gt;
          </button>

          {/* 오른쪽: Sort By */}
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <span className="font-bold">Sort by</span>
            {["New", "Popular", "Download"].map((item) => (
              <button
                key={item}
                type="button"
                className="
                px-1 py-1 rounded-md 
                text-gray-400 hover:text-[#3C4DF8] transition-colors
              "
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
