<template>
  <div v-if="provider">
    <el-page-header @back="$router.back()" :content="provider.name || '攝影師詳情'" class="mb-4" />

    <div class="mb-4 flex flex-wrap items-center gap-3">
      <el-link v-if="provider.goLive === 'Y'" :href="publicProfileUrl" target="_blank" type="primary">預覽公開介紹頁 ↗</el-link>
      <el-text v-else type="info" size="small">上架後才可預覽公開介紹頁</el-text>
      <el-tag :type="provider.goLive === 'Y' ? 'success' : 'info'">
        {{ provider.goLive === 'Y' ? '已上架' : '未上架' }}
      </el-tag>
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本資料" name="basic">
        <el-form :model="basicForm" label-width="110px" class="max-w-3xl">
          <el-row :gutter="16">
            <el-col :xs="24" :md="12">
              <el-form-item label="姓名">
                <el-input v-model="basicForm.name" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item label="暱稱">
                <el-input v-model="basicForm.nickName" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item label="電話">
                <el-input v-model="basicForm.phone" readonly />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item label="Email">
                <el-input v-model="basicForm.email" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item label="縣市">
                <el-select v-model="basicForm.city" filterable clearable @change="onCityChange">
                  <el-option v-for="c in cities" :key="c" :label="c" :value="c" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item label="行政區">
                <el-select v-model="basicForm.districtName" filterable clearable :disabled="!basicForm.city">
                  <el-option v-for="d in districts" :key="d" :label="d" :value="d" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="8">
              <el-form-item label="身份別">
                <el-select v-model="basicForm.career" clearable>
                  <el-option label="全職攝影" value="全職攝影" />
                  <el-option label="兼職攝影" value="兼職攝影" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="8">
              <el-form-item label="年資">
                <el-input-number v-model="basicForm.experience" :min="0" :step="0.5" :precision="1" class="w-full" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="8">
              <el-form-item label="時薪">
                <el-input-number v-model="basicForm.unitPrice" :min="0" :step="100" class="w-full" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="服務項目">
                <el-select v-model="basicForm.serviceTypes" multiple filterable class="w-full">
                  <el-option v-for="st in serviceTypeOptions" :key="st.id" :label="st.name" :value="st.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="自我介紹">
                <el-input v-model="basicForm.intro" type="textarea" :rows="4" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item label="大頭照">
                <el-upload :show-file-list="false" :http-request="uploadAvatar" accept="image/*">
                  <el-avatar :size="72" :src="basicForm.avatar" />
                  <span class="ml-2 text-sm text-blue-500">點擊上傳</span>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item label="代表橫幅">
                <el-upload :show-file-list="false" :http-request="uploadBanner" accept="image/*">
                  <el-image v-if="basicForm.bannerImg" :src="basicForm.bannerImg" class="w-48 h-24 rounded" fit="cover" />
                  <span v-else class="text-sm text-blue-500">點擊上傳橫幅</span>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <el-button type="primary" :loading="savingBasic" @click="saveBasic">儲存基本資料</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-descriptions :column="2" border class="max-w-3xl mt-6" title="系統資訊（唯讀）">
          <el-descriptions-item label="評價">
            {{ ratingSummary?.averageRating ?? provider.rating ?? '—' }}
            <span v-if="ratingSummary?.totalCount">（{{ ratingSummary.totalCount }} 則）</span>
          </el-descriptions-item>
          <el-descriptions-item label="違規">{{ provider.violationCount }} ({{ provider.violationLevel }})</el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>

      <el-tab-pane label="特色資料" name="feature" lazy>
        <el-table v-loading="tabLoading.feature" :data="features" border empty-text="尚無特色資料">
          <el-table-column prop="language" label="語系" width="80" />
          <el-table-column prop="featureType" label="類型" width="120" />
          <el-table-column prop="featureContent" label="內容" />
          <el-table-column prop="enable" label="啟用" width="80" />
          <el-table-column label="操作" width="140">
            <template #default="{ row }">
              <el-button text type="primary" @click="editFeature(row)">編輯</el-button>
              <el-button text type="danger" @click="removeFeature(row.id)">刪除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" class="mt-4" @click="openAddFeature">新增特色</el-button>
      </el-tab-pane>

      <el-tab-pane label="作品集" name="works" lazy>
        <el-upload drag accept="image/jpeg,image/png,image/webp" :http-request="uploadWork" :show-file-list="false" class="max-w-xl">
          <div class="text-sm text-gray-500">拖曳或點擊上傳作品（最多 50 張，單檔 2MB）</div>
        </el-upload>
        <div v-loading="tabLoading.works" class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div v-for="w in works" :key="w.id" class="relative group">
            <el-image :src="workImageUrl(w)" fit="cover" class="w-full aspect-square rounded-lg" />
            <el-button
              class="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
              type="danger"
              circle
              size="small"
              @click="removeWork(w.id)"
            >×</el-button>
          </div>
          <el-empty v-if="!tabLoading.works && works.length === 0" description="尚無作品" class="col-span-full" />
        </div>
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

      <el-tab-pane label="評價" name="rating" lazy>
        <el-table v-loading="tabLoading.rating" :data="ratings" border empty-text="尚無評價">
          <el-table-column prop="author" label="評價者" width="120" />
          <el-table-column prop="stars" label="星等" width="80" />
          <el-table-column prop="comments" label="評語" />
          <el-table-column prop="createdAt" label="時間" width="180" />
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="featureDialog" :title="featureEditing ? '編輯特色' : '新增特色'" width="520px">
      <el-form label-width="80px">
        <el-form-item label="語系">
          <el-radio-group v-model="featureForm.language">
            <el-radio label="tw">繁中</el-radio>
            <el-radio label="en">英文</el-radio>
            <el-radio label="jp">日文</el-radio>
            <el-radio label="kr">韓文</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="類型">
          <el-select v-model="featureForm.featureType">
            <el-option label="風格" value="style" />
            <el-option label="服務" value="service" />
            <el-option label="器材" value="equipment" />
          </el-select>
        </el-form-item>
        <el-form-item label="內容">
          <el-input v-model="featureForm.featureContent" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="啟用">
          <el-switch v-model="featureForm.enable" active-value="Y" inactive-value="N" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="featureDialog = false">取消</el-button>
        <el-button type="primary" @click="saveFeature">儲存</el-button>
      </template>
    </el-dialog>
  </div>
  <el-empty v-else description="載入中或找不到攝影師" />
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'
import request from '@/api/request'

