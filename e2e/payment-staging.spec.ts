import { test, expect } from '@playwright/test'
import { isApiUp, login, authHeaders, API_BASE, expectApiSuccess } from './helpers/match-api'

const CONSUMER_EMPNO = process.env.MATCH_CONSUMER_EMPNO || 'consumer1'
const CONSUMER_PASSWORD = process.env.MATCH_CONSUMER_PASSWORD || '123456'

async function getFirstConfigurationId(request: import('@playwright/test').APIRequestContext) {
  const res = await request.get(`${API_BASE}/search/configurations?serviceTypeId=1`)
  if (!res.ok()) return null
  const json = await res.json()
  const list = json.data || []
  return list[0]?.id ?? null
}

test.describe('ECPay Staging 金流', () => {
  test.beforeEach(async ({ request }, testInfo) => {
    if (!(await isApiUp(request))) {
      testInfo.skip(true, `API not running at ${API_BASE}`)
    }
  })

  test('待付款訂單可模擬付款並取得綠界表單', async ({ request }) => {
    const consumer = await login(request, CONSUMER_EMPNO, CONSUMER_PASSWORD)
    test.skip(!consumer, 'consumer1 login failed')

    const configurationId = await getFirstConfigurationId(request)
    test.skip(!configurationId, 'no configuration seed')

    const createRes = await request.post(`${API_BASE}/orders`, {
      headers: authHeaders(consumer!.token),
      data: {
        photographerId: 1,
        serviceTypeId: 1,
        configurationId,
        shootingDate: '2026-08-01',
        shootingTime: '10:00 - 12:00',
        shootingDuration: 2,
        shootingLocation: '台北市信義區 E2E 測試',
        customerName: 'E2E 測試',
        customerPhone: '0912000000',
        adultNum: 2,
        childNum: 0,
      },
    })
    const createJson = await expectApiSuccess(createRes)
    const orderId = createJson.data.id as number
    expect(createJson.data.status).toBe('Draft')

    const checkoutRes = await request.get(`${API_BASE}/payment/ecpay/checkout/${orderId}`, {
      headers: authHeaders(consumer!.token),
    })
    const checkoutJson = await expectApiSuccess(checkoutRes)
    expect(checkoutJson.data).toContain('ecpayForm')
    expect(checkoutJson.data).toContain('payment-stage.ecpay.com.tw')

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
  })
})
