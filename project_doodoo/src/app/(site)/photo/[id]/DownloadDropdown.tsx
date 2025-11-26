"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  urls: any;
  sizeInfo?: { full: string; regular: string; small: string };
}

export default function DownloadDropdown({ urls, sizeInfo }: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* 메인 버튼 */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="
          w-full text-center py-3 rounded-full font-semibold
          bg-[var(--sub-color)] text-[var(--primary-color)]
          hover:bg-[var(--sub-hover)] transition-all duration-200
          shadow-md hover:shadow-lg
        "
      >
        Download ▼
      </button>

      {/* ▼ Dropdown */}
      <div
        className={`
          absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-30 border
          bg-white shadow-xl 
          transform transition-all duration-200 origin-top
          ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
        `}
      >
        <DropdownItem
          label="Original"
          // url={urls.full}
          size={sizeInfo?.full}
        />
        <DropdownItem
          label="Medium"
          // url={urls.regular}
          size={sizeInfo?.regular}
        />
        <DropdownItem
          label="Low"
          // url={urls.small}
          size={sizeInfo?.small}
        />
      </div>
    </div>
  );
}

/* ▼ 하나의 아이템 컴포넌트 분리 */
function DropdownItem({
  label,
  // url,
  size,
}: {
  label: string;
  // url: string;
  size?: string;
}) {
  return (
    <a
      // href={url}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="
        block px-5 py-3 text-sm flex justify-between items-center text-center cursor-pointer
        hover:bg-blue-50 transition-colors duration-200
      "
    >
      <span className="font-medium text-gray-700">{label}</span>
      {size && <span className="text-xs text-gray-400">{size}</span>}
    </a>
  );
}
