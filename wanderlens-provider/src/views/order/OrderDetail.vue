<template>
  <div v-if="order">
    <el-card class="mb-4">
      <h2 class="text-lg font-bold mb-3">訂單 #{{ order.orderNo }}</h2>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="客戶">{{ order.customerName }}</el-descriptions-item>
        <el-descriptions-item label="電話">{{ order.customerPhone }}</el-descriptions-item>
        <el-descriptions-item label="拍攝日期">{{ order.shootingDate }}</el-descriptions-item>
        <el-descriptions-item label="拍攝時間">{{ order.shootingTime }}</el-descriptions-item>
        <el-descriptions-item label="時數">{{ order.shootingDuration }} 小時</el-descriptions-item>
        <el-descriptions-item label="地點">{{ order.shootingLocation }}</el-descriptions-item>
        <el-descriptions-item label="狀態">
          <el-tag>{{ order.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="酬勞">${{ order.photographerProfit }}</el-descriptions-item>
        <el-descriptions-item v-if="order.secondPhotographerId" label="雙機搭檔">
          第二位攝影師 ID: {{ order.secondPhotographerId }}
        </el-descriptions-item>
        <el-descriptions-item v-if="order.stylistId" label="造型師">
          ID: {{ order.stylistId }}
        </el-descriptions-item>
        <el-descriptions-item v-if="order.studioId" label="攝影棚">
          ID: {{ order.studioId }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 拍攝節點 -->
    <el-card class="mb-4">
      <h3 class="font-semibold mb-3">拍攝控制</h3>
      <div v-if="order.status === 'WaitingProviderContact'" class="mb-4">
        <el-button type="primary" @click="contactCustomer">通報已聯繫客戶</el-button>
      </div>
      <div v-if="order.status === 'Confirmed'" class="mb-4">
        <el-button type="primary" @click="confirmReadyToShoot">確認待拍攝</el-button>
      </div>
      <div v-if="order.status === 'ReadyToShoot'" class="mb-4">
        <el-button type="success" size="large" @click="startShoot">▶ 開始拍攝</el-button>
      </div>
      <div v-if="order.status === 'ShootingStarted'" class="space-y-3">
        <p class="text-sm text-gray-500">開始時間：{{ shootStartTime }}</p>
        <div class="flex gap-3">
          <el-button type="warning" @click="showExtraDialog = true">+ 加時申請</el-button>
          <el-button type="danger" size="large" @click="endShoot">⏹ 結束拍攝</el-button>
        </div>
      </div>
    </el-card>

    <!-- RAW 上傳 -->
    <el-card v-if="order.status === 'ShootingEnded' || order.status === 'UploadingRaw'" class="mb-4">
      <h3 class="font-semibold mb-3">📸 RAW 上傳</h3>
      <RawUploader :order-id="order.id" @complete="onUploadComplete" />
    </el-card>

    <!-- 加時 Dialog -->
    <el-dialog v-model="showExtraDialog" title="加時申請" width="400px">
      <el-form label-width="80px">
        <el-form-item label="分鐘">
          <el-input-number v-model="extraMinutes" :min="30" :step="30" />
        </el-form-item>
        <el-form-item label="費用">
          <el-input-number v-model="extraFee" :min="0" :step="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showExtraDialog = false">取消</el-button>
        <el-button type="primary" @click="requestExtraTime">送出申請</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'
import RawUploader from '@/components/upload/RawUploader.vue'

const route = useRoute()
const order = ref<any>(null)
const showExtraDialog = ref(false)
const extraMinutes = ref(30)
const extraFee = ref(400)
const shootStartTime = ref('')

const contactCustomer = async () => {
  try {
    await api.contactCustomer(order.value.id)
    ElMessage.success('已通報聯繫')
    loadOrder()
  } catch {
    ElMessage.error('操作失敗')
  }
}

const confirmReadyToShoot = async () => {
  try {
    await api.confirmReadyToShoot(order.value.id)
    ElMessage.success('已確認待拍攝')
    loadOrder()
  } catch {
    ElMessage.error('操作失敗')
  }
}

const startShoot = async () => {
  try {
    const res: any = await api.startShoot(order.value.id)
    shootStartTime.value = res.data?.eventTime || ''
    ElMessage.success('拍攝開始')
    loadOrder()
  } catch {
    ElMessage.error('操作失敗')
  }
}

const endShoot = async () => {
  try {
    await ElMessageBox.confirm('確認結束拍攝？此操作不可復原。', '提示', { type: 'warning', confirmButtonText: '確認', cancelButtonText: '取消' })
    await api.endShoot(order.value.id)
    ElMessage.success('拍攝已結束')
    await loadOrder()
  } catch (err: any) {
    if (err !== 'cancel') ElMessage.error('操作失敗')
  }
}

const requestExtraTime = async () => {
  try {
    await api.requestExtraTime(order.value.id, extraMinutes.value, extraFee.value)
    ElMessage.success('加時申請已送出')
    showExtraDialog.value = false
  } catch {
    ElMessage.error('申請失敗')
  }
}

const onUploadComplete = () => {
  ElMessage.success('RAW 上傳完成')
  loadOrder()
}

const loadOrder = async () => {
  try {
    const res: any = await api.getMyOrders()
    const orders = res.data || []
    order.value = orders.find((o: any) => o.id === Number(route.params.id))
  } catch {
    // 靜默
  }
}

onMounted(loadOrder)
</script>