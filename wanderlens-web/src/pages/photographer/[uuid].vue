<template>
  <WlStateView
    v-if="loading"
    status="loading"
    :loading-message="$t('common.loading')"
    empty-title=" "
  />
  <WlStateView
    v-else-if="loadError"
    status="error"
    :error-title="$t('photographer.loadFailed')"
    empty-title=" "
    @retry="loadData"
  />
  <WlStateView
    v-else-if="!photographer"
    status="empty"
    :empty-title="$t('photographer.notFound')"
    :empty-description="$t('photographer.notFoundDesc')"
  />

  <div v-else class="photographer-page">
    <!-- Hero：橫幅 + 疊加資訊 -->
    <section class="hero-section" :style="heroStyle">
      <div class="hero-overlay" />
      <div class="hero-inner wl-container-wide">
        <div class="hero-profile">
          <div class="hero-avatar-wrap">
            <img v-if="photographer.avatar" :src="photographer.avatar" class="hero-avatar" :alt="displayName" />
            <div v-else class="hero-avatar hero-avatar-fallback wl-gradient-primary">
              {{ displayName?.charAt(0) || '?' }}
            </div>
          </div>
          <div class="hero-text">
            <h1 class="hero-name">{{ displayName }}</h1>
            <div class="hero-meta">
              <span class="meta-rating">
                <svg class="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <strong>{{ ratingDisplay }}</strong>
                <span v-if="ratingCount > 0">· {{ ratingCount }} 則評價</span>
              </span>
              <span v-if="locationLabel" class="meta-dot">·</span>
              <span v-if="locationLabel" class="meta-location">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {{ locationLabel }}
              </span>
              <span v-if="careerLabel" class="meta-dot">·</span>
              <span v-if="careerLabel">{{ careerLabel }}</span>
              <span v-if="experienceLabel" class="meta-dot">·</span>
              <span v-if="experienceLabel">經歷 {{ experienceLabel }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 作品 Gallery（有圖時顯示） -->
    <section v-if="galleryPhotos.length > 1" class="gallery-section">
      <div class="gallery-grid" :class="{ 'gallery-single': galleryPhotos.length === 1 }">
        <div class="gallery-main">
          <img :src="galleryPhotos[0]" class="gallery-img" loading="eager" :alt="displayName" />
        </div>
        <div v-if="galleryPhotos.length > 1" class="gallery-side">
          <img v-if="galleryPhotos[1]" :src="galleryPhotos[1]" class="gallery-img" loading="lazy" :alt="displayName" />
          <img v-if="galleryPhotos[2]" :src="galleryPhotos[2]" class="gallery-img" loading="lazy" :alt="displayName" />
        </div>
      </div>
    </section>

    <div class="wl-container-wide py-8">
      <div class="content-layout">
        <div class="content-main">
          <div v-if="serviceTypes.length" class="info-section">
            <h3 class="section-label">服務項目</h3>
            <div class="service-tags">
              <span v-for="st in serviceTypes" :key="st.id" class="service-tag">{{ st.name }}</span>
            </div>
          </div>

          <div v-if="serviceTypes.length" class="wl-divider" />

          <div class="info-section">
            <h3 class="section-label">關於 {{ displayName }}</h3>
            <p class="info-intro" :class="{ collapsed: introCollapsed && introLong }">{{ photographer.intro || '尚無自我介紹' }}</p>
            <button v-if="introLong" class="intro-toggle" @click="introCollapsed = !introCollapsed">
              {{ introCollapsed ? '展開更多' : '收合' }}
            </button>
          </div>

          <template v-if="twFeatures.length">
            <div class="wl-divider" />
            <div class="info-section">
              <h3 class="section-label">攝影特色</h3>
              <div class="feature-cards">
                <div v-for="f in twFeatures" :key="f.id" class="feature-card">
                  <span class="feature-type">{{ featureTypeLabel(f.featureType) }}</span>
                  <p>{{ f.featureContent }}</p>
                </div>
              </div>
            </div>
          </template>

          <div class="wl-divider" />

          <div class="info-section">
            <h3 class="section-label">作品集</h3>
            <div v-if="works.length" class="works-grid">
              <button
                v-for="work in works"
                :key="work.id"
                type="button"
                class="work-item"
                @click="openWork(work.imageUrl)"
              >
                <img :src="work.imageUrl" class="work-img" loading="lazy" :alt="displayName" />
              </button>
            </div>
            <p v-else class="works-empty">尚無作品展示</p>
          </div>

          <template v-if="ratings.length">
            <div class="wl-divider" />
            <div class="info-section">
              <h3 class="section-label">客戶評價</h3>
              <div class="ratings-grid">
                <article v-for="r in ratings" :key="r.id" class="rating-card">
                  <div class="rating-head">
                    <strong>{{ r.author || '匿名客戶' }}</strong>
                    <span class="rating-stars">{{ '★'.repeat(r.stars || 0) }}</span>
                  </div>
                  <p class="rating-comment">{{ r.comments }}</p>
                </article>
              </div>
            </div>
          </template>

          <div class="wl-divider" />

          <div class="info-section">
            <h3 class="section-label">可服務地區</h3>
            <p v-if="serviceAreaNames.length" class="area-text">{{ serviceAreaNames.join('、') }}</p>
            <p v-else class="area-text text-text-secondary">
              {{ photographer.city }}{{ photographer.districtName ? '、' + photographer.districtName : '' }}
            </p>
          </div>
        </div>

        <div class="content-side">
          <div class="booking-card">
            <div class="booking-price">
              <span class="price-amount">${{ unitPriceDisplay }}</span>
              <span class="price-unit">/ 小時</span>
            </div>
            <div class="booking-form">
              <div class="form-row">
                <div class="form-field">
                  <label>日期</label>
                  <input v-model="bookingDate" type="date" class="booking-input" />
                </div>
              </div>
              <div class="form-row two-col">
                <div class="form-field">
                  <label>開始</label>
                  <select v-model="bookingStart" class="booking-input">
                    <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                  </select>
                </div>
                <div class="form-field">
                  <label>結束</label>
                  <select v-model="bookingEnd" class="booking-input">
                    <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                  </select>
                </div>
              </div>
            </div>
            <button @click="bookNow" class="booking-btn wl-gradient-primary">
              預約此攝影師
            </button>
            <div class="booking-note">
              <div class="note-item"><span>⚡</span> 48 小時交付</div>
              <div class="note-item"><span>🔒</span> 安全付款</div>
              <div class="note-item"><span>💬</span> 站內訊息聯繫</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mobile-book-bar">
      <div>
        <span class="mobile-price">${{ unitPriceDisplay }}</span>
        <span class="mobile-unit">/ 小時</span>
      </div>
      <button @click="bookNow" class="wl-btn-primary">預約</button>
    </div>

    <div v-if="lightboxUrl" class="lightbox" @click="lightboxUrl = ''">
      <img :src="lightboxUrl" alt="" @click.stop />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookingStore } from '~/stores/booking'
