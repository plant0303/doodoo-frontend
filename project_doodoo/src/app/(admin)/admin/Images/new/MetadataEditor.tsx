import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { StockItem } from '../../../../../types/StockIte';
import { useState } from 'react';

interface Props {
  items: StockItem[];
  setItems: React.Dispatch<React.SetStateAction<StockItem[]>>;
  category: string;
  onBack: () => void;
}

export default function MetadataEditor({ items, setItems, category, onBack }: Props) {
  const [loading, setLoading] = useState(false);

  // 키워드 붙여넣기 핸들러
  const handlePaste = (index: number, e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const tags = text.split(/[\s,]+/).filter(t => t.trim() !== '');
    
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, keywords: Array.from(new Set([...item.keywords, ...tags])) } : item
    ));
  };

  const handleSave = async () => {
    setLoading(true);
    // TODO: 백엔드 Worker API 호출 로직 (R2 전송 + DB 저장)
    console.log("저장 데이터:", items, "카테고리:", category);
    setTimeout(() => {
      setLoading(false);
      alert("성공적으로 등록되었습니다.");
    }, 2000);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">상세 정보 입력 ({items.length}건)</h2>
        <div className="space-x-4">
          <button onClick={onBack} className="px-6 py-2 text-gray-500 font-medium">이전 단계</button>
          <button 
            onClick={handleSave} 
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? '처리 중...' : '최종 등록 완료'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 w-32">미리보기</th>
              <th className="p-4 w-1/4">제목</th>
              <th className="p-4 w-1/3">키워드 (복사/붙여넣기 가능)</th>
              <th className="p-4">규격 및 용량</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50">
                <td className="p-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border">
                    <img src={item.previewUrl} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4">
                  <input 
                    type="text" 
                    value={item.title} 
                    onChange={(e) => setItems(prev => prev.map((it, i) => i === idx ? {...it, title: e.target.value} : it))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </td>
                <td className="p-4">
                  <div className="border rounded-lg p-2 bg-white min-h-[100px]">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.keywords.map((tag, ti) => (
                        <span key={ti} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs border border-indigo-100 flex items-center">
                          {tag}
                          <button 
                            onClick={() => setItems(prev => prev.map((it, i) => i === idx ? {...it, keywords: it.keywords.filter((_, tIdx) => tIdx !== ti)} : it))}
                            className="ml-1 text-[10px]"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input 
                      className="w-full outline-none text-sm p-1" 
                      placeholder="키워드 붙여넣기..."
                      onPaste={(e) => handlePaste(idx, e)}
                    />
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600 space-y-1">
                  <p><b>해상도:</b> {item.width} x {item.height} px</p>
                  <p><b>용량:</b> {item.fileSizeMb} MB</p>
                  <div className="flex items-center">
                    <span className="mr-2 font-bold text-gray-700">DPI:</span>
                    <input 
                      type="number" 
                      value={item.dpi}
                      onChange={(e) => setItems(prev => prev.map((it, i) => i === idx ? {...it, dpi: parseInt(e.target.value)} : it))}
                      className="w-16 border rounded p-1"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}