// src/app/middleware.ts

import { NextResponse, NextRequest } from 'next/server';
// Supabase 관련 유틸리티 (인증 토큰 확인 등)를 import 합니다.

const ADMIN_PATH = '/admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 관리자 경로인지 확인
  if (pathname.startsWith(ADMIN_PATH) && !pathname.startsWith('/admin/login')) {
    // 2. 관리자 인증 상태 및 권한 확인 로직 (Supabase 토큰 검증)
    const isAuthenticated = await checkAdminAuth(request); // <-- 실제 구현 필요

    if (!isAuthenticated) {
      // 3. 권한이 없으면 로그인 페이지로 리다이렉트
      const loginUrl = new URL(`${ADMIN_PATH}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    // 4. 권한이 있으면 요청을 계속 진행
    return NextResponse.next();
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로를 지정합니다.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

// **********************************  
// checkAdminAuth 함수 (예시)
// **********************************
async function checkAdminAuth(request: NextRequest): Promise<boolean> {
  // 복잡한 로직 없이 무조건 true 반환
  return true;
}