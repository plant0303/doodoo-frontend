// src/components/admin/AdminSidebar.tsx
'use client';
import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="left-0 top-0 h-full w-64 bg-gray-800 text-white p-6 shadow-xl z-10">
      <h2 className="text-2xl font-bold mb-8 border-b border-gray-700 pb-4">
        Admin Panel
      </h2>
      <nav className="space-y-2">
        {/* 대시보드 링크 */}
        <Link 
          href="/admin" 
          className="flex items-center p-3 text-base font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          대시보드
        </Link>
        
        {/* 이미지 관리 링크 */}
        <Link 
          href="/admin/Images"
          className="flex items-center p-3 text-base font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          이미지 관리
        </Link>
        
        {/* 로그아웃 버튼 */}
        <button 
          onClick={() => console.log('로그아웃 기능 구현 필요')}
          className="w-full flex items-center p-3 text-base font-medium rounded-lg text-red-400 hover:bg-gray-700 transition-colors mt-6"
        >
          로그아웃
        </button>
      </nav>
    </aside>
  );
}