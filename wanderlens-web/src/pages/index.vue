<template>
  <div class="home-page">
    <!-- Hero -->
    <section class="hero-section" ref="heroSection">
      <div class="hero-bg">
        <img :src="heroImage" class="hero-img" @error="onPhotoError" :alt="$t('home.heroImageAlt')" />
        <div class="hero-overlay" />
        <div class="hero-content">
          <p class="hero-eyebrow">{{ $t('home.heroEyebrow') }}</p>
          <h1 class="hero-title" v-html="$t('home.heroTitleHtml')" />
          <p class="hero-subtitle">{{ $t('home.heroSubtitle') }}</p>
          <HeroSearch />
          <div class="hero-stats">
            <div class="stat-item"><span class="stat-num">500+</span><span class="stat-label">{{ $t('home.statPhotographers') }}</span></div>
            <div class="stat-divider" />
            <div class="stat-item"><span class="stat-num">50+</span><span class="stat-label">{{ $t('home.statStudios') }}</span></div>
            <div class="stat-divider" />
            <div class="stat-item"><span class="stat-num">4.9</span><span class="stat-label">{{ $t('home.statRating') }}</span></div>
          </div>
        </div>
      </div>
      <div ref="heroSentinel" class="hero-sentinel" aria-hidden="true" />
    </section>


    <!-- 作品牆 -->
    <section class="portfolio-section">
      <div class="wl-container-wide">
        <div class="section-intro">
          <div>
            <span class="wl-badge wl-badge-primary mb-2">{{ $t('home.portfolioBadge') }}</span>
            <h2 class="section-title-sm">{{ $t('home.portfolioTitle') }}</h2>
          </div>
          <NuxtLink to="/photographer-list" class="see-all">{{ $t('home.portfolioSeeAll') }}</NuxtLink>
        </div>
        <div class="portfolio-mosaic">
          <button
            v-for="(tile, idx) in portfolioTiles"
            :key="idx"
            class="mosaic-tile"
            :class="'mosaic-' + tile.span"
            @click="goCategory(tile.categoryId)"
          >
            <img :src="tile.url" :alt="tile.label" loading="lazy" @error="onPhotoError" />
            <div class="mosaic-overlay" />
            <span v-if="tile.label" class="mosaic-label">{{ tile.label }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 全部拍攝類型 -->
    <section class="category-section">
      <div class="wl-container-wide">
        <div class="section-intro">
          <div>
            <span class="wl-badge wl-badge-primary mb-2">{{ $t('home.categoriesBadge') }}</span>
            <h2 class="section-title-sm">{{ $t('home.categoriesTitle') }} <span class="type-count">{{ categories.length }}</span></h2>
          </div>
          <NuxtLink to="/booking" class="see-all">{{ $t('home.categoriesBook') }}</NuxtLink>
        </div>
        <div v-if="categories.length" class="category-grid">
          <button
            v-for="(cat, idx) in categories"
            :key="cat.id"
            class="category-card wl-animate-in"
            :class="'wl-stagger-' + Math.min((idx % 6) + 1, 6)"
            @click="selectCategory(cat)"
          >
            <div class="cat-image">
              <img :src="cat.photo" :alt="cat.name" loading="lazy" @error="onPhotoError" />
              <div class="cat-image-overlay" />
              <span class="cat-price">${{ getCategoryBasePrice(cat.id).toLocaleString() }}<span class="cat-price-unit">{{ $t('home.pricePerHour') }}</span></span>
              <span class="cat-label">{{ cat.name }}</span>
            </div>
          </button>
        </div>
        <div v-else class="category-skeleton">
          <div v-for="n in 13" :key="n" class="wl-skeleton cat-skeleton" />
        </div>
      </div>
    </section>

    <!-- 精選攝影師 -->
    <section class="provider-section">
      <div class="wl-container-wide">
        <div class="section-header">
          <div>
            <span class="wl-badge wl-badge-primary mb-2">{{ $t('home.pools.featuredBadge') }}</span>
            <h2 class="section-title">{{ $t('home.pools.featuredTitle') }}</h2>
          </div>
          <div class="pool-tabs">
            <button
              v-for="pool in pools"
              :key="pool.key"
              class="pool-tab"
              :class="{ active: activePool === pool.key }"
              @click="switchPool(pool.key)"
            >
              <component :is="pool.icon" class="pool-icon" />
              <span>{{ pool.label }}</span>
            </button>
          </div>
        </div>

        <WlLoading v-if="loading" :message="$t('home.loading')" />

        <template v-else>
          <!-- 攝影師 -->
          <div v-if="activePool === 'photographer'">
            <div v-if="displayPhotographers.length" class="provider-grid">
              <div
                v-for="(p, idx) in displayPhotographers"
                :key="p.providerId"
                class="provider-card wl-animate-in"
                :class="'wl-stagger-' + Math.min(idx + 1, 4)"
              >
                <NuxtLink :to="p.providerId >= 9000 ? '/photographer-list' : `/photographer/${p.providerUuid || p.providerId}`" class="card-link">
                  <div class="card-image">
                    <img :src="p._photo || getCardPhoto(idx)" :alt="p.nickName" class="card-img" loading="lazy" @error="onPhotoError" />
                    <button class="card-fav" @click.prevent="toggleFav(p.providerId)">
                      <svg class="w-5 h-5" :class="favs.has(p.providerId) ? 'text-danger fill-danger' : 'text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    </button>
                  </div>
                  <div class="card-info">
                    <div class="card-rating">
                      <svg class="w-3.5 h-3.5 text-warning" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      <span>{{ p.rating || '5.0' }}</span>
                    </div>
                    <h3 class="card-name">{{ p.nickName }}</h3>
                    <p class="card-city">{{ p.city || $t('home.pools.defaultCity') }}</p>
                  </div>
                </NuxtLink>
              </div>
            </div>
            <WlEmpty v-else :title="$t('home.pools.emptyPhotographer')" :description="$t('home.pools.emptyPhotographerDesc')">
              <NuxtLink to="/photographer-list" class="wl-btn-primary mt-4 inline-block">{{ $t('home.pools.browsePhotographers') }}</NuxtLink>
            </WlEmpty>
          </div>

          <!-- 攝影棚 -->
          <div v-else-if="activePool === 'studio'">
            <div v-if="studios.length" class="provider-grid">
              <div v-for="(s, idx) in studios" :key="s.id" class="provider-card wl-animate-in" :class="'wl-stagger-' + Math.min(idx + 1, 4)">
                <NuxtLink to="/photographer-list?pool=studio" class="card-link">
                  <div class="card-image">
                    <img :src="getStudioCardPhoto(s, idx)" :alt="s.name" class="card-img" loading="lazy" @error="onPhotoError" />
                    <div class="card-price">${{ s.hourlyRate || 1200 }}<span class="price-unit">{{ $t('home.perHourShort') }}</span></div>
                  </div>
                  <div class="card-info">
                    <span class="text-xs text-text-secondary">{{ s.studioType || $t('home.pools.studioTypeDefault') }}</span>
                    <h3 class="card-name">{{ s.name }}</h3>
                    <p class="card-city">{{ s.city || $t('home.pools.defaultCity') }}</p>
                  </div>
                </NuxtLink>
              </div>
            </div>
            <WlEmpty v-else :title="$t('home.pools.emptyStudio')">
              <NuxtLink to="/photographer-list?pool=studio" class="wl-btn-secondary mt-4 inline-block">{{ $t('home.pools.explore') }}</NuxtLink>
            </WlEmpty>
          </div>

          <!-- 造型師 -->
          <div v-else-if="activePool === 'stylist'">
            <div v-if="stylists.length" class="provider-grid">
              <div v-for="(s, idx) in stylists" :key="s.providerId" class="provider-card wl-animate-in" :class="'wl-stagger-' + Math.min(idx + 1, 4)">
                <NuxtLink :to="`/photographer/${s.providerUuid || s.providerId}`" class="card-link">
                  <div class="card-image">
                    <img :src="s.avatar || s.bannerImg || getStylistCardPhoto(idx)" :alt="s.nickName" class="card-img" loading="lazy" @error="onPhotoError" />
                    <div class="card-price">${{ s.unitPrice || 600 }}<span class="price-unit">{{ $t('home.pools.perSession') }}</span></div>
                  </div>
                  <div class="card-info">
                    <div class="card-rating">
                      <svg class="w-3.5 h-3.5 text-warning" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      <span>{{ s.rating || '4.9' }}</span>
                    </div>
                    <h3 class="card-name">{{ s.nickName }}</h3>
                    <p class="card-city">{{ s.city || $t('home.pools.defaultCity') }}</p>
                  </div>
                </NuxtLink>
              </div>
            </div>
            <WlEmpty v-else :title="$t('home.pools.emptyStylist')">
              <NuxtLink to="/photographer-list?pool=stylist" class="wl-btn-secondary mt-4 inline-block">{{ $t('home.pools.explore') }}</NuxtLink>
            </WlEmpty>
          </div>
        </template>

        <div class="text-center mt-10">
          <NuxtLink to="/photographer-list" class="see-all">{{ $t('home.pools.seeAll', { pool: poolLabel }) }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- 預約流程 -->
    <section class="how-section">
      <div class="wl-container-wide">
        <div class="section-header text-center">
          <span class="wl-badge wl-badge-primary mb-2">{{ $t('home.howBadge') }}</span>
          <h2 class="section-title">{{ $t('home.howTitle') }}</h2>
        </div>
        <div class="steps-grid">
          <div v-for="(step, i) in steps" :key="i" class="step-card wl-animate-in" :class="'wl-stagger-' + (i + 1)">
            <div class="step-num">{{ i + 1 }}</div>
            <div class="step-img-wrap"><img :src="step.photo" :alt="step.title" loading="lazy" @error="onPhotoError" /></div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 熱門景點 -->
    <section class="spots-section">
      <div class="wl-container-wide">
        <div class="section-header">
          <div><span class="wl-badge wl-badge-primary mb-2">{{ $t('home.spotsBadge') }}</span><h2 class="section-title">{{ $t('home.spotsTitle') }}</h2></div>
          <NuxtLink to="/photographer-list" class="see-all">{{ $t('home.spotsSeeAll') }}</NuxtLink>
        </div>
        <div class="spots-grid">
          <div v-for="(spot, idx) in displaySpots" :key="spot.id" class="spot-card wl-animate-in" :class="'wl-stagger-' + Math.min(idx + 1, 6)">
            <div class="spot-image">
              <img :src="getLocationPhoto(spot.name)" :alt="spot.name" loading="lazy" @error="onPhotoError" />
              <div class="spot-overlay" />
            </div>
            <div class="spot-info">
              <h4>{{ spot.name }}</h4>
              <p>{{ spot.area }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 招募 -->
    <section class="recruit-section">
      <div class="wl-container-wide">
        <div class="recruit-card">
          <img :src="recruitImage" alt="" class="recruit-bg" loading="lazy" @error="onPhotoError" />
          <div class="recruit-overlay" />
          <div class="recruit-content">
            <h2>{{ $t('home.recruitTitle') }}</h2>
            <p>{{ $t('home.recruitDesc') }}</p>
            <div class="recruit-actions">
              <NuxtLink to="/providers/apply" class="recruit-btn-primary">{{ $t('home.joinUs') }}</NuxtLink>
              <NuxtLink to="/faq" class="recruit-btn-ghost">{{ $t('home.recruitLearnMore') }}</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import { useBookingApi } from '~/api/booking-api'
import { useContentApi } from '~/api/content-api'
import { useSearchStore } from '~/stores/search'
import { useHomeHeader } from '~/composables/useHomeHeader'
import {
  getCategoryPhoto, getHeroPhoto, getLocationPhoto,
  getStudioPhoto, getStylistPhoto, getStepPhoto, getRecruitPhoto,
  getPortfolioWall, fallbackSpots, fallbackCategories, getCategoryBasePrice, onPhotoError,
  mapCategoriesWithPhotos, getDemoProviders,
} from '~/utils/photos'

const IconCamera = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-4 h-4' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 13a3 3 0 11-6 0 3 3 0 016 0z' }),
])
const IconBuilding = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-4 h-4' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }),
])
const IconSparkle = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-4 h-4' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' }),
])

