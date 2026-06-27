import fs from 'fs'

// AppHeader
{
  const p = 'src/components/common/AppHeader.vue'
  let t = fs.readFileSync(p, 'utf8')
  t = t.replace(
    /<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"\/><\/svg>\s*[\s\S]*?<\/NuxtLink>/,
    `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          攝影師列表
        </NuxtLink>`
  )
  t = t.replace(
    /<!-- 桌面[^-]*-->/,
    '<!-- 桌面：首頁 Hero / 詳情頁顯示；非首頁或滾過 Hero 顯示完整搜尋 -->'
  )
  t = t.replace(/<!-- 行[^-]*尋入[^-]*-->/, '<!-- 行動：搜尋入口 -->')
  t = t.replace(/aria-label="[^"]*"/, 'aria-label="搜尋攝影師"')
  t = t.replace(
    /(<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"\/><\/svg>)\s*[^\n<]+/,
    '$1\n        搜尋'
  )
  t = t.replace(/<!-- 行[^-]*板 -->/, '<!-- 行動搜尋面板 -->')
  fs.writeFileSync(p, t, 'utf8')
  console.log('AppHeader ok')
}

// PhotoViewer
{
  const p = 'src/components/album/PhotoViewer.vue'
  let t = fs.readFileSync(p, 'utf8')
  t = t.replace(
    /@click="\$emit\('close'\)">\s*\?\s*<\/button>/,
    `@click="$emit('close')" aria-label="關閉">
          ✕
        </button>`
  )
  t = t.replace(
    /@click="\$emit\('download', currentPhoto\)">\s*\?\s*<\/button>/,
    `@click="$emit('download', currentPhoto)" aria-label="下載">
          ⬇
        </button>`
  )
  t = t.replace(/\?\s*\?\?\?/, '← 上一張')
  t = t.replace(/\?\?\?\s*\?/, '下一張 →')
  fs.writeFileSync(p, t, 'utf8')
  console.log('PhotoViewer ok')
}

// profile.vue comments
{
  const p = 'src/pages/profile.vue'
  let t = fs.readFileSync(p, 'utf8')
  t = t.replace(/\/\/ \?\?/g, '// ignore')
  fs.writeFileSync(p, t, 'utf8')
  console.log('profile ok')
}
