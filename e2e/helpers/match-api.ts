/**
 * E2E 共用：登入與 API 工具
 */
import { expect } from '@playwright/test'

const API_BASE = process.env.API_BASE_URL || 'http://127.0.0.1:8080/api';

export { API_BASE };

export interface LoginResult {
  token: string;
  userId: number;
  role: string;
}

export async function isApiUp(request: { get: (url: string, opts?: object) => Promise<{ ok: () => boolean }> }): Promise<boolean> {
  try {
    const res = await request.get(`${API_BASE}/match/public/status`, { timeout: 5000 });
    return res.ok();
  } catch {
    return false;
  }
}

export async function login(
  request: { post: (url: string, opts?: object) => Promise<{ ok: () => boolean; json: () => Promise<any> }> },
  empno: string,
  password: string,
): Promise<LoginResult | null> {
  const res = await request.post(`${API_BASE}/auth/login`, {
    data: { empno, password },
  });
  if (!res.ok()) return null;
  const json = await res.json();
  const data = json.data;
  if (!data?.token) return null;
  return {
    token: data.token,
    userId: data.userId,
    role: data.role,
  };
}

export function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export function wsMatchUrl(token: string) {
  const wsBase = API_BASE.replace(/^http/i, 'ws');
  return `${wsBase}/ws/match?token=${encodeURIComponent(token)}`;
}

export function sseMatchUrl(requestId: number, token: string) {
  return `${API_BASE}/match/request/${requestId}/stream?token=${encodeURIComponent(token)}`;
}

export async function createMatchRequest(
  request: { post: (url: string, opts?: object) => Promise<{ ok: () => boolean; json: () => Promise<any> }> },
  consumerToken: string,
  payload: Record<string, unknown> = {},
) {
  const res = await request.post(`${API_BASE}/match/request`, {
    headers: authHeaders(consumerToken),
    data: {
      serviceTypeId: 1,
      shootingLocation: '台北市信義區',
      city: '台北市',
      durationHours: 0.5,
      ...payload,
    },
  });
  if (!res.ok()) return null;
  const json = await res.json();
  return json.data;
}

export async function enableMatchFeature(
  request: { put: (url: string, opts?: object) => Promise<{ ok: () => boolean }> },
  adminToken: string,
) {
  const res = await request.put(`${API_BASE}/admin/match/feature-flags`, {
    headers: authHeaders(adminToken),
    data: {
      instantMatchEnabled: true,
      travelInstantEnabled: true,
      streetInstantEnabled: true,
    },
  });
  return res.ok();
}

/** API 回傳 HTTP 200 但 body.code 可能為 400，需一併檢查 */
export async function expectApiSuccess(res: { ok: () => boolean; json: () => Promise<any> }) {
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json.code).toBe('200');
  return json;
}
