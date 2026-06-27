import fs from 'fs'

const p = 'src/components/common/AppHeader.vue'
let t = fs.readFileSync(p, 'utf8')
t = t.replace(/<svg class="w-4 h-4"[^>]*d="M15 19l-7-7 7-7"[^/]*\/><\/svg>\s*[^<]*<\/NuxtLink>/,
  '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>\n          攝影師列表\n        </NuxtLink>')
t = t.replace(/aria-label="[^"]*"\s*\n\s*>\s*<svg class="w-4 h-4"[^>]*d="M21 21/,
  'aria-label="搜尋攝影師"\n      >\n        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21')
t = t.replace(/(<svg class="w-4 h-4"[^>]*d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"[^/]*\/><\/svg>)\s*[^\n<]*/,
  '$1\n        搜尋')
fs.writeFileSync(p, t, 'utf8')
console.log('AppHeader ok')