import { useProviderApi } from '~/api/provider-api'

const route = useRoute()
const bookingStore = useBookingStore()
const { getPublicProfile, getRatings } = useProviderApi()

const profile = ref<any>(null)
const ratings = ref<any[]>([])
const loading = ref(true)
const loadError = ref(false)
const introCollapsed = ref(true)
const lightboxUrl = ref('')

const bookingDate = ref(new Date().toISOString().split('T')[0])
const bookingStart = ref('10:00')
const bookingEnd = ref('12:00')

const photographer = computed(() => profile.value?.provider ?? null)
const works = computed(() => profile.value?.works ?? [])
const serviceTypes = computed(() => profile.value?.serviceTypes ?? [])
const serviceAreaNames = computed(() => profile.value?.serviceAreaNames ?? [])
const twFeatures = computed(() =>
  (profile.value?.features ?? []).filter((f: any) => f.language === 'tw' || !f.language),
)

const displayName = computed(() => photographer.value?.nickName || photographer.value?.name || '')
const careerLabel = computed(() => photographer.value?.career || '')
const experienceLabel = computed(() => {
  const exp = photographer.value?.experience
  if (exp == null || exp === '') return ''
  return `${exp} 年`
})
const unitPriceDisplay = computed(() => {
  const p = photographer.value?.unitPrice
  return p != null && p > 0 ? p : 800
})
const ratingDisplay = computed(() => {
  const count = ratingCount.value
  const avg = profile.value?.ratingSummary?.averageRating
  if (avg != null && Number(avg) > 0) return Number(avg).toFixed(1)
  const legacy = photographer.value?.rating
  if (legacy != null && Number(legacy) > 0 && count > 0) return Number(legacy).toFixed(1)
  return count > 0 ? '0.0' : '—'
})
const ratingCount = computed(() => profile.value?.ratingSummary?.totalCount ?? ratings.value.length ?? 0)
const locationLabel = computed(() => {
  const p = photographer.value
  if (!p) return ''
  const parts = [p.city, p.districtName].filter(Boolean)
  return parts.join(' · ')
})

