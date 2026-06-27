const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  const results = [];
  const log = (test, status, detail = '') => {
    results.push({ test, status, detail });
    console.log(`[${status}] ${test}${detail ? ' — ' + detail.slice(0, 120) : ''}`);
  };

  // ═══════════════════════════════════════════
  // ADMIN 後台完整測試
  // ═══════════════════════════════════════════
  console.log('\n========== ADMIN 後台 ==========');

  // 登入
  await page.goto('http://localhost:3003/login', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);

  // 填入帳密
  const adminUserInput = page.locator('input').first();
  const adminPwdInput = page.locator('input[type="password"]').first();
  await adminUserInput.fill('admin');
  await adminPwdInput.fill('admin123');
  log('Admin 填入帳密', 'PASS');

  // 點登入
  await page.locator('button').filter({ hasText: '登入' }).click();
  await page.waitForTimeout(3000);
  const afterLoginUrl = page.url();
  log('Admin 登入', afterLoginUrl.includes('dashboard') ? 'PASS' : 'FAIL', `URL: ${afterLoginUrl}`);

  if (afterLoginUrl.includes('dashboard')) {
    // 截圖 dashboard
    await page.screenshot({ path: 'screenshots/admin-dashboard.png' });
    const dashText = await page.evaluate(() => { const m = document.querySelector('.el-main, main, .el-card'); return m ? m.innerText.slice(0, 200) : document.body.innerText.slice(0, 200); });
    log('Admin Dashboard 內容', dashText.length > 10 ? 'PASS' : 'FAIL', dashText.slice(0, 80));

    // 逐一點擊側邊選單
    const menuItems = await page.locator('.el-menu-item, .el-sub-menu__title').allTextContents();
    log('Admin 選單數量', menuItems.length > 0 ? 'PASS' : 'FAIL', `${menuItems.length} 個: ${menuItems.join(', ')}`);

    for (const item of menuItems) {
      const cleanName = item.trim();
      if (!cleanName) continue;
      console.log(`\n  → 點擊: ${cleanName}`);
      try {
        // 先找是否有子選單（el-sub-menu）
        const subMenu = page.locator('.el-sub-menu__title').filter({ hasText: cleanName });
        if (await subMenu.count() > 0) {
          await subMenu.click();
          await page.waitForTimeout(1000);
          // 點擊子項
          const subItems = await page.locator('.el-menu-item').allTextContents();
          for (const sub of subItems) {
            const cleanSub = sub.trim();
            if (!cleanSub) continue;
            console.log(`    → 子項: ${cleanSub}`);
            try {
              await page.locator('.el-menu-item').filter({ hasText: cleanSub }).first().click();
              await page.waitForTimeout(2000);
              const subUrl = page.url();
              const subContent = await page.evaluate(() => { const m = document.querySelector('.el-main, main'); return m ? m.innerText.slice(0, 150) : ''; });
              log(`Admin ${cleanName}/${cleanSub}`, subUrl.includes('3003') ? 'PASS' : 'CHECK', `內容: ${subContent.slice(0, 60)}`);
            } catch (e) {
              log(`Admin ${cleanName}/${cleanSub}`, 'FAIL', e.message.slice(0, 60));
            }
          }
        } else {
          // 普通選單項
          await page.locator('.el-menu-item').filter({ hasText: cleanName }).first().click();
          await page.waitForTimeout(2000);
          const itemUrl = page.url();
          const itemContent = await page.evaluate(() => { const m = document.querySelector('.el-main, main'); return m ? m.innerText.slice(0, 150) : ''; });
          log(`Admin ${cleanName}`, itemUrl.includes('3003') ? 'PASS' : 'CHECK', `內容: ${itemContent.slice(0, 60)}`);
        }
      } catch (e) {
        log(`Admin ${cleanName}`, 'FAIL', e.message.slice(0, 60));
      }
    }
  }

  // ═══════════════════════════════════════════
  // PROVIDER 後台完整測試
  // ═══════════════════════════════════════════
  console.log('\n========== PROVIDER 後台 ==========');

  await page.goto('http://localhost:3002/login', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);

  const provUserInput = page.locator('input').first();
  const provPwdInput = page.locator('input[type="password"]').first();
  await provUserInput.fill('photographer1');
  await provPwdInput.fill('admin123');
  log('Provider 填入帳密', 'PASS');

  await page.locator('button').filter({ hasText: '登入' }).click();
  await page.waitForTimeout(3000);
  const provLoginUrl = page.url();
  log('Provider 登入', !provLoginUrl.includes('login') ? 'PASS' : 'FAIL', `URL: ${provLoginUrl}`);

  if (!provLoginUrl.includes('login')) {
    const provMenuItems = await page.locator('.el-menu-item, .el-sub-menu__title').allTextContents();
    log('Provider 選單數量', provMenuItems.length > 0 ? 'PASS' : 'FAIL', `${provMenuItems.length} 個: ${provMenuItems.join(', ')}`);

    for (const item of provMenuItems) {
      const cleanName = item.trim();
      if (!cleanName) continue;
      console.log(`\n  → 點擊: ${cleanName}`);
      try {
        await page.locator('.el-menu-item, .el-sub-menu__title').filter({ hasText: cleanName }).first().click();
        await page.waitForTimeout(2000);
        const itemUrl = page.url();
        const itemContent = await page.evaluate(() => { const m = document.querySelector('.el-main, main'); return m ? m.innerText.slice(0, 150) : ''; });
        log(`Provider ${cleanName}`, itemUrl.includes('3002') ? 'PASS' : 'CHECK', `內容: ${itemContent.slice(0, 60)}`);
      } catch (e) {
        log(`Provider ${cleanName}`, 'FAIL', e.message.slice(0, 60));
      }
    }
  }

  // ═══════════════════════════════════════════
  // RETOUCH 後台完整測試
  // ═══════════════════════════════════════════
  console.log('\n========== RETOUCH 後台 ==========');

  await page.goto('http://localhost:3005/login', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);

  const retUserInput = page.locator('input').first();
  const retPwdInput = page.locator('input[type="password"]').first();
  await retUserInput.fill('retoucher1');
  await retPwdInput.fill('admin123');
  log('Retouch 填入帳密', 'PASS');

  await page.locator('button').filter({ hasText: '登入' }).click();
  await page.waitForTimeout(3000);
  const retLoginUrl = page.url();
  log('Retouch 登入', !retLoginUrl.includes('login') ? 'PASS' : 'FAIL', `URL: ${retLoginUrl}`);

  if (!retLoginUrl.includes('login')) {
    const retMenuItems = await page.locator('.el-menu-item, .el-sub-menu__title').allTextContents();
    log('Retouch 選單數量', retMenuItems.length > 0 ? 'PASS' : 'FAIL', `${retMenuItems.length} 個: ${retMenuItems.join(', ')}`);

    for (const item of retMenuItems) {
      const cleanName = item.trim();
      if (!cleanName) continue;
      console.log(`\n  → 點擊: ${cleanName}`);
      try {
        await page.locator('.el-menu-item, .el-sub-menu__title').filter({ hasText: cleanName }).first().click();
        await page.waitForTimeout(2000);
        const itemUrl = page.url();
        const itemContent = await page.evaluate(() => { const m = document.querySelector('.el-main, main'); return m ? m.innerText.slice(0, 150) : ''; });
        log(`Retouch ${cleanName}`, itemUrl.includes('3005') ? 'PASS' : 'CHECK', `內容: ${itemContent.slice(0, 60)}`);
      } catch (e) {
        log(`Retouch ${cleanName}`, 'FAIL', e.message.slice(0, 60));
      }
    }
  }

  // ═══════════════════════════════════════════
  // WEB 登入後測試
  // ═══════════════════════════════════════════
  console.log('\n========== WEB 登入後 ==========');

  await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const webUserInput = page.locator('input[placeholder*="手機"], input[placeholder*="Email"]').first();
  const webPwdInput = page.locator('input[type="password"]').first();
  if (await webUserInput.count() > 0) {
    await webUserInput.fill('consumer1');
    await webPwdInput.fill('admin123');
    log('Web 填入帳密', 'PASS');

    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(3000);
    const webAfterLogin = page.url();
    log('Web 登入', !webAfterLogin.includes('login') ? 'PASS' : 'FAIL', `URL: ${webAfterLogin}`);

    if (!webAfterLogin.includes('login')) {
      // 測試各頁面
      const webPages = [
        { url: '/profile', name: '個人頁' },
        { url: '/albums', name: '我的相簿' },
        { url: '/conversations', name: '訊息' },
        { url: '/orders', name: '我的訂單' },
        { url: '/photographer-list', name: '攝影師列表' },
        { url: '/search', name: '搜尋' },
        { url: '/faq', name: 'FAQ' },
      ];
      for (const wp of webPages) {
        await page.goto(`http://localhost:3001${wp.url}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(2000);
        const content = await page.evaluate(() => { const m = document.querySelector('main'); return m ? m.innerText.slice(0, 200) : ''; });
        log(`Web ${wp.name}`, content.length > 10 ? 'PASS' : 'FAIL', content.slice(0, 60));
      }
    }
  }

  // ═══════════════════════════════════════════
  // 摘要
  // ═══════════════════════════════════════════
  console.log('\n========== 測試摘要 ==========');
  const pass = results.filter(r => r.status === 'PASS').length;
  const fail = results.filter(r => r.status === 'FAIL').length;
  const check = results.filter(r => r.status === 'CHECK').length;
  console.log(`PASS: ${pass} | FAIL: ${fail} | CHECK: ${check} | 總計: ${results.length}`);

  if (fail > 0) {
    console.log('\n失敗項目:');
    results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  ❌ ${r.test} — ${r.detail}`));
  }

  await browser.close();
})();