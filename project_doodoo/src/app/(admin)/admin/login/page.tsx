'use client';

import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faLock, faEnvelope, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { verifyAdminRole } from '@/lib/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // ----------------------------------------------------
  // 로그인 처리 핸들러
  // ----------------------------------------------------
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Supabase Auth 로그인
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !data.session) {
        throw new Error('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
      }

      // 2. 분리한 API 함수로 관리자 권한 검증
      const { isAdmin, error: adminError } = await verifyAdminRole();

      if (isAdmin) {
        // 3. 검증 성공 시 이동
        router.push('/admin/Images');
      } else {
        // 관리자가 아니면 로그아웃 처리 후 에러 표시
        await supabase.auth.signOut();
        throw new Error(adminError || '관리자 권한이 없습니다.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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