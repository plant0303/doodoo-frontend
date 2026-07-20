"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function KeywordList({ keywords }: { keywords: string[] }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const onMouseDown = (e: React.MouseEvent) => {
    isDown = true;
    startX = e.pageX - (containerRef.current?.offsetLeft ?? 0);
    scrollLeft = containerRef.current?.scrollLeft ?? 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft ?? 0);
    const walk = (x - startX) * 1.5; // 드래그 속도 조정
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const onMouseUp = () => {
    isDown = false;
  };

  const handleKeywordClick = (keyword: string) => {
    router.push(`/list?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <section className="py-5">
      <h2 className="font-semibold text-xl mb-3 text-gray-700">
        Keywords
      </h2>

      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
        className="flex flex-row flex-nowrap overflow-x-auto gap-2 pb-2 scrollbar-hide custom-scrollbar scrollbar-auto-hide">

        {keywords && keywords.map((keyword, index) => (
          <button
            key={`keyword-${index}`}
            className="cursor-pointer flex-shrink-0 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 text-sm font-medium rounded-full transition duration-200 whitespace-nowrap"
            onClick={() => handleKeywordClick(keyword)}
          >
            {keyword}
          </button>
        ))}

        {(!keywords || keywords.length === 0) && (
          <p className="text-gray-400 text-sm">No keywords available.</p>
        )}
      </div>
    </section>
  );
}
