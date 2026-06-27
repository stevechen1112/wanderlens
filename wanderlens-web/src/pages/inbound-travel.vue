<template>
  <div class="inbound-page">
    <!-- Hero -->
    <section class="hero">
      <img :src="heroImage" alt="Taiwan travel photography" class="hero-bg" />
      <div class="hero-overlay" />
      <div class="hero-content wl-container-wide">
        <div class="lang-hints">
          <span v-for="hint in langHints" :key="hint.lang" class="lang-pill">{{ hint.text }}</span>
        </div>
        <h1 class="hero-title">{{ heroTitle }}</h1>
        <p class="hero-sub">{{ heroSubtitle }}</p>
        <div class="hero-actions">
          <NuxtLink to="/booking" class="wl-btn-primary !px-8 !py-4 !text-base">
            {{ ctaLabel }} →
          </NuxtLink>
          <NuxtLink to="/photographer-list" class="hero-ghost">
            {{ browseLabel }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 特色 -->
    <section class="features wl-container-wide py-16">
      <div class="text-center mb-12">
        <span class="wl-badge wl-badge-primary mb-2">Why WanderLens</span>
        <h2 class="section-title">{{ featuresTitle }}</h2>
      </div>
      <div class="features-grid">
        <div v-for="(f, i) in features" :key="i" class="feature-card wl-card p-6 wl-animate-in" :class="`wl-stagger-${Math.min(i + 1, 4)}`">
          <span class="feature-icon">{{ f.icon }}</span>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 熱門景點 -->
    <section class="spots-section py-16">
      <div class="wl-container-wide">
        <div class="section-header">
          <div>
            <span class="wl-badge wl-badge-primary mb-2">{{ spotsBadge }}</span>
            <h2 class="section-title">{{ spotsTitle }}</h2>
          </div>
        </div>
        <div class="spots-grid">
          <div v-for="(spot, idx) in spots" :key="spot.id" class="spot-card wl-animate-in" :class="`wl-stagger-${Math.min(idx + 1, 4)}`">
            <div class="spot-image">
              <img :src="getLocationPhoto(spot.name)" :alt="spot.name" loading="lazy" />
            </div>
            <div class="spot-info">
              <h4>{{ spot.name }}</h4>
              <p>{{ spot.area }}</p>
              <NuxtLink :to="`/location/${encodeURIComponent(spot.name)}`" class="spot-link">{{ exploreLabel }} →</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部 CTA -->
    <section class="cta-section">
      <div class="wl-container-wide">
        <div class="cta-card">
          <div class="cta-content">
            <h2>{{ ctaSectionTitle }}</h2>
            <p>{{ ctaSectionDesc }}</p>
            <div class="cta-lang-grid">
              <div v-for="hint in bookingHints" :key="hint.lang" class="cta-lang-item">
                <span class="cta-lang-flag">{{ hint.flag }}</span>
                <div>
                  <div class="cta-lang-label">{{ hint.lang }}</div>
                  <div class="cta-lang-text">{{ hint.text }}</div>
                </div>
              </div>
            </div>
            <NuxtLink to="/booking" class="cta-btn">{{ ctaLabel }} →</NuxtLink>
          </div>
          <div class="cta-image">
            <img :src="getCategoryPhoto(13, 0, 600)" alt="Travel shoot" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useContentApi } from '~/api/content-api'
import { buildServiceSchema, useJsonLd } from '~/composables/useJsonLd'
import { getCategoryPhoto, getHeroPhoto, getLocationPhoto } from '~/utils/photos'

const { locale } = useI18n()
const contentApi = useContentApi()

const spots = ref<any[]>([])
const heroImage = getHeroPhoto(1, 1600)

