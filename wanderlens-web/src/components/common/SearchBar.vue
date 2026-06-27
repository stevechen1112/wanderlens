<template>
  <div class="wl-surface rounded-xl shadow-sm border border-border p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
      <!-- ?��?類�? -->
      <div>
        <label class="text-xs text-text-secondary mb-1 block">{{ $t('search.serviceType') }}</label>
        <select
          v-model="condition.serviceTypeId"
          class="w-full text-sm border border-border rounded-lg px-3 py-2"
        >
          <option :value="null">{{ $t('search.selectType') }}</option>
          <option v-for="st in serviceTypes" :key="st.id" :value="st.id">
            {{ st.name }}
          </option>
        </select>
      </div>

      <!-- ?��? -->
      <div>
        <label class="text-xs text-text-secondary mb-1 block">{{ $t('search.date') }}</label>
        <input
          v-model="condition.shootingDate"
          type="date"
          class="w-full text-sm border border-border rounded-lg px-3 py-2"
        />
      </div>

      <!-- ?��? -->
      <div>
        <label class="text-xs text-text-secondary mb-1 block">{{ $t('search.location') }}</label>
        <input
          v-model="locationQuery"
          @input="onLocationInput"
          type="text"
          :placeholder="$t('search.enterLocation')"
          class="w-full text-sm border border-border rounded-lg px-3 py-2"
        />
        <ul v-if="placeResults.length" class="absolute z-50 wl-surface border border-border rounded-lg mt-1 max-h-48 overflow-auto">
          <li
            v-for="place in placeResults"
            :key="place.place_id"
            @click="selectPlace(place)"
            class="px-3 py-2 text-sm hover:bg-bg cursor-pointer"
          >
            {{ place.name }}
          </li>
        </ul>
      </div>

      <!-- ?�段 -->
      <div>
        <label class="text-xs text-text-secondary mb-1 block">{{ $t('search.time') }}</label>
        <div class="flex gap-1">
          <select v-model="condition.timeStart" class="flex-1 text-sm border border-border rounded-lg px-2 py-2">
            <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
          </select>
          <span class="self-center text-text-secondary">~</span>
          <select v-model="condition.timeEnd" class="flex-1 text-sm border border-border rounded-lg px-2 py-2">
            <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
          </select>
        </div>
      </div>

      <!-- ?�數 -->
      <div>
        <label class="text-xs text-text-secondary mb-1 block">{{ $t('search.duration') }}</label>
        <select v-model="condition.shootingDuration" class="w-full text-sm border border-border rounded-lg px-3 py-2">
          <option v-for="d in durations" :key="d" :value="d">{{ d }} {{ $t('search.hours') }}</option>
        </select>
      </div>

      <!-- ?��??��? -->
      <div class="flex items-end">
        <button @click="search" class="wl-btn-primary w-full">
          {{ $t('search.searchBtn') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '~/stores/search'
import { useBookingApi } from '~/api/booking-api'
import { useContentApi } from '~/api/content-api'
import { fallbackCategories } from '~/utils/photos'

const { t } = useI18n()
const searchStore = useSearchStore()
const bookingApi = useBookingApi()
const contentApi = useContentApi()

const condition = ref(searchStore.condition)

const serviceTypes = ref<any[]>([...fallbackCategories])
const locationQuery = ref('')
const placeResults = ref<any[]>([])

const hours = computed(() => {
  const result: string[] = []
  for (let h = 8; h <= 22; h++) {
    result.push(`${String(h).padStart(2, '0')}:00`)
  }
  return result
})

const durations = computed(() => {
  const result: number[] = []
  for (let d = 1; d <= 8; d += 0.5) {
    result.push(d)
  }
  return result
})

let debounceTimer: any = null

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
  }, 700)
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
  searchStore.setCondition(condition.value)
  emit('searched')
  navigateTo('/search')
}

const emit = defineEmits<{ searched: [] }>()

const loadingTypes = ref(false)

const reloadTypes = async () => {
  loadingTypes.value = true
  try {
    const res: any = await bookingApi.getServiceTypes()
    serviceTypes.value = res.data?.length ? res.data : [...fallbackCategories]
  } catch {
    serviceTypes.value = [...fallbackCategories]
  } finally {
    loadingTypes.value = false
  }
}

onMounted(reloadTypes)
</script>