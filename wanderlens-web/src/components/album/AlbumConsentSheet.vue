<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[150] flex items-end bg-black/50" @click.self="$emit('close')">
      <div class="w-full max-h-[85vh] wl-surface rounded-t-3xl p-5 pb-8 wl-animate-in overflow-y-auto">
        <div class="w-10 h-1 rounded-full bg-border mx-auto mb-4" />
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-bold">{{ $t('album.consentTitle') }}</h3>
          <button type="button" class="text-text-secondary text-2xl leading-none" @click="$emit('close')">✕</button>
        </div>
        <p class="text-sm text-text-secondary mb-4">{{ $t('album.consentDesc') }}</p>

        <div class="space-y-2 mb-4">
          <button
            v-for="item in levels"
            :key="item.value"
            type="button"
            :disabled="isDisabled(item.value)"
            :class="[
              'w-full text-left p-4 rounded-xl border-2 transition-all',
              level === item.value ? 'border-primary bg-primary-light/40' : 'border-border',
              isDisabled(item.value) ? 'opacity-45 cursor-not-allowed' : 'hover:border-primary/50',
            ]"
            @click="selectLevel(item.value)"
          >
            <div class="font-semibold text-sm">{{ item.label }}</div>
            <div class="text-xs text-text-secondary mt-1">{{ item.desc }}</div>
            <div v-if="isDisabled(item.value)" class="text-xs text-warning mt-1">{{ $t('album.consentMinorWarn') }}</div>
          </button>
        </div>

        <label class="flex items-center justify-between p-4 rounded-xl bg-bg gap-4">
          <div>
            <div class="font-semibold text-sm">{{ $t('album.hasMinor') }}</div>
            <div class="text-xs text-text-secondary mt-1">{{ $t('album.hasMinorDesc') }}</div>
          </div>
          <input v-model="hasMinor" type="checkbox" class="w-5 h-5 accent-primary">
        </label>

        <div class="flex gap-3 mt-6">
          <button type="button" class="flex-1 py-3 border border-border rounded-xl font-semibold" @click="$emit('close')">
            {{ $t('common.cancel') }}
          </button>
          <button type="button" class="flex-1 wl-btn-primary !py-3" :disabled="saving" @click="save">
            {{ saving ? $t('common.processing') : $t('album.consentSave') }}
          </button>
        </div>

        <button type="button" class="w-full mt-3 text-sm text-danger font-semibold" @click="$emit('revoke')">
          {{ $t('album.consentRevoke') }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useAlbumApi } from '~/api/album-api'
import { useToast } from '~/composables/useToast'

type ConsentLevel = 'PRIVATE' | 'PUBLIC' | 'MARKETING' | 'COMMERCIAL'

const props = defineProps<{
  visible: boolean
  albumId: number
  currentLevel?: string
  hasMinor?: boolean
}>()

const emit = defineEmits<{
  close: []
  saved: [level: string]
  revoke: []
}>()

const { t } = useI18n()
const toast = useToast()
const albumApi = useAlbumApi()

const level = ref<ConsentLevel>((props.currentLevel as ConsentLevel) || 'PRIVATE')
const hasMinor = ref(props.hasMinor ?? false)
const saving = ref(false)

const levels = computed(() => [
  { value: 'PRIVATE' as const, label: t('album.consentPrivate'), desc: t('album.consentPrivateDesc') },
  { value: 'PUBLIC' as const, label: t('album.consentPublic'), desc: t('album.consentPublicDesc') },
  { value: 'MARKETING' as const, label: t('album.consentMarketing'), desc: t('album.consentMarketingDesc') },
  { value: 'COMMERCIAL' as const, label: t('album.consentCommercial'), desc: t('album.consentCommercialDesc') },
])

watch(
  () => [props.visible, props.currentLevel, props.hasMinor] as const,
  ([visible, currentLevel, minor]) => {
    if (!visible) return
    level.value = (currentLevel as ConsentLevel) || 'PRIVATE'
    hasMinor.value = minor ?? false
  },
)

watch(hasMinor, (minor) => {
  if (minor && (level.value === 'MARKETING' || level.value === 'COMMERCIAL')) {
    level.value = 'PUBLIC'
  }
})

function isDisabled(value: ConsentLevel) {
  return hasMinor.value && (value === 'MARKETING' || value === 'COMMERCIAL')
}

function selectLevel(value: ConsentLevel) {
  if (!isDisabled(value)) level.value = value
}

async function save() {
  saving.value = true
  try {
    await albumApi.setMultiLevelConsent(props.albumId, level.value, undefined, hasMinor.value)
    emit('saved', level.value)
    emit('close')
    toast.success(t('album.consentSaved'))
  } catch (err: any) {
    toast.error(err?.message || t('album.consentSaveFailed'))
  } finally {
    saving.value = false
  }
}
</script>
