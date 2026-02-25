import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { StockItem } from '../../../../../types/StockItem';
import { useState } from 'react';
import { uploadBulkImages } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Props {
  items: StockItem[];
  setItems: React.Dispatch<React.SetStateAction<StockItem[]>>;
  category: string;
  onBack: () => void;
}

export default function MetadataEditor({ items, setItems, category, onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 키워드 붙여넣기 핸들러
  const handlePaste = (index: number, e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const tags = text.split(/[\s,]+/).filter(t => t.trim() !== '');

    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, keywords: Array.from(new Set([...item.keywords, ...tags])) } : item
    ));
  };

  const handleAddKeyword = (index: number, value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    // 쉼표나 공백으로 여러 개를 동시에 입력했을 경우 처리
    const newTags = trimmedValue.split(/[\s,]+/).filter(t => t.trim() !== '');

    setItems(prev => prev.map((item, i) =>
      i === index
        ? { ...item, keywords: Array.from(new Set([...item.keywords, ...newTags])) }
        : item
    ));
  };

  // 유효성 검사
  const handleSave = async () => {
    const isAnyEmptyTitle = items.some(item => !item.title.trim());
    if (isAnyEmptyTitle) return alert('모든 이미지의 제목을 입력해주세요.');

    if (!confirm(`${items.length}개의 스톡을 등록하시겠습니까?`)) return;

    setLoading(true);
    try {
      const result = await uploadBulkImages(category, items);

      if (result.success) {
        alert(`${result.count}개의 스톡이 성공적으로 등록되었습니다.`);
        router.push('/admin/Images'); // 목록 페이지로 이동
      }
    } catch (error: any) {
      alert(`등록 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        {/* 제목 영역: 모바일에서는 중앙 정렬 또는 왼쪽 정렬 유지 */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center md:text-left">
          상세 정보 입력 <span className="text-indigo-600">({items.length}건)</span>
        </h2>

        {/* 버튼 그룹: 모바일에서는 꽉 차게, PC에서는 나란히 */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onBack}
            className="flex-1 md:flex-none cursor-pointer px-4 md:px-6 py-3 md:py-2 text-gray-500 font-medium hover:bg-gray-100 rounded-xl transition-colors text-sm md:text-base"
          >
            이전 단계
          </button>

          <button
            onClick={handleSave}
            className="flex-[2] md:flex-none cursor-pointer bg-indigo-600 text-white px-6 md:px-8 py-3 md:py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-all active:scale-95 text-sm md:text-base"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                전송 중...
              </span>
            ) : '최종 등록 완료'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <colgroup>
            <col className="w-32" />    
            <col className="w-1/4" />   
            <col className="w-1/6" />   
            <col className="w-auto" />  
            <col className="w-1/5" />   
          </colgroup>
          <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-600">
            <tr>
              <th className="p-4 text-left">미리보기</th>
              <th className="p-4 text-left">제목</th>
              <th className="p-4 text-left">규격 및 용량</th>
              <th className="p-4 text-left">키워드</th>
              <th className="p-4 text-left">Adobe Express</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, idx) => {
              // 우선순위: _preview 파일이 있다면 사용, 없으면 일반 이미지 소스 중 첫 번째 사용
              const displayUrl = item.previewUrl || item.thumbUrl;

              return (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
                      {displayUrl ? (
                        <img src={displayUrl} className="w-full h-full object-cover" alt="preview" />
                      ) : (
                        <div className="text-center">
                          <span className="text-[10px] text-gray-400 block">No Image</span>
                        </div>
                      )}
                      {/* 이미지 위에 어떤 종류인지 라벨 표시 (선택 사항) */}
                      {item.previewUrl && (
                        <span className="absolute bottom-0 right-0 bg-indigo-600 text-white text-[8px] px-1">PREVIEW</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 mb-1">
                      <StatusBadge label="PREVIEW" exists={!!item.previewUrl} color="bg-blue-500" />
                      <StatusBadge label="THUM" exists={!!item.thumbUrl} color="bg-emerald-500" />
                      <StatusBadge label="SOURCE" exists={item.sourceFiles.length > 0} color="bg-amber-500" />
                    </div>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => setItems(prev => prev.map((it, i) => i === idx ? { ...it, title: e.target.value } : it))}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.sourceFiles.map((f, fi) => (
                        <span key={fi} className="px-2 py-0.5 bg-gray-200 rounded text-[10px] font-bold uppercase">
                          {f.extension}
                        </span>
                      ))}
                    </div>
                  </td>
                  {/* 키워드 영역 */}
                  <td className="p-4">
                    <div className="text-xs space-y-2">
                      {item.sourceFiles.map((file, fi) => (
                        <div key={fi} className="border-b pb-1 last:border-0">
                          <span className="font-bold text-indigo-600 uppercase">{file.extension}:</span> {file.fileSizeMb}MB
                          {file.width && ` (${file.width}x${file.height})`}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <label className="block border border-gray-200 rounded-lg p-2 bg-white min-h-[100px] cursor-text focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                      {/* 태그(키워드) 목록 */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.keywords.map((tag, ti) => (
                          <span
                            key={ti}
                            className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs border border-indigo-100 flex items-center font-medium"
                            // 태그 자체를 클릭했을 때 input으로 포커스가 튀지 않게 하려면 클릭 이벤트 전파 방지 가능 (선택 사항)
                            onClick={(e) => e.stopPropagation()}
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault(); // label 클릭 이벤트 방지
                                e.stopPropagation(); // 버블링 방지
                                setItems(prev => prev.map((it, i) =>
                                  i === idx ? { ...it, keywords: it.keywords.filter((_, tIdx) => tIdx !== ti) } : it
                                ));
                              }}
                              className="ml-1 text-[10px] hover:text-red-500 transition-colors"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* 실제 입력창 */}
                      <input
                        className="w-full outline-none text-sm p-1 bg-transparent"
                        placeholder={item.keywords.length === 0 ? "키워드 입력 후 엔터..." : ""}
                        onPaste={(e) => handlePaste(idx, e)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault(); // 기본 동작 막기
                            const target = e.target as HTMLInputElement;
                            handleAddKeyword(idx, target.value); // 키워드 추가
                            target.value = ''; // 입력창 비우기
                          }
                        }}
                      />
                    </label>
                  </td>
                  <td className="p-4">
                    {/* 어도비 익스프레스 주소 (선택 사항) */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="어도비 익스프레스 주소 (선택)"
                        // item.adobeUrl이 없을 경우를 대비해 빈 문자열 처리
                        value={item.adobeUrl || ''}
                        onChange={(e) => {
                          const newUrl = e.target.value;
                          setItems(prev => prev.map((it, i) =>
                            i === idx ? { ...it, adobeUrl: newUrl } : it
                          ));
                        }}
                        className="w-full p-1 text-xs border-b border-gray-200 focus:border-indigo-400 outline-none bg-transparent"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 상태 표시를 위한 소형 컴포넌트
function StatusBadge({ label, exists, color }: { label: string; exists: boolean; color: string }) {
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm transition-all ${exists
      ? `${color} text-white`
      : 'bg-gray-100 text-gray-300 border border-gray-200'
      }`}>
      {exists ? '● ' : '○ '}{label}
    </span>
  );
}