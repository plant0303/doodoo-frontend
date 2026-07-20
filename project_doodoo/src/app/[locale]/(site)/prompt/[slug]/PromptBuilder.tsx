'use client';

import React, { useMemo, useState } from 'react'
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

  // 1. edit_fields 안전하게 확보 (문자열 파싱 대응)
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

  // 2. Form Initial State 세팅
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {};
    editFields.forEach((field) => {
      if (field.key) {
        initialState[field.key] = field.default || '';
      }
    });
    return initialState;
  });

  // 3. 서브옵션 선택 상태 (기본값: 적용됨)
  const [selectedSubOption, setSelectedSubOption] = useState<string | null>(
    promptData?.sub_option?.name || null
  );
  
  // 3. base_prompt 동적 치환
  const finalPrompt = useMemo(() => {
    let result = promptData?.base_prompt || '';

    Object.entries(formValues).forEach(([key, value]) => {
      // {{KEY}} 및 {{ KEY }} 형태를 모두 안전하게 치환 (특수문자 이스케이프 포함)
      const regex = new RegExp(`{{\\s*${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*}}`, 'g');
      result = result.replace(regex, value || '');
    });

    return result;
  }, [promptData?.base_prompt, formValues]);

  // 4. Input 입력 핸들러
  const handleInputChange = (key: string, val: string) => {
    setFormValues((prev) => ({ ...prev, [key]: val }));
  };

  // 6. 추천 키워드 칩 클릭 핸들러
  const handleOptionClick = (key: string, optionValue: string) => {
    setFormValues((prev) => ({ ...prev, [key]: optionValue }));
  };

  // 7. 서브 옵션 칩 토글 핸들러
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


  return (
    <section className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-lg space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Prompt Builder</h2>
      </div>

      {/* 1. Quick Modify (가변 필드 폼) */}
      <div className="space-y-5">
        {editFields.length > 0 ? (
          editFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{field.label || field.key}</span>
              </label>

              {/* 텍스트 입력창 (수정 시 실시간 치환) */}
              <input
                type="text"
                value={formValues[field.key] ?? ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={field.default}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              {/* 추천 키워드 칩 안전 렌더링 */}
              {field.options && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(Array.isArray(field.options)
                    ? field.options
                    : typeof field.options === 'string'
                      ? (field.options as string).split(',')
                      : []
                  ).map((opt: any, index: number) => {
                    const optionText =
                      typeof opt === 'string'
                        ? opt.trim()
                        : opt?.label || opt?.value || String(opt);

                    if (!optionText) return null;
                    const isSelected = formValues[field.key] === optionText;

                    return (
                      <button
                        key={`${optionText}-${index}`}
                        type="button"
                        onClick={() => handleOptionClick(field.key, optionText)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                          }`}
                      >
                        {optionText}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">수정 가능한 가변 필드가 없습니다.</p>
        )}
      </div>

      {/* 2. Final Prompt (JSON Block) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
            Final Prompt
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
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

        <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 font-mono text-xs overflow-y-auto max-h-64 leading-relaxed shadow-inner whitespace-pre-wrap">
          {finalPrompt || '프롬프트를 불러오는 중입니다...'}
        </div>
      </div>


      {/* 3. Call to Action Button */}
      <button
        onClick={handleCopy}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
      >
        <span>{copied ? '복사되었습니다!' : '프롬프트 복사하기'}</span>
        <ArrowUpRight className="w-5 h-5" />
      </button>
    </section>
  );
}
