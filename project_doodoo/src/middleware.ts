import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 1. Supabase 클라이언트 생성 (쿠키 핸들링 포함)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
      },
    }
  );

  // 2. 세션 정보 확인
  const { data: { session } } = await supabase.auth.getSession();

  // 3. /admin 경로 보호 로직
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin')) {
    // 로그인 페이지 접근은 허용
    if (pathname === '/admin/login') {
      return response;
    }

    // 세션이 없으면 로그인 페이지로 리다이렉트
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // 관리자 이메일 체크 (필요 시)
    const adminEmails = ['penitcontact@gmail.com'];
    if (!adminEmails.includes(session.user.email || '')) {
      // 관리자가 아니면 세션이 있어도 쫓아냄
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};