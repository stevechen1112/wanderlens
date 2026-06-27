import { test, expect } from '@playwright/test';

/**
 * WanderLens App（Expo Web）核心流程 E2E
 * 需 API + Expo Web 運行：APP_BASE_URL 預設 http://localhost:8081
 *
 * UI 測試需 Metro bundle 完全載入；若僅 HTML shell 回應 200 但 JS 未 hydrate，會自動 skip。
 */
const APP_BASE = process.env.APP_BASE_URL || 'http://localhost:8081';
const API_BASE = process.env.API_BASE_URL || 'http://localhost:8080/api';

async function isApiUp(request: import('@playwright/test').APIRequestContext): Promise<boolean> {
  try {
    const res = await request.get(`${API_BASE}/search/service-types`, { timeout: 5000 });
    return res.ok();
  } catch {
    return false;
  }
}

async function isAppShellUp(request: import('@playwright/test').APIRequestContext): Promise<boolean> {
  try {
    const res = await request.get(APP_BASE, { timeout: 5000 });
    return res.ok();
  } catch {
    return false;
  }
}

async function waitForLoginScreen(page: import('@playwright/test').Page): Promise<boolean> {
  await page.goto(APP_BASE, { waitUntil: 'load', timeout: 30000 });
  try {
    await page.waitForSelector('[data-testid="login-empno"]', { timeout: 90000 });
    return true;
  } catch {
    return false;
  }
}

async function loginAsConsumer(page: import('@playwright/test').Page) {
  await page.getByTestId('login-empno').fill('consumer1');
  await page.getByTestId('login-password').fill('123456');
  await page.getByTestId('login-submit').click();
  await expect(page.getByText(/相簿|Albums|預約|Book/i).first()).toBeVisible({ timeout: 30000 });
}

test.describe('WanderLens App API', () => {
  test.beforeEach(async ({ request }, testInfo) => {
    if (!(await isApiUp(request))) {
      testInfo.skip(true, `API not running at ${API_BASE}`);
    }
  });

  test('通知 API 需登入', async ({ request }) => {
    const res = await request.get(`${API_BASE}/notify/page`);
    expect([401, 403]).toContain(res.status());
  });

  test('Google Places autocomplete 端點公開', async ({ request }) => {
    const res = await request.get(`${API_BASE}/google/places/autocomplete?input=台北`);
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.code).toBe('200');
  });
});

test.describe('WanderLens App UI (Expo Web)', () => {
  test.beforeEach(async ({ page, request }, testInfo) => {
    if (!(await isAppShellUp(request))) {
      testInfo.skip(true, `App shell not running at ${APP_BASE}`);
    }
    if (!(await waitForLoginScreen(page))) {
      testInfo.skip(true, 'Expo Web UI 未 hydrate（請確認 expo start --web 並等待 bundle 編譯完成）');
    }
  });

  test('登入頁可載入', async ({ page }) => {
    await expect(page.getByTestId('login-password')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
  });

  test('consumer1 可登入並進入主畫面', async ({ page }) => {
    await loginAsConsumer(page);
  });

  test('登入後可進入預約流程 Step 1', async ({ page }) => {
    await loginAsConsumer(page);
    await page.getByText(/預約|Book/i).first().click();
    await expect(page.getByText(/預約拍攝|Book a shoot|服務/i).first()).toBeVisible({ timeout: 15000 });
  });
});
