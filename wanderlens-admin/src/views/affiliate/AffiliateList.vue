<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-lg">推廣員管理</h3>
      <div class="flex items-center gap-2">
        <el-input v-model="searchKeyword" placeholder="搜尋推廣員" :prefix-icon="Search" style="width: 240px" clearable />
        <el-button type="primary" :icon="Plus" @click="openCreate">新增推廣員</el-button>
      </div>
    </div>

    <!-- 載入中 -->
    <div v-if="loading" class="flex justify-center py-12">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
    </div>

    <!-- 空狀態 -->
    <el-empty v-else-if="filteredAffiliates.length === 0" description="無推廣員" />

    <!-- 推廣員表格 -->
    <el-table v-else :data="filteredAffiliates" border stripe>
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="empno" label="帳號" width="120" />
      <el-table-column prop="phone" label="電話" width="130" />
      <el-table-column prop="referralCode" label="推薦碼" width="120" />
      <el-table-column prop="clickCount" label="點擊數" width="80" align="center" />
      <el-table-column prop="orderCount" label="成交數" width="80" align="center" />
      <el-table-column prop="totalCommission" label="總佣金" width="100" align="right">
        <template #default="{ row }">$ {{ row.totalCommission?.toLocaleString() || 0 }}</template>
      </el-table-column>
      <el-table-column prop="bankAccount" label="銀行帳號" width="150" show-overflow-tooltip />
      <el-table-column prop="status" label="狀態" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '活躍' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button text type="primary" :icon="Edit" @click="openEdit(row)">編輯</el-button>
          <el-popconfirm
            title="確認刪除？"
            confirm-button-text="確認"
            cancel-button-text="取消"
            @confirm="remove(row.id)"
          >
            <template #reference>
              <el-button text type="danger" :icon="Delete">刪除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/編輯對話框 -->
    <el-dialog v-model="dialogVisible" :title="editing ? '編輯推廣員' : '新增推廣員'" width="500px" @closed="resetForm">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="請輸入姓名" />
        </el-form-item>
        <el-form-item label="帳號" prop="empno">
          <el-input v-model="formData.empno" placeholder="請輸入帳號" :disabled="editing" />
        </el-form-item>
        <el-form-item label="電話" prop="phone">
          <el-input v-model="formData.phone" placeholder="請輸入電話" />
        </el-form-item>
        <el-form-item label="推薦碼" prop="referralCode">
          <el-input v-model="formData.referralCode" placeholder="自動產生或手動輸入" />
        </el-form-item>
        <el-form-item label="銀行帳號" prop="bankAccount">
          <el-input v-model="formData.bankAccount" placeholder="銀行代碼-帳號" />
        </el-form-item>
        <el-form-item label="狀態" prop="status">
          <el-select v-model="formData.status" class="!w-full">
            <el-option label="活躍" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
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

const loading = ref(false)
const saving = ref(false)
const affiliates = ref<any[]>([])
const searchKeyword = ref('')
const dialogVisible = ref(false)
const editing = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const formData = reactive({
  name: '', empno: '', phone: '', referralCode: '', bankAccount: '', status: 'active',
})

const rules = {
  name: [{ required: true, message: '姓名不可為空', trigger: 'blur' }],
  empno: [{ required: true, message: '帳號不可為空', trigger: 'blur' }],
  phone: [{ required: true, message: '電話不可為空', trigger: 'blur' }],
}

const filteredAffiliates = computed(() => {
  if (!searchKeyword.value) return affiliates.value
  const kw = searchKeyword.value.toLowerCase()
  return affiliates.value.filter(a =>
    a.name?.toLowerCase().includes(kw) || a.empno?.toLowerCase().includes(kw) || a.referralCode?.toLowerCase().includes(kw)
  )
})

const loadData = async () => {
  loading.value = true
  try {
    const res: any = await api.getAffiliates()
    affiliates.value = res.data || []
  } catch {
    affiliates.value = []
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editing.value = false
  editingId.value = null
  Object.assign(formData, { name: '', empno: '', phone: '', referralCode: '', bankAccount: '', status: 'active' })
  dialogVisible.value = true
}

const openEdit = (row: any) => {
  editing.value = true
  editingId.value = row.id
  Object.assign(formData, { name: row.name, empno: row.empno, phone: row.phone, referralCode: row.referralCode, bankAccount: row.bankAccount, status: row.status })
  dialogVisible.value = true
}

const resetForm = () => {
  Object.assign(formData, { name: '', empno: '', phone: '', referralCode: '', bankAccount: '', status: 'active' })
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
      if (editingId.value !== null) data.id = editingId.value
      await api.saveAffiliate(data)
      ElMessage.success(editing.value ? '更新成功' : '新增成功')
      dialogVisible.value = false
      await loadData()
    } catch {
      ElMessage.error(editing.value ? '更新失敗' : '新增失敗')
    } finally {
      saving.value = false
    }
  })
}

const remove = async (id: number) => {
  try {
    await api.deleteAffiliate(id)
    ElMessage.success('已刪除')
    await loadData()
  } catch {
    ElMessage.error('刪除失敗')
  }
}

onMounted(loadData)
</script>