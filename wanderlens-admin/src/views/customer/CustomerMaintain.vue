<template>
  <div>
    <!-- 麵包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-4">
      <el-breadcrumb-item>客戶管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜尋列 -->
    <el-row class="mb-4">
      <el-col :span="16">
        <el-select v-model="queryField" placeholder="搜尋欄位" style="width: 120px" class="mr-2">
          <el-option label="姓名" value="username" />
          <el-option label="電話" value="phone" />
          <el-option label="Email" value="email" />
        </el-select>
        <el-input v-model="search" style="width: 200px" placeholder="keyword" :prefix-icon="Search" class="mr-2" />
        <el-button type="primary" @click="search = search">搜尋</el-button>
        <el-button @click="clearQuery">清除查詢</el-button>
      </el-col>
      <el-col :span="8" style="text-align: right">
        <el-button type="primary" :icon="Plus" @click="openAdd">新增</el-button>
      </el-col>
    </el-row>

    <el-table :data="filteredCustomers" border>
      <el-table-column prop="username" label="姓名" width="120" />
      <el-table-column prop="phone" label="電話" width="130" />
      <el-table-column prop="email" label="Email" min-width="180" />
      <el-table-column prop="area" label="地區" width="100" />
      <el-table-column prop="orderCount" label="訂單數" width="80" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button text type="primary" @click="openEdit(row)">編輯</el-button>
          <el-popconfirm title="確認刪除？" @confirm="remove(row.id)">
            <template #reference>
              <el-button text type="danger">刪除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/編輯 Dialog -->
    <el-dialog v-model="showDialog" :title="editing ? '編輯客戶' : '新增客戶'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="帳號" v-if="!editing">
          <el-input v-model="form.empno" placeholder="手機號碼" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="電話">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="地區">
          <el-input v-model="form.area" placeholder="例：台北市" />
        </el-form-item>
        <el-form-item label="密碼" v-if="!editing">
          <el-input v-model="form.password" placeholder="預設 123456" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">確認</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus, ArrowRight } from '@element-plus/icons-vue'
import api from '@/api'

const search = ref('')
const queryField = ref('username')
const customers = ref<any[]>([])
const showDialog = ref(false)
const editing = ref(false)
const saving = ref(false)
const form = reactive<any>({ id: null, empno: '', username: '', phone: '', email: '', area: '', password: '123456' })

const filteredCustomers = computed(() => {
  if (!search.value) return customers.value
  const kw = search.value.toLowerCase()
  const field = queryField.value
  return customers.value.filter(c => String(c[field] || '').toLowerCase().includes(kw))
})

const clearQuery = () => { search.value = ''; queryField.value = 'username' }

const openAdd = () => {
  editing.value = false
  Object.assign(form, { id: null, empno: '', username: '', phone: '', email: '', area: '', password: '123456' })
  showDialog.value = true
}

const openEdit = (row: any) => {
  editing.value = true
  Object.assign(form, { id: row.id, empno: '', username: row.username, phone: row.phone, email: row.email, area: row.area, password: '' })
  showDialog.value = true
}

const save = async () => {
  if (!form.username) { ElMessage.warning('姓名為必填'); return }
  saving.value = true
  try {
    await api.saveUser({ id: form.id, empno: form.empno || form.phone, username: form.username, phone: form.phone, email: form.email, role: 'CONSUMER', password: form.password || undefined, area: form.area })
    ElMessage.success(editing.value ? '已更新' : '已新增')
    showDialog.value = false
    await load()
  } catch { ElMessage.error('儲存失敗') }
  finally { saving.value = false }
}

const remove = async (id: number) => {
  try {
    await api.deleteUser(id)
    ElMessage.success('已刪除')
    await load()
  } catch { ElMessage.error('刪除失敗') }
}

const load = async () => {
  try { const res: any = await api.getCustomers(); customers.value = res.data || [] }
  catch { /* 靜默 */ }
}

onMounted(load)
</script>