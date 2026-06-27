<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <el-input v-model="search" placeholder="搜尋折扣碼" :prefix-icon="Search" style="width: 300px" clearable />
      <el-button type="primary" :icon="Plus" @click="openCreate">新增折扣碼</el-button>
    </div>

    <!-- 載入中 -->
    <div v-if="loading" class="flex justify-center py-12">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
    </div>

    <el-table v-else :data="filteredCoupons" border stripe>
      <el-table-column prop="couponName" label="名稱" min-width="120" />
      <el-table-column prop="couponCode" label="折扣碼" width="120" />
      <el-table-column prop="discount" label="折扣" width="80" align="right" />
      <el-table-column prop="discountType" label="類型" width="80">
        <template #default="{ row }">
          <el-tag size="small">{{ row.discountType === 'PERCENT' ? '百分比' : '固定金額' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="使用次數" width="100">
        <template #default="{ row }">{{ row.usageCountCurrent || 0 }}/{{ row.usageCount || '∞' }}</template>
      </el-table-column>
      <el-table-column prop="startDate" label="開始日期" width="120" />
      <el-table-column prop="endDate" label="結束日期" width="120" />
      <el-table-column prop="active" label="狀態" width="80">
        <template #default="{ row }">
          <el-tag :type="row.active === 'Y' ? 'success' : 'info'">{{ row.active === 'Y' ? '啟用' : '停用' }}</el-tag>
        </template>
      </el-table-column>
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
    <el-dialog v-model="dialogVisible" :title="editing ? '編輯折扣碼' : '新增折扣碼'" width="500px" @closed="resetForm">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="名稱" prop="couponName">
          <el-input v-model="formData.couponName" placeholder="請輸入名稱" />
        </el-form-item>
        <el-form-item label="折扣碼" prop="couponCode">
          <el-input v-model="formData.couponCode" placeholder="請輸入折扣碼" />
        </el-form-item>
        <el-form-item label="折扣類型" prop="discountType">
          <el-select v-model="formData.discountType" class="!w-full">
            <el-option label="固定金額" value="FIXED" />
            <el-option label="百分比" value="PERCENT" />
          </el-select>
        </el-form-item>
        <el-form-item label="折扣值" prop="discount">
          <el-input-number v-model="formData.discount" :min="0" :max="formData.discountType === 'PERCENT' ? 100 : 10000" class="!w-full" />
        </el-form-item>
        <el-form-item label="使用次數" prop="usageCount">
          <el-input-number v-model="formData.usageCount" :min="0" :max="9999" class="!w-full" />
          <span class="text-xs text-gray-400 ml-2">0 = 無限制</span>
        </el-form-item>
        <el-form-item label="開始日期" prop="startDate">
          <el-date-picker v-model="formData.startDate" type="date" value-format="YYYY-MM-DD" class="!w-full" />
        </el-form-item>
        <el-form-item label="結束日期" prop="endDate">
          <el-date-picker v-model="formData.endDate" type="date" value-format="YYYY-MM-DD" class="!w-full" />
        </el-form-item>
        <el-form-item label="啟用" prop="active">
          <el-switch v-model="formData.active" active-value="Y" inactive-value="N" />
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
const coupons = ref<any[]>([])
const dialogVisible = ref(false)
const editing = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const formData = reactive({
  couponName: '', couponCode: '', discountType: 'FIXED', discount: 0,
  usageCount: 0, startDate: '', endDate: '', active: 'Y',
})

const rules = {
  couponName: [{ required: true, message: '名稱不可為空', trigger: 'blur' }],
  couponCode: [{ required: true, message: '折扣碼不可為空', trigger: 'blur' }],
  discount: [{ required: true, message: '折扣值不可為空', trigger: 'blur' }],
}

const filteredCoupons = computed(() => {
  if (!search.value) return coupons.value
  const kw = search.value.toLowerCase()
  return coupons.value.filter(c =>
    c.couponName?.toLowerCase().includes(kw) || c.couponCode?.toLowerCase().includes(kw)
  )
})

const openCreate = () => {
  editing.value = false
  editingId.value = null
  Object.assign(formData, { couponName: '', couponCode: '', discountType: 'FIXED', discount: 0, usageCount: 0, startDate: '', endDate: '', active: 'Y' })
  dialogVisible.value = true
}

const openEdit = (row: any) => {
  editing.value = true
  editingId.value = row.id
  Object.assign(formData, {
    couponName: row.couponName, couponCode: row.couponCode,
    discountType: row.discountType || 'FIXED', discount: row.discount || 0,
    usageCount: row.usageCount || 0, startDate: row.startDate || '', endDate: row.endDate || '',
    active: row.active || 'Y',
  })
  dialogVisible.value = true
}

const resetForm = () => {
  Object.assign(formData, { couponName: '', couponCode: '', discountType: 'FIXED', discount: 0, usageCount: 0, startDate: '', endDate: '', active: 'Y' })
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
      await api.saveCoupon(data)
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
  try { await api.deleteCoupon(id); ElMessage.success('已刪除'); load() }
  catch { ElMessage.error('刪除失敗') }
}

const load = async () => {
  loading.value = true
  try { const res: any = await api.getCoupons(); coupons.value = res.data || [] }
  catch { ElMessage.error('載入失敗'); coupons.value = [] }
  finally { loading.value = false }
}

onMounted(load)
</script>