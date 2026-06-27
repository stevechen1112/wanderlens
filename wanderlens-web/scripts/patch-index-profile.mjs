import fs from 'fs'

// index.vue: hero i18n + demo provider link
let index = fs.readFileSync('src/pages/index.vue', 'utf8')
index = index.replace(
  `<p class="hero-eyebrow">WanderLens · 在地隨選攝影</p>
          <h1 class="hero-title">發現你的<br/>完美拍攝體驗</h1>
          <p class="hero-subtitle">嚴選在地攝影師、攝影棚與造型師，一鍵預約</p>
          <HeroSearch />
          <div class="hero-stats">
            <div class="stat-item"><span class="stat-num">500+</span><span class="stat-label">專業攝影師</span></div>
            <div class="stat-divider" />
            <div class="stat-item"><span class="stat-num">50+</span><span class="stat-label">合作攝影棚</span></div>
            <div class="stat-divider" />
            <div class="stat-item"><span class="stat-num">4.9</span><span class="stat-label">平均評分</span></div>
          </div>`,
  `<p class="hero-eyebrow">{{ $t('home.heroEyebrow') }}</p>
          <h1 class="hero-title" v-html="$t('home.heroTitleHtml')" />
          <p class="hero-subtitle">{{ $t('home.heroSubtitle') }}</p>
          <HeroSearch />
          <div class="hero-stats">
            <div class="stat-item"><span class="stat-num">500+</span><span class="stat-label">{{ $t('home.statPhotographers') }}</span></div>
            <div class="stat-divider" />
            <div class="stat-item"><span class="stat-num">50+</span><span class="stat-label">{{ $t('home.statStudios') }}</span></div>
            <div class="stat-divider" />
            <div class="stat-item"><span class="stat-num">4.9</span><span class="stat-label">{{ $t('home.statRating') }}</span></div>
          </div>`,
)
index = index.replace(
  '<NuxtLink :to="`/photographer/${p.providerUuid || p.providerId}`" class="card-link">',
  `<NuxtLink :to="p.providerId >= 9000 ? '/photographer-list' : \`/photographer/\${p.providerUuid || p.providerId}\`" class="card-link">`,
)
fs.writeFileSync('src/pages/index.vue', index, 'utf8')
console.log('index patched')

// profile.vue shortcuts
let profile = fs.readFileSync('src/pages/profile.vue', 'utf8')
const icons = ['📋', '🖼️', '💬', '🚪']
let n = 0
profile = profile.replace(/<div class="text-3xl mb-2">[^<]*<\/div>/g, (m) => {
  if (n < icons.length) return `<div class="text-3xl mb-2">${icons[n++]}</div>`
  return m
})
fs.writeFileSync('src/pages/profile.vue', profile, 'utf8')
console.log('profile patched', n)
