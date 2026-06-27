<template>
  <div class="hero-search-card">
    <div class="hero-search-fields">
      <div class="field">
        <label class="field-label">{{ $t('search.serviceType') }}</label>
        <select v-model="condition.serviceTypeId" class="field-input">
          <option :value="null">{{ $t('search.selectType') }}</option>
          <option v-for="st in serviceTypes" :key="st.id" :value="st.id">{{ st.name }}</option>
        </select>
      </div>
      <div class="field-divider" aria-hidden="true" />
      <div class="field">
        <label class="field-label">{{ $t('search.date') }}</label>
        <input v-model="condition.shootingDate" type="date" class="field-input" />
      </div>
      <div class="field-divider" aria-hidden="true" />
      <div class="field field-grow">
        <label class="field-label">{{ $t('search.location') }}</label>
        <input
          v-model="locationQuery"
          type="text"
          :placeholder="$t('search.enterLocation')"
          class="field-input"
          @input="onLocationInput"
        />
      </div>
      <button type="button" class="search-btn wl-gradient-primary" @click="search">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <span>{{ $t('search.searchBtn') }}</span>
      </button>
    </div>
    <ul v-if="placeResults.length" class="place-dropdown">
      <li v-for="place in placeResults" :key="place.place_id" @click="selectPlace(place)">
        {{ place.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '~/stores/search'
import { useBookingApi } from '~/api/booking-api'
import { useContentApi } from '~/api/content-api'
import { fallbackCategories } from '~/utils/photos'

const searchStore = useSearchStore()
const bookingApi = useBookingApi()
const contentApi = useContentApi()

const condition = ref({
  ...searchStore.condition,
  shootingDate: searchStore.condition.shootingDate || defaultDate(),
  timeStart: searchStore.condition.timeStart || '10:00',
  timeEnd: searchStore.condition.timeEnd || '12:00',
  shootingDuration: searchStore.condition.shootingDuration || 2,
})

const serviceTypes = ref<any[]>([...fallbackCategories])
const locationQuery = ref(searchStore.condition.city || '')
const placeResults = ref<any[]>([])
function defaultDate() {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().split('T')[0]
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const onLocationInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    if (locationQuery.value.length < 2) {
      placeResults.value = []
      return
    }
    try {
      const res: any = await contentApi.searchPlaces(locationQuery.value)
      placeResults.value = res.data?.results || []
    } catch {
      placeResults.value = []
    }
  }, 500)
}

const selectPlace = (place: any) => {
  locationQuery.value = place.name
  condition.value.city = place.name
  if (place.geometry?.location) {
    condition.value.lat = place.geometry.location.lat
    condition.value.lng = place.geometry.location.lng
  }
  placeResults.value = []
}

const search = () => {
  if (locationQuery.value && !condition.value.city) {
    condition.value.city = locationQuery.value
  }
  searchStore.setCondition(condition.value)
  navigateTo('/search')
}

const reloadTypes = async () => {
  try {
    const res: any = await bookingApi.getServiceTypes()
    serviceTypes.value = res.data?.length ? res.data : [...fallbackCategories]
  } catch {
    serviceTypes.value = [...fallbackCategories]
  }
}

onMounted(reloadTypes)
</script>

<style scoped>
.hero-search-card {
  position: relative;
  width: 100%;
  max-width: 720px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.28);
  padding: 8px;
}

.hero-search-fields {
  display: flex;
  align-items: stretch;
  gap: 0;
}

.field {
  flex: 1;
  min-width: 0;
  padding: 12px 16px;
  text-align: left;
}

.field-grow {
  flex: 1.4;
}

.field-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}

.field-input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  outline: none;
}

.field-input[type="date"] {
  color-scheme: light;
}

.field-divider {
  width: 1px;
  background: #eee;
  align-self: stretch;
  margin: 12px 0;
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 14px;
  padding: 0 28px;
  margin: 6px;
  font-size: 15px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s, transform 0.2s;
}

.search-btn:hover {
  opacity: 0.92;
  transform: scale(1.02);
}

.place-dropdown {
  position: absolute;
  left: 8px;
  right: 8px;
  top: calc(100% + 4px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.place-dropdown li {
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
}

.place-dropdown li:hover {
  background: #fafafa;
}

@media (max-width: 768px) {
  .hero-search-fields {
    flex-direction: column;
  }

  .field-divider {
    width: auto;
    height: 1px;
    margin: 0 16px;
  }

  .search-btn {
    margin: 8px;
    padding: 14px;
    border-radius: 12px;
  }
}
</style>
