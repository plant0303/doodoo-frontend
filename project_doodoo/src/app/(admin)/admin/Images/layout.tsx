// src/app/(admin)/layout.tsx

'use client';

import React, { useState } from 'react';
import "../globals.css";
import AdminSidebar from '@/components/admin/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      
      {/* 1. 모바일용 오버레이 (사이드바 열렸을 때 배경 어둡게) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. 사이드바 (모바일에서는 숨겨져 있다가 열림 상태에 따라 등장) */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 w-64 bg-white
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* 모바일 전용 닫기 버튼 (사이드바 내부 상단) */}
        <div className="flex bg-gray-800 justify-end p-4 md:hidden">
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-50">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <AdminSidebar />
      </div>

      {/* 3. 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* 모바일용 상단 바 (햄버거 버튼 포함) */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 md:hidden">
          <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none">
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
          <h1 className="text-lg font-bold text-indigo-600">Admin Panel</h1>
          <div className="w-6" /> {/* 좌우 밸런스용 빈 공간 */}
        </header>

        {/* 실제 콘텐츠 스크롤 영역 */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}