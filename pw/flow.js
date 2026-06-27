const { chromium } = require('playwright')
const fs = require('fs')

const APP = process.env.PW_APP || 'consumer'
const OUT = process.env.PW_OUT || 'shots'
const WAIT = parseInt(process.env.PW_WAIT || '7000', 10)

const VW = 390
const VH = 844

// 固定埠，刻意不吃 PW_URL，避免殘留環境變數連到錯誤的 App
const CONFIGS = {
  consumer: {
    url: 'http://localhost:19010',
    empno: 'consumer1',
    password: '123456',
    tabs: ['首頁', '相簿', '預約', '訊息', '個人'],
  },
  provider: {
    url: 'http://localhost:19011',
    empno: 'photographer1',
    password: '123456',
    tabs: ['首頁', '行事曆', '訂單', '訊息', '收益', '我的'],
  },
}

const cfg = CONFIGS[APP]

async function injectCors(context) {
  await context.route('**/*', async (route) => {
    const req = route.request()
    const url = req.url()
    if (url.includes(':8080')) {
      if (req.method() === 'OPTIONS') {
        return route.fulfill({
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
            'access-control-allow-headers': '*',
            'access-control-max-age': '3600',
          },
          body: '',
        })
      }
      try {
        const resp = await route.fetch()
        return route.fulfill({ response: resp, headers: { ...resp.headers(), 'access-control-allow-origin': '*' } })
      } catch (e) {
        return route.continue()
      }
    }
    return route.continue()
  })
}

async function shot(page, name) {
  const out = `${OUT}/${name}.png`
  await page.screenshot({ path: out, fullPage: false })
  console.log('SHOT:', out)
}

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch({
    args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process'],
  })

  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({
      viewport: { width: VW, height: VH },
      deviceScaleFactor: 2,
      colorScheme: scheme,
      bypassCSP: true,
    })
    await injectCors(ctx)
    const page = await ctx.newPage()
    page.on('pageerror', (e) => console.log('PAGEERROR:', e.message.split('\n')[0]))

    await page.goto(cfg.url, { waitUntil: 'load', timeout: 180000 })
    await page.waitForSelector('input[type="password"]', { timeout: 60000 })
    await page.waitForTimeout(2000)

    await page.locator('input:not([type="password"])').first().fill(cfg.empno)
    await page.locator('input[type="password"]').first().fill(cfg.password)
    await page.getByText('登入', { exact: true }).first().click()

    try {
      await page.waitForSelector('input[type="password"]', { state: 'detached', timeout: 30000 })
    } catch (e) {
      console.log('WARN: login form still present')
    }
    await page.waitForTimeout(WAIT)
    await shot(page, `${APP}-home-${scheme}`)

    // 以底部分頁列座標點擊（避開標題與分頁同字的誤點）
    const n = cfg.tabs.length
    const tabY = VH - 24
    for (let i = 0; i < n; i++) {
      const x = (VW / n) * (i + 0.5)
      try {
        await page.mouse.click(x, tabY)
        await page.waitForTimeout(WAIT)
        await shot(page, `${APP}-${i}-${cfg.tabs[i]}-${scheme}`)
      } catch (e) {
        console.log(`WARN: tab ${i} "${cfg.tabs[i]}" failed: ${e.message.split('\n')[0]}`)
      }
    }

    await ctx.close()
  }

  await browser.close()
  console.log('DONE')
})()