const { t } = useI18n()

const bookingApi = useBookingApi()
const contentApi = useContentApi()
const searchStore = useSearchStore()
const { heroPassed } = useHomeHeader()

const FEATURED_COUNT = 8

const categories = ref(mapCategoriesWithPhotos(fallbackCategories))
const loading = ref(true)
const activePool = ref('photographer')
const photographers = ref<any[]>([])
const studios = ref<any[]>([])
const stylists = ref<any[]>([])
const attractions = ref<any[]>([])
const favs = ref(new Set<number>())

const portfolioTiles = getPortfolioWall(800)
const demoProviders = getDemoProviders()

const heroImage = getHeroPhoto(0, 1600)
const recruitImage = getRecruitPhoto(1200)
const heroSentinel = ref<HTMLElement>()

const pools = computed(() => [
  { key: 'photographer', label: t('home.pools.photographer'), icon: IconCamera },
  { key: 'studio', label: t('home.pools.studio'), icon: IconBuilding },
  { key: 'stylist', label: t('home.pools.stylist'), icon: IconSparkle },
])

const steps = computed(() => [
  { title: t('home.howStep1Title'), desc: t('home.howStep1Desc'), photo: getStepPhoto(0) },
  { title: t('home.howStep2Title'), desc: t('home.howStep2Desc'), photo: getStepPhoto(1) },
  { title: t('home.howStep3Title'), desc: t('home.howStep3Desc'), photo: getStepPhoto(2) },
])