const route = useRoute()
const providerId = Number(route.params.id)
const provider = ref<any>(null)
const activeTab = ref('basic')
const basicForm = reactive<any>({})
const savingBasic = ref(false)
const cities = ref<string[]>([])
const districts = ref<string[]>([])
const areaTree = ref<any[]>([])
const serviceTypeOptions = ref<any[]>([])

const schedule = ref<any[]>([])
const serviceAreas = ref<any[]>([])
const bank = ref<any>(null)
const features = ref<any[]>([])
const works = ref<any[]>([])
const ratings = ref<any[]>([])
const ratingSummary = ref<{ averageRating?: number; totalCount?: number } | null>(null)
const tabLoading = reactive({ schedule: false, area: false, bank: false, feature: false, works: false, rating: false })
const loaded = reactive<Record<string, boolean>>({})

const featureDialog = ref(false)
const featureEditing = ref(false)
const featureForm = reactive<any>({ language: 'tw', featureType: 'style', featureContent: '', enable: 'Y' })

const consumerWebBase = import.meta.env.VITE_CONSUMER_WEB_URL || 'https://www.wanderlenstw.com'
const publicProfileUrl = computed(() => {
  const uuid = provider.value?.providerUuid || basicForm.providerUuid
  return uuid ? `${consumerWebBase.replace(/\/$/, '')}/photographer/${uuid}` : '#'
})

const workImageUrl = (w: any) => w.imageUrl || (w.fileUuid ? `/api/files/serve/works/${w.fileUuid}` : '')

const loadRatingSummary = async () => {
  try {
    const res: any = await request.get(`/providers/rating/${providerId}`)
    ratingSummary.value = res.data || null
    if (ratingSummary.value?.averageRating != null && provider.value) {
      provider.value.rating = ratingSummary.value.averageRating
    }
  } catch { /* silent */ }
}

const onCityChange = () => {
  basicForm.districtName = ''
  loadDistricts(basicForm.city)
}

const loadDistricts = (city: string) => {
  const cityNode = areaTree.value.find((a) => a.name === city && (a.parentId == null || a.parentId === 0))
  if (!cityNode) {
    districts.value = []
    return
  }
  districts.value = areaTree.value.filter((a) => a.parentId === cityNode.id).map((a) => a.name)
}

const fillBasicForm = (data: any) => {
  Object.assign(basicForm, data)
  basicForm.serviceTypes = data.serviceItem
    ? String(data.serviceItem).split(',').map((s: string) => Number(s.trim())).filter(Boolean)
    : []
  if (basicForm.city) loadDistricts(basicForm.city)
}

