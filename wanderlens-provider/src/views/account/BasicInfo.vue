<template>
  <el-card shadow="never" class="basic-info-card">
    <el-form :model="form" label-width="120px" class="max-w-2xl">
      <el-form-item :label="t('profilePage.frontendLink')">
        <el-link :href="frontendUrl" target="_blank" type="primary">{{ frontendUrl }}</el-link>
      </el-form-item>
      <el-form-item :label="t('profilePage.lineNotify')">
        <el-button type="success" :icon="ChatLineRound" @click="connectLineNotify">
          {{ form.lineUserId ? `✅ ${t('profilePage.lineBound')}` : t('profilePage.lineBind') }}
        </el-button>
        <span class="ml-2 text-xs text-gray-400">{{ t('profilePage.lineHint') }}</span>
      </el-form-item>
      <el-form-item :label="t('profilePage.phone')">
        <el-input v-model="form.phone" readonly />
      </el-form-item>
      <el-form-item :label="t('profilePage.name')">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item :label="t('profilePage.nickName')">
        <el-input v-model="form.nickName" />
      </el-form-item>
      <el-form-item :label="t('profilePage.email')">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item :label="t('profilePage.city')">
        <el-select v-model="form.city" :placeholder="t('profilePage.selectCity')" filterable @change="onCityChange">
          <el-option v-for="c in cities" :key="c" :label="c" :value="c" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('profilePage.district')">
        <el-select v-model="form.districtName" :placeholder="t('profilePage.selectDistrict')" filterable :disabled="!form.city">
          <el-option v-for="d in districts" :key="d" :label="d" :value="d" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('profilePage.address')">
        <el-input v-model="form.address" :placeholder="t('profilePage.addressPlaceholder')" @blur="geocode">
          <template #append>
            <el-button :loading="geocoding" @click="geocode">{{ t('profilePage.geocode') }}</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item :label="t('profilePage.coordinates')">
        <span class="text-sm text-gray-500">{{ form.addrLng ?? '—' }}, {{ form.addrLat ?? '—' }}</span>
      </el-form-item>
      <el-form-item :label="t('profilePage.intro')">
        <el-input v-model="form.intro" type="textarea" :rows="4" />
      </el-form-item>

      <el-divider>{{ t('profilePage.professional') }}</el-divider>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="8">
          <el-form-item :label="t('profilePage.career')">
            <el-select v-model="form.career" :placeholder="t('profilePage.selectCareer')">
              <el-option :label="t('profilePage.careerFull')" value="全職攝影" />
              <el-option :label="t('profilePage.careerPart')" value="兼職攝影" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-form-item :label="t('profilePage.experience')">
            <el-input-number v-model="form.experience" :min="0" :step="0.5" :precision="1" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-form-item :label="t('profilePage.serviceTypes')">
            <el-select v-model="form.serviceTypes" multiple :placeholder="t('profilePage.selectServiceTypes')" filterable>
              <el-option v-for="st in serviceTypeOptions" :key="st.id" :label="st.name" :value="st.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider>{{ t('profilePage.multilingual') }}</el-divider>
      <el-form-item :label="t('profilePage.nickNameEn')">
        <el-input v-model="form.nickNameEn" />
      </el-form-item>
      <el-form-item :label="t('profilePage.nickNameJp')">
        <el-input v-model="form.nickNameJp" />
      </el-form-item>
      <el-form-item :label="t('profilePage.nickNameKr')">
        <el-input v-model="form.nickNameKr" />
      </el-form-item>
      <el-form-item :label="t('profilePage.introEn')">
        <el-input v-model="form.introEn" type="textarea" :rows="3" />
      </el-form-item>

      <el-form-item :label="t('profilePage.avatar')">
        <el-upload :show-file-list="false" :http-request="uploadAvatar" accept="image/*">
          <el-avatar :size="80" :src="form.avatar" />
          <span class="ml-2 text-sm text-blue-500">{{ t('profilePage.clickUpload') }}</span>
        </el-upload>
      </el-form-item>
      <el-form-item :label="t('profilePage.banner')">
        <el-upload :show-file-list="false" :http-request="uploadBanner" accept="image/*">
          <el-image v-if="form.bannerImg" :src="form.bannerImg" class="w-48 h-24 rounded" fit="cover" />
          <span v-else class="text-sm text-blue-500">{{ t('profilePage.clickUpload') }}</span>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="saving" @click="save">{{ t('profilePage.save') }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { ChatLineRound } from '@element-plus/icons-vue'
import api from '@/api'
import request from '@/api/request'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { t } = useI18n()
const form = reactive<any>({})
const areaTree = ref<any[]>([])
const cities = ref<string[]>([])
const districts = ref<string[]>([])
const geocoding = ref(false)
const saving = ref(false)
const serviceTypeOptions = ref<any[]>([])

const frontendUrl = computed(() => `http://localhost:3001/photographer/${form.providerUuid || ''}`)

const connectLineNotify = () => {
  // 開啟 LINE Notify 授權頁面
  const clientId = 'YOUR_LINE_CLIENT_ID'
  const redirectUri = encodeURIComponent(window.location.origin + '/line/callback')
  const state = `provider_${authStore.userId}`
  window.open(
    `https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=notify&state=${state}`,
    '_blank',
  )
}

const onCityChange = () => {
  form.districtName = ''
  loadDistricts(form.city)
}

const loadDistricts = (city: string) => {
  const cityNode = areaTree.value.find((a) => a.name === city && (a.parentId == null || a.parentId === 0))
  if (!cityNode) {
    districts.value = areaTree.value.filter((a) => a.parentId != null && a.parentId !== 0 && a.name?.includes(city))
      .map((a) => a.name)
    return
  }
  districts.value = areaTree.value
    .filter((a) => a.parentId === cityNode.id)
    .map((a) => a.name)
}

const geocode = async () => {
  const full = [form.city, form.districtName, form.address].filter(Boolean).join('')
  if (!full) return
  geocoding.value = true
  try {
    const res: any = await api.geocodeAddress(full)
    const coords = res.data
    if (Array.isArray(coords) && coords.length >= 2) {
      form.addrLat = coords[0]
      form.addrLng = coords[1]
      ElMessage.success(t('profilePage.geocodeSuccess'))
    }
  } catch {
    ElMessage.error(t('profilePage.geocodeFailed'))
  } finally {
    geocoding.value = false
  }
}

const uploadAvatar = async (options: any) => {
  try {
    const res: any = await api.uploadFile('provider_avatar', options.file)
    form.avatar = res.data?.url
  } catch {
    ElMessage.error(t('profilePage.uploadFailed'))
  }
}

const uploadBanner = async (options: any) => {
  try {
    const res: any = await api.uploadFile('provider_banner', options.file)
    form.bannerImg = res.data?.url
  } catch {
    ElMessage.error(t('profilePage.uploadFailed'))
  }
}

const save = async () => {
  saving.value = true
  try {
    await api.updateProvider(form)
    ElMessage.success(t('profilePage.saveSuccess'))
  } catch {
    ElMessage.error(t('profilePage.saveFailed'))
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const treeRes: any = await api.getAreasTree()
    areaTree.value = treeRes.data || []
    cities.value = areaTree.value
      .filter((a) => a.parentId == null || a.parentId === 0)
      .map((a) => a.name)
  } catch { /* 靜默 */ }

  // 載入服務類型選項
  try {
    const stRes: any = await request.get('/service-types')
    serviceTypeOptions.value = stRes.data || []
  } catch { /* 靜默 */ }

  if (authStore.userId) {
    try {
      const res: any = await api.getProvider(authStore.userId)
      Object.assign(form, res.data)
      if (form.city) loadDistricts(form.city)
    } catch { /* 靜默 */ }
  }
})
</script>

<style scoped>
.basic-info-card {
  border-radius: 12px;
}
</style>
