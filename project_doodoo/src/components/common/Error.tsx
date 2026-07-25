// components/ErrorState.tsx
'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] my-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
      <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1">
        검색 결과를 불러올 수 없습니다
      </h3>
      <p className="text-xs text-gray-500 mb-5">
        네트워크 연결이 끊겼거나 서버 응답이 지연되고 있습니다.
      </p>
      
      {/* 새로고침하여 SSR을 재요청 */}
      <button
        onClick={() => window.location.reload()}
        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-all"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>새로고침</span>
      </button>
    </div>
  );
}