const saveBasic = async () => {
  savingBasic.value = true
  try {
    const payload = {
      ...basicForm,
      id: providerId,
      serviceItem: Array.isArray(basicForm.serviceTypes)
        ? basicForm.serviceTypes.join(',')
        : basicForm.serviceItem,
    }
    await api.updateProvider(payload)
    const res: any = await api.getProvider(providerId)
    provider.value = res.data
    fillBasicForm(res.data)
    ElMessage.success('基本資料已儲存')
  } catch {
    ElMessage.error('儲存失敗')
  } finally {
    savingBasic.value = false
  }
}

const uploadAvatar = async (options: any) => {
  try {
    const res: any = await api.uploadFile('provider_avatar', options.file)
    basicForm.avatar = res.data?.url
  } catch {
    ElMessage.error('上傳失敗')
  }
}

const uploadBanner = async (options: any) => {
  try {
    const res: any = await api.uploadFile('provider_banner', options.file)
    basicForm.bannerImg = res.data?.url
  } catch {
    ElMessage.error('上傳失敗')
  }
}

const openAddFeature = () => {
  Object.assign(featureForm, { language: 'tw', featureType: 'style', featureContent: '', enable: 'Y', id: undefined })
  featureEditing.value = false
  featureDialog.value = true
}

const editFeature = (row: any) => {
  Object.assign(featureForm, row)
  featureEditing.value = true
  featureDialog.value = true
}

const saveFeature = async () => {
  try {
    await api.setProviderFeature({ ...featureForm, providerId })
    featureDialog.value = false
    const res: any = await api.getProviderFeatures(providerId)
    features.value = res.data || []
    ElMessage.success('特色已儲存')
  } catch {
    ElMessage.error('儲存失敗')
  }
}

const removeFeature = async (id: number) => {
  try {
    await ElMessageBox.confirm('確定刪除此特色？', '確認', { type: 'warning' })
    await api.deleteProviderFeature(id, providerId)
    features.value = features.value.filter((f) => f.id !== id)
    ElMessage.success('已刪除')
  } catch (err: any) {
    if (err !== 'cancel') ElMessage.error('刪除失敗')
  }
}

const uploadWork = async (options: any) => {
  if (works.value.length >= 50) {
    ElMessage.warning('作品集最多 50 張')
    return
  }
  if (options.file.size > 2 * 1024 * 1024) {
    ElMessage.error('單檔不可超過 2MB')
    return
  }
  try {
    const res: any = await api.uploadFile('provider_works', options.file)
    const fileUuid = res.data?.uuid
    if (!fileUuid) throw new Error('missing uuid')
    const workRes: any = await api.addProviderWork({ providerId, fileUuid })
    works.value.push(workRes.data)
    ElMessage.success('作品已上傳')
  } catch {
    ElMessage.error('上傳失敗')
  }
}

const removeWork = async (id: number) => {
  try {
    await api.deleteProviderWork(id, providerId)
    works.value = works.value.filter((w) => w.id !== id)
    ElMessage.success('已刪除')
  } catch {
    ElMessage.error('刪除失敗')
  }
}

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
      const res: any = await request.get(`/providers/service-area/${providerId}`, { params: { view: 'flat' } })
      serviceAreas.value = res.data || []
    } else if (tab === 'bank') {
      tabLoading.bank = true
      const res: any = await request.get('/providers/bank', { params: { providerId } })
      bank.value = res.data
    } else if (tab === 'feature') {
      tabLoading.feature = true
      const res: any = await api.getProviderFeatures(providerId)
      features.value = res.data || []
    } else if (tab === 'works') {
      tabLoading.works = true
      const res: any = await api.getProviderWorks(providerId)
      works.value = res.data || []
    } else if (tab === 'rating') {
      tabLoading.rating = true
      const res: any = await request.get(`/providers/rating/${providerId}/list`)
      ratings.value = res.data || []
      await loadRatingSummary()
    }
  } catch { /* tab error */ }
  finally {
    tabLoading[tab as keyof typeof tabLoading] = false
  }
}

watch(activeTab, (tab) => { if (tab !== 'basic') loadTab(tab) })

onMounted(async () => {
  try {
    const treeRes: any = await api.getAreasTree()
    areaTree.value = treeRes.data || []
    cities.value = areaTree.value
      .filter((a) => a.parentId == null || a.parentId === 0)
      .map((a) => a.name)
  } catch { /* silent */ }

  try {
    const stRes: any = await api.getServiceTypes()
    serviceTypeOptions.value = stRes.data || []
  } catch { /* silent */ }

  try {
    const res: any = await api.getProvider(providerId)
    provider.value = res.data
    fillBasicForm(res.data)
    await loadRatingSummary()
  } catch { /* silent */ }
})
</script>
