// src/components/admin/AdminSidebar.tsx
'use client';
import { logout } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminSidebar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (!confirm('로그아웃 하시겠습니까?')) return;

    setIsLoggingOut(true);
    try {
      await logout(); 
      router.push('/admin/login'); // 성공 시 로그인 페이지로 이동
    } catch (err: any) {
      console.error('Logout failed:', err);
      alert('로그아웃 중 오류가 발생했습니다.');
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <aside className="left-0 top-0 h-full w-64 bg-gray-800 text-white p-6 shadow-xl z-10">
      <h2 className="text-2xl font-bold mb-8 border-b border-gray-700 pb-4">
        Admin Panel
      </h2>
      <nav className="space-y-2">
        {/* 대시보드 링크 */}
        <Link
          href="/admin/Images/dashboard"
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

        <Link
          href="/admin/Images/new"
          className="flex items-center p-3 text-base font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          새 이미지 등록
        </Link>

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer w-full flex items-center p-3 text-base font-medium rounded-lg text-red-400 hover:bg-gray-700 transition-colors mt-6"
        >
          로그아웃
        </button>
      </nav>
    </aside>
  );
}