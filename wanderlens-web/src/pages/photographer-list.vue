<template>
  <div class="wl-container-wide py-8">
    <div class="mb-8">
      <span class="wl-badge wl-badge-primary mb-2">探索</span>
      <h1 class="text-3xl font-extrabold text-text-primary">尋找您的完美攝影團隊</h1>
      <p class="text-text-secondary mt-2">攝影師、攝影棚、造型師 — 一站滿足所有拍攝需求</p>
    </div>

    <!-- 三供給池切換 -->
    <div class="pool-bar">
      <div class="pool-tabs">
        <button v-for="pool in pools" :key="pool.key" @click="activePool = pool.key"
          class="pool-tab" :class="{ active: activePool === pool.key }">
          <span class="pool-icon">{{ pool.icon }}</span>
          <div class="pool-text">
            <span class="pool-label">{{ pool.label }}</span>
            <span class="pool-count">{{ poolCounts[pool.key] || 0 }} 位</span>
          </div>
        </button>
      </div>
    </div>

    <div class="filter-bar">
      <div class="filter-scroll">
        <button @click="filterByArea('')" class="filter-pill" :class="{ active: selectedArea === '' }">
          <span>🌏</span> 全部地區
        </button>
        <button v-for="area in areas" :key="area" @click="filterByArea(area)"
          class="filter-pill" :class="{ active: selectedArea === area }">
          {{ area }}
        </button>
      </div>
    </div>

    <!-- 載入骨架 -->
    <div v-if="loading" class="provider-grid">
      <div v-for="n in 8" :key="n" class="skeleton-card">
        <div class="wl-skeleton wl-skeleton-image" />
        <div class="p-4"><div class="wl-skeleton wl-skeleton-text" /><div class="wl-skeleton wl-skeleton-text-sm" /></div>
      </div>
    </div>

    <!-- 空狀態 -->
    <div v-else-if="photographers.length === 0" class="wl-empty">
      <div class="wl-empty-icon">{{ activePool === 'studio' ? '🏢' : activePool === 'stylist' ? '💄' : '📷' }}</div>
      <div class="wl-empty-title">尚無{{ poolLabel }}可預約</div>
      <div class="wl-empty-desc">請嘗試其他地區或服務類型</div>
    </div>

    <!-- 攝影師網格（真實資料） -->
    <div v-else class="provider-grid">
      <div v-for="(p, idx) in photographers" :key="p.providerId"
        class="provider-card wl-animate-in" :class="'wl-stagger-' + Math.min(idx + 1, 4)">
        <NuxtLink :to="`/photographer/${p.providerUuid || p.providerId}`" class="card-link">
          <div class="card-image">
            <img :src="getCardPhoto(idx)" :alt="p.nickName" class="card-img" loading="lazy" />
            <div class="card-price">${{ p.totalFee || p.unitPrice || 800 }}<span class="price-unit">/hr</span></div>
          </div>
          <div class="card-info">
            <div class="card-rating">
              <svg class="w-3.5 h-3.5 text-warning" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <span>{{ p.rating || '5.0' }}</span>
            </div>
            <h3 class="card-name">{{ p.nickName }}</h3>
            <p class="card-city">{{ p.city }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCategoryPhoto } from '~/utils/photos'

const photographers = ref<any[]>([])
const selectedArea = ref('')
const areas = ref<string[]>([])
const loading = ref(true)
const activePool = ref('photographer')

const getCardPhoto = (idx: number) => getCategoryPhoto((idx % 13) + 1, 0, 600)

const pools = [
  { key: 'photographer', label: '攝影師', icon: '📷' },
  { key: 'studio', label: '攝影棚', icon: '🏢' },
  { key: 'stylist', label: '造型師', icon: '💄' },
]
const poolCounts = ref<Record<string, number>>({ photographer: 0, studio: 0, stylist: 0 })
const poolLabel = computed(() => pools.find(p => p.key === activePool.value)?.label || '')

const filterByArea = (area: string) => { selectedArea.value = area; search() }

const search = async () => {
  loading.value = true
  try {
    const config = useRuntimeConfig()
    const resp = await fetch(`${config.public.apiBase}/search/providers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceTypeId: 1,
        shootingDate: new Date().toISOString().split('T')[0],
        timeStart: '10:00', timeEnd: '12:00',
        city: selectedArea.value || undefined,
      })
    })
    const res = await resp.json()
    photographers.value = res.data || []
    poolCounts.value.photographer = photographers.value.length
  } catch { photographers.value = [] }
  finally { loading.value = false }
}

onMounted(async () => {
  await search()
  areas.value = [...new Set(photographers.value.map((p: any) => p.city).filter(Boolean))]
})
</script>

<style scoped>
.pool-bar { margin-bottom: 20px; }
.pool-tabs { display: flex; gap: 8px; }
.pool-tab {
  display: flex; align-items: center; gap: 10px; padding: 12px 20px;
  border-radius: 14px; border: 2px solid var(--wl-border); background: var(--wl-bg-card);
  cursor: pointer; transition: all 0.2s;
}
.pool-tab:hover { border-color: #F37A69; }
.pool-tab.active { border-color: #F37A69; background: var(--wl-primary-light); }
.pool-icon { font-size: 24px; }
.pool-text { display: flex; flex-direction: column; }
.pool-label { font-weight: 700; font-size: 14px; color: var(--wl-text-primary); }
.pool-count { font-size: 12px; color: var(--wl-text-secondary); }

.filter-bar { margin-bottom: 24px; }
.filter-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
.filter-scroll::-webkit-scrollbar { display: none; }
.filter-pill {
  display: flex; align-items: center; gap: 4px; padding: 8px 16px;
  border-radius: 20px; border: 2px solid var(--wl-border); background: var(--wl-bg-card);
  cursor: pointer; font-size: 13px; font-weight: 600; white-space: nowrap;
  transition: all 0.2s; color: var(--wl-text-primary);
}
.filter-pill:hover { border-color: #F37A69; }
.filter-pill.active { background: #F37A69; color: white; border-color: #F37A69; }

.provider-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
.provider-card { border-radius: 16px; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; }
.provider-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
.card-link { text-decoration: none; color: inherit; display: block; }
.card-image { position: relative; aspect-ratio: 4/3; overflow: hidden; background: linear-gradient(135deg, #f0f0f0, #e8e8e8); }
.card-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.card-price { position: absolute; bottom: 12px; left: 12px; background: rgba(0,0,0,0.7); color: white; padding: 4px 10px; border-radius: 8px; font-size: 14px; font-weight: 700; }
.price-unit { font-size: 11px; font-weight: 400; opacity: 0.8; }
.card-info { padding: 12px 4px; }
.card-rating { display: flex; align-items: center; gap: 4px; font-size: 13px; margin-bottom: 4px; }
.card-name { font-weight: 700; font-size: 15px; color: var(--wl-text-primary); }
.card-city { font-size: 13px; color: var(--wl-text-secondary); margin-top: 2px; display: flex; align-items: center; gap: 3px; }

.skeleton-card { border-radius: 16px; overflow: hidden; background: var(--wl-bg-card); }
</style>