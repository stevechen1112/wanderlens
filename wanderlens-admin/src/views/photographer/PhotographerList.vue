<template>
  <div>
    <!-- 麵包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-4">
      <el-breadcrumb-item>攝影師管理</el-breadcrumb-item>
      <el-breadcrumb-item>攝影師列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜尋列 -->
    <el-row class="mb-4">
      <el-col :span="16">
        <el-select v-model="queryField" placeholder="搜尋欄位" style="width: 120px" class="mr-2">
          <el-option label="姓名" value="name" />
          <el-option label="暱稱" value="nickName" />
          <el-option label="電話" value="phone" />
          <el-option label="Email" value="email" />
        </el-select>
        <el-input v-model="keyword" style="width: 200px" placeholder="keyword" :prefix-icon="Search" class="mr-2" />
        <el-button type="primary" @click="load">搜尋</el-button>
        <el-button @click="clearQuery">清除查詢</el-button>
      </el-col>
      <el-col :span="8" style="text-align: right">
        <el-button type="warning" @click="$router.push('/photographers/dashboard')">主控台</el-button>
        <el-button type="primary" :icon="Plus" @click="showAddDialog = true">新增</el-button>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <!-- 左側地區分組 table -->
      <el-col :span="6">
        <el-table :data="areaGroups" stripe size="small" @row-click="(row: any) => filterByCity(row.city)">
          <el-table-column :label="`地區 (上架 ${liveCount} / 全部 ${providers.length})`">
            <template #default="{ row }">
              <el-button text type="primary">{{ row.city }} ({{ row.total }})</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <!-- 右側攝影師列表 -->
      <el-col :span="18">
        <el-table :data="pagedProviders" stripe border>
          <el-table-column label="姓名" width="200">
            <template #default="{ row }">
              <div class="flex items-center gap-2">
                <el-avatar v-if="row.avatar" :size="32" :src="row.avatar" />
                <el-avatar v-else :size="32">{{ row.name?.charAt(0) || '?' }}</el-avatar>
                <span>{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="nickName" label="暱稱" width="120" />
          <el-table-column prop="phone" label="電話" width="130" />
          <el-table-column prop="city" label="縣/市" width="80" />
          <el-table-column label="是否上架" width="100">
            <template #default="{ row }">
              <el-switch :model-value="row.goLive === 'Y'" @change="(val: string | number | boolean) => toggleLive(row.id, val === true)" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button type="warning" :icon="Edit" circle size="small" @click.stop="$router.push(`/photographers/${row.id}`)" />
              <el-popconfirm title="確定刪除此筆資料嗎?" confirm-button-text="確定" cancel-button-text="取消" @confirm="handleDelete(row.id)">
                <template #reference>
                  <el-button type="danger" :icon="Delete" circle size="small" @click.stop />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分頁 -->
        <div class="flex justify-center mt-4" v-if="filteredProviders.length > pageSize">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredProviders.length"
            layout="prev, pager, next, total"
            background
          />
        </div>
      </el-col>
    </el-row>

    <!-- 新增攝影師 Dialog -->
    <el-dialog v-model="showAddDialog" title="新增攝影師" width="600px">
      <el-form :model="addForm" label-width="80px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="手機" required>
              <el-input v-model="addForm.phone" placeholder="09xxxxxxxx" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" required>
              <el-input v-model="addForm.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="暱稱">
              <el-input v-model="addForm.nickName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Email">
              <el-input v-model="addForm.email" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="縣市">
              <el-input v-model="addForm.city" placeholder="例：台北市" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密碼">
              <el-input v-model="addForm.password" placeholder="預設 123456" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" :loading="adding" @click="addPhotographer">確認新增</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus, Edit, Delete, ArrowRight } from '@element-plus/icons-vue'
import api from '@/api'

const providers = ref<any[]>([])
const queryField = ref('name')
const keyword = ref('')
const cityFilter = ref('')
const currentPage = ref(1)
const pageSize = 10
const showAddDialog = ref(false)
const adding = ref(false)
const addForm = reactive<any>({ phone: '', name: '', nickName: '', email: '', city: '', password: '123456' })

const liveCount = computed(() => providers.value.filter(p => p.goLive === 'Y').length)

const areaGroups = computed((): { city: string; live: number; total: number }[] => {
  const groups: Record<string, { city: string; live: number; total: number }> = {}
  providers.value.forEach(p => {
    const city = p.city || '未設定'
    if (!groups[city]) groups[city] = { city, live: 0, total: 0 }
    groups[city].total++
    if (p.goLive === 'Y') groups[city].live++
  })
  return Object.values(groups)
})

const filteredProviders = computed(() => {
  let result = providers.value
  if (cityFilter.value) result = result.filter(p => p.city === cityFilter.value)
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    const field = queryField.value
    result = result.filter(p => String(p[field] || '').toLowerCase().includes(kw))
  }
  return result
})

const pagedProviders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProviders.value.slice(start, start + pageSize)
})

const filterByCity = (city: string) => { cityFilter.value = cityFilter.value === city ? '' : city }
const clearQuery = () => { keyword.value = ''; cityFilter.value = ''; queryField.value = 'name' }

const handleDelete = async (id: number) => {
  try { await api.deleteUser(id); ElMessage.success('已刪除'); await load() }
  catch { ElMessage.error('刪除失敗') }
}

const toggleLive = async (id: number, live: boolean) => {
  try { await api.setProviderLive(id, live); ElMessage.success('已更新') }
  catch { ElMessage.error('更新失敗') }
}

const addPhotographer = async () => {
  if (!addForm.phone || !addForm.name) { ElMessage.warning('手機和姓名為必填'); return }
  adding.value = true
  try {
    await api.saveUser({ empno: addForm.phone, username: addForm.name, phone: addForm.phone, email: addForm.email, role: 'PHOTOGRAPHER', password: addForm.password })
    ElMessage.success('攝影師已建立')
    showAddDialog.value = false
    addForm.phone = ''; addForm.name = ''; addForm.nickName = ''; addForm.email = ''; addForm.city = ''; addForm.password = '123456'
    await load()
  } catch { ElMessage.error('建立失敗') }
  finally { adding.value = false }
}

const load = async () => {
  try { const res: any = await api.getProviders(); providers.value = res.data || [] }
  catch { /* 靜默 */ }
}

onMounted(load)
</script>