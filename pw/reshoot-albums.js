const { chromium } = require('playwright')
const fs = require('fs')
const OUT = 'seedshots'
const VW = 390, VH = 844, WAIT = 6000

async function injectCors(context) {
  await context.route('**/*', async (route) => {
    const req = route.request(); const url = req.url()
    if (url.includes(':8080')) {
      if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS', 'access-control-allow-headers': '*' }, body: '' })
      try { const resp = await route.fetch(); return route.fulfill({ response: resp, headers: { ...resp.headers(), 'access-control-allow-origin': '*' } }) } catch (e) { return route.continue() }
    }
    return route.continue()
  })
}

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch({ args: ['--disable-web-security'] })
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 2, colorScheme: scheme, bypassCSP: true })
    await injectCors(ctx)
    const page = await ctx.newPage()
    await page.goto('http://localhost:19010', { waitUntil: 'load', timeout: 180000 })
    await page.waitForSelector('input[type="password"]', { timeout: 60000 })
    await page.waitForTimeout(2000)
    await page.locator('input:not([type="password"])').first().fill('consumer1')
    await page.locator('input[type="password"]').first().fill('123456')
    await page.getByText('登入', { exact: true }).first().click()
    try { await page.waitForSelector('input[type="password"]', { state: 'detached', timeout: 30000 }) } catch (e) {}
    await page.waitForTimeout(WAIT)
    await page.mouse.click((VW / 5) * 1.5, VH - 24) // 相簿 tab
    await page.waitForTimeout(WAIT)
    await page.screenshot({ path: `${OUT}/consumer-albums-${scheme}.png` })
    console.log('SHOT albums', scheme)
    await ctx.close()
  }
  await browser.close(); console.log('DONE')
})()
