import fs from 'fs'

const zh = {
  brand: '\u54c1\u724c',
  social: '\u793e\u7fa4\u9023\u7d50',
  service: '\u670d\u52d9',
  serviceTypes: '\u670d\u52d9\u985e\u578b',
  portrait: '\u500b\u4eba\u5beb\u771f',
  wedding: '\u5a5a\u79ae\u7d00\u9304',
  family: '\u5168\u5bb6\u798f',
  commercial: '\u5546\u696d\u651d\u5f71',
  contact: '\u806f\u7d61',
  address: '\u53f0\u5317\u5e02\u4fe1\u7fa9\u5340\u4fe1\u7fa9\u8def\u4e94\u6bb5 7 \u865f',
  bottom: '\u5e95\u90e8',
  privacy: '\u96b1\u79c1\u6b0a\u653f\u7b56',
  terms: '\u670d\u52d9\u689d\u6b3e',
  searchSummary: '\u641c\u5c0b\u689d\u4ef6\u6458\u8981',
  loading: '\u8f09\u5165\u9aa8\u67b6',
  empty: '\u7a7a\u72c0\u614b',
  results: '\u7d50\u679c\u5217\u8868\uff08\u771f\u5be6\u8cc7\u6599\uff09',
  serviceTypeDefault: '\u78ba\u4fdd serviceTypeId \u6709\u9810\u8a2d\u503c',
  poolSwitch: '\u4e09\u4f9b\u7d66\u6c60\u5207\u63db',
  photoGrid: '\u651d\u5f71\u5e2b\u7db2\u683c\uff08\u771f\u5be6\u8cc7\u6599\uff09',
}

// AppFooter
fs.writeFileSync(
  'src/components/common/AppFooter.vue',
  `<template>
  <footer class="bg-gray-900 text-white pt-12 pb-6 mt-16">
    <div class="wl-container-wide">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- ${zh.brand} -->
        <div class="md:col-span-1">
          <h3 class="text-xl font-extrabold wl-gradient-text mb-3">WanderLens</h3>
          <p class="text-sm text-gray-400 leading-relaxed">{{ $t('footer.tagline') }}</p>
          <!-- ${zh.social} -->
          <div class="flex gap-3 mt-4">
            <a href="#" class="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all" aria-label="Instagram">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all" aria-label="Facebook">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all" aria-label="LINE">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.365 9.863a.631.631 0 010 1.261H17.61v1.125h1.755a.63.63 0 110 1.259H16.98a.63.63 0 01-.63-.63V10.5a.63.63 0 01.63-.63h2.385v-.007zm-3.855 3.645a.63.63 0 01-.63.63.63.63 0 01-.63-.63V10.5a.63.63 0 011.26 0v3.008zm-2.52 0a.63.63 0 01-.63.63.63.63 0 01-.63-.63v-1.748l-1.41 1.89a.63.63 0 01-1.05 0l-1.41-1.89v1.748a.63.63 0 01-.63.63.63.63 0 01-.63-.63V10.5a.63.63 0 011.155-.39L9.6 12.6l1.845-2.49a.63.63 0 011.155.39v3.008h-.01zM24 12c0 5.19-5.37 9.39-12 9.39-.93 0-1.85-.09-2.73-.27l-3.15 1.89a.6.6 0 01-.9-.54l.09-2.85C2.1 17.85 0 15.12 0 12 0 6.81 5.37 2.61 12 2.61S24 6.81 24 12z"/></svg>
            </a>
          </div>
        </div>

        <!-- ${zh.service} -->
        <div>
          <h4 class="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">{{ $t('footer.service') }}</h4>
          <ul class="space-y-2.5">
            <li><NuxtLink to="/photographer-list" class="text-sm text-gray-400 hover:text-white transition-colors">{{ $t('nav.photographers') }}</NuxtLink></li>
            <li><NuxtLink to="/faq" class="text-sm text-gray-400 hover:text-white transition-colors">{{ $t('nav.faq') }}</NuxtLink></li>
            <li><NuxtLink to="/privacy-policy" class="text-sm text-gray-400 hover:text-white transition-colors">{{ $t('nav.privacy') }}</NuxtLink></li>
          </ul>
        </div>

        <!-- ${zh.serviceTypes} -->
        <div>
          <h4 class="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">{{ $t('home.serviceTypes') }}</h4>
          <ul class="space-y-2.5">
            <li><NuxtLink to="/booking" class="text-sm text-gray-400 hover:text-white transition-colors">${zh.portrait}</NuxtLink></li>
            <li><NuxtLink to="/booking" class="text-sm text-gray-400 hover:text-white transition-colors">${zh.wedding}</NuxtLink></li>
            <li><NuxtLink to="/booking" class="text-sm text-gray-400 hover:text-white transition-colors">${zh.family}</NuxtLink></li>
            <li><NuxtLink to="/booking" class="text-sm text-gray-400 hover:text-white transition-colors">${zh.commercial}</NuxtLink></li>
          </ul>
        </div>

        <!-- ${zh.contact} -->
        <div>
          <h4 class="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">{{ $t('footer.contact') }}</h4>
          <ul class="space-y-2.5">
            <li class="flex items-center gap-2 text-sm text-gray-400">
              <span>\u2709\ufe0f</span> support@wanderlens.app
            </li>
            <li class="flex items-center gap-2 text-sm text-gray-400">
              <span>\ud83d\udcde</span> 02-1234-5678
            </li>
            <li class="flex items-center gap-2 text-sm text-gray-400">
              <span>\ud83d\udccd</span> ${zh.address}
            </li>
          </ul>
        </div>
      </div>

      <!-- ${zh.bottom} -->
      <div class="pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-sm text-gray-500">\u00a9 2026 WanderLens. All rights reserved.</p>
        <div class="flex gap-4 text-sm text-gray-500">
          <NuxtLink to="/privacy-policy" class="hover:text-gray-300 transition-colors">${zh.privacy}</NuxtLink>
          <span>|</span>
          <NuxtLink to="/faq" class="hover:text-gray-300 transition-colors">${zh.terms}</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>
`,
  'utf8'
)

