const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  const log = (test, status, detail = '') => {
    const entry = { test, status, detail };
    results.push(entry);
    console.log(`[${status}] ${test}${detail ? ' — ' + detail : ''}`);
  };

  // ═══════════════════════════════════════════════
  // 1. WEB 首頁功能測試
  // ═══════════════════════════════════════════════
  console.log('\n=== Web 首頁 ===');
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(3000);

  // 1a: 標題
  const title = await page.title();
  log('首頁標題', title.includes('WanderLens') ? 'PASS' : 'FAIL', title);

  // 1b: 搜尋列存在
  const searchBtn = await page.getByText('搜尋攝影師').count();
  log('搜尋按鈕', searchBtn > 0 ? 'PASS' : 'FAIL');

  // 1c: 語言切換 — 找包含中文/English 選項的 select
  const allSelects = page.locator('select');
  const selectCount = await allSelects.count();
  let langSelectIdx = -1;
  for (let i = 0; i < selectCount; i++) {
    const opts = await allSelects.nth(i).locator('option').allTextContents();
    if (opts.some(o => o.includes('English') || o.includes('中文'))) {
      langSelectIdx = i;
      break;
    }
  }
  log('語言切換下拉', langSelectIdx >= 0 ? 'PASS' : 'FAIL', `在第 ${langSelectIdx + 1} 個 select`);

  // 1d: 點擊語言切換為 English
  if (langSelectIdx >= 0) {
    const langSelect = allSelects.nth(langSelectIdx);
    // 找 English option 的 value
    const options = await langSelect.locator('option').allTextContents();
    const enIdx = options.findIndex(o => o.includes('English'));
    if (enIdx >= 0) {
      const enValue = await langSelect.locator('option').nth(enIdx).getAttribute('value');
      await langSelect.selectOption(enValue);
      await page.waitForTimeout(2000);
      const enText = await page.evaluate(() => document.body.innerText);
      const hasEnglish = enText.includes('Search') || enText.includes('Photographer') || enText.includes('Login');
      log('切換英文', hasEnglish ? 'PASS' : 'FAIL', hasEnglish ? '顯示英文' : '未切換');
      // 切回中文
      const zhValue = await langSelect.locator('option').first().getAttribute('value');
      await langSelect.selectOption(zhValue);
      await page.waitForTimeout(1000);
    }
  }

  // 1e: 導航連結 - 攝影師列表
  const photographerListLink = page.getByText('攝影師列表').first();
  if (await photographerListLink.count() > 0) {
    await photographerListLink.click();
    await page.waitForTimeout(3000);
  const listTitle = await page.evaluate(() => { const m = document.querySelector('main'); return m ? m.innerText.slice(0, 200) : ''; });
  log('點擊攝影師列表', page.url().includes('photographer-list') ? 'PASS' : 'FAIL', page.url());
  log('攝影師列表內容', listTitle.includes('攝影師') || listTitle.length > 20 ? 'PASS' : 'FAIL', listTitle.slice(0, 80));
  }

  // ═══════════════════════════════════════════════
  // 2. WEB 登入頁
  // ═══════════════════════════════════════════════
  console.log('\n=== Web 登入頁 ===');
  await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const loginTitle = await page.evaluate(() => { const m = document.querySelector('main'); return m ? m.innerText.slice(0, 200) : document.body.innerText.slice(0, 200); });
  log('登入頁標題', loginTitle.includes('登入') ? 'PASS' : 'FAIL', loginTitle.slice(0, 50));

  // 填寫登入表單
  const empnoInput = page.locator('input[placeholder*="手機"], input[placeholder*="Email"]').first();
  const pwdInput = page.locator('input[type="password"]').first();
  const loginBtn = page.locator('button[type="submit"]').first();

  if (await empnoInput.count() > 0 && await pwdInput.count() > 0) {
    await empnoInput.fill('testuser');
    await pwdInput.fill('wrongpassword');
    log('填寫登入表單', 'PASS');

    if (await loginBtn.count() > 0) {
      await loginBtn.click();
      await page.waitForTimeout(3000);
      const afterLogin = await page.evaluate(() => document.body.innerText);
      const hasError = afterLogin.includes('錯誤') || afterLogin.includes('失敗') || afterLogin.includes('帳號');
      log('登入失敗提示', hasError ? 'PASS' : 'CHECK', afterLogin.slice(0, 100));
    }
  } else {
    log('登入表單欄位', 'FAIL', '找不到輸入框');
  }

  // ═══════════════════════════════════════════════
  // 3. WEB 註冊頁
  // ═══════════════════════════════════════════════
  console.log('\n=== Web 註冊頁 ===');
  await page.goto('http://localhost:3001/register', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const regText = await page.evaluate(() => { const m = document.querySelector('main'); return m ? m.innerText.slice(0, 300) : ''; });
  log('註冊頁標題', regText.includes('註冊') ? 'PASS' : 'FAIL', regText.slice(0, 50));

  // 檢查表單欄位
  const regInputs = await page.locator('input').count();
  log('註冊表單欄位數', regInputs >= 5 ? 'PASS' : 'FAIL', `找到 ${regInputs} 個 input`);

  // ═══════════════════════════════════════════════
  // 4. WEB FAQ 頁
  // ═══════════════════════════════════════════════
  console.log('\n=== Web FAQ 頁 ===');
  await page.goto('http://localhost:3001/faq', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
  const faqText = await page.evaluate(() => { const m = document.querySelector('main'); return m ? m.innerText.slice(0, 300) : ''; });
  log('FAQ 頁標題', faqText.includes('常見問題') ? 'PASS' : 'FAIL', faqText.slice(0, 50));

  // ═══════════════════════════════════════════════
  // 5. WEB 預約頁
  // ═══════════════════════════════════════════════
  console.log('\n=== Web 預約頁 ===');
  await page.goto('http://localhost:3001/booking', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
  const bookingText = await page.evaluate(() => { const m = document.querySelector('main'); return m ? m.innerText.slice(0, 300) : ''; });
  log('預約頁內容', bookingText.length > 20 ? 'PASS' : 'FAIL', bookingText.slice(0, 80));

  // ═══════════════════════════════════════════════
  // 6. WEB 搜尋頁
  // ═══════════════════════════════════════════════
  console.log('\n=== Web 搜尋頁 ===');
  await page.goto('http://localhost:3001/search', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
  const searchText = await page.evaluate(() => { const m = document.querySelector('main'); return m ? m.innerText.slice(0, 300) : ''; });
  log('搜尋頁內容', searchText.includes('搜尋') || searchText.includes('攝影師') || searchText.includes('找不到') ? 'PASS' : 'FAIL', searchText.slice(0, 80));

  // ═══════════════════════════════════════════════
  // 7. WEB 隱私政策頁
  // ═══════════════════════════════════════════════
  console.log('\n=== Web 隱私政策頁 ===');
  await page.goto('http://localhost:3001/privacy-policy', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
  const privacyText = await page.evaluate(() => { const m = document.querySelector('main'); return m ? m.innerText.slice(0, 300) : ''; });
  log('隱私政策內容', privacyText.includes('隱私') ? 'PASS' : 'FAIL', privacyText.slice(0, 80));

  // ═══════════════════════════════════════════════
  // 8. ADMIN 登入頁
  // ═══════════════════════════════════════════════
  console.log('\n=== Admin 登入頁 ===');
  await page.goto('http://localhost:3003/login', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
  const adminText = await page.evaluate(() => document.body.innerText.slice(0, 300));
  log('Admin 登入頁', adminText.includes('WanderLens') || adminText.includes('管理') ? 'PASS' : 'FAIL', adminText.slice(0, 80));

  // 填寫 admin 登入表單
  const adminInputs = await page.locator('input').count();
  log('Admin 表單欄位', adminInputs >= 2 ? 'PASS' : 'FAIL', `找到 ${adminInputs} 個 input`);

  const adminBtn = page.locator('button').filter({ hasText: '登入' }).first();
  if (await adminBtn.count() > 0) {
    log('Admin 登入按鈕', 'PASS');
    // 填入測試帳號
    const adminEmpno = page.locator('input').first();
    const adminPwd = page.locator('input[type="password"]').first();
    if (await adminEmpno.count() > 0) await adminEmpno.fill('admin');
    if (await adminPwd.count() > 0) await adminPwd.fill('admin123');
    await adminBtn.click();
    await page.waitForTimeout(3000);
    const afterAdminLogin = page.url();
    log('Admin 登入嘗試', afterAdminLogin.includes('dashboard') ? 'PASS' : 'CHECK', afterAdminLogin);
  }

  // ═══════════════════════════════════════════════
  // 9. PROVIDER 登入頁
  // ═══════════════════════════════════════════════
  console.log('\n=== Provider 登入頁 ===');
  await page.goto('http://localhost:3002/login', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
  const providerText = await page.evaluate(() => document.body.innerText.slice(0, 300));
  log('Provider 登入頁', providerText.includes('WanderLens') || providerText.includes('攝影師') ? 'PASS' : 'FAIL', providerText.slice(0, 80));

  const providerInputs = await page.locator('input').count();
  log('Provider 表單欄位', providerInputs >= 2 ? 'PASS' : 'FAIL', `找到 ${providerInputs} 個 input`);

  // ═══════════════════════════════════════════════
  // 10. RETOUCH 登入頁
  // ═══════════════════════════════════════════════
  console.log('\n=== Retouch 登入頁 ===');
  await page.goto('http://localhost:3005/login', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
  const retouchText = await page.evaluate(() => document.body.innerText.slice(0, 300));
  log('Retouch 登入頁', retouchText.includes('WanderLens') || retouchText.includes('修圖') ? 'PASS' : 'FAIL', retouchText.slice(0, 80));

  const retouchInputs = await page.locator('input').count();
  log('Retouch 表單欄位', retouchInputs >= 2 ? 'PASS' : 'FAIL', `找到 ${retouchInputs} 個 input`);

  // ═══════════════════════════════════════════════
  // 11. MEDIA Swagger 頁
  // ═══════════════════════════════════════════════
  console.log('\n=== Media Swagger ===');
  await page.goto('http://localhost:3004/docs', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
  const swaggerText = await page.evaluate(() => document.body.innerText.slice(0, 300));
  log('Media Swagger', swaggerText.includes('WanderLens') || swaggerText.includes('Media') ? 'PASS' : 'FAIL', swaggerText.slice(0, 80));

  // ═══════════════════════════════════════════════
  // 摘要
  // ═══════════════════════════════════════════════
  console.log('\n=== 測試摘要 ===');
  const pass = results.filter(r => r.status === 'PASS').length;
  const fail = results.filter(r => r.status === 'FAIL').length;
  const check = results.filter(r => r.status === 'CHECK').length;
  console.log(`PASS: ${pass} | FAIL: ${fail} | CHECK: ${check} | 總計: ${results.length}`);

  await browser.close();
})();