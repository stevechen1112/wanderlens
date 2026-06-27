import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8080/api';

test.describe('Conversation API', () => {
  test('未登入無法取得對話列表', async ({ request }) => {
    const res = await request.get(`${API_BASE}/conversations`);
    expect([401, 403]).toContain(res.status());
  });

  test('客服通道端點需登入', async ({ request }) => {
    const res = await request.post(`${API_BASE}/conversations/customer-service`, {
      data: { content: 'test' },
    });
    expect([401, 403]).toContain(res.status());
  });
});
