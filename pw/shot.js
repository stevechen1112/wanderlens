const { chromium } = require('playwright')
const fs = require('fs')

const URL = process.env.PW_URL || 'http://localhost:19010'
const OUT = process.env.PW_OUT || 'shots'
const NAME = process.env.PW_NAME || 'consumer'
const TAG = process.env.PW_TAG || 'login'
const WAIT = parseInt(process.env.PW_WAIT || '12000', 10)

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch()
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      colorScheme: scheme,
    })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => console.log('PAGEERROR:', e.message))
    await page.goto(URL, { waitUntil: 'load', timeout: 180000 })
    await page.waitForTimeout(WAIT)
    const out = `${OUT}/${NAME}-${TAG}-${scheme}.png`
    await page.screenshot({ path: out, fullPage: false })
    console.log('SHOT:', out)
    await ctx.close()
  }
  await browser.close()
  console.log('DONE')
})()