const isValidLabel = (s?: string) => !!s && !/\?{2,}/.test(s) && s.trim().length > 0

const displayPhotographers = computed(() => {
  const valid = photographers.value.filter((p) => isValidLabel(p.nickName))
  if (valid.length >= 4) return valid.slice(0, FEATURED_COUNT)
  return demoProviders.slice(0, FEATURED_COUNT)
})

const displaySpots = computed(() => {
  const valid = attractions.value.filter((a) => isValidLabel(a.name))
  return valid.length >= 4 ? valid.slice(0, 12) : fallbackSpots
})

const poolLabel = computed(() => {
  if (activePool.value === 'studio') return t('home.pools.studio')
  if (activePool.value === 'stylist') return t('home.pools.stylist')
  return t('home.pools.photographer')
})

const getCardPhoto = (idx: number) => getCategoryPhoto((idx % 13) + 1, 0, 600)
const getStudioCardPhoto = (s: any, idx: number) => s.environmentImages?.split(',')[0]?.trim() || getStudioPhoto(idx, 600)
const getStylistCardPhoto = (idx: number) => getStylistPhoto(idx, 600)

const searchPayload = () => ({
  serviceTypeId: 1,
  shootingDate: new Date().toISOString().split('T')[0],
  timeStart: '10:00',
  timeEnd: '12:00',
})

