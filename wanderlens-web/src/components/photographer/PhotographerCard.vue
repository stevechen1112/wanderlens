<template>
  <NuxtLink
    v-if="!selectable"
    :to="`/photographer/${photographer.providerUuid || photographer.providerId}`"
    class="wl-card cursor-pointer wl-hover-lift wl-tap-active group block"
  >
    <PhotographerCardInner :photographer="photographer" :show-selected="false" />
  </NuxtLink>
  <button
    v-else
    type="button"
    class="wl-card cursor-pointer wl-hover-lift wl-tap-active group block text-left w-full"
    @click="selectProvider"
  >
    <PhotographerCardInner :photographer="photographer" :show-selected="isSelected" />
  </button>
</template>

<script setup lang="ts">
import { useBookingStore } from '~/stores/booking'
import PhotographerCardInner from './PhotographerCardInner.vue'

const bookingStore = useBookingStore()

const props = defineProps<{
  photographer: {
    providerId: number
    providerUuid?: string
    nickName: string
    city: string
    avatar?: string
    bannerImg?: string
    rating?: number
    unitPrice?: number
    totalFee?: number
    transportationFee?: number
    orderCount?: number
    availabilityId?: number
  }
  selectable?: boolean
  selectionTarget?: 'primary' | 'second'
}>()

const emit = defineEmits<{ selected: [providerId: number, target: 'primary' | 'second'] }>()

const target = computed(() => props.selectionTarget || 'primary')

const isSelected = computed(() => {
  if (!props.selectable) return false
  if (target.value === 'second') {
    return bookingStore.data.secondPhotographerId === props.photographer.providerId
  }
  return bookingStore.data.photographerId === props.photographer.providerId
})

const selectProvider = () => {
  const p = props.photographer
  if (target.value === 'second') {
    bookingStore.setData({
      secondPhotographerId: p.providerId,
      secondPhotographerName: p.nickName,
      secondAvailabilityId: p.availabilityId ?? null,
      secondUnitPrice: p.unitPrice || 0,
      secondTransportationFee: p.transportationFee || 0,
    })
  } else {
    bookingStore.setData({
      photographerId: p.providerId,
      photographerUuid: p.providerUuid || '',
      photographerName: p.nickName,
      availabilityId: p.availabilityId ?? null,
      unitPrice: p.unitPrice || 0,
      transportationFee: p.transportationFee || 0,
      totalFee: p.totalFee || 0,
    })
  }
  emit('selected', p.providerId, target.value)
}
</script>
