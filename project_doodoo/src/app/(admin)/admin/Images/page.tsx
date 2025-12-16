// src/app/(admin)/images/page.tsx

'use client';
import React, { useState, useMemo, useCallback } from 'react';

// Font Awesome Import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,         // 설정 (Settings)
  faTrashAlt,    // 삭제 (Trash2)
  faEdit,        // 수정 (Edit)
  faChevronLeft, // 왼쪽 화살표 (ChevronLeft)
  faChevronRight, // 오른쪽 화살표 (ChevronRight)
  faPlus,        // 등록 버튼용 (FileText 대신)
  faSquare,
  faBox,         // 통계 카드 - 총 등록 이미지 (📦)
  faFire,        // 통계 카드 - 오늘 조회수 (🔥)
  faDownload,    // 통계 카드 - 주간 다운로드 (⬇️)
  faClock,       // 통계 카드 - 미승인 대기 (⏳)
} from '@fortawesome/free-solid-svg-icons';


const MOCK_IMAGES = [
  ...Array(115).fill(0).map((_, i) => ({
    id: `img-${i + 1}`,
    uuid: `0f8a7e${(i + 1).toString().padStart(3, '0')}-4c9b-9a4d-c123d4e5f6g7`,
    title: `Premium Stock Image Title ${i + 1}`,
    thumbUrl: `/api/placeholder/48x48?text=T${i + 1}`, // 실제 썸네일 URL로 변경 필요
    views: Math.floor(Math.random() * 5000) + 100,
    uploadedAt: new Date(Date.now() - i * 86400000).toLocaleDateString(),
    extensions: i % 3 === 0 ? ['PSD', 'JPG'] : i % 3 === 1 ? ['AI', 'EPS'] : ['PNG'],
  })),
];

const ITEMS_PER_PAGE = 10;

