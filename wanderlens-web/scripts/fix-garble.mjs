import fs from 'fs'
import path from 'path'

const root = 'src'

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory()) walk(p, out)
    else if (p.endsWith('.vue')) out.push(p)
  }
  return out
}

const patches = {
  'pages/faq.vue': [
    [/<span class="wl-badge wl-badge-primary mb-3">[^<]*<\/span>/, '<span class="wl-badge wl-badge-primary mb-3">幫助中心</span>'],
    [/<p class="text-text-secondary mt-2">[^<]*<\/p>/, '<p class="text-text-secondary mt-2">以下是常見問題，若無法解決您的疑問，歡迎聯繫客服</p>'],
    [/<div class="wl-empty-icon">[^<]*<\/div>\s*<div class="wl-empty-title">[^<]*<\/div>/, '<div class="wl-empty-icon">❓</div>\n      <div class="wl-empty-title">尚無常見問題</div>'],
  ],
  'components/home/ServiceIntro.vue': [
    [/const features = \[[\s\S]*?\]/, `const features = [
  { key: 'value', icon: '💰' },
  { key: 'flexible', icon: '📅' },
  { key: 'efficient', icon: '⚡' },
  { key: 'fast', icon: '🚀' },
]`],
  ],
  'pages/conversations/index.vue': [
    [/<div class="wl-empty-icon">[^<]*<\/div>/, '<div class="wl-empty-icon">💬</div>'],
    [/<span>\{\{ conv\.orderId \? '[^']*' : '[^']*' \}\}<\/span>/, "<span>{{ conv.orderId ? '📋' : '💬' }}</span>"],
  ],
  'pages/register.vue': [
    [/<span>[^<]*<\/span> \{\{ error \}\}/, '<span>⚠️</span> {{ error }}'],
  ],
  'pages/login.vue': [
    [/<span>[^<]*<\/span> \{\{ errorMsg \}\}/, '<span>⚠️</span> {{ errorMsg }}'],
  ],
  'pages/booking/index.vue': [
    [/<div class="wl-empty-icon">[^<]*<\/div>/, '<div class="wl-empty-icon">🔍</div>'],
    [/<span v-if="bookingStore\.currentStep > step">[^<]*<\/span>/, '<span v-if="bookingStore.currentStep > step">✓</span>'],
    [/\{\{ \$t\('common\.next'\) \}\} \?/, "{{ $t('common.next') }} →"],
    [/\{\{ \$t\('booking\.checkout'\) \}\} \?/, "{{ $t('booking.checkout') }} →"],
  ],
  'pages/profile.vue': [
    [/<div class="text-3xl mb-2">[^<]*<\/div>\s*<p class="text-sm text-text-secondary">\{\{ \$t\('profile\.orders'\) \}\}/, '<div class="text-3xl mb-2">📋</div>\n          <p class="text-sm text-text-secondary">{{ $t(\'profile.orders\') }}'],
    [/<div class="text-3xl mb-2">[^<]*<\/div>\s*<p class="text-sm text-text-secondary">\{\{ \$t\('profile\.albums'\) \}\}/, '<div class="text-3xl mb-2">🖼️</div>\n          <p class="text-sm text-text-secondary">{{ $t(\'profile.albums\') }}'],
    [/<div class="text-3xl mb-2">[^<]*<\/div>\s*<p class="text-sm text-text-secondary">\{\{ \$t\('profile\.messages'\) \}\}/, '<div class="text-3xl mb-2">💬</div>\n          <p class="text-sm text-text-secondary">{{ $t(\'profile.messages\') }}'],
    [/<div class="text-3xl mb-2">[^<]*<\/div>\s*<p class="text-sm text-text-secondary">\{\{ \$t\('profile\.favorites'\) \}\}/, '<div class="text-3xl mb-2">❤️</div>\n          <p class="text-sm text-text-secondary">{{ $t(\'profile.favorites\') }}'],
  ],
  'components/booking/CheckoutForm.vue': [
    [/\{\{ \$t\('checkout\.serviceFee'\) \}\}\?/g, "{{ $t('checkout.serviceFee') }}（"],
    [/hr\?/g, 'hr）'],
    [/\{\{ \$t\('checkout\.secondPhotographer'\) \}\}\?/g, "{{ $t('checkout.secondPhotographer') }}（"],
  ],
  'pages/search.vue': [
    [/<div class="wl-empty-icon">[^<]*<\/div>/, '<div class="wl-empty-icon">🔍</div>'],
  ],
  'components/home/PhotographerShowcase.vue': [
    [/<div class="wl-empty-icon">[^<]*<\/div>/, '<div class="wl-empty-icon">📷</div>'],
  ],
  'components/home/RatingCarousel.vue': [
    [/<span class="text-xs text-warning">[^<]*\{\{ rating\.stars \}\}<\/span>/, '<span class="text-xs text-warning">★ {{ rating.stars }}</span>'],
  ],
  'components/common/GoTop.vue': [
    [/aria-label="[^"]*"/, 'aria-label="回到頂部"'],
  ],
  'components/album/AlbumConsentSheet.vue': [
    [/@click="\$emit\('close'\)">[^<]*<\/button>/, '@click="$emit(\'close\')">✕</button>'],
  ],
  'components/common/AppHeader.vue': [
    [/<NuxtLink to="\/photographer-list"[^>]*>[\s\S]*?<\/NuxtLink>/m, '<NuxtLink to="/photographer-list" class="nav-link">{{ $t(\'nav.photographers\') }}</NuxtLink>'],
    [/aria-label="[^"]*"\s*\n\s*@click="mobileOpen/, 'aria-label="開啟選單"\n        @click="mobileOpen'],
    [/<button[^>]*class="[^"]*mobile-menu[^"]*"[^>]*>\s*[^<]*\s*<\/button>/m, '<button type="button" class="mobile-menu-btn md:hidden" @click="mobileOpen = !mobileOpen" aria-label="開啟選單">\n        ☰\n      </button>'],
  ],
  'components/album/PhotoViewer.vue': [
    [/@click="\$emit\('close'\)">\s*[^<]*\s*<\/button>/, '@click="$emit(\'close\')">\n          ✕\n        </button>'],
    [/@click="\$emit\('download', currentPhoto\)">\s*[^<]*\s*<\/button>/, '@click="$emit(\'download\', currentPhoto)">\n          ⬇\n        </button>'],
    [/>\s*←[^<]*<\/button>/, '>\n          ← 上一張\n        </button>'],
    [/>\s*下一張[^<]*<\/button>/, '>\n          下一張 →\n        </button>'],
  ],
}

for (const [rel, rules] of Object.entries(patches)) {
  const p = path.join(root, rel)
  if (!fs.existsSync(p)) { console.warn('skip', rel); continue }
  let t = fs.readFileSync(p, 'utf8')
  const o = t
  for (const [from, to] of rules) t = t.replace(from, to)
  if (t !== o) {
    fs.writeFileSync(p, t, 'utf8')
    console.log('fixed', rel)
  } else console.warn('nochange', rel)
}

console.log('done')
