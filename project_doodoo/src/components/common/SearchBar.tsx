"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar() {
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
      className="flex items-center w-full sm:flex-1 bg-white px-3 sm:px-4 py-2 border-2 border-[var(--sub-color)] rounded-full text-sm sm:text-base sm:bg-blue-50"
      onSubmit={handleSearch}
    >
      <select
        defaultValue="all"
        className="mr-2 sm:mr-3 bg-transparent text-gray-700 outline-none"
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="photo">Photo</option>
        <option value="illustration">Illustration</option>
        <option value="template">Template</option>
        <option value="icon">Icon</option>
        <option value="sticker">Sticker</option>
      </select>

      <input
        type="text"
        placeholder="Search..."
        aria-label="search"
        className="w-full px-2 border-none outline-none placeholder-white/60 text-gray-800"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button type="submit">
        <FontAwesomeIcon icon={faSearch} className="w-5 y-5 text-[var(--primary-color)]" />
      </button>
    </form>
  );
}
