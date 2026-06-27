import { test, expect } from '@playwright/test'

test.describe('A11y 基線（Web）', () => {
  const base = process.env.WEB_BASE_URL || 'http://localhost:3001'

  test('skip link 可聚焦並跳至主內容', async ({ page }) => {
    await page.goto(base)
    await page.keyboard.press('Tab')
    const skip = page.getByTestId('skip-to-main')
    await expect(skip).toBeFocused({ timeout: 10000 })
    await skip.click()
    await expect(page.locator('#main-content')).toBeFocused()
  })

  test('行動選單可用 Escape 關閉', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(base)
    await page.getByTestId('mobile-nav-toggle').click()
    await expect(page.getByTestId('mobile-nav-drawer')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('mobile-nav-drawer')).toBeHidden()
  })

  test('登入頁表單欄位具 label 關聯', async ({ page }) => {
    await page.goto(`${base}/login`)
    await expect(page.locator('label[for="login-empno"]')).toBeVisible()
    await expect(page.locator('label[for="login-password"]')).toBeVisible()
    await page.locator('#login-empno').focus()
    await expect(page.locator('#login-empno')).toBeFocused()
  })
})
