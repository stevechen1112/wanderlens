import { test, expect } from '@playwright/test'
import { isApiUp, login, authHeaders, API_BASE, expectApiSuccess } from './helpers/match-api'

const CONSUMER_EMPNO = process.env.MATCH_CONSUMER_EMPNO || 'consumer1'
const CONSUMER_PASSWORD = process.env.MATCH_CONSUMER_PASSWORD || '123456'
const PHOTOGRAPHER_EMPNO = process.env.MATCH_PHOTOGRAPHER_EMPNO || 'photographer1'
const PHOTOGRAPHER_PASSWORD = process.env.MATCH_PHOTOGRAPHER_PASSWORD || '123456'

async function getFirstConfigurationId(request: import('@playwright/test').APIRequestContext) {
  const res = await request.get(`${API_BASE}/search/configurations?serviceTypeId=1`)
  if (!res.ok()) return null
  const json = await res.json()
  const list = json.data || []
  return list[0]?.id ?? null
}

async function createTestOrder(
  request: import('@playwright/test').APIRequestContext,
  consumerToken: string,
  configurationId: number,
) {
  const createRes = await request.post(`${API_BASE}/orders`, {
    headers: authHeaders(consumerToken),
    data: {
      photographerId: 1,
      serviceTypeId: 1,
      configurationId,
      shootingDate: '2026-09-15',
      shootingTime: '10:00 - 12:00',
      shootingDuration: 2,
      shootingLocation: '台北市信義區 狀態機 E2E',
      customerName: 'E2E 狀態機',
      customerPhone: '0912000001',
      adultNum: 2,
      childNum: 0,
    },
  })
  const createJson = await expectApiSuccess(createRes)
  return createJson.data.id as number
}

test.describe('訂單狀態機主幹', () => {
  test.beforeEach(async ({ request }, testInfo) => {
    if (!(await isApiUp(request))) {
      testInfo.skip(true, `API not running at ${API_BASE}`)
    }
  })

  test('Draft → PendingPayment → 付款 → 聯繫 → 待拍攝', async ({ request }) => {
    const consumer = await login(request, CONSUMER_EMPNO, CONSUMER_PASSWORD)
    test.skip(!consumer, 'consumer1 login failed')

    const photographer = await login(request, PHOTOGRAPHER_EMPNO, PHOTOGRAPHER_PASSWORD)
    test.skip(!photographer, 'photographer1 login failed')

    const configurationId = await getFirstConfigurationId(request)
    test.skip(!configurationId, 'no configuration seed')

    const orderId = await createTestOrder(request, consumer!.token, configurationId)

    const draftRes = await request.get(`${API_BASE}/orders/${orderId}`, {
      headers: authHeaders(consumer!.token),
    })
    const draftJson = await expectApiSuccess(draftRes)
    expect(draftJson.data.status).toBe('Draft')

    const checkoutRes = await request.get(`${API_BASE}/payment/ecpay/checkout/${orderId}`, {
      headers: authHeaders(consumer!.token),
    })
    await expectApiSuccess(checkoutRes)

    const pendingRes = await request.get(`${API_BASE}/orders/${orderId}`, {
      headers: authHeaders(consumer!.token),
    })
    const pendingJson = await expectApiSuccess(pendingRes)
    expect(pendingJson.data.status).toBe('PendingPayment')

    const simRes = await request.post(`${API_BASE}/payment/staging/simulate-success/${orderId}`, {
      headers: authHeaders(consumer!.token),
    })
    const simJson = await expectApiSuccess(simRes)
    expect(simJson.data.status).toBe('WaitingProviderContact')

    const contactRes = await request.post(`${API_BASE}/orders/contact/${orderId}`, {
      headers: authHeaders(photographer!.token),
    })
    const contactJson = await expectApiSuccess(contactRes)
    expect(contactJson.data.status).toBe('Confirmed')

    const readyRes = await request.post(`${API_BASE}/orders/confirm-ready/${orderId}`, {
      headers: authHeaders(photographer!.token),
    })
    const readyJson = await expectApiSuccess(readyRes)
    expect(readyJson.data.status).toBe('ReadyToShoot')
  })
})
