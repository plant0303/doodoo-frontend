import { Metadata } from 'next';
import Images from './ImagesClient';

export const metadata: Metadata = {
  title: '이미지 관리 - doodoo admin',
  description: 'doodoo admin page - dashboard',
};

export default function Page() {
  // 2. 서버 컴포넌트에서 클라이언트 컴포넌트를 렌더링
  return <Images />;
}