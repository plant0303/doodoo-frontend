'use client';

import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faLock, faEnvelope, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 클라이언트 측 Supabase 인스턴스
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  
  // Workers API URL (환경 변수 사용 권장)
  const WORKERS_URL = process.env.NEXT_PUBLIC_WORKERS_URL || 'http://127.0.0.1:8787';

  // ----------------------------------------------------
  // Workers API 호출 함수 (권한 검증)
  // ----------------------------------------------------
  const verifyAdminRole = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${WORKERS_URL}/api/admin/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        return data.isAdmin === true;
      }

      // 401 (토큰 유효하지 않음) 또는 403 (권한 없음)
      const errorData = await response.json();
      setError(errorData.error || '권한 검증 중 알 수 없는 오류 발생');
      return false;

    } catch (e) {
      setError('서버 연결 오류가 발생했습니다.');
      return false;
    }
  };

  // ----------------------------------------------------
  // 로그인 처리 핸들러
  // ----------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. Supabase Auth로 로그인 시도
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.session) {
      setError('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
      setLoading(false);
      return;
    }

    // 2. Workers를 통한 관리자 권한 검증
    const isAdmin = await verifyAdminRole(data.session.access_token);

    if (isAdmin) {
      router.push('/admin'); // 3. 검증 성공 시 대시보드로 이동
    } else {
      await supabase.auth.signOut(); // 세션 강제 종료
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-200">

        {/* 헤더 */}
        <div className="text-center">
          <FontAwesomeIcon icon={faSignInAlt} className="w-10 h-10 mx-auto text-gray-800" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            관리자 로그인
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            접근하려면 관리자 계정으로 로그인하세요.
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* 로그인 폼 */}
        <form className="space-y-6" onSubmit={handleLogin}>

          {/* 이메일 입력 */}
          <div>
            <label htmlFor="email" className="sr-only">이메일 주소</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="관리자 이메일 주소"
                disabled={loading}
              />
            </div>
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="password" className="sr-only">비밀번호</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="비밀번호"
                disabled={loading}
              />
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white transition-colors 
              ${loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`
            }
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5 mr-2" />
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}