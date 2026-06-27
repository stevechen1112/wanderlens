<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[200] bg-black flex flex-col"
      data-testid="photo-viewer"
      role="dialog"
      aria-modal="true"
      :aria-label="$t('album.viewerTitle')"
    >
      <div class="flex items-center justify-between px-4 pt-4 pb-2 text-white">
        <button type="button" class="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10" data-testid="photo-viewer-close" :aria-label="$t('common.close')" @click="$emit('close')">
          ✕
        </button>
        <span class="text-sm font-semibold" aria-live="polite">{{ index + 1 }} / {{ photos.length }}</span>
        <button type="button" class="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10" :aria-label="$t('album.download')" @click="$emit('download', currentPhoto)">
          ⬇
        </button>
      </div>

      <div
        ref="trackRef"
        class="flex-1 flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        @scroll="onScroll"
      >
        <div
          v-for="(photo, i) in photos"
          :key="photo.id"
          class="min-w-full h-full flex items-center justify-center snap-center px-3"
        >
          <img
            :src="photo.previewUrl || photo.fileUrl || photo.thumbnailUrl"
            :alt="`${index + 1}`"
            class="max-h-[75vh] max-w-full object-contain"
          >
        </div>
      </div>

      <div class="flex justify-between px-6 pb-8">
        <button
          type="button"
          class="px-4 py-2 text-white disabled:opacity-30"
          :disabled="index <= 0"
          @click="goPrev"
        >
          ← 上一張
        </button>
        <button
          type="button"
          class="px-4 py-2 text-white disabled:opacity-30"
          :disabled="index >= photos.length - 1"
          @click="goNext"
        >
          下一張 →
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Photo {
  id: number
  thumbnailUrl?: string
  previewUrl?: string
  fileUrl?: string
}

const props = defineProps<{
  visible: boolean
  photos: Photo[]
  initialIndex?: number
}>()

defineEmits<{
  close: []
  download: [photo: Photo]
}>()

const index = ref(props.initialIndex ?? 0)
const trackRef = ref<HTMLElement | null>(null)

const currentPhoto = computed(() => props.photos[index.value])

watch(() => props.visible, (v) => {
  if (v) index.value = props.initialIndex ?? 0
})

watch(() => props.initialIndex, (v) => {
  if (v != null) index.value = v
})

function scrollToIndex(i: number) {
  const el = trackRef.value
  if (!el) return
  el.scrollTo({ left: el.clientWidth * i, behavior: 'smooth' })
}

function goPrev() {
  if (index.value > 0) {
    index.value--
    scrollToIndex(index.value)
  }
}

function goNext() {
  if (index.value < props.photos.length - 1) {
    index.value++
    scrollToIndex(index.value)
  }
}

function onScroll() {
  const el = trackRef.value
  if (!el || !el.clientWidth) return
  index.value = Math.round(el.scrollLeft / el.clientWidth)
}
</script>
