// src/app/(admin)/layout.tsx

// 필요한 Supabase 클라이언트 및 Hooks Import
import AdminLoadingScreen from '@/components/admin/AdminLoadingScreen';
import React from 'react'
// import { useSupabase } from '@/lib/supabase/hooks'; // 예시

export default function AdminLayout({ children }: { children: React.ReactNode }) {


  // user 객체에 'admin' 역할 정보가 포함되어 있는지 확인해야 합니다.
  // if (!user || user.role !== 'admin') {
  //   // 미들웨어에서 걸러졌어야 하지만, 클라이언트 측에서도 한 번 더 체크 가능
  //   // (미들웨어 실패 대비)
  //   return <div>접근 권한이 없습니다.</div>;
  // }

  // 인증이 완료된 관리자에게만 관리자 UI 표시
  return (
    <>
      <main>{children}</main>
    </>
  );
}