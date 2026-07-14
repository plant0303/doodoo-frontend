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

  const handleDownloadClick = async (e: React.MouseEvent, option: FileDownloadOption) => {
    // 1. 이벤트 전파 및 기본 동작 방지 (배포 환경에서 페이지 전환 방지 핵심)
    e.preventDefault();
    e.stopPropagation();

    setOpen(false);

    try {
      // Worker에게 Signed URL 생성을 요청 (JSON 응답을 받음)
      const response = await fetch(
        `${WORKERS_API_URL}/api/download?id=${imageId}&type_id=${option.file_type_id}`
      );

      if (!response.ok) {
        throw new Error("다운로드 권한을 가져오는데 실패했습니다.");
      }

      const data = await response.json();

      // 서버가 보내준 downloadUrl이 있는지 확인
      if (data.downloadUrl) {
        const link = document.createElement('a');
        link.href = data.downloadUrl;

        // R2에서 내려준 파일명 정책을 따르거나 강제 지정
        link.setAttribute('download', '');

        // 실제 DOM에 추가해야 일부 브라우저에서 정상 작동
        document.body.appendChild(link);
        link.click();

        // 클릭 후 바로 제거
        document.body.removeChild(link);
      } else {
        throw new Error("유효한 다운로드 주소가 없습니다.");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("다운로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const primaryOption = options[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* 메인 버튼 */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer w-full text-center py-3 rounded-full font-semibold bg-[var(--sub-color)] text-[var(--primary-color)] hover:bg-[var(--sub-hover)] transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Download
        <span className="ml-2">▼</span>
      </button>

      {/* ▼ Dropdown */}
      {options.length > 0 && (
        <div
          className={`
                        cursor-pointer absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-30 border
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
              onClick={(e) => handleDownloadClick(e, option)}
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
  onClick: (e: React.MouseEvent) => void;
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