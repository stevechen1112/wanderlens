<template>
  <div class="wl-container py-8">
    <div class="max-w-3xl mx-auto mb-10">
      <div class="flex items-center justify-between">
        <div v-for="step in 6" :key="step" class="flex items-center flex-1 last:flex-none">
          <div class="flex flex-col items-center relative">
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300',
                bookingStore.currentStep > step ? 'wl-gradient-primary text-white shadow-lg' :
                bookingStore.currentStep === step ? 'wl-gradient-primary text-white shadow-lg wl-pulse' :
                'bg-bg text-text-secondary border-2 border-border'
              ]"
            >
              <span v-if="bookingStore.currentStep > step">?</span>
              <span v-else>{{ step }}</span>
            </div>
            <span
              class="text-xs mt-2 font-semibold whitespace-nowrap"
              :class="bookingStore.currentStep >= step ? 'text-primary' : 'text-text-secondary'"
            >
              {{ stepLabels[step - 1] }}
            </span>
          </div>
          <div
            v-if="step < 6"
            class="flex-1 h-1 mx-2 rounded-full transition-all duration-300"
            :class="bookingStore.currentStep > step ? 'bg-primary' : 'bg-border'"
          />
        </div>
      </div>
    </div>

    <div v-if="bookingStore.currentStep === 1" class="max-w-3xl mx-auto wl-animate-in">
      <h2 class="text-2xl font-extrabold mb-2">{{ $t('booking.step1') }}</h2>
      <p class="text-text-secondary mb-6">{{ $t('booking.step1Desc') }}</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          v-for="st in serviceTypes"
          :key="st.id"
          class="wl-card p-0 text-left border-2 transition-all wl-hover-lift wl-tap-active overflow-hidden"
          :class="bookingStore.data.serviceTypeId === st.id ? 'border-primary shadow-md ring-2 ring-primary/20' : 'border-transparent hover:border-primary/30'"
          @click="selectType(st)"
        >
          <div class="aspect-[4/3] overflow-hidden">
            <img :src="getTypePhoto(st.id)" :alt="st.name" class="w-full h-full object-cover" loading="lazy" />
          </div>
          <div class="p-3">
            <span class="text-sm font-bold">{{ st.name }}</span>
            <p class="text-xs text-text-secondary mt-0.5">{{ $t('home.from') }} ${{ st.price || 800 }}</p>
          </div>
        </button>
      </div>
    </div>

    <div v-if="bookingStore.currentStep === 2" class="max-w-2xl mx-auto wl-animate-in">
      <h2 class="text-2xl font-extrabold mb-2">{{ $t('booking.step2') }}</h2>
      <p class="text-text-secondary mb-6">{{ $t('booking.step2Desc') }}</p>
      <div class="wl-card p-6 space-y-5">
        <div>
          <label class="text-sm font-bold mb-3 block">{{ $t('booking.shootLocation') }}</label>
          <div class="flex gap-3">
            <button
              v-for="loc in ['OUTDOOR', 'STUDIO', 'BOTH']"
              :key="loc"
              class="flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all"
              :class="bookingStore.data.configurationId === getConfigId(loc) ? 'border-primary bg-primary-light text-primary' : 'border-border hover:border-primary/30'"
              @click="bookingStore.setData({ configurationId: getConfigId(loc) })"
            >
              {{ $t(`booking.${loc}`) }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="bookingStore.currentStep === 3" class="max-w-2xl mx-auto wl-animate-in">
      <h2 class="text-2xl font-extrabold mb-2">{{ $t('booking.step3') }}</h2>
      <p class="text-text-secondary mb-6">{{ $t('booking.step3Desc') }}</p>
      <div class="wl-card p-6 space-y-4">
        <div>
          <label class="text-sm font-bold mb-1.5 block">{{ $t('search.date') }}</label>
          <input v-model="bookingStore.data.shootingDate" type="date" class="wl-input" />
        </div>
        <div>
          <label class="text-sm font-bold mb-1.5 block">{{ $t('search.time') }}</label>
          <input v-model="bookingStore.data.shootingTime" type="text" placeholder="14:00-16:00" class="wl-input" />
        </div>
        <div>
          <label class="text-sm font-bold mb-1.5 block">{{ $t('search.location') }}</label>
          <input v-model="bookingStore.data.shootingLocation" type="text" :placeholder="$t('search.enterLocation')" class="wl-input" />
        </div>
        <div v-if="bookingStore.data.shootingLocation" class="rounded-xl overflow-hidden border border-border">
          <iframe
            width="100%"
            height="250"
            style="border:0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            :src="`https://www.google.com/maps?q=${encodeURIComponent(bookingStore.data.shootingLocation)}&output=embed`"
            allowfullscreen
          />
        </div>
      </div>
    </div>

    <div v-if="bookingStore.currentStep === 4" class="max-w-4xl mx-auto wl-animate-in">
      <h2 class="text-2xl font-extrabold mb-2">
        {{ selectionTarget === 'second' ? $t('booking.step4Second') : $t('booking.step4') }}
      </h2>
      <p class="text-text-secondary mb-6">
        {{ selectionTarget === 'second' ? $t('booking.step4SecondDesc') : $t('booking.step4Desc') }}
      </p>
      <div v-if="displayProviders.length === 0" class="wl-empty">
        <div class="wl-empty-icon">??</div>
        <div class="wl-empty-title">{{ $t('search.noResults') }}</div>
        <div class="wl-empty-desc">{{ $t('search.noResultsDesc') }}</div>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <PhotographerCard
          v-for="p in displayProviders"
          :key="`${selectionTarget}-${p.providerId}`"
          :photographer="p"
          selectable
          :selection-target="selectionTarget"
          @selected="onProviderSelected"
        />
      </div>
    </div>

    <div v-if="bookingStore.currentStep === 5" class="max-w-2xl mx-auto wl-animate-in">
      <h2 class="text-2xl font-extrabold mb-2">{{ $t('booking.step5') }}</h2>
      <p class="text-text-secondary mb-6">{{ $t('booking.step5Desc') }}</p>
      <div class="wl-card p-6 space-y-3 text-sm">
        <div class="flex justify-between py-2">
          <span class="text-text-secondary">{{ $t('booking.serviceType') }}</span>
          <span class="font-semibold">{{ serviceTypes.find(s => s.id === bookingStore.data.serviceTypeId)?.name || '-' }}</span>
        </div>
        <div class="flex justify-between py-2">
          <span class="text-text-secondary">{{ $t('search.date') }}</span>
          <span class="font-semibold">{{ bookingStore.data.shootingDate }}</span>
        </div>
        <div class="flex justify-between py-2">
          <span class="text-text-secondary">{{ $t('search.time') }}</span>
          <span class="font-semibold">{{ bookingStore.data.shootingTime }}</span>
        </div>
        <div class="flex justify-between py-2">
          <span class="text-text-secondary">{{ $t('search.location') }}</span>
          <span class="font-semibold">{{ bookingStore.data.shootingLocation }}</span>
        </div>
        <div class="flex justify-between items-center py-2">
          <span class="text-text-secondary">{{ $t('booking.photographer') }}</span>
          <div class="flex items-center gap-3">
            <span class="font-semibold">{{ bookingStore.data.photographerName || '-' }}</span>
            <NuxtLink
              v-if="bookingStore.data.photographerUuid"
              :to="`/photographer/${bookingStore.data.photographerUuid}`"
              class="text-primary text-sm font-medium hover:underline"
              target="_blank"
            >
              查看介紹
            </NuxtLink>
          </div>
        </div>
        <div v-if="bookingStore.data.secondPhotographerId" class="flex justify-between items-center py-2">
          <span class="text-text-secondary">{{ $t('checkout.secondPhotographer') }}</span>
          <div class="flex items-center gap-3">
            <span class="font-semibold">{{ bookingStore.data.secondPhotographerName || '-' }}</span>
            <NuxtLink
              v-if="bookingStore.data.secondPhotographerUuid"
              :to="`/photographer/${bookingStore.data.secondPhotographerUuid}`"
              class="text-primary text-sm font-medium hover:underline"
              target="_blank"
            >
              查看介紹
            </NuxtLink>
          </div>
        </div>
        <div class="wl-divider" />
        <div class="flex justify-between text-lg font-extrabold">
          <span>{{ $t('booking.total') }}</span>
          <span class="wl-gradient-text">${{ bookingStore.totalFee }}</span>
        </div>
      </div>
    </div>

    <div v-if="bookingStore.currentStep === 6" class="max-w-3xl mx-auto wl-animate-in">
      <CheckoutForm @completed="onOrderCreated" />
    </div>

    <div class="flex justify-between mt-8 max-w-2xl mx-auto">
      <button
        v-if="bookingStore.currentStep > 1"
        class="px-6 py-3 border-2 border-border rounded-xl font-semibold hover:border-primary hover:text-primary transition-all"
        @click="bookingStore.setStep(bookingStore.currentStep - 1)"
      >
        ? {{ $t('common.back') }}
      </button>
      <div v-else />
      <button v-if="bookingStore.currentStep < 5" class="wl-btn-primary !px-8" @click="nextStep">
        {{ $t('common.next') }} ?
      </button>
      <button v-if="bookingStore.currentStep === 5" class="wl-btn-primary !px-8" @click="bookingStore.setStep(6)">
        {{ $t('booking.checkout') }} ?
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookingStore } from '~/stores/booking'
import { useBookingApi } from '~/api/booking-api'
import { getCategoryPhoto } from '~/utils/photos'

