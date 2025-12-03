"use client";

import { useState, useRef, useEffect } from "react";
import { FileDownloadOption } from '@/lib/api';

const WORKERS_API_URL = process.env.NEXT_PUBLIC_WORKERS_API_URL;

interface Props {
  imageId: string; 
  options: FileDownloadOption[];
  defaultLabel: string;
}

export default function DownloadDropdown({ imageId, options, defaultLabel }: Props) {
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

  const handleDownloadClick = (option: FileDownloadOption) => {
    setOpen(false); // 드롭다운 닫기

    if (!WORKERS_API_URL) {
      console.error("Workers API URL is not set for download.");
      return;
    }

    const downloadUrl = `${WORKERS_API_URL}/api/download?id=${imageId}&type_id=${option.file_type_id}`;

    window.open(downloadUrl, '_blank');
  };

  const primaryOption = options[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* 메인 버튼 */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-center py-3 rounded-full font-semibold bg-[var(--sub-color)] text-[var(--primary-color)] hover:bg-[var(--sub-hover)] transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Download
        <span className="ml-2">▼</span>
      </button>

      {/* ▼ Dropdown */}
      {options.length > 0 && (
        <div
          className={`
                        absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-30 border
                        bg-white shadow-xl 
                        transform transition-all duration-200 origin-top
                        ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
                    `}
        >
          {options.map((option) => (
            <DropdownItem
              key={option.file_type_id}
              label={`${option.label} (${option.extension.toUpperCase()})`}
              size={`${option.width}x${option.height} / ${option.file_size_mb}MB`}
              onClick={() => handleDownloadClick(option)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DropdownItem({
    label,
    size,
    onClick,
}: {
    label: string;
    size: string;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className="block px-5 py-3 text-sm flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors duration-200"
        >
            <span className="font-medium text-gray-700">{label}</span>
            {size && <span className="text-xs text-gray-400">{size}</span>}
        </div>
    );
}