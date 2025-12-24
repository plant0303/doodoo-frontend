// src/app/(admin)/page.tsx

import { Metadata } from "next";

// metadate 정의하기
export const metadata: Metadata = {
  title: 'doodoo admin page - dashboard',

  description: 'doodoo admin page - dashboard',
}

export default function AdminDashboardPage() {

  const adminName = "관리자"; // 임시 이름


  return (
    <div className="">
      대시보드
    </div>
  );
}