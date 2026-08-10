"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import SearchBar from "./SearchBar";

const SEARCH_CATEGORIES = [
  { key: "all", value: "전체" },
  { key: "marketing", value: "마케팅디자인" },
  { key: "typography", value: "타이포그래피" },
  { key: "branding-mockup", value: "브랜딩 목업" },
  { key: "illustration", value: "일러스트레이션" },
  { key: "photography", value: "사진실사" },
  { key: "meme", value: "밈" },
] as const;

export default function Header({ showCategoryNav = true }: { showCategoryNav?: boolean }) {
  const locale = useLocale();

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container xl:max-w-[1280px] py-4 flex flex-col gap-4">
        <h1 className="flex justify-center leading-none text-center">
          <Link href={`/${locale}`}>
            <img
              src="/logo/doodoo_logo.png"
              alt="DooDoo Logo"
              className="h-8 sm:h-10 mx-auto"
            />
          </Link>
        </h1>

        <Suspense>
          <SearchBar />
        </Suspense>

        {showCategoryNav && (
          <Suspense>
            <CategoryNav locale={locale} />
          </Suspense>
        )}
      </div>
    </header>
  );
}

function CategoryNav({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";
  const tCategory = useTranslations("category");

  return (
    <nav aria-label="검색 카테고리" className="overflow-x-auto">
      <ul className="flex min-w-max gap-2 pb-1">
        {SEARCH_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.value;
          const params = new URLSearchParams(searchParams.toString());

          if (category.value === "all") {
            params.delete("category"); // '전체'면 카테고리 파라미터 제거
          } else {
            params.set("category", category.value); // 'typography' 같은 영어 slug 할당
          }
          params.set("p", "1"); // 카테고리가 바뀌면 무조건 1페이지로 리셋

          return (
            <li key={category.value}>
              <Link
                href={`/${locale}/list?${params.toString()}`}
                aria-current={isSelected ? "page" : undefined}
                className={`block rounded-md px-4 py-2 text-sm font-medium transition-colors ${isSelected
                  ? "bg-[var(--sub-color)] text-[var(--primary-color)]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {tCategory(category.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
