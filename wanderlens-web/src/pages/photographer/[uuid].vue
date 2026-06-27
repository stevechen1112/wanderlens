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
    <!-- ═══ Airbnb-style 圖片 Gallery ═══ -->
    <section class="gallery-section">
      <div class="gallery-grid">
        <div class="gallery-main">
          <img :src="galleryPhotos[0]" class="gallery-img" loading="eager" />
        </div>
        <div class="gallery-side">
          <img :src="galleryPhotos[1]" class="gallery-img" loading="lazy" />
          <img :src="galleryPhotos[2]" class="gallery-img" loading="lazy" />
        </div>
      </div>
    </section>

    <!-- ═══ 主要內容 ═══ -->
    <div class="wl-container-wide py-8">
      <div class="content-layout">
        <!-- 左側：詳細資訊 -->
        <div class="content-main">
          <!-- 標題區 -->
          <div class="info-header">
            <div>
              <h1 class="info-name">{{ photographer.nickName || photographer.name }}</h1>
              <div class="info-meta">
                <span class="meta-rating">
                  <svg class="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  <strong>{{ photographer.rating || '5.0' }}</strong>
                  <span class="text-text-secondary">· 48 則評價</span>
                </span>
                <span class="meta-dot">·</span>
                <span class="meta-location">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  {{ photographer.city }}{{ photographer.districtName ? ' · ' + photographer.districtName : '' }}
                </span>
              </div>
            </div>
            <div class="info-avatar">
              <div class="avatar-circle wl-gradient-primary">
                {{ (photographer.nickName || photographer.name)?.charAt(0) || '?' }}
              </div>
            </div>
          </div>

          <div class="wl-divider" />

          <!-- 服務項目 tags -->
          <div class="info-section">
            <h3 class="section-label">服務項目</h3>
            <div class="service-tags">
              <span v-for="sid in serviceIds" :key="sid" class="service-tag">{{ getServiceName(sid) }}</span>
            </div>
          </div>

          <div class="wl-divider" />

          <!-- 關於 -->
          <div class="info-section">
            <h3 class="section-label">關於 {{ photographer.nickName || photographer.name }}</h3>
            <p class="info-intro">{{ photographer.intro || '專業攝影師，擅長捕捉自然光影與真實情感。致力於為每位客戶創造獨一無二的影像回憶。' }}</p>
          </div>

          <div class="wl-divider" />

          <!-- 作品集 (真實照片網格) -->
          <div class="info-section">
            <h3 class="section-label">作品集</h3>
            <div class="works-grid">
              <div v-for="(photo, idx) in worksPhotos" :key="idx" class="work-item">
                <img :src="photo" class="work-img" loading="lazy" />
              </div>
            </div>
          </div>

          <div class="wl-divider" />

          <!-- 可服務地區 -->
          <div class="info-section">
            <h3 class="section-label">可服務地區</h3>
            <p class="text-text-regular">{{ photographer.city }}{{ photographer.districtName ? '、' + photographer.districtName : '' }} 及周邊區域</p>
          </div>
        </div>

        <!-- 右側：預約卡片 (Airbnb sticky) -->
        <div class="content-side">
          <div class="booking-card">
            <div class="booking-price">
              <span class="price-amount">${{ photographer.unitPrice || 800 }}</span>
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

    <!-- ═══ 底部固定預約列 (行動版) ═══ -->
    <div class="mobile-book-bar">
      <div>
        <span class="mobile-price">${{ photographer.unitPrice || 800 }}</span>
        <span class="mobile-unit">/ 小時</span>
      </div>
      <button @click="bookNow" class="wl-btn-primary">預約</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookingStore } from '~/stores/booking'
import { getCategoryPhoto } from '~/utils/photos'

const route = useRoute()
const config = useRuntimeConfig()
const bookingStore = useBookingStore()

const photographer = ref<any>(null)
const works = ref<any[]>([])
const loading = ref(true)
const loadError = ref(false)

const bookingDate = ref(new Date().toISOString().split('T')[0])
const bookingStart = ref('10:00')
const bookingEnd = ref('12:00')

// Pexels 真實照片
const galleryPhotos = [
  'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=600',
]
const worksPhotos = [
  getCategoryPhoto(1, 0, 400), getCategoryPhoto(2, 0, 400), getCategoryPhoto(7, 0, 400),
  getCategoryPhoto(3, 0, 400), getCategoryPhoto(6, 0, 400), getCategoryPhoto(13, 0, 400),
]

