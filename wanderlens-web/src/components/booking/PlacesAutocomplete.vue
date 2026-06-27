<template>
  <div class="relative">
    <label v-if="label" class="text-sm font-bold mb-1.5 block">{{ label }}</label>
    <div class="relative">
      <input
        :value="modelValue"
        type="text"
        :placeholder="placeholder"
        class="wl-input pr-10"
        autocomplete="off"
        @input="onInput"
        @focus="showDropdown = placeResults.length > 0"
        @blur="onBlur"
      />
      <span v-if="loading" class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs">
        ...
      </span>
      <svg v-else class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
      </svg>
    </div>

    <ul
      v-if="showDropdown && placeResults.length"
      class="absolute z-50 w-full wl-surface border border-border rounded-xl mt-1 max-h-56 overflow-auto shadow-lg"
    >
      <li
        v-for="place in placeResults"
        :key="place.place_id"
        class="px-4 py-3 text-sm hover:bg-primary-light cursor-pointer border-b border-border/50 last:border-0 transition-colors"
        @mousedown.prevent="selectPlace(place)"
      >
        <div class="font-semibold text-text-primary">{{ place.name }}</div>
        <div v-if="place.formatted_address" class="text-xs text-text-secondary mt-0.5 truncate">
          {{ place.formatted_address }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useBookingApi, type PlacePrediction } from '~/api/booking-api'

const props = defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  selected: [place: PlacePrediction]
}>()

const bookingApi = useBookingApi()
const { locale } = useI18n()

const placeResults = ref<PlacePrediction[]>([])
const showDropdown = ref(false)
const loading = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const langMap: Record<string, string> = {
  zh: 'zh-TW',
  en: 'en',
  jp: 'ja',
  ka: 'ko',
}

const onInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)

  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    if (value.length < 2) {
      placeResults.value = []
      showDropdown.value = false
      return
    }
    loading.value = true
    try {
      placeResults.value = await bookingApi.autocompletePlaces(value, langMap[locale.value] || 'zh-TW')
      showDropdown.value = placeResults.value.length > 0
    } catch {
      placeResults.value = []
      showDropdown.value = false
    } finally {
      loading.value = false
    }
  }, 400)
}

const selectPlace = (place: PlacePrediction) => {
  emit('update:modelValue', place.name)
  emit('selected', place)
  placeResults.value = []
  showDropdown.value = false
}

const onBlur = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 150)
}
</script>
