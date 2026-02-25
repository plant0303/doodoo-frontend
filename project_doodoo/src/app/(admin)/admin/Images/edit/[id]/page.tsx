'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt, faArrowLeft, faCloudUploadAlt, faTimes, faSpinner, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { getStockDetail, updateStockMetadata, deleteStockFile, addStockFile } from '@/lib/api';
import { useParams } from 'next/navigation';

interface Props {
  stockId: string;
}

export default function StockEditPage() {
  const params = useParams();
  const stockId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stock, setStock] = useState<any>(null);

  // 수정할 상태값들
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [adobeUrl, setAdobeUrl] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const router = useRouter();

  // 1. 데이터 로드 함수
  const fetchStockData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getStockDetail(stockId);
      setStock(data);
      setTitle(data.title);
      setKeywords(data.keywords || []);
      setFiles(data.stock_files || []);
      setAdobeUrl(data.adobe_url || '');
    } catch (error) {
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [stockId]);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  // 키워드 핸들러
  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      if (!keywords.includes(keywordInput.trim())) {
        setKeywords([...keywords, keywordInput.trim()]);
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (tagToRemove: string) => {
    setKeywords(keywords.filter(tag => tag !== tagToRemove));
  };

  // 메타데이터 수정 (제목, 키워드, 링크)
  const handleSaveMetadata = async () => {
    try {
      setSaving(true);
      await updateStockMetadata(stockId, title, keywords, adobeUrl);
      alert('정보가 성공적으로 수정되었습니다.');
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 파일 삭제 핸들러
  const handleDeleteFile = async (stock_id: string, r2Path: string, file_type_id: string) => {
    if (!confirm('정말로 이 원본 파일을 삭제하시겠습니까? R2에서도 삭제됩니다.')) return;

    try {
      await deleteStockFile(stockId, stock_id, r2Path, file_type_id);
      setFiles(files.filter(f => f.id !== stock_id)); // 로컬 상태 업데이트
      alert('파일이 삭제되었습니다.');
    } catch (error) {
      alert('파일 삭제 실패');
    }
  };

  // 새 파일 추가 핸들러
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('extension', extension || '');
    formData.append('category', stock.category);
    formData.append('title', title);

    try {
      setSaving(true);
      await addStockFile(stockId, formData);
      await fetchStockData(); // 전체 다시 불러와서 목록 갱신
      alert('새 파일이 추가되었습니다.');
    } catch (error) {
      alert('파일 업로드 실패');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-indigo-500" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen animate-fadeIn">
      {/* 상단 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="cursor-pointer p-2 hover:bg-white rounded-full transition-all text-gray-400 hover:text-indigo-600 shadow-sm">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">스톡 상세 수정</h1>
        </div>
        <button
          onClick={handleSaveMetadata}
          disabled={saving}
          className="cursor-pointer flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all disabled:bg-gray-400"
        >
          <FontAwesomeIcon icon={saving ? faSpinner : faSave} spin={saving} />
          {saving ? '저장 중...' : '변경사항 저장'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 text-gray-800 border-l-4 border-indigo-500 pl-3">기본 정보</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5 ml-1">스톡 제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-gray-900 bg-gray-50/50"
                  placeholder="제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5 ml-1">키워드</label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50/50 border border-gray-200 rounded-xl min-h-[120px] focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                  {keywords.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 bg-white border border-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm">
                      {tag}
                      <button
                        onClick={() => removeKeyword(tag)}
                        className="hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleAddKeyword}
                    className="flex-1 bg-transparent outline-none text-sm font-medium min-w-[120px]"
                    placeholder="키워드 입력 후 Enter..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5 ml-1 flex items-center gap-2">
                  Adobe Express URL
                  <span className="text-[10px] bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full uppercase">Optional</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={adobeUrl}
                    onChange={(e) => setAdobeUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-gray-900 bg-gray-50/50"
                    placeholder="adobe express link"
                  />
                  {adobeUrl && (
                    <a
                      href={adobeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                      title="링크 바로가기"
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 미리보기 이미지 (참고용) */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 text-gray-800 border-l-4 border-indigo-500 pl-3">미리보기 (Read Only)</h2>
            <div className="aspect-video rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
              <img src={stock?.preview_url} className="w-full h-full object-contain" alt="Preview" />
            </div>
          </section>
        </div>

        {/* 오른쪽 섹션: 원본 파일 관리 */}
        <div className="space-y-6">
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h2 className="text-lg font-bold text-gray-800 mb-6">소스 파일 ({files.length})</h2>

            <div className="space-y-3">
              {files.map((file, idx) => (
                <div key={idx} className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm font-bold text-xs text-indigo-500 uppercase">
                      {file.extension?.extension || file.extension}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700 uppercase">{file.extension?.extension || file.extension} 원본</p>
                      <p className="text-xs text-gray-400">{file.file_size_mb}MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFile(file.stock_id, file.r2_path, file.file_type_id)}
                    className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              ))}

              {/* 파일 추가 버튼 영역 */}
              <label className="mt-6 border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50/30 hover:bg-gray-50 hover:border-indigo-300 transition-all cursor-pointer group">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".ai,.psd,.jpg,.jpeg,.png,.eps"
                />
                <FontAwesomeIcon icon={faCloudUploadAlt} className="text-3xl text-gray-300 group-hover:text-indigo-400 mb-2 transition-colors" />
                <p className="text-sm font-semibold text-gray-400 group-hover:text-indigo-500">새 소스 파일 추가</p>
                <p className="text-[10px] text-gray-300 mt-1 uppercase font-bold tracking-widest text-center">AI / PSD / JPG / PNG</p>
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}