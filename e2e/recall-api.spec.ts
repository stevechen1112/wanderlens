/**
 * S3-002 召回 API 測試
 */
import { test, expect } from '@playwright/test';
import { API_BASE, isApiUp, login } from './helpers/match-api';

const CONSUMER_EMPNO = process.env.MATCH_CONSUMER_EMPNO || 'consumer1';
const CONSUMER_PASSWORD = process.env.MATCH_CONSUMER_PASSWORD || '123456';

test.describe('S3-002 召回 API', () => {
  test.beforeEach(async ({ request }, testInfo) => {
    if (!(await isApiUp(request))) {
      testInfo.skip(true, 'API 未啟動');
    }
  });

  test('未登入無法取得召回牆', async ({ request }) => {
    const res = await request.get(`${API_BASE}/recall/feed`);
    expect([401, 403]).toContain(res.status());
  });

  test('登入後可取得召回牆列表', async ({ request }, testInfo) => {
    const consumer = await login(request, CONSUMER_EMPNO, CONSUMER_PASSWORD);
    if (!consumer) {
      testInfo.skip(true, '缺少 consumer 測試帳號');
    }

    const res = await request.get(`${API_BASE}/recall/feed`, {
      headers: { Authorization: `Bearer ${consumer!.token}` },
    });
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.code).toBe('200');
    expect(Array.isArray(json.data)).toBeTruthy();
  });
});
