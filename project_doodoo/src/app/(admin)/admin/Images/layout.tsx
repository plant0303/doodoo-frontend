// src/app/(admin)/layout.tsx

// 필요한 Supabase 클라이언트 및 Hooks Import
import React from 'react'
import "../globals.css";
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  // 인증이 완료된 관리자에게만 관리자 UI 표시
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto pl-64 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}