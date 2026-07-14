"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";

export default function SearchBar() {
  const t = useTranslations("hero");

  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultQuery = searchParams.get("q") || "";
  const defaultCategory = searchParams.get("category") || "all";

  const [query, setQuery] = useState(defaultQuery);
  const [filter, setFilter] = useState(defaultCategory);
  useEffect(() => {
    setQuery(defaultQuery);
    setFilter(defaultCategory);
  }, [defaultQuery, defaultCategory]);


  const handleSearch = (e: any) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (filter !== "all") params.set("category", filter);

    router.push(`/list?${params.toString()}`);
  };

  return (
    <form
      role="search"
      method="get"
      className="flex justify-end w-full sm:text-sm sm:text-base max-w"
      onSubmit={handleSearch}
    >
      <div className="relative w-full relative w-full">
        <input
          type="text"
          aria-label="search"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:flex-1 pl-6 pr-12 py-3.5 bg-white border border-[var(--sub-color)] rounded-full shadow-sm text-sm focus:outline-none focus:border-[var(--sub-color)] focus:ring-2 focus:ring-[var(--sub-color)] transition-all placeholder-gray-400"
        />
        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <FontAwesomeIcon icon={faSearch} className="w-5 y-5 text-[var(--primary-color)]" />
        </button>
      </div>

    </form>


  );
}
