// src/components/admin/AdminLoadingScreen.tsx

export default function AdminLoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        {/* 간단한 로딩 스피너 (Tailwind CSS 애니메이션) */}
        <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-gray-600 font-medium">
          관리자 권한을 확인 중입니다...
        </p>
      </div>
    </div>
  );
}