const hours = computed(() => {
  const result: string[] = []
  for (let h = 8; h <= 22; h++) result.push(`${String(h).padStart(2, '0')}:00`)
  return result
})

const serviceIds = computed(() => {
  if (!photographer.value?.serviceItem) return []
  return photographer.value.serviceItem.split(',').map(Number).filter(Boolean)
})

const serviceNames = ['個人寫真','情侶寫真','全家福','寶寶寫真','孕婦寫真','藝術寫真','婚禮紀錄','生日派對','運動攝影','寵物攝影','畢業照','商業攝影','旅拍','美食攝影']
const getServiceName = (id: number) => serviceNames[(id - 1) % serviceNames.length] || `服務#${id}`

const bookNow = () => {
  if (photographer.value) {
    bookingStore.setData({
      photographerId: photographer.value.id,
      photographerUuid: photographer.value.providerUuid || route.params.uuid as string,
      photographerName: photographer.value.nickName || photographer.value.name || '',
      unitPrice: photographer.value.unitPrice || 800,
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
    const [infoResp, worksResp] = await Promise.all([
      fetch(`${config.public.apiBase}/providers/info/${uuid}`).then(r => r.json()),
      fetch(`${config.public.apiBase}/providers/info/${uuid}/works`).then(r => r.json()),
    ])
    photographer.value = infoResp.data ?? null
    works.value = worksResp.data || []
  } catch {
    loadError.value = true
    photographer.value = null
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ═══ Gallery ═══ */
.gallery-section { padding: 0 24px; max-width: 1280px; margin: 24px auto 0; }
.gallery-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 8px; height: 420px; border-radius: 16px; overflow: hidden; }
.gallery-main { background: linear-gradient(135deg, #f0f0f0, #e0e0e0); }
.gallery-side { display: grid; grid-template-rows: 1fr 1fr; gap: 8px; }
.gallery-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f5f5f5, #e8e8e8); }
.gallery-placeholder.small { background: linear-gradient(135deg, #eee, #ddd); }

/* ═══ 內容佈局 ═══ */
.content-layout { display: grid; grid-template-columns: 1fr 380px; gap: 64px; align-items: start; }
.content-main { min-width: 0; }
.content-side { position: sticky; top: 88px; }

/* ═══ 標題 ═══ */
.info-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.info-name { font-size: 26px; font-weight: 800; color: #1a1a2e; margin-bottom: 8px; }
.info-meta { display: flex; align-items: center; gap: 8px; font-size: 14px; flex-wrap: wrap; }
.meta-rating { display: flex; align-items: center; gap: 4px; }
.meta-dot { color: #ccc; }
.meta-location { display: flex; align-items: center; gap: 4px; color: #666; }
.info-avatar { flex-shrink: 0; }
.avatar-circle { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; font-weight: 800; }

/* ═══ 區段 ═══ */
.info-section { padding: 8px 0; }
.section-label { font-size: 18px; font-weight: 700; color: #1a1a2e; margin-bottom: 12px; }
.info-intro { font-size: 15px; line-height: 1.7; color: #555; }

/* ═══ 服務標籤 ═══ */
.service-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.service-tag { padding: 6px 14px; background: #FFF0EE; color: #F37A69; border-radius: 20px; font-size: 13px; font-weight: 600; }

/* ═══ 作品集 ═══ */
.works-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.work-item { aspect-ratio: 1; border-radius: 12px; overflow: hidden; background: linear-gradient(135deg, #f0f0f0, #e0e0e0); }
.work-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 32px; opacity: 0.3; }
.works-empty { text-align: center; padding: 40px; color: #999; }

/* ═══ 預約卡片 ═══ */
.booking-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 1px solid #eee; }
.booking-price { margin-bottom: 20px; }
.price-amount { font-size: 24px; font-weight: 800; color: #1a1a2e; }
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

/* ═══ 行動版固定列 ═══ */
.mobile-book-bar { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #eee; padding: 12px 20px; z-index: 50; align-items: center; justify-content: space-between; }
.mobile-price { font-size: 18px; font-weight: 800; }
.mobile-unit { font-size: 13px; color: #888; }

@media (max-width: 1024px) {
  .content-layout { grid-template-columns: 1fr; gap: 32px; }
  .content-side { position: static; display: none; }
  .mobile-book-bar { display: flex; }
  .gallery-grid { height: 280px; }
}
@media (max-width: 640px) {
  .gallery-grid { height: 200px; grid-template-columns: 1fr; }
  .gallery-side { display: none; }
  .works-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>