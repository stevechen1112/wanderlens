<template>
  <button
    type="button"
    @click="selectStudio"
    :class="[
      'wl-card text-left border-2 transition-all wl-hover-lift wl-tap-active overflow-hidden w-full',
      isSelected ? 'border-primary shadow-md ring-2 ring-primary/20' : 'border-transparent hover:border-primary/30'
    ]"
  >
    <div class="aspect-[16/10] overflow-hidden relative bg-bg">
      <img
        v-if="coverImage"
        :src="coverImage"
        :alt="studio.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary-light to-primary-light">
        <span class="text-4xl opacity-40">🏢</span>
      </div>
      <div class="absolute bottom-3 left-3 px-3 py-1.5 bg-black/70 text-white rounded-lg text-sm font-bold">
        ${{ studio.hourlyRate || 1200 }}<span class="text-xs font-normal opacity-80">/hr</span>
      </div>
      <div v-if="isSelected" class="absolute inset-0 bg-primary/20 flex items-center justify-center">
        <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-lg">✓</div>
      </div>
    </div>
    <div class="p-4">
      <h3 class="font-bold text-sm">{{ studio.name }}</h3>
      <p class="text-xs text-text-secondary mt-1 flex items-center gap-1">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
        {{ studio.city }}{{ studio.districtName ? ` · ${studio.districtName}` : '' }}
      </p>
      <p v-if="studio.studioType" class="text-xs text-primary mt-2 font-semibold">{{ studio.studioType }}</p>
    </div>
  </button>
</template>

<script setup lang="ts">
import { useBookingStore } from '~/stores/booking'
import { getStudioPhoto } from '~/utils/photos'

const bookingStore = useBookingStore()

const props = defineProps<{
  studio: {
    id: number
    name: string
    city?: string
    districtName?: string
    studioType?: string
    hourlyRate?: number
    environmentImages?: string
  }
  selectable?: boolean
}>()

const emit = defineEmits<{ selected: [studioId: number] }>()

const isSelected = computed(() =>
  props.selectable && bookingStore.data.studioId === props.studio.id
)

const coverImage = computed(() => {
  const first = props.studio.environmentImages?.split(',')[0]?.trim()
  return first || getStudioPhoto(props.studio.id % 4, 600)
})

const selectStudio = () => {
  if (!props.selectable) return
  const rate = props.studio.hourlyRate || 1200
  bookingStore.setData({
    studioId: props.studio.id,
    studioName: props.studio.name,
    studioFee: rate * bookingStore.data.shootingDuration,
  })
  emit('selected', props.studio.id)
}
</script>
