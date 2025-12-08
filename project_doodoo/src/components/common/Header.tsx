"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import SearchBar from "./SearchBar";

export default function Header() {
  const gnbItems = ["Photo", "Illustration", "Template", "Icon", "Sticker"];
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params = new URLSearchParams();
    params.set('q', query.trim());

    router.push(`/list?${params.toString()}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    const categoryParam = categoryName.toLowerCase();

    const params = new URLSearchParams();
    params.set('category', categoryParam);
    router.push(`/list?${params.toString()}`);
    console.log(1);
  };


  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container xl:max-w-[1200px]  py-4 flex flex-col gap-4">

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
        <SearchBar />

        {/* GNB */}
        <nav aria-label="global" className="w-full bg-white hidden sm:block">
          <ul
            className="flex items-center justify-between text-xs sm:text-sm md:text-base"
          >
            {gnbItems.map((item, idx) => (
              <li
                key={item}
                onClick={() => handleCategoryClick(item)}
                className={`w-full border-r border-[var(--primary-color)] ${idx === gnbItems.length - 1 ? "border-r-0" : ""
                  }`}
              >
                <Link
                  href={`/list?category=${item.toLowerCase()}`}
                  className="flex items-center justify-center w-full text-[var(--primary-color)] hover:text-blue-600 transition-colors py-1"
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
