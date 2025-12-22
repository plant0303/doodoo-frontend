import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faPenNib, faImage, faIcons, faStickyNote } from '@fortawesome/free-solid-svg-icons';

const CATEGORIES = [
  { id: 'Photo', name: 'Photo', icon: faCamera, color: 'bg-blue-500' },
  { id: 'illustration', name: 'Illustration', icon: faPenNib, color: 'bg-purple-500' },
  { id: 'template', name: 'Template', icon: faImage, color: 'bg-green-500' },
  { id: 'icon', name: 'Icon', icon: faIcons, color: 'bg-yellow-500' },
  { id: 'sticker', name: 'Sticker', icon: faStickyNote, color: 'bg-pink-500' },
];

export default function CategorySelector({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">등록할 스톡의 카테고리를 선택하세요</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols- gap-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="cursor-pointer  p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all flex flex-col items-center space-y-4 group"
          >
            <div className={`${cat.color} w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform`}>
              <FontAwesomeIcon icon={cat.icon} />
            </div>
            <span className="text-lg font-bold text-gray-700">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}