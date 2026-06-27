<template>
  <div v-if="provider">
    <el-page-header @back="$router.back()" :content="provider.name || '攝影師詳情'" class="mb-4" />
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本資料" name="basic">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ provider.name }}</el-descriptions-item>
          <el-descriptions-item label="暱稱">{{ provider.nickName }}</el-descriptions-item>
          <el-descriptions-item label="電話">{{ provider.phone }}</el-descriptions-item>
          <el-descriptions-item label="Email">{{ provider.email }}</el-descriptions-item>
          <el-descriptions-item label="縣市">{{ provider.city }}</el-descriptions-item>
          <el-descriptions-item label="上架">{{ provider.goLive === 'Y' ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="評價">{{ provider.rating }}</el-descriptions-item>
          <el-descriptions-item label="違規">{{ provider.violationCount }} ({{ provider.violationLevel }})</el-descriptions-item>
          <el-descriptions-item label="介紹" :span="2">{{ provider.intro || '—' }}</el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>

      <el-tab-pane label="接案時段" name="schedule" lazy>
        <el-table v-loading="tabLoading.schedule" :data="schedule" border empty-text="尚無時段資料">
          <el-table-column prop="scheduleDate" label="日期" width="120" />
          <el-table-column label="時段">
            <template #default="{ row }">{{ row.slotStart }} - {{ row.slotEnd }}</template>
          </el-table-column>
          <el-table-column prop="maxValue" label="可預約數" width="100" />
          <el-table-column prop="active" label="啟用" width="80" />
          <el-table-column label="鎖定">
            <template #default="{ row }">{{ row.lockedByOrderId || '—' }}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="服務地區" name="area" lazy>
        <el-table v-loading="tabLoading.area" :data="serviceAreas" border empty-text="尚無服務地區">
          <el-table-column prop="areaId" label="區域 ID" width="100" />
          <el-table-column prop="zipCode" label="郵遞區號" width="120" />
          <el-table-column prop="areaParentId" label="上層區域" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="匯款資料" name="bank" lazy>
        <el-descriptions v-if="bank" :column="2" border v-loading="tabLoading.bank">
          <el-descriptions-item label="銀行">{{ bank.bankName }}</el-descriptions-item>
          <el-descriptions-item label="代碼">{{ bank.bankCode }}</el-descriptions-item>
          <el-descriptions-item label="分行">{{ bank.bankBranch }}</el-descriptions-item>
          <el-descriptions-item label="戶名">{{ bank.accountName }}</el-descriptions-item>
          <el-descriptions-item label="帳號">{{ bank.accountNo }}</el-descriptions-item>
          <el-descriptions-item label="備註">{{ bank.note || '—' }}</el-descriptions-item>
        </el-descriptions>
        <el-empty v-else description="尚未填寫匯款資料" />
      </el-tab-pane>

      <el-tab-pane label="特色資料" name="feature" lazy>
        <el-table v-loading="tabLoading.feature" :data="features" border empty-text="尚無特色資料">
          <el-table-column prop="language" label="語系" width="80" />
          <el-table-column prop="featureType" label="類型" width="120" />
          <el-table-column prop="featureTitle" label="標題" />
          <el-table-column prop="enable" label="啟用" width="80" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="作品集" name="works" lazy>
        <div v-loading="tabLoading.works" class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <el-image v-for="w in works" :key="w.id" :src="workUrl(w.fileUuid)" fit="cover" class="w-full aspect-square rounded-lg" />
          <el-empty v-if="!tabLoading.works && works.length === 0" description="尚無作品" class="col-span-full" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="評價" name="rating" lazy>
        <el-table v-loading="tabLoading.rating" :data="ratings" border empty-text="尚無評價">
          <el-table-column prop="author" label="評價者" width="120" />
          <el-table-column prop="stars" label="星等" width="80" />
          <el-table-column prop="comments" label="評語" />
          <el-table-column prop="createdAt" label="時間" width="180" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
  <el-empty v-else description="載入中或找不到攝影師" />
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'
import request from '@/api/request'

const route = useRoute()
const providerId = Number(route.params.id)
const provider = ref<any>(null)
const activeTab = ref('basic')
const schedule = ref<any[]>([])
const serviceAreas = ref<any[]>([])
const bank = ref<any>(null)
const features = ref<any[]>([])
const works = ref<any[]>([])
const ratings = ref<any[]>([])
const tabLoading = reactive({ schedule: false, area: false, bank: false, feature: false, works: false, rating: false })
const loaded = reactive<Record<string, boolean>>({})

const workUrl = (uuid?: string) => uuid ? `/api/files/serve/works/${uuid}` : ''

const loadTab = async (tab: string) => {
  if (loaded[tab]) return
  loaded[tab] = true
  try {
    if (tab === 'schedule') {
      tabLoading.schedule = true
      const res: any = await api.getProviderSchedule(providerId)
      schedule.value = res.data || []
    } else if (tab === 'area') {
      tabLoading.area = true
      const res: any = await request.get(`/providers/service-area/${providerId}`)
      serviceAreas.value = res.data || []
    } else if (tab === 'bank') {
      tabLoading.bank = true
      const res: any = await request.get('/providers/bank', { params: { providerId } })
      bank.value = res.data
    } else if (tab === 'feature') {
      tabLoading.feature = true
      const res: any = await request.get(`/providers/feature/${providerId}`)
      features.value = res.data || []
    } else if (tab === 'works') {
      tabLoading.works = true
      const res: any = await request.get(`/providers/works/${providerId}`)
      works.value = res.data || []
    } else if (tab === 'rating') {
      tabLoading.rating = true
      const res: any = await request.get(`/providers/rating/${providerId}`)
      ratings.value = res.data || []
    }
  } catch { /* tab error */ }
  finally {
    tabLoading[tab as keyof typeof tabLoading] = false
  }
}

watch(activeTab, (tab) => { if (tab !== 'basic') loadTab(tab) })

onMounted(async () => {
  try {
    const res: any = await api.getProvider(providerId)
    provider.value = res.data
  } catch { /* silent */ }
})
</script>
