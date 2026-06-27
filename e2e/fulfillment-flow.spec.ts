import { test, expect } from '@playwright/test'
import { isApiUp, login, authHeaders, API_BASE, expectApiSuccess } from './helpers/match-api'

const MEDIA_SERVICE_API_KEY =
  process.env.MEDIA_SERVICE_API_KEY || 'wanderlens_media_key_2026'
const PHOTOGRAPHER_EMPNO = process.env.MATCH_PHOTOGRAPHER_EMPNO || 'photographer1'
const PHOTOGRAPHER_PASSWORD = process.env.MATCH_PHOTOGRAPHER_PASSWORD || '123456'
const CONSUMER_EMPNO = process.env.MATCH_CONSUMER_EMPNO || 'consumer1'
const CONSUMER_PASSWORD = process.env.MATCH_CONSUMER_PASSWORD || '123456'
const FULFILLMENT_ORDER_NO = 'DEMO-FFL'

function serviceHeaders() {
  return { 'X-Service-API-Key': MEDIA_SERVICE_API_KEY }
}

async function findProviderOrder(
  request: import('@playwright/test').APIRequestContext,
  orderNo: string,
) {
  const auth = await login(request, PHOTOGRAPHER_EMPNO, PHOTOGRAPHER_PASSWORD)
  if (!auth) return null
  const res = await request.get(`${API_BASE}/orders/provider`, {
    headers: authHeaders(auth.token),
  })
  if (!res.ok()) return null
  const json = await res.json()
  const orders = json.data || []
  return orders.find((o: { orderNo: string }) => o.orderNo === orderNo) ?? null
}

test.describe('WanderLens RAW 履約完整路徑', () => {
  test.beforeEach(async ({ request }, testInfo) => {
    if (!(await isApiUp(request))) {
      testInfo.skip(true, `API not running at ${API_BASE}`)
    }
  })

  test('起拍 → RAW 驗收 → AI 完成 → 消費者相簿可見', async ({ request, page }) => {
    const photographer = await login(request, PHOTOGRAPHER_EMPNO, PHOTOGRAPHER_PASSWORD)
    test.skip(!photographer, 'photographer1 login failed')

    const order = await findProviderOrder(request, FULFILLMENT_ORDER_NO)
    test.skip(!order, `seed order ${FULFILLMENT_ORDER_NO} not found — run seed-demo-content.sql`)

    const orderId = order.id as number
    let status = order.status as string

    if (status === 'ReadyToShoot') {
      const startRes = await request.post(`${API_BASE}/orders/shoot/start`, {
        headers: authHeaders(photographer!.token),
        params: { orderId },
      })
      await expectApiSuccess(startRes)
      status = 'ShootingStarted'
    }

    if (status === 'ShootingStarted') {
      const endRes = await request.post(`${API_BASE}/orders/shoot/end`, {
        headers: authHeaders(photographer!.token),
        params: { orderId },
      })
      await expectApiSuccess(endRes)
      status = 'ShootingEnded'
    }

    if (status === 'ShootingEnded') {
      const tokenRes = await request.post(`${API_BASE}/media/upload-token`, {
        headers: authHeaders(photographer!.token),
        params: { orderId, assetType: 'RAW' },
      })
      await expectApiSuccess(tokenRes)
      status = 'UploadingRaw'
    }

    if (status === 'UploadingRaw') {
      const verifyRes = await request.post(`${API_BASE}/media/verify`, {
        headers: serviceHeaders(),
        params: {
          orderId,
          success: true,
          fileCount: 3,
          totalSize: 1024 * 1024,
          detail: 'e2e fulfillment verify',
        },
      })
      await expectApiSuccess(verifyRes)
      status = 'AiProcessing'
    }

    if (status === 'AiProcessing') {
      const aiRes = await request.post(`${API_BASE}/media/ai-complete`, {
        headers: {
          ...serviceHeaders(),
          'Content-Type': 'application/json',
        },
        data: {
          orderId,
          assetUrls: [
            'https://picsum.photos/seed/wl-ffl-1/1200/800',
            'https://picsum.photos/seed/wl-ffl-2/1200/800',
          ],
        },
      })
      await expectApiSuccess(aiRes)
      status = 'Delivered'
    }

    expect(status).toBe('Delivered')

    const orderRes = await request.get(`${API_BASE}/orders/${orderId}`, {
      headers: authHeaders(photographer!.token),
    })
    const orderJson = await expectApiSuccess(orderRes)
    expect(orderJson.data.status).toBe('Delivered')

    const consumer = await login(request, CONSUMER_EMPNO, CONSUMER_PASSWORD)
    test.skip(!consumer, 'consumer1 login failed')

    const albumsRes = await request.get(`${API_BASE}/albums`, {
      headers: authHeaders(consumer!.token),
    })
    const albumsJson = await expectApiSuccess(albumsRes)
    const album = (albumsJson.data || []).find((a: { orderId?: number }) => a.orderId === orderId)
    expect(album).toBeTruthy()

    const photosRes = await request.get(`${API_BASE}/albums/${album.id}/photos`, {
      headers: authHeaders(consumer!.token),
    })
    const photosJson = await expectApiSuccess(photosRes)
    expect((photosJson.data || []).length).toBeGreaterThanOrEqual(2)

    const base = process.env.WEB_BASE_URL || 'http://localhost:3001'
    const { hostname } = new URL(base)
    await page.context().addCookies([{
      name: 'wl_token',
      value: consumer!.token,
      domain: hostname,
      path: '/',
      sameSite: 'Lax',
    }])
    await page.addInitScript((token: string) => {
      localStorage.setItem('wl_token', token)
      localStorage.setItem('wl_user_id', String(4))
    }, consumer!.token)

    await page.goto(`/albums/${album.id}`)
    await expect(page.getByTestId('album-detail-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('album-photo-grid')).toBeVisible()
  })
})
