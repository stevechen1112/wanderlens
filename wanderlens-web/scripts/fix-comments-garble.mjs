import fs from 'fs'
import path from 'path'

const patches = {
  'pages/search.vue': (t) => {
    t = t.replace(/<!--[^>]*條件[^>]*-->/, '<!-- 搜尋條件摘要 -->')
    t = t.replace(/<!--[^>]*載入[^>]*-->/, '<!-- 載入骨架 -->')
    t = t.replace(/<!--[^>]*空[^>]*-->/, '<!-- 空狀態 -->')
    t = t.replace(/<!--[^>]*結果[^>]*-->/, '<!-- 結果列表（真實資料） -->')
    t = t.replace(/<div class="wl-empty-icon">[^<]*<\/div>/, '<div class="wl-empty-icon">🔍</div>')
    t = t.replace(/\/\/[^\n]*serviceTypeId[^\n]*/, '    // 確保 serviceTypeId 有預設值')
    return t
  },
  'pages/faq.vue': (t) => {
    t = t.replace(/<!--[^>]*載入[^>]*-->/, '<!-- 載入骨架 -->')
    t = t.replace(/<!-- FAQ[^>]*-->/, '<!-- FAQ 列表 -->')
    t = t.replace(/<!--[^>]*空[^>]*-->/, '<!-- 空狀態 -->')
    return t
  },
  'pages/photographer-list.vue': (t) => {
    t = t.replace(/<!--[^>]*三[^>]*-->/, '<!-- 三供給池切換 -->')
    t = t.replace(/<!--[^>]*載入[^>]*-->/, '<!-- 載入骨架 -->')
    t = t.replace(/<!--[^>]*空[^>]*-->/, '<!-- 空狀態 -->')
    t = t.replace(/<!--[^>]*攝影師網[^>]*-->/, '<!-- 攝影師網格（真實資料） -->')
    return t
  },
  'pages/inbound-travel.vue': (t) => {
    t = t.replace(/<!-- \?+ -->/, '<!-- 特色 -->')
    t = t.replace(/<!-- \?{5,} -->/, '<!-- 熱門景點 -->')
    t = t.replace(/<!-- \?+ CTA -->/, '<!-- 底部 CTA -->')
    return t
  },
  'pages/booking/index.vue': (t) => t.replace(/\/\/ \?\?/g, '// ignore'),
  'components/home/PhotographerShowcase.vue': (t) => {
    t = t.replace(/<!--[^>]*載入[^>]*-->/, '<!-- 載入骨架 -->')
    t = t.replace(/<!--[^>]*攝影師網[^>]*-->/, '<!-- 攝影師網格 -->')
    t = t.replace(/<!--[^>]*空[^>]*-->/, '<!-- 空狀態 -->')
    t = t.replace(/<!--[^>]*查看[^>]*-->/, '<!-- 行動：查看全部 -->')
    return t
  },
  'components/home/HeroBanner.vue': (t) => {
    t = t.replace(/<!--[^>]*背景[^>]*-->/, '<!-- 預設背景（無 banner 時顯示） -->')
    t = t.replace(/<!--[^>]*滾[^>]*-->/, '<!-- 向下滾動提示 -->')
    return t
  },
  'components/home/ServiceTypeCards.vue': (t) => {
    t = t.replace(/<!--[^>]*載入[^>]*-->/, '<!-- 載入骨架 -->')
    t = t.replace(/<!--[^>]*類[^>]*-->/, '<!-- 類型卡片 -->')
    return t
  },
  'layouts/auth.vue': (t) => t.replace(/\/\/[^\n]*/, '// 無 Header / Footer 的登入佈局'),
  'layouts/default.vue': (t) => t.replace(/\/\/[^\n]*/, '// 預設佈局：Header + Main + Footer + GoTop + CookieConsent'),
  'layouts/blank.vue': (t) => t.replace(/\/\/[^\n]*/, '// 空白佈局：無導航頁面'),
}

for (const [rel, fn] of Object.entries(patches)) {
  const p = path.join('src', rel)
  if (!fs.existsSync(p)) continue
  const before = fs.readFileSync(p, 'utf8')
  const after = fn(before)
  if (after !== before) {
    fs.writeFileSync(p, after, 'utf8')
    console.log('fixed', rel)
  }
}

console.log('comments done')