const copy = computed(() => {
  const lang = locale.value
  if (lang === 'jp') return {
    heroTitle: '台湾旅行フォトサービス',
    heroSubtitle: '地元プロカメラマンと、旅の思い出を最高の一枚に',
    ctaLabel: '今すぐ予約',
    browseLabel: 'カメラマンを探す',
    featuresTitle: 'WanderLensが選ばれる理由',
    spotsBadge: 'インスピレーション',
    spotsTitle: '人気の撮影スポット',
    exploreLabel: '詳しく見る',
    ctaSectionTitle: '3ステップで簡単予約',
    ctaSectionDesc: '撮影タイプを選び、日時を決めて、プロを選ぶだけ',
  }
  if (lang === 'ka') return {
    heroTitle: '대만 여행 스냅 촬영',
    heroSubtitle: '현지 전문 포토그래퍼와 함께하는 특별한 순간',
    ctaLabel: '지금 예약하기',
    browseLabel: '포토그래퍼 찾기',
    featuresTitle: 'WanderLens를 선택하는 이유',
    spotsBadge: '영감',
    spotsTitle: '인기 촬영 명소',
    exploreLabel: '자세히 보기',
    ctaSectionTitle: '3단계로 간편 예약',
    ctaSectionDesc: '촬영 유형 선택, 일정 설정, 포토그래퍼 선택',
  }
  if (lang === 'en') return {
    heroTitle: 'Taiwan Travel Photography',
    heroSubtitle: 'Book local pros for stunning travel memories across Taiwan',
    ctaLabel: 'Book Now',
    browseLabel: 'Browse Photographers',
    featuresTitle: 'Why Choose WanderLens',
    spotsBadge: 'Inspiration',
    spotsTitle: 'Popular Photo Spots',
    exploreLabel: 'Explore',
    ctaSectionTitle: 'Book in 3 Easy Steps',
    ctaSectionDesc: 'Pick a shoot type, set your schedule, choose your pro',
  }
  return {
    heroTitle: '來台旅拍 · 專業跟拍',
    heroSubtitle: '為入境旅客打造的一鍵預約攝影體驗，中文／英文／日韓語友善',
    ctaLabel: '立即預約',
    browseLabel: '瀏覽攝影師',
    featuresTitle: '為什麼選擇 WanderLens',
    spotsBadge: '靈感',
    spotsTitle: '熱門旅拍景點',
    exploreLabel: '探索',
    ctaSectionTitle: '三步驟完成預約',
    ctaSectionDesc: '選類型、定時間、挑攝影師，48 小時內交付精修照片',
  }
})

const heroTitle = computed(() => copy.value.heroTitle)
const heroSubtitle = computed(() => copy.value.heroSubtitle)
const ctaLabel = computed(() => copy.value.ctaLabel)
const browseLabel = computed(() => copy.value.browseLabel)
const featuresTitle = computed(() => copy.value.featuresTitle)
const spotsBadge = computed(() => copy.value.spotsBadge)
const spotsTitle = computed(() => copy.value.spotsTitle)
const exploreLabel = computed(() => copy.value.exploreLabel)
const ctaSectionTitle = computed(() => copy.value.ctaSectionTitle)
const ctaSectionDesc = computed(() => copy.value.ctaSectionDesc)

const langHints = [
  { lang: 'EN', text: 'English-friendly booking' },
  { lang: 'JP', text: '日本語対応' },
  { lang: 'KR', text: '한국어 지원' },
]

const bookingHints = [
  { lang: 'English', flag: '🇺🇸', text: 'Book in English — no Chinese required' },
  { lang: '日本語', flag: '🇯🇵', text: '日本語でのやり取りも可能' },
  { lang: '한국어', flag: '🇰🇷', text: '한국어 상담 및 예약 지원' },
]

const features = computed(() => {
  const lang = locale.value
  if (lang === 'en') return [
    { icon: '🌏', title: 'Local Experts', desc: 'Verified photographers who know the best spots' },
    { icon: '⚡', title: 'Fast Delivery', desc: 'Retouched photos within 48 hours' },
    { icon: '💬', title: 'Multilingual', desc: 'English, Japanese & Korean support' },
    { icon: '💳', title: 'Secure Payment', desc: 'Book online with instant confirmation' },
  ]
  if (lang === 'jp') return [
    { icon: '🌏', title: '地元のプロ', desc: '台湾を知り尽くしたカメラマン' },
    { icon: '⚡', title: '48時間納品', desc: 'AIレタッチ付きでスピード交付' },
    { icon: '💬', title: '多言語対応', desc: '日本語でのコミュニケーションOK' },
    { icon: '💳', title: '安心決済', desc: 'オンライン予約・即時確定' },
  ]
  if (lang === 'ka') return [
    { icon: '🌏', title: '현지 전문가', desc: '대만 명소를 아는 검증된 포토그래퍼' },
    { icon: '⚡', title: '48시간 납품', desc: 'AI 보정 포함 빠른 사진 전달' },
    { icon: '💬', title: '다국어 지원', desc: '한국어·영어·일본어 상담' },
    { icon: '💳', title: '안전 결제', desc: '온라인 예약 즉시 확정' },
  ]
  return [
    { icon: '🌏', title: '在地專家', desc: '熟悉熱門景點的嚴選攝影師' },
    { icon: '⚡', title: '48 小時交付', desc: 'AI 精修，快速收到旅拍美照' },
    { icon: '💬', title: '多語系友善', desc: '英／日／韓語溝通無障礙' },
    { icon: '💳', title: '安全付款', desc: '線上預約，選到即確定' },
  ]
})

