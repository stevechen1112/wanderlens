<template>
  <div class="wl-container py-12 text-center">
    <div v-if="loading" class="py-12">
      <p class="text-text-secondary">{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="order">
      <div v-if="order.status === 'Paid' || order.status === 'Delivered'" class="text-success">
        <div class="text-6xl mb-4">✅</div>
        <h1 class="text-2xl font-bold mb-2">{{ $t('payment.success') }}</h1>
        <p class="text-text-secondary mb-6">{{ $t('payment.successDesc') }}</p>
      </div>

      <div v-else class="text-danger">
        <div class="text-6xl mb-4">❌</div>
        <h1 class="text-2xl font-bold mb-2">{{ $t('payment.failed') }}</h1>
        <p class="text-text-secondary mb-6">{{ $t('payment.failedDesc') }}</p>
      </div>

      <div class="wl-surface rounded-lg p-6 max-w-md mx-auto text-left text-sm space-y-2">
        <div class="flex justify-between"><span class="text-text-secondary">{{ $t('payment.orderNo') }}</span><span>{{ order.orderNo }}</span></div>
        <div class="flex justify-between"><span class="text-text-secondary">{{ $t('booking.total') }}</span><span>${{ order.totalFee }}</span></div>
      </div>

      <NuxtLink to="/albums" class="wl-btn-primary inline-block mt-6">
        {{ $t('payment.viewAlbums') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrderApi } from '~/api/order-api'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const orderApi = useOrderApi()
const order = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    // tradeNo 為 ECPay 交易編號（字串），不應轉為數字 orderId
    const tradeNo = String(route.params.tradeNo)
    const res: any = await orderApi.getByTradeNo(tradeNo)
    order.value = res.data
  } catch {
    // 404 或訂單查無
  } finally {
    loading.value = false
  }
})
</script>