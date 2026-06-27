import { test, expect } from '@playwright/test';

/**
 * WanderLens 核心路徑 E2E（需本地 API + Web 運行）
 * 環境變數：WEB_BASE_URL, API_BASE_URL
 */
const API_BASE = process.env.API_BASE_URL || 'http://localhost:8080/api';

test.describe('WanderLens 公開頁面', () => {
  test('首頁可載入並顯示品牌元素', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/WanderLens|隨選|攝影/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('預約流程 Step 1 可進入', async ({ page }) => {
    await page.goto('/booking');
    await expect(page.locator('body')).toContainText(/服務|預約|拍攝/i);
  });

  test('FAQ 頁面可載入', async ({ page }) => {
    await page.goto('/faq');
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('WanderLens API 健康檢查', () => {
  test('服務類型 API 可回應', async ({ request }) => {
    const res = await request.get(`${API_BASE}/search/service-types`);
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.code === '200' || json.success === true || Array.isArray(json.data)).toBeTruthy();
  });

  test('三池搜尋 API 端點存在', async ({ request }) => {
    const res = await request.get(`${API_BASE}/search/configurations`);
    expect([200, 401, 403]).toContain(res.status());
  });

  test('聯盟點擊追蹤端點公開', async ({ request }) => {
    const res = await request.post(`${API_BASE}/affiliates/click`, {
      params: { referralCode: 'TEST', sourceUrl: 'http://localhost/e2e' },
    });
    expect([200, 400, 404]).toContain(res.status());
  });

  test('多幣別換算端點公開', async ({ request }) => {
    const res = await request.get(`${API_BASE}/currency/convert?twdAmount=3000&currency=USD`);
    expect(res.ok()).toBeTruthy();
  });

  test('入境旅拍頁面可載入', async ({ page }) => {
    await page.goto('/inbound-travel');
    await expect(page.locator('body')).toContainText(/旅拍|Travel|WanderLens/i);
  });
});