onMounted(async () => {
  try {
    const res: any = await contentApi.attractions()
    spots.value = (res?.data || []).slice(0, 6)
  } catch { /* silent */ }
  try {
    const config = useRuntimeConfig()
    await fetch(`${config.public.apiBase}/market-signals/record?sourceCountry=${locale.value === 'zh' ? 'TW' : locale.value.toUpperCase()}&signalType=VISIT`)
  } catch { /* silent */ }
})

useHead({
  title: 'Inbound Travel Photography — WanderLens',
  meta: [{ name: 'description', content: 'Book professional travel photography in Taiwan. English, Japanese & Korean friendly.' }],
})

useJsonLd(buildServiceSchema(
  'Inbound Travel Photography Taiwan',
  'Professional on-demand photography for international visitors in Taiwan',
  'https://wanderlens.app/inbound-travel',
))

</script>

<style scoped>
.hero { position: relative; min-height: 75vh; display: flex; align-items: center; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(38,182,157,0.4) 100%); }
.hero-content { position: relative; z-index: 2; padding: 80px 24px; color: white; max-width: 720px; }
.lang-hints { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.lang-pill { background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; border: 1px solid rgba(255,255,255,0.2); }
.hero-title { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; line-height: 1.15; margin-bottom: 16px; }
.hero-sub { font-size: clamp(1rem, 2vw, 1.2rem); opacity: 0.92; margin-bottom: 32px; line-height: 1.6; }
.hero-actions { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
.hero-ghost { color: white; font-weight: 600; opacity: 0.9; text-decoration: underline; text-underline-offset: 4px; }

.section-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; color: var(--wl-text-primary); }
.features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
.feature-card { text-align: center; }
.feature-icon { font-size: 36px; display: block; margin-bottom: 12px; }
.feature-card h3 { font-weight: 700; font-size: 16px; margin-bottom: 8px; }
.feature-card p { font-size: 13px; color: var(--wl-text-secondary); line-height: 1.5; }

.spots-section { background: var(--wl-bg-card); }
.section-header { margin-bottom: 32px; }
.spots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
.spot-card { border-radius: 16px; overflow: hidden; background: var(--wl-bg); box-shadow: 0 2px 12px rgba(0,0,0,0.04); transition: transform 0.3s; }
.spot-card:hover { transform: translateY(-4px); }
.spot-image { aspect-ratio: 4/3; overflow: hidden; }
.spot-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.spot-card:hover .spot-image img { transform: scale(1.05); }
.spot-info { padding: 14px; }
.spot-info h4 { font-weight: 700; font-size: 15px; }
.spot-info p { font-size: 12px; color: var(--wl-text-secondary); margin-top: 2px; }
.spot-link { display: inline-block; margin-top: 8px; font-size: 13px; font-weight: 600; color: #F37A69; }

.cta-section { padding: 60px 0 80px; }
.cta-card { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; background: var(--wl-bg-card); border-radius: 24px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.08); }
.cta-content { padding: 48px; }
.cta-content h2 { font-size: 28px; font-weight: 800; margin-bottom: 12px; }
.cta-content > p { color: var(--wl-text-secondary); margin-bottom: 24px; }
.cta-lang-grid { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
.cta-lang-item { display: flex; gap: 12px; align-items: center; padding: 12px; background: var(--wl-bg); border-radius: 12px; }
.cta-lang-flag { font-size: 24px; }
.cta-lang-label { font-weight: 700; font-size: 13px; }
.cta-lang-text { font-size: 12px; color: var(--wl-text-secondary); }
.cta-btn { display: inline-block; background: linear-gradient(135deg, #F37A69, #D85A49); color: white; padding: 14px 32px; border-radius: 12px; font-weight: 700; transition: transform 0.2s; }
.cta-btn:hover { transform: scale(1.03); }
.cta-image { height: 100%; min-height: 320px; }
.cta-image img { width: 100%; height: 100%; object-fit: cover; }

@media (max-width: 768px) {
  .cta-card { grid-template-columns: 1fr; }
  .cta-image { min-height: 200px; order: -1; }
  .cta-content { padding: 32px 24px; }
}
</style>