const { t } = useI18n()
const bookingStore = useBookingStore()
const bookingApi = useBookingApi()
const serviceTypes = ref<any[]>([])
const configurations = ref<any[]>([])
const providers = ref<any[]>([])
const selectionTarget = ref<'primary' | 'second'>('primary')
const photographerCount = ref(1)

const displayProviders = computed(() => {
  if (selectionTarget.value === 'second') {
    return providers.value.filter((p) => p.providerId !== bookingStore.data.photographerId)
  }
  return providers.value
})

const stepLabels = computed(() => [
  t('booking.step1'),
  t('booking.step2'),
  t('booking.step3'),
  t('booking.step4'),
  t('booking.step5'),
  t('booking.step6'),
])

const getTypePhoto = (id: number) => getCategoryPhoto(id, 0, 400)

const selectType = (st: any) => {
  bookingStore.setData({ serviceTypeId: st.id })
  nextStep()
}

const getConfigId = (loc: string) => {
  const config = configurations.value.find(c => c.shootLocation === loc)
  return config?.id || null
}

const parseDuration = (timeRange: string) => {
  const [start, end] = (timeRange || '10:00-12:00').split('-').map((s) => s.trim())
  const [sh, sm] = (start || '10:00').split(':').map(Number)
  const [eh, em] = (end || '12:00').split(':').map(Number)
  const hours = (eh * 60 + em - sh * 60 - sm) / 60
  return Math.max(1, Math.round(hours * 10) / 10)
}

