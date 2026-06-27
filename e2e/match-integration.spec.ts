/**
 * S2-014 即時媒合整合測試
 *
 * 需 API + Redis + MySQL 運行，並設定測試帳號環境變數：
 * - MATCH_CONSUMER_EMPNO / MATCH_CONSUMER_PASSWORD
 * - MATCH_PROVIDER_EMPNO / MATCH_PROVIDER_PASSWORD
 * - MATCH_ADMIN_EMPNO / MATCH_ADMIN_PASSWORD（或 MATCH_ADMIN_TOKEN）
 *
 * 執行：npm run test:e2e:match
 */
import { test, expect } from '@playwright/test';
import {
  API_BASE,
  authHeaders,
  createMatchRequest,
  enableMatchFeature,
  expectApiSuccess,
  isApiUp,
  login,
  wsMatchUrl,
} from './helpers/match-api';

const CONSUMER_EMPNO = process.env.MATCH_CONSUMER_EMPNO || 'consumer1';
const CONSUMER_PASSWORD = process.env.MATCH_CONSUMER_PASSWORD || '123456';
const PROVIDER_EMPNO = process.env.MATCH_PROVIDER_EMPNO || 'photographer1';
const PROVIDER_PASSWORD = process.env.MATCH_PROVIDER_PASSWORD || '123456';
const ADMIN_EMPNO = process.env.MATCH_ADMIN_EMPNO || 'admin';
const ADMIN_PASSWORD = process.env.MATCH_ADMIN_PASSWORD || '123456';

