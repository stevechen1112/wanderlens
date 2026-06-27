<template>
  <div class="wl-container py-8 max-w-3xl">
    <div class="mb-8">
      <span class="wl-badge wl-badge-primary mb-2">{{ $t('orders.manage') }}</span>
      <h1 class="text-3xl font-extrabold text-text-primary">{{ $t('nav.orders') }}</h1>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="wl-surface rounded-2xl p-5">
        <div class="wl-skeleton wl-skeleton-text !w-40" />
        <div class="wl-skeleton wl-skeleton-text-sm !w-24 mt-2" />
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="wl-empty">
      <div class="wl-empty-title">{{ $t('orders.empty') }}</div>
      <div class="wl-empty-desc">{{ $t('orders.emptyDesc') }}</div>
      <NuxtLink to="/search" class="wl-btn-primary mt-4 inline-block">{{ $t('home.bookNow') }}</NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="order-card"
        @click="navigateTo(`/orders/${order.id}`)"
      >
        <div class="order-header">
          <span class="order-no">{{ order.orderNo }}</span>
          <span class="order-status" :class="statusClass(order.status)">{{ statusLabel(order.status) }}</span>
        </div>
        <div class="order-body">
          <div class="order-info">
            <div class="order-info-item">
              {{ order.shootingDate }} {{ order.timeStart }}-{{ order.timeEnd }}
            </div>
            <div v-if="order.photographerName" class="order-info-item">
              {{ order.photographerName }}
            </div>
            <div v-if="order.city" class="order-info-item">
              {{ order.city }}
            </div>
          </div>
          <div class="order-amount">${{ order.totalFee?.toLocaleString() || 0 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrderApi } from '~/api/order-api'

definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const orderApi = useOrderApi()
const loading = ref(true)
const orders = ref<any[]>([])

const statusLabel = (status: string) => {
  const key = `orders.status.${status}`
  const translated = t(key)
  return translated !== key ? translated : status
}

const statusClass = (status: string) => {
  const map: Record<string, string> = {
    PendingPayment: 'bg-orange-100 text-orange-600',
    Paid: 'bg-green-100 text-green-600',
    Confirmed: 'bg-blue-100 text-blue-600',
    ReadyToShoot: 'bg-red-100 text-red-600',
    ShootingStarted: 'bg-red-100 text-red-600',
    Delivered: 'bg-green-100 text-green-600',
    Cancelled: 'bg-gray-100 text-gray-500',
    Refunded: 'bg-gray-100 text-gray-500',
    Disputed: 'bg-red-100 text-red-600',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

onMounted(async () => {
  try {
    const res: any = await orderApi.myOrders()
    orders.value = res.data || []
  } catch {
    orders.value = []
  } finally {
    loading.value = false
  }
})
</script>
