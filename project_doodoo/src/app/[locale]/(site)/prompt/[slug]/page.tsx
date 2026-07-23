import { notFound, useSearchParams } from 'next/navigation';
import SimilarImages from './SimilarImages';
import PromptBuilder from './PromptBuilder';
import { getPromptDetail } from '@/lib/api';
import Image from 'next/image';
import { PromptDetailResponse } from '@/types/prompt';
import { Link } from 'lucide-react';
import DetailBreadcrumb from '@/components/common/DetailBreadcrumb';
import { spawn } from 'child_process';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}


export default async function Page({ params }: PageProps) {
  const { locale, slug: slug } = await params;

  const promptData: PromptDetailResponse | null = await getPromptDetail(slug, locale);

  if (!promptData) {
    notFound();
  }

  return (
    <div className="container min-h-screen py-8 sm:px-6 lg:px-8">

      <DetailBreadcrumb
        title={promptData.title}
        categoryName={promptData.category}
      />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT PANEL: Hero Image & Information (7/12 cols) */}
        <section className="lg:col-span-6 space-y-6">
          <div>
            <h1 className="text-[32px] font-medium  tracking-tight">
              {promptData.title}
            </h1>
            <p className="mt-3 text-[17px] text-slate-500">
              {promptData.summary}
            </p>
          </div>

          {/* Hero Image Container */}
          <figure className="relative w-full aspect-[4/4] rounded-3xl ">
            <Image
              src={promptData.image_preview_url}
              alt={promptData.image_alt || 'Prompt preview image'}
              title={promptData.title}
              fill
              priority // 💡 1. SEO & LCP 최적화: 가장 중요한 메인 이미지를 우선적으로 프리로드
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw" // 💡 2. 반응형 srcset 자동 생성으로 속도 향상
              quality={85} // 💡 3. 용량 대비 최적의 화질 설정
              className="max-w-full max-h-full object-contain"
            />
            {/* 💡 4. 시맨틱 태그(figure/figcaption) 활용으로 크롤러 식별성 향상 */}
            {promptData.title && (
              <figcaption className="sr-only">
                {promptData.title}
              </figcaption>
            )}
          </figure>
        </section>

        {/* RIGHT PANEL: Prompt Builder (5/12 cols) */}
        <PromptBuilder promptData={promptData} />
      </div>
      <div className="mt-12 pt-8 border-t border-gray-100">
        {/* 헤더 섹션: 태그 뱃지 + 타이틀 문구 */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="flex flex-wrap gap-1.5 items-center">
            {promptData.tags.map((tag) => (
              <span
                key={tag.id || tag.slug || tag.name}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[var(--sub-color)] text-[var(--primary-color)] "
              >
                #{tag.name}
              </span>
            ))}
          </div>
          <span className="text-base sm:text-lg font-bold text-gray-900 ml-0.5">
            와(과) 유사한 추천 이미지
          </span>
        </div>

        {/* 유사 이미지 컴포넌트 */}
        <SimilarImages imageId={promptData.id} />
      </div>
    </div>
  );
}