const switchPool = async (pool: string) => {
  activePool.value = pool
  if (pool === 'studio' && studios.value.length === 0) {
    try {
      const res: any = await bookingApi.searchMultiPool({ ...searchPayload(), configurationId: 2, needStylist: false })
      studios.value = (res?.data?.studios || []).filter((s: any) => isValidLabel(s.name)).slice(0, FEATURED_COUNT)
    } catch { /* silent */ }
  }
  if (pool === 'stylist' && stylists.value.length === 0) {
    try {
      const res: any = await bookingApi.searchMultiPool({ ...searchPayload(), configurationId: 4, needStylist: true })
      stylists.value = (res?.data?.stylists || []).filter((s: any) => isValidLabel(s.nickName)).slice(0, FEATURED_COUNT)
    } catch { /* silent */ }
  }
}

const goCategory = (categoryId?: number) => {
  if (!categoryId) return
  searchStore.setCondition({ serviceTypeId: categoryId })
  navigateTo('/search')
}

const selectCategory = (cat: any) => goCategory(cat.id)

const toggleFav = (id: number) => {
  if (favs.value.has(id)) favs.value.delete(id)
  else favs.value.add(id)
  favs.value = new Set(favs.value)
}

onMounted(async () => {
  heroPassed.value = false

  if (heroSentinel.value) {
    const observer = new IntersectionObserver(
      ([entry]) => { heroPassed.value = !entry.isIntersecting },
      { rootMargin: '-64px 0px 0px 0px', threshold: 0 },
    )
    observer.observe(heroSentinel.value)
    onUnmounted(() => {
      observer.disconnect()
      heroPassed.value = false
    })
  }

  try {
    const [typesRes, providersRes, attrRes]: any[] = await Promise.all([
      bookingApi.getServiceTypes(),
      bookingApi.searchProviders(searchPayload()),
      contentApi.attractions(),
    ])
    const types = typesRes.data?.length ? typesRes.data : fallbackCategories
    categories.value = mapCategoriesWithPhotos(types)
    photographers.value = (providersRes.data || [])
      .filter((p: any) => isValidLabel(p.nickName))
      .slice(0, FEATURED_COUNT)
    if (photographers.value.length < 4) photographers.value = []
    attractions.value = (attrRes.data || []).filter((a: any) => isValidLabel(a.name))
  } catch {
    categories.value = mapCategoriesWithPhotos(fallbackCategories)
    photographers.value = []
  }
  finally { loading.value = false }
})
</script>

