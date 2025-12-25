import { Metadata } from 'next';
import BulkUploadClient from './BulkUploadClient';

// ✅ 여기서 Head Title을 설정합니다.
export const metadata: Metadata = {
  title: '대량 업로드 - doodoo admin',
  description: '스톡 이미지 대량 업로드 및 관리 페이지',
};

export default function Page() {
  return <BulkUploadClient />;
}