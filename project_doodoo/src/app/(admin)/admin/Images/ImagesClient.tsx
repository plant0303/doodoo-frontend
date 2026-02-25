'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faTrashAlt,
  faEdit,
  faChevronLeft,
  faChevronRight,
  faPlus,
  faSquare,
  faCheckSquare,
  faSpinner // 로딩 아이콘 추가
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { fetchImages, ImageItem, deleteImages } from '@/lib/api'; // API 함수 임포트
import { useRouter } from 'next/navigation';

const ITEMS_PER_PAGE = 10;

export default function Images() {
  const CATEGORIES = ['all', 'photo', 'illustration', 'template', 'icon', 'sticker'];

  const [images, setImages] = useState<ImageItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const router = useRouter();

  // 데이터 로드 함수
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchImages();
      setImages(data);
    } catch (error) {
      console.error(error);
      alert('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredImages = useMemo(() => {
    let result = [...images];

    // 1. 카테고리 필터링
    if (selectedCategory !== 'all') {
      result = result.filter(img => img.category === selectedCategory);
    }

    // 2. 검색어 필터링
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      result = result.filter(img =>
        img.title.toLowerCase().includes(term) ||
        img.id.toLowerCase().includes(term)
      );
    }

    return result;
  }, [searchTerm, selectedCategory, images]);

  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);

  const currentImages = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredImages.slice(start, end);
  }, [currentPage, filteredImages]);

  // 4. 검색어가 변경되면 페이지를 1페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const toggleSelectAll = useCallback(() => {
    if (selectedItems.size === currentImages.length && currentImages.length > 0) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set(currentImages.map(img => img.id));
      setSelectedItems(allIds);
    }
  }, [selectedItems, currentImages]);

  const toggleSelectItem = useCallback((id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, []);

  // 일괄 삭제
  const handleBulkDelete = async () => {
    const selectedIds = Array.from(selectedItems);
    if (selectedIds.length === 0) return alert('선택된 항목이 없습니다.');

    if (!window.confirm(`선택된 ${selectedIds.length}개의 이미지를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return;

    setLoading(true); // 로딩 표시 시작
    try {
      await deleteImages(selectedIds);

      alert('성공적으로 삭제되었습니다.');

      setImages(prev => prev.filter(img => !selectedItems.has(img.id)));

      setSelectedItems(new Set());

      if (currentImages.length === selectedIds.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }

    } catch (error) {
      console.error(error);
      alert('삭제 작업 중 오류가 발생했습니다.');
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handleGoToPage = (page: number) => setCurrentPage(page);

  // 수정페이지 이동
  const handleEditClick = (id: string) => {
    router.push(`/admin/Images/edit/${id}`);
  };

  // 단일 삭제
  const handleDeleteClick = async (id: string, title: string) => {
    if (!confirm(`[${title}] 스톡을 삭제하시겠습니까?\n연결된 모든 원본 파일과 DB 정보가 영구 삭제됩니다.`)) return;

    try {
      await deleteImages([id]);
      alert('삭제되었습니다.');
      // 현재 목록에서 삭제된 아이템 제외
      setImages(prev => prev.filter(img => img.id !== id));


      // 선택 목록에서 제거
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

      // 페이지네이션 보정
      if (currentImages.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (err) {
      alert('삭제 처리 중 오류가 발생했습니다.');
    }
  };



  return (
    <div className="min-h-full rounded-xl p-6 md:p-8">
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
          <FontAwesomeIcon icon={faCog} className="w-5 h-5 md:w-6 md:h-6 mr-3 text-indigo-600" />
          이미지 관리
        </h1>
        <Link
          href="/admin/Images/new"
          className="w-full md:w-auto flex justify-center items-center bg-indigo-600 text-white px-5 py-3 md:py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3 h-3 mr-2" /> 새 이미지 등록
        </Link>
      </header>

      {/* 일괄삭제, 카테고리, 검색 영역 */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        {/* 왼쪽 그룹: 일괄삭제 & 카테고리 선택 */}
        <div className="flex flex-row space-x-2 w-full md:w-auto">
          <button
            onClick={handleBulkDelete}
            disabled={selectedItems.size === 0 || loading}
            className="flex-1 md:flex-none flex items-center justify-center text-sm px-4 py-2.5 md:py-2 border border-red-400 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faTrashAlt} className="w-3 h-3 mr-2" />
            <span>삭제 <span className="md:inline hidden">({selectedItems.size})</span></span>
            <span className="md:hidden ml-1">({selectedItems.size})</span>
          </button>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 md:flex-none px-3 py-2.5 md:py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white outline-none"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? '전체 카테고리' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* 오른쪽 그룹: 검색창 */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="제목 또는 UUID 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 w-10">
                <button onClick={toggleSelectAll} className="p-1 text-gray-500 hover:text-gray-800 cursor-pointer">
                  <FontAwesomeIcon
                    icon={selectedItems.size === currentImages.length && currentImages.length > 0 ? faCheckSquare : faSquare}
                    className="w-4 h-4"
                  />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">썸네일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목 (UUID)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentImages.map((image) => (
              <tr key={image.id} onClick={() => handleEditClick(image.id)} className={`cursor-pointer hover:bg-indigo-50/20 ${selectedItems.has(image.id) ? 'bg-indigo-50' : ''}`}>
                <td className="px-3 py-4 w-10">
                  <button onClick={() => toggleSelectItem(image.id)} className="p-1 text-gray-700 hover:text-indigo-600 cursor-pointer">
                    <FontAwesomeIcon
                      icon={selectedItems.has(image.id) ? faCheckSquare : faSquare}
                      className="w-4 h-4"
                    />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={image.thumb_url}
                      alt={image.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">{image.title}</div>
                  <div className="text-xs text-gray-500 truncate w-48">{image.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* category 필드를 뱃지로 표시 */}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {image.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {image.views.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(image.uploaded_at).toLocaleDateString()} {/* 날짜 포맷팅 */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    className="cursor-pointer text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                    onClick={() => handleEditClick(image.id)}
                    title="개별 수정"
                  >
                    <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                  </button>
                  <button
                    className="cursor-pointer text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                    onClick={() => handleDeleteClick(image.id, image.title)}
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

      {/* 페이지네이션 (images.length 기반으로 자동 계산) */}
      {!loading && images.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            총 {images.length}개의 이미지 중 {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, images.length)}개 표시
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="cursor-pointer p-2 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handleGoToPage(page)}
                className={`cursor-pointer w-9 h-9 text-sm font-medium rounded-lg transition-colors border ${currentPage === page
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="cursor-pointer p-2 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

