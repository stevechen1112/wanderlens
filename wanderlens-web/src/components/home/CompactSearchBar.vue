<template>
  <div class="compact-search">
    <select v-model="condition.serviceTypeId" class="compact-field">
      <option :value="null">{{ $t('search.selectType') }}</option>
      <option v-for="st in serviceTypes" :key="st.id" :value="st.id">{{ st.name }}</option>
    </select>
    <input v-model="condition.shootingDate" type="date" class="compact-field compact-date" />
    <input
      v-model="locationQuery"
      type="text"
      :placeholder="$t('search.enterLocation')"
      class="compact-field compact-grow"
    />
    <button type="button" class="compact-btn wl-gradient-primary" @click="search">
      {{ $t('search.searchBtn') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '~/stores/search'
import { useBookingApi } from '~/api/booking-api'
import { fallbackCategories } from '~/utils/photos'

const searchStore = useSearchStore()
const bookingApi = useBookingApi()

const emit = defineEmits<{ searched: [] }>()

const condition = ref({ ...searchStore.condition })
const locationQuery = ref(searchStore.condition.city || '')
const serviceTypes = ref<any[]>([...fallbackCategories])

const search = () => {
  if (locationQuery.value) condition.value.city = locationQuery.value
  searchStore.setCondition(condition.value)
  emit('searched')
  navigateTo('/search')
}

onMounted(async () => {
  try {
    const res: any = await bookingApi.getServiceTypes()
    serviceTypes.value = res.data?.length ? res.data : [...fallbackCategories]
  } catch {
    serviceTypes.value = [...fallbackCategories]
  }
})
</script>

<style scoped>
.compact-search {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 4px 4px 4px 12px;
}

.compact-field {
  border: none;
  background: transparent;
  font-size: 13px;
  color: #333;
  outline: none;
  min-width: 0;
}

.compact-date {
  width: 120px;
  color-scheme: light;
}

.compact-grow {
  flex: 1;
}

.compact-btn {
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.compact-btn:hover {
  opacity: 0.9;
}
</style>
