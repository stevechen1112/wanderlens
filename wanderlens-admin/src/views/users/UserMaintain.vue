<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <el-input v-model="search" placeholder="搜尋使用者" :prefix-icon="Search" style="width: 300px" clearable />
      <el-button type="primary" :icon="Plus" @click="openCreate">新增使用者</el-button>
    </div>

    <!-- 載入中 -->
    <div v-if="loading" class="flex justify-center py-12">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
    </div>

    <el-table v-else :data="filteredUsers" border stripe>
      <el-table-column prop="username" label="姓名" />
      <el-table-column prop="empno" label="帳號" width="120" />
      <el-table-column prop="role" label="角色" width="120">
        <template #default="{ row }">
          <el-tag>{{ roleLabel(row.role) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="電話" width="150" />
      <el-table-column prop="email" label="Email" min-width="180" show-overflow-tooltip />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button text type="primary" :icon="Edit" @click="openEdit(row)">編輯</el-button>
          <el-popconfirm title="確認刪除？" @confirm="remove(row.id)">
            <template #reference><el-button text type="danger" :icon="Delete">刪除</el-button></template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/編輯對話框 -->
    <el-dialog v-model="dialogVisible" :title="editing ? '編輯使用者' : '新增使用者'" width="500px" @closed="resetForm">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="formData.username" placeholder="請輸入姓名" />
        </el-form-item>
        <el-form-item label="帳號" prop="empno">
          <el-input v-model="formData.empno" placeholder="請輸入帳號" :disabled="editing" />
        </el-form-item>
        <el-form-item v-if="!editing" label="密碼" prop="password">
          <el-input v-model="formData.password" type="password" placeholder="請輸入密碼" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" class="!w-full">
            <el-option label="系統管理員" value="ADMIN" />
            <el-option label="客服" value="SUPPORT" />
            <el-option label="財務" value="FINANCE" />
            <el-option label="編輯" value="EDITOR" />
            <el-option label="消費者" value="CONSUMER" />
            <el-option label="攝影師" value="PHOTOGRAPHER" />
          </el-select>
        </el-form-item>
        <el-form-item label="電話" prop="phone">
          <el-input v-model="formData.phone" placeholder="請輸入電話" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="formData.email" placeholder="請輸入 Email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="submit">確認</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Search, Plus, Edit, Delete, Loading } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance } from 'element-plus'
import api from '@/api'

const search = ref('')
const loading = ref(false)
const saving = ref(false)
const users = ref<any[]>([])
const dialogVisible = ref(false)
const editing = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const formData = reactive({
  username: '', empno: '', password: '', role: 'CONSUMER', phone: '', email: '',
})

const rules = {
  username: [{ required: true, message: '姓名不可為空', trigger: 'blur' }],
  empno: [{ required: true, message: '帳號不可為空', trigger: 'blur' }],
  password: [{ required: true, message: '密碼不可為空', trigger: 'blur' }],
  role: [{ required: true, message: '角色不可為空', trigger: 'change' }],
}

const roleLabel = (role: string) => {
  const map: Record<string, string> = {
    ADMIN: '管理員', SUPPORT: '客服', FINANCE: '財務', EDITOR: '編輯',
    CONSUMER: '消費者', PHOTOGRAPHER: '攝影師', RETOUCH: '修圖',
  }
  return map[role] || role
}

const filteredUsers = computed(() =>
  users.value.filter(u =>
    !search.value ||
    u.username?.includes(search.value) ||
    u.empno?.includes(search.value)
  )
)

const openCreate = () => {
  editing.value = false
  editingId.value = null
  Object.assign(formData, { username: '', empno: '', password: '', role: 'CONSUMER', phone: '', email: '' })
  dialogVisible.value = true
}

const openEdit = (row: any) => {
  editing.value = true
  editingId.value = row.id
  Object.assign(formData, { username: row.username, empno: row.empno, password: '', role: row.role, phone: row.phone || '', email: row.email || '' })
  dialogVisible.value = true
}

const resetForm = () => {
  Object.assign(formData, { username: '', empno: '', password: '', role: 'CONSUMER', phone: '', email: '' })
  editingId.value = null
  formRef.value?.resetFields()
}

const submit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    saving.value = true
    try {
      const data: any = { ...formData }
      if (editingId.value !== null) {
        data.id = editingId.value
        delete data.password // 編輯時不更新密碼
      }
      await api.saveUser(data)
      ElMessage.success(editing.value ? '更新成功' : '新增成功')
      dialogVisible.value = false
      await load()
    } catch {
      ElMessage.error(editing.value ? '更新失敗' : '新增失敗')
    } finally {
      saving.value = false
    }
  })
}

const remove = async (id: number) => {
  try { await api.deleteUser(id); ElMessage.success('已刪除'); load() }
  catch { ElMessage.error('刪除失敗') }
}

const load = async () => {
  loading.value = true
  try { const res: any = await api.getUsers(); users.value = res.data || [] }
  catch { ElMessage.error('載入失敗'); users.value = [] }
  finally { loading.value = false }
}

onMounted(load)
</script>