test.describe('S2-014 即時媒合 API 整合', () => {
  test.beforeAll(() => {
    try {
      const { execSync } = require('child_process');
      const keys = execSync(
        'docker exec wanderlens-redis redis-cli -a wanderlens_redis_2026 --scan --pattern lock:availability:*',
        { encoding: 'utf8' },
      ).trim();
      if (keys) {
        keys.split('\n').filter(Boolean).forEach((key: string) => {
          execSync(`docker exec wanderlens-redis redis-cli -a wanderlens_redis_2026 DEL ${key}`);
        });
      }
      execSync(
        'docker exec wanderlens-mysql mysql -uwanderlens -pwanderlens_dev_2026 wanderlens_db -e "UPDATE availability SET locked_by_order_id = NULL WHERE locked_by_order_id IS NOT NULL;"',
        { stdio: 'ignore' },
      );
    } catch {
      // 本地未啟動 Docker 時略過
    }
  });

  test.beforeEach(async ({ request }, testInfo) => {
    if (!(await isApiUp(request))) {
      testInfo.skip(true, 'API 未啟動，請先啟動 wanderlens-api + Redis + MySQL');
    }
  });

  test('公開狀態端點可回應', async ({ request }) => {
    const res = await request.get(`${API_BASE}/match/public/status`);
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.code).toBe('200');
    expect(json.data).toHaveProperty('instantMatchEnabled');
  });

  test('未登入無法建立媒合需求', async ({ request }) => {
    const res = await request.post(`${API_BASE}/match/request`, {
      data: {
        serviceTypeId: 1,
        shootingLocation: '台北市大稻埕',
        city: '台北市',
        durationHours: 1,
      },
    });
    expect([401, 403]).toContain(res.status());
  });

  test('完整媒合流程：建立 → 接受 → 媒合成功', async ({ request }, testInfo) => {
    const consumer = await login(request, CONSUMER_EMPNO, CONSUMER_PASSWORD);
    const provider = await login(request, PROVIDER_EMPNO, PROVIDER_PASSWORD);
    const admin = process.env.MATCH_ADMIN_TOKEN
      ? { token: process.env.MATCH_ADMIN_TOKEN, userId: 0, role: 'ADMIN' }
      : await login(request, ADMIN_EMPNO, ADMIN_PASSWORD);

    if (!consumer || !provider) {
      testInfo.skip(true, '缺少 consumer/provider 測試帳號，請設定 MATCH_* 環境變數');
    }

    if (admin?.token) {
      await enableMatchFeature(request, admin.token);
    }

    await request.post(`${API_BASE}/match/online`, {
      headers: authHeaders(provider!.token),
      data: { city: '台北市', lat: 25.033, lng: 121.565 },
    });

    const createRes = await request.post(`${API_BASE}/match/request`, {
      headers: authHeaders(consumer!.token),
      data: {
        serviceTypeId: 1,
        shootingLocation: '台北市大稻埕',
        city: '台北市',
        shootingLat: 25.058,
        shootingLng: 121.51,
        durationHours: 1,
        startOffsetMinutes: 30,
        customerName: 'E2E 測試',
      },
    });

    if (!createRes.ok()) {
      const err = await createRes.json().catch(() => ({}));
      testInfo.skip(true, `無法建立媒合需求: ${err.message || createRes.status()}`);
    }

    const created = await createRes.json();
    const requestId = created.data?.id;
    expect(requestId).toBeTruthy();
    expect(created.data.status).toBe('SEARCHING');

    const acceptRes = await request.post(`${API_BASE}/match/request/${requestId}/accept`, {
      headers: authHeaders(provider!.token),
    });

    const accepted = await acceptRes.json();
    if (accepted.code === '400') {
      const msg = String(accepted.message || '');
      if (msg.includes('時段不可用')) {
        testInfo.skip(true, '攝影師無可用時段，請先設定 schedule 後重試');
      }
      if (msg.includes('攝影師不可接單')) {
        testInfo.skip(true, '攝影師 provider 未 go_live，請確認 seed 資料');
      }
    }

    expect(accepted.code).toBe('200');
    expect(accepted.data.status).toBe('MATCH_FOUND');
    expect(accepted.data.orderId).toBeTruthy();

    const getRes = await request.get(`${API_BASE}/match/request/${requestId}`, {
      headers: authHeaders(consumer!.token),
    });
    expect(getRes.ok()).toBeTruthy();
    const detail = await getRes.json();
    expect(detail.data.status).toBe('MATCH_FOUND');

    await request.post(`${API_BASE}/match/offline`, {
      headers: authHeaders(provider!.token),
    });
  });

  test('消費者可取消搜尋中的需求', async ({ request }, testInfo) => {
    const consumer = await login(request, CONSUMER_EMPNO, CONSUMER_PASSWORD);
    if (!consumer) {
      testInfo.skip(true, '缺少 consumer 測試帳號');
    }

    const admin = process.env.MATCH_ADMIN_TOKEN
      ? { token: process.env.MATCH_ADMIN_TOKEN }
      : await login(request, ADMIN_EMPNO, ADMIN_PASSWORD);
    if (admin?.token) {
      await enableMatchFeature(request, admin.token);
    }

    const createRes = await request.post(`${API_BASE}/match/request`, {
      headers: authHeaders(consumer!.token),
      data: {
        serviceTypeId: 1,
        shootingLocation: '台北市信義區',
        city: '台北市',
        durationHours: 0.5,
      },
    });

    if (!createRes.ok()) {
      testInfo.skip(true, '無法建立媒合需求（可能功能開關未開）');
    }

    const requestId = (await createRes.json()).data.id;
    const cancelRes = await request.delete(`${API_BASE}/match/request/${requestId}`, {
      headers: authHeaders(consumer!.token),
    });
    expect(cancelRes.ok()).toBeTruthy();

    const after = await request.get(`${API_BASE}/match/request/${requestId}`, {
      headers: authHeaders(consumer!.token),
    });
    const status = (await after.json()).data.status;
    expect(['CANCELLED', 'EXPIRED']).toContain(status);
  });

  test('管理員可讀取媒合分析指標', async ({ request }, testInfo) => {
    const admin = process.env.MATCH_ADMIN_TOKEN
      ? { token: process.env.MATCH_ADMIN_TOKEN }
      : await login(request, ADMIN_EMPNO, ADMIN_PASSWORD);

    if (!admin?.token) {
      testInfo.skip(true, '需要 admin 帳號');
    }

    const res = await request.get(`${API_BASE}/admin/match/analytics`, {
      headers: authHeaders(admin!.token),
    });
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.data).toHaveProperty('requestsCreated30d');
    expect(json.data).toHaveProperty('matchRate');
  });

  test('功能關閉時拒絕建立需求', async ({ request }, testInfo) => {
    const consumer = await login(request, CONSUMER_EMPNO, CONSUMER_PASSWORD);
    const admin = process.env.MATCH_ADMIN_TOKEN
      ? { token: process.env.MATCH_ADMIN_TOKEN }
      : await login(request, ADMIN_EMPNO, ADMIN_PASSWORD);

    if (!consumer || !admin?.token) {
      testInfo.skip(true, '需要 consumer + admin 帳號');
    }

    await request.put(`${API_BASE}/admin/match/feature-flags`, {
      headers: authHeaders(admin!.token),
      data: {
        instantMatchEnabled: false,
        travelInstantEnabled: false,
        streetInstantEnabled: false,
      },
    });

    const res = await request.post(`${API_BASE}/match/request`, {
      headers: authHeaders(consumer!.token),
      data: {
        serviceTypeId: 1,
        shootingLocation: '測試',
        city: '台北市',
        durationHours: 1,
      },
    });
    const json = await res.json();
    expect(json.code).not.toBe('200');

    await enableMatchFeature(request, admin!.token);
  });

  test('消費者 SSE 可訂閱媒合狀態', async ({ request }, testInfo) => {
    const consumer = await login(request, CONSUMER_EMPNO, CONSUMER_PASSWORD);
    const admin = process.env.MATCH_ADMIN_TOKEN
      ? { token: process.env.MATCH_ADMIN_TOKEN }
      : await login(request, ADMIN_EMPNO, ADMIN_PASSWORD);

    if (!consumer) {
      testInfo.skip(true, '缺少 consumer 測試帳號');
    }
    if (admin?.token) {
      await enableMatchFeature(request, admin.token);
    }

    const created = await createMatchRequest(request, consumer!.token);
    if (!created?.id) {
      testInfo.skip(true, '無法建立媒合需求');
    }

    const sseUrl = `${API_BASE}/match/request/${created.id}/stream`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    let streamRes: Response | null = null;
    try {
      streamRes = await fetch(sseUrl, {
        headers: authHeaders(consumer!.token),
        signal: controller.signal,
      });
    } catch (e: unknown) {
      if (!(e instanceof Error) || e.name !== 'AbortError') {
        throw e;
      }
    } finally {
      clearTimeout(timer);
    }

    expect(streamRes).toBeTruthy();
    expect(streamRes!.status).toBe(200);
    expect(streamRes!.headers.get('content-type') || '').toContain('text/event-stream');

    await request.delete(`${API_BASE}/match/request/${created.id}`, {
      headers: authHeaders(consumer!.token),
    });
  });

  test('攝影師 WebSocket 可連線', async ({ request }, testInfo) => {
    const provider = await login(request, PROVIDER_EMPNO, PROVIDER_PASSWORD);
    if (!provider) {
      testInfo.skip(true, '缺少 provider 測試帳號');
    }

    const wsUrl = wsMatchUrl(provider!.token);
    const connected = await new Promise<boolean>((resolve) => {
      const ws = new WebSocket(wsUrl);
      ws.onopen = () => {
        ws.close();
        resolve(true);
      };
      ws.onerror = () => resolve(false);
      setTimeout(() => {
        ws.close();
        resolve(false);
      }, 5000);
    });

    expect(connected).toBeTruthy();
  });

  test('攝影師可略過媒合需求', async ({ request }, testInfo) => {
    const consumer = await login(request, CONSUMER_EMPNO, CONSUMER_PASSWORD);
    const provider = await login(request, PROVIDER_EMPNO, PROVIDER_PASSWORD);
    const admin = process.env.MATCH_ADMIN_TOKEN
      ? { token: process.env.MATCH_ADMIN_TOKEN }
      : await login(request, ADMIN_EMPNO, ADMIN_PASSWORD);

    if (!consumer || !provider) {
      testInfo.skip(true, '缺少 consumer/provider 測試帳號');
    }
    if (admin?.token) {
      await enableMatchFeature(request, admin.token);
    }

    await request.post(`${API_BASE}/match/online`, {
      headers: authHeaders(provider!.token),
      data: { city: '台北市', lat: 25.033, lng: 121.565 },
    });

    const created = await createMatchRequest(request, consumer!.token);
    if (!created?.id) {
      testInfo.skip(true, '無法建立媒合需求');
    }

    const declineRes = await request.post(`${API_BASE}/match/request/${created.id}/decline`, {
      headers: authHeaders(provider!.token),
    });
    expect(declineRes.ok()).toBeTruthy();

    await request.delete(`${API_BASE}/match/request/${created.id}`, {
      headers: authHeaders(consumer!.token),
    }).catch(() => {});
    await request.post(`${API_BASE}/match/offline`, {
      headers: authHeaders(provider!.token),
    });
  });
});