const introLong = computed(() => (photographer.value?.intro || '').length > 180)

const galleryPhotos = computed(() => {
  const urls: string[] = []
  for (const w of works.value) {
    if (w.imageUrl && !urls.includes(w.imageUrl)) urls.push(w.imageUrl)
    if (urls.length >= 3) break
  }
  return urls
})

const heroStyle = computed(() => {
  const img = photographer.value?.bannerImg || galleryPhotos.value[0]
  if (img) {
    return { backgroundImage: `url(${img})` }
  }
  return {}
})

const featureTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    style: '風格',
    service: '服務',
    equipment: '器材',
  }
  return map[type] || type
}

const hours = computed(() => {
  const result: string[] = []
  for (let h = 8; h <= 22; h++) result.push(`${String(h).padStart(2, '0')}:00`)
  return result
})

const openWork = (url: string) => {
  lightboxUrl.value = url
}

const bookNow = () => {
  if (photographer.value) {
    bookingStore.setData({
      photographerId: photographer.value.id,
      photographerUuid: photographer.value.providerUuid || route.params.uuid as string,
      photographerName: displayName.value,
      unitPrice: unitPriceDisplay.value,
      shootingDate: bookingDate.value,
      shootingTime: `${bookingStart.value}-${bookingEnd.value}`,
    })
    bookingStore.setStep(5)
    navigateTo('/booking')
  }
}

onMounted(loadData)

async function loadData() {
  loading.value = true
  loadError.value = false
  try {
    const uuid = route.params.uuid as string
    const resp = await getPublicProfile(uuid)
    profile.value = resp?.data ?? null
    if (!profile.value?.provider) {
      profile.value = null
      return
    }
    const pid = profile.value.provider.id
    if (pid) {
      try {
        const ratingResp = await getRatings(pid, 1, 6)
        ratings.value = ratingResp?.data ?? []
      } catch {
        ratings.value = []
      }
    }
  } catch {
    loadError.value = true
    profile.value = null
  } finally {
    loading.value = false
  }
}

useHead({
  title: computed(() => (displayName.value ? `${displayName.value} — WanderLens` : '攝影師介紹')),
})
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 280px;
  background: linear-gradient(135deg, #1a1a2e 0%, #3d2c4a 45%, #F37A69 100%);
  background-size: cover;
  background-position: center;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.15) 100%);
}
.hero-inner {
  position: relative;
  z-index: 1;
  padding: 48px 24px 32px;
}
.hero-profile {
  display: flex;
  align-items: flex-end;
  gap: 20px;
}
.hero-avatar-wrap { flex-shrink: 0; }
.hero-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255,255,255,0.9);
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}
.hero-avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36px;
  font-weight: 800;
}
.hero-name {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255,255,255,0.92);
}
.hero-meta .meta-rating { display: flex; align-items: center; gap: 4px; }
.hero-meta .meta-location { display: flex; align-items: center; gap: 4px; }
.meta-dot { opacity: 0.6; }

