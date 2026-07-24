'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Paintbrush,
  Type,
  Palette,
  Boxes,
  Copy,
  Share2,
  Heart,
  ArrowUpRight,
  Check,
  Sparkles
} from "lucide-react";
import { PromptDetailResponse } from '@/types/prompt';


interface PromptBuilderProps {
  promptData: PromptDetailResponse; // 👈 정의해 두신 타입 활용!
}

export default function PromptBuilder({ promptData }: PromptBuilderProps) {

  const [copied, setCopied] = useState(false);

  // Final Prompt 박스 및 하이라이트 요소를 가리킬 Ref
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightedRef = useRef<HTMLElement | null>(null);

  // edit_fields 문자열 파싱
  const editFields = useMemo(() => {
    if (!promptData?.edit_fields) return [];
    if (typeof promptData.edit_fields === 'string') {
      try {
        return JSON.parse(promptData.edit_fields) as PromptDetailResponse['edit_fields'];
      } catch {
        return [];
      }
    }
    return promptData.edit_fields;
  }, [promptData?.edit_fields]);

  // Form Initial State 세팅
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {};
    editFields.forEach((field) => {
      if (field.key) {
        initialState[field.key] = field.default || '';
      }
    });
    return initialState;
  });

  // 서브옵션 선택 상태 (기본값: 적용됨)
  const [selectedSubOption, setSelectedSubOption] = useState<string | null>(
    promptData?.sub_option?.name || null
  );

  // 마지막으로 수정한 필드의 Key 추적 (해당 위치로 스크롤)
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // base_prompt 동적 치환
  const finalPrompt = useMemo(() => {
    let result = promptData?.base_prompt || '';

    Object.entries(formValues).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*}}`, 'g');
      result = result.replace(regex, value || '');
    });

    return result;
  }, [promptData?.base_prompt, formValues]);

  // Input 입력 핸들러
  const handleInputChange = (key: string, val: string) => {
    setFormValues((prev) => ({ ...prev, [key]: val }));
    setActiveKey(key);
  };

  // 추천 키워드 칩 클릭 핸들러
  const handleOptionClick = (key: string, optionValue: string) => {
    setFormValues((prev) => ({ ...prev, [key]: optionValue }));
  };

  // 서브 옵션 칩 토글 핸들러
  const handleSubOptionToggle = (subOptionName: string) => {
    if (selectedSubOption === subOptionName) {
      setSelectedSubOption(null);
    } else {
      setSelectedSubOption(subOptionName);
      // 첫 번째 입력 필드가 존재할 경우 해당 필드 값으로 자동 반영 (선택 사항)
      if (editFields.length > 0 && editFields[0].key) {
        handleInputChange(editFields[0].key, subOptionName);
      }
    }
  };

  // 클립보드 복사 핸들러
  const handleCopy = () => {
    if (!finalPrompt) return;
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 하이라이트 및 스크롤 타겟 렌더링
  const renderHighlightedPrompt = useMemo(() => {
    if (!finalPrompt) return '프롬프트를 불러오는 중입니다...';

    const activeValues = Object.values(formValues)
      .filter((val) => val && val.trim() !== '')
      .map((val) => val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (activeValues.length === 0) return finalPrompt;

    activeValues.sort((a, b) => b.length - a.length);
    const regex = new RegExp(`(${activeValues.join('|')})`, 'g');
    const parts = finalPrompt.split(regex);

    // 현재 수정 중인 필드의 입력값
    const currentActiveValue = activeKey ? formValues[activeKey] : null;

    return parts.map((part, index) => {
      const isHighlighted = activeValues.some(
        (val) => val.replace(/\\/g, '') === part
      );

      // 현재 활성화되어 수정 중인 단어인지 확인
      const isCurrentlyEditing = currentActiveValue && part === currentActiveValue;

      if (isHighlighted) {
        return (
          <mark
            key={index}
            // 현재 수정 중인 위치라면 ref를 연결하여 스크롤 위치 지정
            ref={isCurrentlyEditing ? (el) => { highlightedRef.current = el; } : undefined}
            className="bg-indigo-500/30 text-indigo-200 border-b-2 border-indigo-400 font-semibold px-1 py-0.5 rounded transition-all duration-300"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  }, [finalPrompt, formValues, activeKey]);

  // 값이 변경될 때마다 하이라이트된 위치로 자동 스크롤
  useEffect(() => {
    const container = containerRef.current;
    const target = highlightedRef.current;

    if (container && target) {
      // container 상단 기준 target 위치 상대 오프셋 계산
      const containerTop = container.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;

      // target이 container 내부에서 얼마만큼 떨어져 있는지 계산
      const relativeTop = targetTop - containerTop + container.scrollTop;

      // target이 container 한가운데 위치하도록 목표 scrollTop 계산
      const targetScrollTop = relativeTop - container.clientHeight / 2 + target.clientHeight / 2;

      // 상자 내부 스크롤만 부드럽게 이동 (전체 페이지 스크롤 영향 X)
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });
    }
  }, [formValues, activeKey]);

  return (
    <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 mb-2 sm:p-8 space-y-8">
      <h2 className="text-[25px]">Prompt Builder</h2>

      {/* 1. Quick Modify (가변 필드 폼) */}
      <div className="space-y-5">
        {editFields.length > 0 ? (
          editFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{field.label || field.key}</span>
              </label>

              <input
                type="text"
                value={formValues[field.key] ?? ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={field.default}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">수정 가능한 가변 필드가 없습니다.</p>
        )}
      </div>

      {/* 2. Final Prompt (JSON Block) */}
      <div className="space-y-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              Final Prompt
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* containerRef로 상자 스크롤 감지 및 제어 */}
          <div
            ref={containerRef}
            className="bg-slate-900 text-slate-200 rounded-2xl p-5 font-mono text-xs overflow-y-auto max-h-64 leading-relaxed shadow-inner whitespace-pre-wrap selection:bg-indigo-500 selection:text-white"
          >
            {renderHighlightedPrompt}
          </div>
        </div>
      </div>


      {/* 3. Call to Action Button */}
      <button
        onClick={handleCopy}
        className="cursor-pointer w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
      >
        <span>{copied ? '복사되었습니다!' : '프롬프트 복사하기'}</span>
        <ArrowUpRight className="w-5 h-5" />
      </button>
    </section>
  );
}
