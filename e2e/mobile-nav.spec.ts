import { test, expect } from '@playwright/test'

test.describe('Web 行動導覽', () => {
  test('小螢幕可開啟選單並前往登入頁', async ({ page }) => {
    const base = process.env.WEB_BASE_URL || 'http://localhost:3001'
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(base)

    const toggle = page.getByTestId('mobile-nav-toggle')
    await expect(toggle).toBeVisible({ timeout: 15000 })

    await toggle.click()
    const drawer = page.getByTestId('mobile-nav-drawer')
    await expect(drawer).toBeVisible()

    await drawer.getByRole('link', { name: /登入|Login/i }).click()
    await expect(page).toHaveURL(/\/login/)
  })
})
