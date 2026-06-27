<template>
  <div class="wl-container py-8 max-w-3xl">
    <NuxtLink to="/orders" class="text-text-secondary text-sm mb-4 inline-block">← {{ $t('orders.backToList') }}</NuxtLink>

    <WlStateView
      v-if="loading"
      status="loading"
      :loading-message="$t('common.loading')"
      empty-title=" "
    />
    <WlStateView
      v-else-if="!order"
      status="error"
      :error-title="$t('orders.detailNotFound')"
      :error-message="$t('orders.detailNotFoundDesc')"
      empty-title=" "
      @retry="loadOrder"
    />

    <template v-else>
      <!-- 狀態卡片 -->
      <div class="wl-surface rounded-lg p-6 mb-6 text-center">
        <div class="text-4xl mb-2">{{ statusEmoji(order.status) }}</div>
        <h1 class="text-xl font-bold mb-1">{{ statusLabel(order.status) }}</h1>
        <p class="text-text-secondary text-sm">訂單號：{{ order.orderNo }}</p>
      </div>

      <!-- 拍攝資訊 -->
      <div class="wl-surface rounded-lg p-6 mb-4">
        <h2 class="font-semibold mb-4">拍攝資訊</h2>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-text-secondary">拍攝日期</span>
            <span class="font-medium">{{ order.shootingDate }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">拍攝時間</span>
            <span class="font-medium">{{ order.timeStart }} - {{ order.timeEnd }}</span>
          </div>
          <div v-if="order.city" class="flex justify-between">
            <span class="text-text-secondary">城市</span>
            <span class="font-medium">{{ order.city }}</span>
          </div>
          <div v-if="order.photographerName" class="flex justify-between items-center">
            <span class="text-text-secondary">攝影師</span>
            <div class="flex items-center gap-2">
              <span class="font-medium">{{ order.photographerName }}</span>
              <NuxtLink
                v-if="order.photographerUuid"
                :to="`/photographer/${order.photographerUuid}`"
                class="text-primary text-xs font-medium hover:underline"
              >
                查看介紹
              </NuxtLink>
            </div>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">人數</span>
            <span class="font-medium">大人 {{ order.adultNum || 0 }}，小孩 {{ order.childNum || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- 金額資訊 -->
      <div class="wl-surface rounded-lg p-6 mb-4">
        <h2 class="font-semibold mb-4">金額資訊</h2>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-text-secondary">訂單金額</span>
            <span class="font-semibold text-lg text-primary">$ {{ order.totalFee?.toLocaleString() || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- 聯絡資訊 -->
      <div v-if="order.customerName" class="wl-surface rounded-lg p-6 mb-4">
        <h2 class="font-semibold mb-4">聯絡資訊</h2>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-text-secondary">姓名</span>
            <span class="font-medium">{{ order.customerName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">電話</span>
            <span class="font-medium">{{ order.customerPhone }}</span>
          </div>
        </div>
      </div>

      <!-- 備註 -->
      <div v-if="order.remark" class="wl-surface rounded-lg p-6 mb-4">
        <h2 class="font-semibold mb-2">備註</h2>
        <p class="text-sm text-text-secondary">{{ order.remark }}</p>
      </div>

      <!-- 訂單歷程 -->
      <div class="wl-surface rounded-lg p-6 mb-4">
        <h2 class="font-semibold mb-4">訂單歷程</h2>
        <div v-if="historyLoading" class="text-text-secondary text-sm">載入中...</div>
        <div v-else-if="history.length > 0" class="space-y-3">
          <div v-for="h in history" :key="h.id" class="flex gap-3 text-sm">
            <div class="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <div>
              <p class="font-medium">{{ h.action }}</p>
              <p class="text-text-secondary text-xs">{{ h.detail }}</p>
              <p class="text-text-secondary text-xs">{{ formatTime(h.createdAt) }} · {{ h.operator }}</p>
            </div>
          </div>
        </div>
        <p v-else class="text-text-secondary text-sm">無歷程記錄</p>
      </div>

      <!-- 操作按鈕 -->
      <div class="flex gap-3">
        <button
          v-if="order.status === 'PendingPayment'"
          class="wl-btn-primary flex-1"
          @click="goToPayment"
        >
          前往付款
        </button>
        <NuxtLink
          v-if="order.status === 'Delivered' || order.status === 'Closed'"
          to="/albums"
          class="wl-btn-primary flex-1 text-center"
        >
          查看相簿
        </NuxtLink>
        <button
          v-if="canCancel(order.status)"
          class="wl-btn-secondary flex-1"
          @click="showCancelDialog = true"
        >
          取消訂單
        </button>
      </div>

      <!-- 取消對話框 -->
      <div v-if="showCancelDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showCancelDialog = false">
        <div class="wl-surface rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="font-semibold mb-4">取消訂單</h3>
          <textarea
            v-model="cancelReason"
            class="wl-input mb-4"
            rows="3"
            placeholder="請輸入取消原因"
          />
          <div class="flex gap-3">
            <button class="wl-btn-secondary flex-1" @click="showCancelDialog = false">取消</button>
            <button class="wl-btn-primary flex-1" :disabled="!cancelReason.trim() || cancelling" @click="confirmCancel">
              {{ cancelling ? '處理中...' : '確認取消' }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useOrderApi } from '~/api/order-api'
import { usePaymentApi } from '~/api/order-api'
import { useToast } from '~/composables/useToast'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const orderApi = useOrderApi()
const paymentApi = usePaymentApi()
const toast = useToast()

const loading = ref(true)
const historyLoading = ref(true)
const order = ref<any>(null)
const history = ref<any[]>([])
const showCancelDialog = ref(false)
const cancelReason = ref('')
const cancelling = ref(false)

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    Draft: '草稿', PendingPayment: '待付款', Paid: '已付款',
    WaitingProviderContact: '等待聯繫', Confirmed: '已確認',
    ReadyToShoot: '待拍攝', ShootingStarted: '拍攝中', ShootingEnded: '拍攝結束',
    UploadingRaw: '上傳中', AiProcessing: 'AI處理中', Delivered: '已交付',
    Cancelled: '已取消', Closed: '已結案', Refunded: '已退款', Disputed: '爭議中',
  }
  return map[status] || status
}

const statusEmoji = (status: string) => {
  const map: Record<string, string> = {
    PendingPayment: '⏳', Paid: '✅', Confirmed: '✅',
    ReadyToShoot: '📸', ShootingStarted: '📸', Delivered: '🎉',
    Cancelled: '❌', Refunded: '💰', Disputed: '⚠️',
  }
  return map[status] || '📋'
}

const canCancel = (status: string) => {
  return ['PendingPayment', 'Paid', 'Confirmed', 'ReadyToShoot'].includes(status)
}

const formatTime = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-TW')
}

const goToPayment = async () => {
  try {
    const res: any = await paymentApi.ecpayCheckout(order.value.id)
    if (res.data) {
      // 使用 DOMParser 安全地提交綠界表單
      const parser = new DOMParser()
      const doc = parser.parseFromString(res.data, 'text/html')
      const formEl = doc.querySelector('form')
      if (formEl) {
        const newForm = document.createElement('form')
        newForm.action = formEl.action
        newForm.method = formEl.method || 'POST'
        formEl.querySelectorAll('input').forEach((input: HTMLInputElement) => {
          const newInput = document.createElement('input')
          newInput.type = input.type
          newInput.name = input.name
          newInput.value = input.value
          newForm.appendChild(newInput)
        })
        document.body.appendChild(newForm)
        newForm.submit()
      }
    }
  } catch {
    toast.error('付款表單產生失敗，請稍後再試')
  }
}

const confirmCancel = async () => {
  cancelling.value = true
  try {
    await orderApi.cancel(order.value.id, cancelReason.value)
    showCancelDialog.value = false
    toast.success('訂單已取消')
    await loadOrder()
  } catch {
    toast.error('取消失敗')
  } finally {
    cancelling.value = false
  }
}

const loadOrder = async () => {
  loading.value = true
  try {
    const res: any = await orderApi.getById(Number(route.params.id))
    order.value = res.data
  } catch {
    order.value = null
  } finally {
    loading.value = false
  }
}

const loadHistory = async () => {
  historyLoading.value = true
  try {
    const res: any = await orderApi.history(Number(route.params.id))
    history.value = res.data || []
  } catch {
    history.value = []
  } finally {
    historyLoading.value = false
  }
}

onMounted(async () => {
  await loadOrder()
  if (order.value) loadHistory()
})
</script>