/**
 * Staging / 本地整合 E2E
 * 需先啟動：API :8080、Web :3001
 * 執行：npm run test:e2e:staging
 */
import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_BASE_URL || 'http://127.0.0.1:8080/api';
const WEB_BASE = process.env.WEB_BASE_URL || 'http://localhost:3001';

async function isApiUp(request: any): Promise<boolean> {
  try {
    const res = await request.get(`${API_BASE}/search/service-types`, { timeout: 5000 });
    return res.ok();
  } catch {
    return false;
  }
}

async function isWebUp(request: any): Promise<boolean> {
  try {
    const res = await request.get(WEB_BASE, { timeout: 5000 });
    return res.ok();
  } catch {
    return false;
  }
}

test.describe('Staging 整合路徑', () => {
  test.beforeEach(async ({ request }, testInfo) => {
    const apiOk = await isApiUp(request);
    const webOk = await isWebUp(request);
    if (!apiOk || !webOk) {
      testInfo.skip(true, `服務未啟動 (API=${apiOk}, Web=${webOk})，請先 docker compose up`);
    }
  });

  test('API 服務類型可回應', async ({ request }) => {
    const res = await request.get(`${API_BASE}/search/service-types`);
    expect(res.ok()).toBeTruthy();
  });

  test('多幣別換算', async ({ request }) => {
    const res = await request.get(`${API_BASE}/currency/convert?twdAmount=3000&currency=USD`);
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.data?.convertedAmount).toBeGreaterThan(0);
  });

  test('市場訊號記錄（公開）', async ({ request }) => {
    const res = await request.post(`${API_BASE}/market-signals/record`, {
      params: { sourceCountry: 'JP', signalType: 'VISIT', sourceCity: 'Tokyo' },
    });
    expect(res.ok()).toBeTruthy();
  });

  test('Web 首頁', async ({ page }) => {
    await page.goto(WEB_BASE);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Web 六步預約入口', async ({ page }) => {
    await page.goto(`${WEB_BASE}/booking`);
    await expect(page.locator('body')).toContainText(/服務|預約|拍攝/i);
  });

  test('Web 入境旅拍頁', async ({ page }) => {
    await page.goto(`${WEB_BASE}/inbound-travel`);
    await expect(page.locator('body')).toContainText(/旅拍|Travel|WanderLens/i);
  });
});