export default function Images() {
  const [currentPage, setCurrentPage] = useState(1);
  // 선택된 이미지 ID 목록 (일괄 처리용)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const totalPages = Math.ceil(MOCK_IMAGES.length / ITEMS_PER_PAGE);

  const currentImages = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return MOCK_IMAGES.slice(start, end);
  }, [currentPage]);

  // 전체 선택/해제 핸들러
  const toggleSelectAll = useCallback(() => {
    if (selectedItems.size === currentImages.length) {
      setSelectedItems(new Set()); // 모두 해제
    } else {
      const allIds = new Set(currentImages.map(img => img.id));
      setSelectedItems(allIds); // 모두 선택
    }
  }, [selectedItems, currentImages]);

  // 개별 항목 선택/해제 핸들러
  const toggleSelectItem = useCallback((id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // 일괄 수정/삭제 처리
  const handleBulkEdit = () => {
    if (selectedItems.size === 0) return alert('선택된 항목이 없습니다.');
    console.log(`일괄 수정 대상: ${Array.from(selectedItems).join(', ')}`);
    alert(`${selectedItems.size}개의 항목을 일괄 수정합니다. (실제 기능 구현 필요)`);
    setSelectedItems(new Set()); // 처리 후 선택 초기화
  };

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return alert('선택된 항목이 없습니다.');
    if (!window.confirm(`선택된 ${selectedItems.size}개의 이미지를 정말로 삭제하시겠습니까?`)) return;

    console.log(`일괄 삭제 대상: ${Array.from(selectedItems).join(', ')}`);
    alert(`${selectedItems.size}개의 항목을 일괄 삭제합니다. (실제 기능 구현 필요)`);
    // 실제로는 MOCK_IMAGES를 업데이트하거나 API 호출 후 다시 로드해야 함
    setSelectedItems(new Set()); // 처리 후 선택 초기화
  };


  // 페이지네이션 로직은 이전과 동일
  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handleGoToPage = (page: number) => setCurrentPage(page);

  return (
    <div className="min-h-full rounded-xl p-6 md:p-8">
      <header className="mb-6 flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FontAwesomeIcon icon={faCog} className="w-6 h-6 mr-3 text-indigo-600" />
          이미지 관리
        </h1>
        <button
          className="cursor-pointer flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md"
          onClick={() => console.log('이미지 등록 페이지로 이동')}
        >
          <FontAwesomeIcon icon={faPlus} className="w-3 h-3 mr-2" /> 새 이미지 등록
        </button>
      </header>

      {/* 일괄 처리 및 검색 영역 */}
      <div className="flex justify-between items-center mb-4">
        {/* 일괄 처리 버튼 */}
        <div className="flex space-x-3">
          <button
            onClick={handleBulkDelete}
            disabled={selectedItems.size === 0}
            className="flex items-center text-sm px-4 py-2 border border-red-400 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            <FontAwesomeIcon icon={faTrashAlt} className="w-3 h-3 mr-2" /> 일괄 삭제 ({selectedItems.size})
          </button>
        </div>

        {/* 검색 필드 (추후 구현) */}
        <input
          type="text"
          placeholder="제목, 키워드, UUID 검색..."
          className="w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* 이미지 목록 테이블 */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* 전체 선택 체크박스 */}
              <th className="px-3 py-3 w-10">
                <button onClick={toggleSelectAll} className="p-1 text-gray-500 hover:text-gray-800">
                  <FontAwesomeIcon
                    icon={selectedItems.size === currentImages.length && currentImages.length > 0 ? faCheckSquare : faSquare}
                    className="w-4 h-4"
                  />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">썸네일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목 (UUID)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">파일 확장자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentImages.map((image) => (
              <tr key={image.id} className={`hover:bg-indigo-50/20 ${selectedItems.has(image.id) ? 'bg-indigo-50' : ''}`}>
                {/* 개별 선택 체크박스 */}
                <td className="px-3 py-4 w-10">
                  <button onClick={() => toggleSelectItem(image.id)} className="p-1 text-gray-700 hover:text-indigo-600">
                    <FontAwesomeIcon
                      icon={selectedItems.has(image.id) ? faCheckSquare : faSquare}
                      className="w-4 h-4"
                    />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                    {/* Next/Image 미사용 상태이므로 <img /> 태그 사용 */}
                    <img
                      src={image.thumbUrl}
                      alt={image.title}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">{image.title}</div>
                  <div className="text-xs text-gray-500 truncate w-48">{image.uuid}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {image.extensions.map(ext => (
                    <span key={ext} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2">
                      {ext}
                    </span>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{image.uploadedAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    className="cursor-pointer text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                    onClick={() => console.log(`수정: ${image.id}`)}
                    title="개별 수정"
                  >
                    <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                  </button>
                  <button
                    className="cursor-pointer text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                    onClick={() => console.log(`삭제: ${image.id}`)}
                    title="개별 삭제"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          총 {MOCK_IMAGES.length}개의 이미지 중 {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, MOCK_IMAGES.length)}개 표시
        </div>
        <div className="flex items-center space-x-1">
          {/* 이전 버튼 */}
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="cursor-pointer p-2 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
          </button>

          {/* 페이지 번호 목록 */}
          {Array(totalPages).fill(0).map((_, index) => (
            <button
              key={index}
              onClick={() => handleGoToPage(index + 1)}
              className={`cursor-pointer w-9 h-9 text-sm font-medium rounded-lg transition-colors border ${currentPage === index + 1
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                }`}
            >
              {index + 1}
            </button>
          ))}

          {/* 다음 버튼 */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="cursor-pointer p-2 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 간단한 통계 카드 컴포넌트
interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  icon: any; // Font Awesome Icon definition type
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon, color }) => (
  <div className={`p-4 rounded-xl shadow-md ${color}`}>
    <div className="flex justify-between items-center">
      {/* Font Awesome 아이콘 표시 */}
      <FontAwesomeIcon icon={icon} className="text-2xl" />
      <div className="text-right">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1">
          {value.toLocaleString()} <span className="text-sm font-normal">{unit}</span>
        </p>
      </div>
    </div>
  </div>
);