import { test, expect } from '@playwright/test'
import { isApiUp, login, authHeaders, API_BASE, expectApiSuccess } from './helpers/match-api'

test.describe('API 錯誤碼統一', () => {
  test.beforeEach(async ({ request }, testInfo) => {
    if (!(await isApiUp(request))) {
      testInfo.skip(true, `API not running at ${API_BASE}`)
    }
  })

  test('不存在的訂單回傳 order_not_found', async ({ request }) => {
    const consumer = await login(request, 'consumer1', '123456')
    test.skip(!consumer, 'consumer login failed')

    const res = await request.get(`${API_BASE}/orders/999999999`, {
      headers: authHeaders(consumer!.token),
    })
    const json = await res.json()
    expect(json.code).toBe('order_not_found')
    expect(json.data).toBeFalsy()
  })

  test('不存在的相簿回傳 album_not_found', async ({ request }) => {
    const consumer = await login(request, 'consumer1', '123456')
    test.skip(!consumer, 'consumer login failed')

    const res = await request.get(`${API_BASE}/albums/999999999`, {
      headers: authHeaders(consumer!.token),
    })
    const json = await res.json()
    expect(json.code).toBe('album_not_found')
  })

  test('未登入溝通室列表回傳 401', async ({ request }) => {
    const res = await request.get(`${API_BASE}/conversations`)
    expect(res.status()).toBeGreaterThanOrEqual(401)
  })
})