const nextStep = async () => {
  if (bookingStore.currentStep === 3) {
    selectionTarget.value = 'primary'
    try {
      const [timeStart, timeEnd] = (bookingStore.data.shootingTime || '10:00-12:00').split('-')
      const res: any = await bookingApi.searchMultiPool({
        serviceTypeId: bookingStore.data.serviceTypeId!,
        shootingDate: bookingStore.data.shootingDate,
        timeStart: timeStart?.trim() || '10:00',
        timeEnd: timeEnd?.trim() || '12:00',
        configurationId: bookingStore.data.configurationId,
        city: bookingStore.data.shootingLocation || undefined,
      })
      const data = res.data || {}
      providers.value = data.photographers || []
      photographerCount.value = data.photographerCount || 1
      bookingStore.setData({
        photographerCount: data.photographerCount || 1,
        needStylist: !!data.needStylist,
        shootingDuration: parseDuration(bookingStore.data.shootingTime),
      })
    } catch {
      providers.value = []
    }
  }
  bookingStore.setStep(bookingStore.currentStep + 1)
}

const onProviderSelected = (_providerId: number, target: 'primary' | 'second') => {
  if (target === 'primary' && photographerCount.value >= 2) {
    selectionTarget.value = 'second'
    return
  }
  bookingStore.setStep(5)
}

const onOrderCreated = (orderId: number) => {
  navigateTo(`/thankyou/${orderId}`)
}

onMounted(async () => {
  try {
    const [typesRes, configRes]: any[] = await Promise.all([
      bookingApi.getServiceTypes(),
      bookingApi.getConfigurations(),
    ])
    serviceTypes.value = typesRes.data || []
    configurations.value = configRes.data || []
  } catch {
    // ignore
  }
})
</script>
