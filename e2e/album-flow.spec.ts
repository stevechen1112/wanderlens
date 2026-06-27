import { test, expect } from '@playwright/test'
import { isApiUp, login } from './helpers/match-api'

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8080/api'
const CONSUMER_EMPNO = process.env.MATCH_CONSUMER_EMPNO || 'consumer1'
const CONSUMER_PASSWORD = process.env.MATCH_CONSUMER_PASSWORD || '123456'

async function loginWeb(page: import('@playwright/test').Page, request: import('@playwright/test').APIRequestContext) {
  const auth = await login(request, CONSUMER_EMPNO, CONSUMER_PASSWORD)
  if (!auth) throw new Error('consumer1 API login failed')
  const base = process.env.WEB_BASE_URL || 'http://localhost:3001'
  const { hostname } = new URL(base)
  await page.context().addCookies([{
    name: 'wl_token',
    value: auth.token,
    domain: hostname,
    path: '/',
    sameSite: 'Lax',
  }])
  await page.addInitScript((token: string) => {
    localStorage.setItem('wl_token', token)
    localStorage.setItem('wl_user_id', String(4))
  }, auth.token)
}

async function getFirstAlbumId(request: import('@playwright/test').APIRequestContext): Promise<number | null> {
  const auth = await login(request, CONSUMER_EMPNO, CONSUMER_PASSWORD)
  if (!auth) return null
  const albumsRes = await request.get(`${API_BASE}/albums`, {
    headers: { Authorization: `Bearer ${auth.token}` },
  })
  if (!albumsRes.ok()) return null
  const albumsJson = await albumsRes.json()
  const albums = albumsJson.data || []
  return albums[0]?.id ?? null
}

test.describe('WanderLens Web 相簿流程', () => {
  test.beforeEach(async ({ request }, testInfo) => {
    if (!(await isApiUp(request))) {
      testInfo.skip(true, `API not running at ${API_BASE}`)
    }
  })

  test('consumer1 可登入並進入相簿列表', async ({ page, request }) => {
    await loginWeb(page, request)
    await page.goto('/albums')
    await expect(page.getByTestId('album-list-page')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('h1')).toContainText(/相簿|Album/i)
  })

  test('相簿列表可進入詳情並開啟公開設定', async ({ page, request }) => {
    const albumId = await getFirstAlbumId(request)
    test.skip(!albumId, 'no seed albums for consumer1')

    await loginWeb(page, request)
    await page.goto(`/albums/${albumId}`)
    await expect(page.getByTestId('album-detail-page')).toBeVisible({ timeout: 15000 })
    await page.getByTestId('album-consent-btn').click()
    await expect(page.getByRole('heading', { name: /公開設定|Consent/i })).toBeVisible()
    await expect(page.getByText(/完全私密|Private/i)).toBeVisible()
  })

  test('相簿詳情可開啟 PhotoViewer', async ({ page, request }) => {
    const albumId = await getFirstAlbumId(request)
    test.skip(!albumId, 'no seed albums for consumer1')

    const auth = await login(request, CONSUMER_EMPNO, CONSUMER_PASSWORD)
    test.skip(!auth, 'consumer1 login failed')

    const photosRes = await request.get(`${API_BASE}/albums/${albumId}/photos`, {
      headers: { Authorization: `Bearer ${auth!.token}` },
    })
    const photosJson = await photosRes.json()
    const photos = photosJson.data || []
    test.skip(photos.length === 0, 'no photos in seed album')

    await loginWeb(page, request)
    await page.goto(`/albums/${albumId}`)
    await expect(page.getByTestId('album-photo-grid')).toBeVisible({ timeout: 15000 })
    await page.getByTestId(`album-photo-${photos[0].id}`).click()
    await expect(page.getByTestId('photo-viewer')).toBeVisible({ timeout: 5000 })
    await page.getByTestId('photo-viewer-close').click()
    await expect(page.getByTestId('photo-viewer')).toBeHidden()
  })

  test('相簿詳情可切換收藏（有照片時）', async ({ page, request }) => {
    const albumId = await getFirstAlbumId(request)
    test.skip(!albumId, 'no seed albums for consumer1')

    const auth = await login(request, CONSUMER_EMPNO, CONSUMER_PASSWORD)
    test.skip(!auth, 'consumer1 login failed')

    const photosRes = await request.get(`${API_BASE}/albums/${albumId}/photos`, {
      headers: { Authorization: `Bearer ${auth!.token}` },
    })
    const photos = (await photosRes.json()).data || []
    test.skip(photos.length === 0, 'no photos in seed album')

    await loginWeb(page, request)
    await page.goto(`/albums/${albumId}`)
    const favBtn = page.getByTestId(`album-favorite-${photos[0].id}`)
    await expect(favBtn).toBeVisible({ timeout: 15000 })
    const before = await favBtn.textContent()
    await favBtn.click()
    await expect(favBtn).not.toHaveText(before || '', { timeout: 5000 })
  })

  test('相簿 API favorites 端點需登入', async ({ request }) => {
    const res = await request.get(`${API_BASE}/albums/favorites`)
    expect([401, 403]).toContain(res.status())
  })
})
