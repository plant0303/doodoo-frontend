import { faCloudUploadAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StockItem } from '../../../../../types/StockIte';

export default function FileUploader({ onUpload, onBack }: { onUpload: (items: StockItem[]) => void; onBack: () => void }) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const items = await Promise.all(
      files.map(async (file) => {
        const previewUrl = URL.createObjectURL(file);
        const dimensions = await new Promise<{ w: number; h: number }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ w: img.width, h: img.height });
          img.src = previewUrl;
        });

        return {
          file,
          previewUrl,
          title: file.name.split('.')[0],
          keywords: [],
          width: dimensions.w,
          height: dimensions.h,
          dpi: 300,
          fileSizeMb: (file.size / (1024 * 1024)).toFixed(2),
        };
      })
    );
    onUpload(items);
  };

  return (
    <div className="mx-auto animate-fadeIn">
      <button onClick={onBack} className="mb-6 text-gray-500 hover:text-indigo-600">
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> 카테고리 다시 선택
      </button>
      <div className="border-4 border-dashed border-gray-200 rounded-3xl p-20 text-center bg-gray-50">
        <input type="file" id="files" multiple hidden onChange={handleFileChange} accept="image/*" />
        <label htmlFor="files" className="cursor-pointer block">
          <FontAwesomeIcon icon={faCloudUploadAlt} className="text-7xl text-indigo-200 mb-6" />
          <h2 className="text-2xl font-bold mb-2">스톡 이미지들을 여기에 드래그하거나 클릭하세요</h2>
          <p className="text-gray-500 mb-8">한 번에 여러 장의 이미지를 선택할 수 있습니다.</p>
          <div className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold inline-block">파일 선택하기</div>
        </label>
      </div>
    </div>
  );
}