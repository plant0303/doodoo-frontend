"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import SearchBar from "./SearchBar";

const SEARCH_CATEGORIES = [
  { label: "전체", value: "all" },
  { label: "카드뉴스", value: "카드뉴스" },
  { label: "인포그래픽", value: "인포그래픽" },
  { label: "광고/포스터", value: "광고/포스터" },
  { label: "템플릿", value: "템플릿" },
  { label: "SNS", value: "SNS" },
  { label: "브랜딩", value: "브랜딩" },
  { label: "마케팅", value: "마케팅" },
];

export default function Header() {
  const locale = useLocale();

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container xl:max-w-[1200px] py-4 flex flex-col gap-4">
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

        <Suspense>
          <CategoryNav locale={locale} />
        </Suspense>
      </div>
    </header>
  );
}

function CategoryNav({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";

  return (
    <nav aria-label="검색 카테고리" className="overflow-x-auto">
      <ul className="flex min-w-max gap-2 pb-1">
        {SEARCH_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.value;
          const params = new URLSearchParams();
          params.set("category", category.value);

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
                {category.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