<style scoped>
.hero-section { position: relative; height: 92vh; min-height: 600px; max-height: 860px; }
.hero-bg { position: absolute; inset: 0; overflow: hidden; }
.hero-img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  animation: heroKenBurns 20s ease-in-out infinite alternate;
}
@keyframes heroKenBurns {
  from { transform: scale(1); }
  to { transform: scale(1.06); }
}
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.65) 100%);
}
.hero-content {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100%; text-align: center; padding: 0 24px;
}
.hero-eyebrow {
  font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(255,255,255,0.75); margin-bottom: 12px;
}
.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 900; color: white;
  line-height: 1.12; letter-spacing: -0.02em; margin-bottom: 12px;
  text-shadow: 0 2px 24px rgba(0,0,0,0.35);
}
.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.15rem); color: rgba(255,255,255,0.88);
  max-width: 480px; margin-bottom: 28px;
}
.hero-stats { display: flex; align-items: center; gap: 24px; margin-top: 36px; }
.stat-item { display: flex; flex-direction: column; align-items: center; }
.stat-num { font-size: 22px; font-weight: 800; color: white; }
.stat-label { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 2px; }
.stat-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.25); }
.hero-sentinel { position: absolute; bottom: 0; left: 0; right: 0; height: 1px; pointer-events: none; }

.portfolio-section { padding: 40px 0 24px; background: var(--wl-bg-card); }
.portfolio-mosaic {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 140px;
  gap: 10px;
}
.mosaic-tile {
  position: relative; border: none; padding: 0; border-radius: 14px;
  overflow: hidden; cursor: pointer; background: var(--wl-border);
  transition: transform 0.25s, box-shadow 0.25s;
}
.mosaic-tile:hover { transform: scale(1.02); box-shadow: 0 8px 24px rgba(0,0,0,0.15); z-index: 1; }
.mosaic-tile img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.mosaic-tile:hover img { transform: scale(1.06); }
.mosaic-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%); }
.mosaic-label { position: absolute; bottom: 10px; left: 12px; color: white; font-size: 13px; font-weight: 700; text-shadow: 0 1px 4px rgba(0,0,0,0.4); }
.mosaic-normal { grid-column: span 1; grid-row: span 1; }
.mosaic-wide { grid-column: span 2; grid-row: span 1; }
.mosaic-tall { grid-column: span 1; grid-row: span 2; }
.mosaic-large { grid-column: span 2; grid-row: span 2; }

.category-section { padding: 32px 0 48px; background: var(--wl-bg); }
.section-intro { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.section-title-sm { font-size: clamp(1.25rem, 2.5vw, 1.5rem); font-weight: 800; color: var(--wl-text-primary); }
.type-count { font-size: 0.85em; color: var(--wl-primary); font-weight: 700; margin-left: 4px; }
.see-all { font-size: 14px; font-weight: 600; color: var(--wl-primary); text-decoration: none; }
.see-all:hover { text-decoration: underline; }

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}
.category-card {
  border: none; background: transparent; cursor: pointer; padding: 0;
  transition: transform 0.25s;
}
.category-card:hover { transform: translateY(-3px); }
.cat-image {
  position: relative; aspect-ratio: 4/5; border-radius: 14px; overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}