// search.vue comment fixes
{
  let t = fs.readFileSync('src/pages/search.vue', 'utf8')
  const lines = t.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<!--') && lines[i].includes('-->')) {
      if (i === 2) lines[i] = `    <!-- ${zh.searchSummary} -->`
      else if (lines[i].includes('載入') || lines[i].match(/<!--.*\?/)) {
        if (lines[i + 1]?.includes('v-if="loading"')) lines[i] = `    <!-- ${zh.loading} -->`
        else if (lines[i + 1]?.includes('v-else-if="results.length === 0"')) lines[i] = `    <!-- ${zh.empty} -->`
        else if (lines[i + 1]?.includes('v-else')) lines[i] = `    <!-- ${zh.results} -->`
      }
    }
    if (lines[i].includes('wl-empty-icon')) {
      lines[i] = '      <div class="wl-empty-icon">\ud83d\udd0d</div>'
    }
    if (lines[i].trim().startsWith('//') && lines[i].includes('serviceTypeId')) {
      lines[i] = `    // ${zh.serviceTypeDefault}`
    }
  }
  fs.writeFileSync('src/pages/search.vue', lines.join('\n'), 'utf8')
}

// photographer-list last garbled comment
{
  let t = fs.readFileSync('src/pages/photographer-list.vue', 'utf8')
  t = t.replace(/<!--[^>]*攝影師網[^>]*-->/, `<!-- ${zh.photoGrid} -->`)
  t = t.replace(/<!--[^>]*\?[^>]*攝影師[^>]*-->/, `<!-- ${zh.photoGrid} -->`)
  t = t.replace(/<!--[^>]*\?{2,}[^>]*-->/g, (m, offset, s) => {
    const after = s.slice(offset, offset + 200)
    if (after.includes('pool-tabs')) return `<!-- ${zh.poolSwitch} -->`
    if (after.includes('v-if="loading"')) return `<!-- ${zh.loading} -->`
    if (after.includes('v-else-if="!providers.length"')) return `<!-- ${zh.empty} -->`
    if (after.includes('provider-card')) return `<!-- ${zh.photoGrid} -->`
    return m
  })
  fs.writeFileSync('src/pages/photographer-list.vue', t, 'utf8')
}

console.log('utf8 restore ok')
