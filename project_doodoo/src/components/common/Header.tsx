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

      </div>
    </header>
  );

}
