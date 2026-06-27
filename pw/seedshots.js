// 跨端整合截圖：Web 公開相簿 + 消費者 App(相簿/對話) + 攝影師 App(訂單/對話/收益)
// 三端共用同一份後端種子資料（4 公開相簿、3 訂單、1 訂單對話）
const { chromium } = require('playwright')
const fs = require('fs')

const OUT = process.env.PW_OUT || 'seedshots'
const VW = 390
const VH = 844
const WAIT = 6000

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

async function login(page, url, empno, password) {
  await page.goto(url, { waitUntil: 'load', timeout: 180000 })
  await page.waitForSelector('input[type="password"]', { timeout: 60000 })
  await page.waitForTimeout(2000)
  await page.locator('input:not([type="password"])').first().fill(empno)
  await page.locator('input[type="password"]').first().fill(password)
  await page.getByText('登入', { exact: true }).first().click()
  try {
    await page.waitForSelector('input[type="password"]', { state: 'detached', timeout: 30000 })
  } catch (e) {
    console.log('WARN: login form still present')
  }
  await page.waitForTimeout(WAIT)
}

function tab(page, n, i) {
  const x = (VW / n) * (i + 0.5)
  const y = VH - 24
  return page.mouse.click(x, y)
}

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch({
    args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process'],
  })

  for (const scheme of ['light', 'dark']) {
    // ── Web 公開相簿（3001） ──
    {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, colorScheme: scheme })
      const page = await ctx.newPage()
      page.on('pageerror', (e) => console.log('WEB PAGEERROR:', e.message.split('\n')[0]))
      try {
        await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 120000 })
        await page.waitForTimeout(5000)
        await shot(page, `web-home-${scheme}`)
      } catch (e) {
        console.log('WARN web:', e.message.split('\n')[0])
      }
      await ctx.close()
    }

    // ── 消費者 App（19010）：相簿 / 訊息 / 對話 ──
    {
      const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 2, colorScheme: scheme, bypassCSP: true })
      await injectCors(ctx)
      const page = await ctx.newPage()
      page.on('pageerror', (e) => console.log('CONSUMER PAGEERROR:', e.message.split('\n')[0]))
      try {
        await login(page, 'http://localhost:19010', 'consumer1', '123456')
        const tabs = ['首頁', '相簿', '預約', '訊息', '個人']
        await tab(page, tabs.length, 1) // 相簿
        await page.waitForTimeout(WAIT)
        await shot(page, `consumer-albums-${scheme}`)
        await tab(page, tabs.length, 3) // 訊息
        await page.waitForTimeout(WAIT)
        await shot(page, `consumer-messages-${scheme}`)
        // 點第一個對話列開啟詳情
        await page.mouse.click(VW / 2, 150)
        await page.waitForTimeout(WAIT)
        await shot(page, `consumer-conversation-${scheme}`)
      } catch (e) {
        console.log('WARN consumer:', e.message.split('\n')[0])
      }
      await ctx.close()
    }

    // ── 攝影師 App（19011）：訂單 / 訊息 / 對話 / 收益 ──
    {
      const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 2, colorScheme: scheme, bypassCSP: true })
      await injectCors(ctx)
      const page = await ctx.newPage()
      page.on('pageerror', (e) => console.log('PROVIDER PAGEERROR:', e.message.split('\n')[0]))
      try {
        await login(page, 'http://localhost:19011', 'photographer1', '123456')
        const tabs = ['首頁', '行事曆', '訂單', '訊息', '收益', '我的']
        await tab(page, tabs.length, 2) // 訂單
        await page.waitForTimeout(WAIT)
        await shot(page, `provider-orders-${scheme}`)
        await tab(page, tabs.length, 3) // 訊息
        await page.waitForTimeout(WAIT)
        await shot(page, `provider-messages-${scheme}`)
        await page.mouse.click(VW / 2, 150) // 開對話
        await page.waitForTimeout(WAIT)
        await shot(page, `provider-conversation-${scheme}`)
        await tab(page, tabs.length, 4) // 收益
        await page.waitForTimeout(WAIT)
        await shot(page, `provider-earnings-${scheme}`)
      } catch (e) {
        console.log('WARN provider:', e.message.split('\n')[0])
      }
      await ctx.close()
    }
  }

  await browser.close()
  console.log('DONE')
})()
