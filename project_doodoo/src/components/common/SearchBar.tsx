"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLocale, useTranslations } from "next-intl";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";

  return <SearchBarForm key={`${query}:${category}`} defaultQuery={query} category={category} />;
}

function SearchBarForm({ defaultQuery, category }: { defaultQuery: string; category: string }) {
  const t = useTranslations("hero");
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category !== "all") params.set("category", category);

    router.push(`/${locale}/list?${params.toString()}`);
  };

  return (
    <form
      role="search"
      method="get"
      className="flex w-full justify-end sm:text-base"
      onSubmit={handleSearch}
    >
      <div className="relative w-full">
        <input
          type="text"
          aria-label="search"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full sm:flex-1 pl-6 pr-12 py-3.5 bg-white border border-[var(--sub-color)] rounded-full shadow-sm text-sm focus:outline-none focus:border-[var(--sub-color)] focus:ring-2 focus:ring-[var(--sub-color)] transition-all placeholder-gray-400"
        />
        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <FontAwesomeIcon icon={faSearch} className="w-5 h-5 text-[var(--primary-color)]" />
        </button>
      </div>
    </form>
  );
}
