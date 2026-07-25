import { test, expect } from '@playwright/test';

// Vercel이 생성한 Preview URL(PLAYWRIGHT_TEST_BASE_URL)을 사용하거나 기본값 사용
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test('메인 페이지 접속 및 검색 기능 테스트', async ({ page }) => {
  // 1. Preview 배포 주소로 접속
  await page.goto(baseURL);

  // 2. 제목이나 주요 요소가 정상 노출되는지 확인
  await expect(page).toHaveTitle(/doodoo/i);

  // 3. 검색어 입력 및 엔터
  const searchInput = page.getByPlaceholder('검색어를 입력하세요');
  await searchInput.fill('마케팅');
  await searchInput.press('Enter');

  // 4. URL 변경 및 결과 확인
  await expect(page).toHaveURL(/.*category=marketing|.*q=마케팅/);
});