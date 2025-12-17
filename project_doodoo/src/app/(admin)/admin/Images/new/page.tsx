'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTimes, faSave, faArrowLeft, faImage, faPlus, faFileArchive } from '@fortawesome/free-solid-svg-icons';

export default function NewImagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Business');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');

  const [originalFiles, setOriginalFiles] = useState<File[]>([]);
  const [thumbFile, setThumbFile] = useState<File | null>(null);   // 썸네일 (작은 이미지)
  const [previewFile, setPreviewFile] = useState<File | null>(null); // 프리뷰 (큰 이미지)

  // 미리보기 URL (브라우저 메모리)
  const [thumbPreview, setThumbPreview] = useState<string>('');
  const [previewPreview, setPreviewPreview] = useState<string>('');

  // 1. 키워드 로직: 엔터 및 붙여넣기 처리
  const processKeywords = (text: string) => {
    // 공백, 쉼표, 줄바꿈으로 분리 후 빈 값 제거
    const newTags = text.split(/[\s,]+/).filter(tag => tag.trim() !== '' && !keywords.includes(tag));
    if (newTags.length > 0) {
      setKeywords(prev => [...prev, ...newTags]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processKeywords(keywordInput);
      setKeywordInput('');
    }
  };

  // 키워드 태그 추가
  const addKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      if (!keywords.includes(keywordInput.trim())) {
        setKeywords([...keywords, keywordInput.trim()]);
      }
      setKeywordInput('');
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    processKeywords(pasteData);
  };

  // 2. 파일 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumb' | 'preview' | 'original') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === 'thumb') {
      const file = files[0];
      setThumbFile(file);
      setThumbPreview(URL.createObjectURL(file));
    } else if (type === 'preview') {
      const file = files[0];
      setPreviewFile(file);
      setPreviewPreview(URL.createObjectURL(file));
    } else if (type === 'original') {
      setOriginalFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeOriginal = (index: number) => {
    setOriginalFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 3. 제출 로직
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbFile || !previewFile || originalFiles.length === 0) {
      return alert('썸네일, 프리뷰, 그리고 최소 하나 이상의 원본 파일이 필요합니다.');
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('keywords', JSON.stringify(keywords));

    // 파일들 추가
    formData.append('thumb', thumbFile);
    formData.append('preview', previewFile);
    originalFiles.forEach((file, index) => {
      formData.append(`originals`, file); // 다중 파일 전송
    });

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        alert('등록에 성공했습니다!');
        router.push('/admin/images');
      }
    } catch (err) {
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 썸네일 미리보기 처리
  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="mx-auto p-8">
      <button onClick={() => router.back()} className="mb-6 text-gray-600 hover:text-indigo-600 flex items-center">
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2 cursor-pointer" /> 뒤로가기
      </button>

      <h1 className="text-3xl font-bold mb-8 text-gray-800">새 이미지 등록</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 왼쪽 섹션: 메타데이터 */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">이미지 제목</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 푸른 하늘 아래 산맥"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">카테고리</label>
            <select
              className="w-full px-4 py-2 border rounded-lg appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>photo</option>
              <option>Illustration</option>
              <option>Template</option>
              <option>Icon</option>
              <option>Sticker</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">키워드 (Enter로 추가)</label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[100px] bg-white">
              {keywords.map((tag) => (
                <span key={tag} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center">
                  {tag}
                  <button type="button" onClick={() => setKeywords(keywords.filter(k => k !== tag))} className="ml-2">
                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="flex-1 outline-none min-w-[120px]"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={addKeyword}
              />
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션: 파일 업로드 */}
        <div className="space-y-6">
          {/* 원본 파일 업로드 */}
          <section className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">썸네일 (Small)</label>
              <div
                className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden group hover:border-indigo-500 transition-colors cursor-pointer"
                onClick={() => document.getElementById('thumb-input')?.click()}
              >
                {thumbPreview ? (
                  <img src={thumbPreview} className="w-full h-full object-cover" alt="Thumb" />
                ) : (
                  <FontAwesomeIcon icon={faImage} className="text-3xl text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs font-bold">이미지 변경</span>
                </div>
              </div>
              <input type="file" id="thumb-input" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'thumb')} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">프리뷰 (Large)</label>
              <div
                className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden group hover:border-indigo-500 transition-colors cursor-pointer"
                onClick={() => document.getElementById('preview-input')?.click()}
              >
                {previewPreview ? (
                  <img src={previewPreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <FontAwesomeIcon icon={faImage} className="text-3xl text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs font-bold">이미지 변경</span>
                </div>
              </div>
              <input type="file" id="preview-input" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'preview')} />
            </div>
          </section>

          {/* 썸네일 업로드 및 미리보기 */}
          <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">원본 파일 업로드 (다중 선택 가능)</h2>
              <label className="bg-white border border-gray-300 px-3 py-1 rounded shadow-sm text-sm cursor-pointer hover:bg-gray-50 transition-colors">
                <FontAwesomeIcon icon={faPlus} className="mr-1" /> 파일 추가
                <input type="file" hidden multiple onChange={(e) => handleFileChange(e, 'original')} />
              </label>
            </div>

            {originalFiles.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400">
                <FontAwesomeIcon icon={faCloudUploadAlt} className="text-4xl mb-2" />
                <p>업로드된 원본 파일이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {originalFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faFileArchive} className="text-indigo-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeOriginal(idx)}
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="md:col-span-2 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors shadow-lg"
          >
            {loading ? '업로드 중...' : <><FontAwesomeIcon icon={faSave} className="mr-2" /> 이미지 등록하기</>}
          </button>
        </div>
      </form>
    </div>
  );
}