.gallery-section { padding: 24px 24px 0; max-width: 1280px; margin: 0 auto; }
.gallery-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 8px; height: 360px; border-radius: 16px; overflow: hidden; }
.gallery-grid.gallery-single { grid-template-columns: 1fr; }
.gallery-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gallery-side { display: grid; grid-template-rows: 1fr 1fr; gap: 8px; }

.content-layout { display: grid; grid-template-columns: 1fr 380px; gap: 64px; align-items: start; }
.content-main { min-width: 0; }

.info-section { padding: 8px 0; }
.section-label { font-size: 18px; font-weight: 700; color: #1a1a2e; margin-bottom: 12px; }
.info-intro { font-size: 15px; line-height: 1.8; color: #555; white-space: pre-wrap; }
.info-intro.collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.intro-toggle {
  margin-top: 8px;
  background: none;
  border: none;
  color: #F37A69;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
}

.service-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.service-tag {
  padding: 8px 16px;
  background: #FFF0EE;
  color: #F37A69;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 600;
}

.feature-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
.feature-card {
  padding: 16px;
  border-radius: 12px;
  background: #fafafa;
  border: 1px solid #eee;
}
.feature-type {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #F37A69;
  margin-bottom: 6px;
}
.feature-card p { font-size: 14px; color: #555; margin: 0; line-height: 1.5; }

.works-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.work-item {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #f0f0f0;
  border: none;
  padding: 0;
  cursor: zoom-in;
  transition: transform 0.2s;
}
.work-item:hover { transform: scale(1.02); }
.work-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.works-empty { text-align: center; padding: 40px; color: #999; background: #fafafa; border-radius: 12px; }

.ratings-grid { display: grid; gap: 12px; }
.rating-card {
  padding: 16px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.rating-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.rating-stars { color: #f5a623; font-size: 14px; letter-spacing: 1px; }
.rating-comment { font-size: 14px; color: #555; line-height: 1.6; margin: 0; }
.area-text { font-size: 15px; color: #444; }

.booking-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  border: 1px solid #eee;
}
.content-side { position: sticky; top: 88px; }
.booking-price { margin-bottom: 20px; }
.price-amount { font-size: 28px; font-weight: 800; color: #1a1a2e; }
.price-unit { font-size: 14px; color: #888; }
.booking-form { margin-bottom: 16px; }
.form-row { margin-bottom: 12px; }
.form-row.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.form-field label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #888; margin-bottom: 4px; }
.booking-input { width: 100%; padding: 10px 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; outline: none; transition: border-color 0.2s; background: white; }
.booking-input:focus { border-color: #F37A69; }
.booking-btn { width: 100%; padding: 14px; border: none; border-radius: 12px; color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
.booking-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(243,122,105,0.4); }
.booking-note { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0; }
.note-item { font-size: 12px; color: #888; display: flex; align-items: center; gap: 4px; }

.mobile-book-bar { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #eee; padding: 12px 20px; z-index: 50; align-items: center; justify-content: space-between; }
.mobile-price { font-size: 18px; font-weight: 800; }
.mobile-unit { font-size: 13px; color: #888; }

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  cursor: zoom-out;
}
.lightbox img { max-width: 100%; max-height: 90vh; border-radius: 8px; object-fit: contain; }

@media (max-width: 1024px) {
  .content-layout { grid-template-columns: 1fr; gap: 32px; }
  .content-side { position: static; display: none; }
  .mobile-book-bar { display: flex; }
  .gallery-grid { height: 240px; }
  .hero-section { min-height: 220px; }
  .hero-avatar { width: 72px; height: 72px; }
}
@media (max-width: 640px) {
  .gallery-grid { height: 180px; grid-template-columns: 1fr; }
  .gallery-side { display: none; }
  .works-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
