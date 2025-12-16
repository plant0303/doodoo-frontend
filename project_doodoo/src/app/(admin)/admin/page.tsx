// src/app/(admin)/page.tsx

// 필요한 경우 서버 컴포넌트에서 데이터베이스/API 호출 로직을 여기에 구현합니다.

// 임시 데이터 (실제로는 Supabase/Workers API에서 가져와야 함)
const dashboardStats = [
  { 
    title: "총 이미지 수", 
    value: "1,245", 
    change: "+12", 
    trend: "positive",
    description: "지난 7일간의 신규 등록 이미지 수",
  },
  { 
    title: "총 사용자 수", 
    value: "890", 
    change: "+30", 
    trend: "positive",
    description: "지난 7일간의 신규 가입자 수",
  },
  { 
    title: "R2 스토리지 사용량", 
    value: "25.4 GB", 
    change: "0.5 GB", 
    trend: "neutral",
    description: "총 사용된 클라우드 스토리지",
  },
  { 
    title: "누적 다운로드", 
    value: "12,400", 
    change: "-5%", 
    trend: "negative",
    description: "지난 달 대비 다운로드 변화율",
  },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'positive' | 'negative' | 'neutral';
  description: string;
}

// 현황을 보여주는 카드 컴포넌트
const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, description }) => {
  const trendColor = 
    trend === 'positive' ? 'text-green-500' : 
    trend === 'negative' ? 'text-red-500' : 
    'text-gray-500';

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-4xl font-extrabold text-gray-900">{value}</p>
        <span className={`text-sm font-medium ${trendColor}`}>{change}</span>
      </div>
      <p className="text-xs text-gray-400 mt-2">{description}</p>
    </div>
  );
};


export default function AdminDashboardPage() {
  
  // 실제로는 useSupabase 훅을 통해 관리자 이름을 가져올 수 있습니다.
  const adminName = "관리자"; // 임시 이름

  return (
    <div className="space-y-8">
      {/* 1. 헤더 영역 */}
      <header className="pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">👋 {adminName}님, 대시보드</h1>
        <p className="text-gray-500 mt-1">서비스 현황을 한눈에 확인하고 관리하세요.</p>
      </header>

      {/* 2. 통계 카드 영역 */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">주요 현황</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

      {/* 3. 최근 활동 영역 (임시) */}
      <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">최근 활동</h2>
        <ul className="space-y-3 text-gray-600">
          <li className="p-3 border-b border-gray-100 flex justify-between">
            <span>'서울 야경' 이미지가 새로 등록되었습니다.</span>
            <span className="text-sm text-gray-400">10분 전</span>
          </li>
          <li className="p-3 border-b border-gray-100 flex justify-between">
            <span>새로운 사용자 2명이 가입했습니다.</span>
            <span className="text-sm text-gray-400">1시간 전</span>
          </li>
          <li className="p-3 flex justify-between">
            <span>'낡은 건물' 이미지가 삭제되었습니다.</span>
            <span className="text-sm text-gray-400">3시간 전</span>
          </li>
        </ul>
      </section>
      
    </div>
  );
}