.cat-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.category-card:hover .cat-image img { transform: scale(1.06); }
.cat-image-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.6) 100%);
}
.cat-price {
  position: absolute; top: 10px; right: 10px;
  background: rgba(243, 122, 105, 0.92); color: white;
  padding: 4px 8px; border-radius: 8px;
  font-size: 12px; font-weight: 700; line-height: 1.2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.cat-price-unit { font-size: 10px; font-weight: 500; opacity: 0.9; }
.cat-label {
  position: absolute; bottom: 12px; left: 12px; right: 12px;
  color: white; font-size: 14px; font-weight: 700; text-align: left;
  text-shadow: 0 1px 4px rgba(0,0,0,0.4);
}
.category-skeleton { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
.cat-skeleton { aspect-ratio: 4/5; border-radius: 14px; }

.provider-section { padding: 48px 0 64px; }
.section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
.section-header.text-center { justify-content: center; }
.section-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; color: var(--wl-text-primary); }

.pool-tabs { display: flex; gap: 4px; background: var(--wl-bg); border-radius: 12px; padding: 4px; }
.pool-tab {
  display: flex; align-items: center; gap: 6px; padding: 8px 16px;
  border-radius: 10px; border: none; background: transparent; cursor: pointer;
  font-size: 14px; font-weight: 600; color: var(--wl-text-regular); transition: all 0.2s;
}
.pool-tab.active { background: var(--wl-bg-card); color: #F37A69; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.pool-icon { flex-shrink: 0; }

.provider-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  max-width: 1100px;
}
.provider-card { border-radius: 16px; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; background: var(--wl-bg-card); }
.provider-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
.card-link { text-decoration: none; color: inherit; display: block; }
.card-image { position: relative; aspect-ratio: 4/3; overflow: hidden; background: var(--wl-border); }
.card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.provider-card:hover .card-img { transform: scale(1.05); }
.card-fav { position: absolute; top: 12px; right: 12px; z-index: 2; background: none; border: none; cursor: pointer; padding: 4px; }
.card-info { padding: 12px 4px; }
.card-rating { display: flex; align-items: center; gap: 4px; font-size: 13px; margin-bottom: 4px; }
.card-name { font-weight: 700; font-size: 15px; color: var(--wl-text-primary); }
.card-city { font-size: 13px; color: var(--wl-text-secondary); margin-top: 2px; }

.how-section { padding: 72px 0; background: var(--wl-bg); }
.steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 36px; max-width: 960px; margin-left: auto; margin-right: auto; }
.step-card {
  background: var(--wl-bg-card); border-radius: 20px; padding: 0 0 24px; text-align: center;
  box-shadow: 0 2px 16px rgba(0,0,0,0.04); position: relative; overflow: hidden;
}
.step-num {
  position: absolute; top: 12px; left: 12px; width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, #F37A69, #D85A49); color: white;
  display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; z-index: 2;
}
.step-img-wrap { width: 100%; height: 160px; overflow: hidden; }
.step-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.step-card h3 { font-weight: 700; font-size: 16px; margin: 16px 0 8px; color: var(--wl-text-primary); }
.step-card p { font-size: 13px; color: var(--wl-text-secondary); line-height: 1.5; padding: 0 16px; }

.spots-section { padding: 64px 0; background: var(--wl-bg-card); }
.spots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}
.spot-card {
  border-radius: 14px; overflow: hidden; background: var(--wl-bg-card);
  box-shadow: 0 2px 12px rgba(0,0,0,0.06); transition: transform 0.3s;
  position: relative;
}
.spot-card:hover { transform: translateY(-4px); }
.spot-image { aspect-ratio: 4/3; overflow: hidden; position: relative; }
.spot-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.spot-card:hover .spot-image img { transform: scale(1.05); }
.spot-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.3) 100%); pointer-events: none; }
.spot-info { padding: 12px; }
.spot-info h4 { font-weight: 700; font-size: 14px; color: var(--wl-text-primary); }
.spot-info p { font-size: 12px; color: var(--wl-text-secondary); margin-top: 2px; }

.recruit-section { padding: 48px 0 72px; }
.recruit-card {
  position: relative; border-radius: 24px; overflow: hidden; padding: 48px;
  color: white; min-height: 240px;
}
.recruit-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.recruit-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(243,122,105,0.92), rgba(216,90,73,0.88)); }
.recruit-content { position: relative; z-index: 2; max-width: 520px; }
.recruit-content h2 { font-size: clamp(1.5rem, 3vw, 1.75rem); font-weight: 800; margin-bottom: 12px; }
.recruit-content p { font-size: 15px; opacity: 0.95; margin-bottom: 24px; line-height: 1.6; }
.recruit-actions { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.recruit-btn-primary { background: var(--wl-bg-card); color: var(--wl-primary); padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 15px; text-decoration: none; transition: transform 0.2s; display: inline-block; }
.recruit-btn-primary:hover { transform: scale(1.04); }
.recruit-btn-ghost { color: white; font-weight: 600; text-decoration: none; opacity: 0.9; }
.recruit-btn-ghost:hover { opacity: 1; }

@media (max-width: 768px) {
  .hero-section { height: auto; min-height: 100svh; max-height: none; }
  .hero-content { padding: 80px 16px 48px; justify-content: flex-end; min-height: 100svh; }
  .hero-stats { gap: 16px; margin-top: 28px; }
  .stat-num { font-size: 18px; }
  .portfolio-mosaic { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 120px; }
  .mosaic-wide, .mosaic-large { grid-column: span 2; }
  .mosaic-tall, .mosaic-large { grid-row: span 2; }
  .category-grid { grid-template-columns: repeat(2, 1fr); }
  .steps-grid { grid-template-columns: 1fr; }
  .spots-grid { grid-template-columns: repeat(2, 1fr); }
  .recruit-card { padding: 32px 24px; }
}

</style>
