const { chromium } = require('playwright')

const URL = process.env.PW_URL || 'http://localhost:19010'

;(async () => {
  const browser = await chromium.launch({
    args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process'],
  })
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    bypassCSP: true,
  })
  await ctx.route('**/*', async (route) => {
    const req = route.request()
    const url = req.url()
    if (url.includes(':8080')) {
      if (req.method() === 'OPTIONS') {
        return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS', 'access-control-allow-headers': '*' }, body: '' })
      }
      try { const resp = await route.fetch(); return route.fulfill({ response: resp, headers: { ...resp.headers(), 'access-control-allow-origin': '*' } }) } catch (e) { return route.continue() }
    }
    return route.continue()
  })
  const page = await ctx.newPage()
  page.on('console', (m) => console.log('CONSOLE:', m.text().slice(0, 200)))
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message.slice(0, 200)))

  await page.goto(URL, { waitUntil: 'load', timeout: 180000 })
  console.log('AFTER LOAD title=', await page.title(), 'href=', page.url())
  await page.waitForSelector('input[type="password"]', { timeout: 60000 })
  await page.waitForTimeout(1500)

  await page.locator('input:not([type="password"])').first().fill('consumer1')
  await page.locator('input[type="password"]').first().fill('123456')

  // log login API response
  page.on('response', (r) => { if (r.url().includes('/auth/')) console.log('API', r.status(), r.url()) })

  await page.getByText('登入', { exact: true }).first().click()
  await page.waitForTimeout(9000)

  console.log('AFTER LOGIN href=', page.url())
  const texts = await page.evaluate(() => {
    const out = []
    document.querySelectorAll('*').forEach((el) => {
      if (el.children.length === 0 && el.textContent && el.textContent.trim().length > 0 && el.textContent.trim().length < 12) {
        out.push(el.textContent.trim())
      }
    })
    return Array.from(new Set(out)).slice(0, 60)
  })
  console.log('VISIBLE SHORT TEXTS:', JSON.stringify(texts))

  await browser.close()
})()
