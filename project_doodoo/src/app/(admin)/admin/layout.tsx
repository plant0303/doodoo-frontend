// src/app/(admin)/layout.tsx

// 필요한 Supabase 클라이언트 및 Hooks Import
import React from 'react'
import "./globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  // 인증이 완료된 관리자에게만 관리자 UI 표시
  return (
    <div className="flex-1 overflow-y-auto">
        {children}
    </div>
  );
}