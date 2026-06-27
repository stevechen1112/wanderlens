<template>
  <div>
    <el-button type="primary" class="mb-4" @click="openCreate">新增選單</el-button>
    <el-table :data="menus" border>
      <el-table-column prop="name" label="選單名稱" />
      <el-table-column prop="path" label="路徑" />
      <el-table-column prop="icon" label="圖示" width="80" />
      <el-table-column prop="sortOrder" label="排序" width="80" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button text type="primary" @click="openEdit(row)">編輯</el-button>
          <el-popconfirm title="確認刪除此選單？" confirm-button-text="確認刪除" cancel-button-text="取消" confirm-button-type="danger" @confirm="remove(row.id)">
            <template #reference>
              <el-button text type="danger">刪除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/編輯對話框 -->
    <el-dialog v-model="dialogVisible" :title="editing ? '編輯選單' : '新增選單'" width="500px" @closed="resetForm">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="名稱" prop="name">
          <el-input v-model="formData.name" placeholder="請輸入選單名稱" />
        </el-form-item>
        <el-form-item label="路徑" prop="path">
          <el-input v-model="formData.path" placeholder="請輸入路徑" />
        </el-form-item>
        <el-form-item label="圖示" prop="icon">
          <el-input v-model="formData.icon" placeholder="請輸入圖示名稱" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="formData.sortOrder" :min="0" class="!w-full" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import api from '@/api'

const menus = ref<any[]>([])
const dialogVisible = ref(false)
const editing = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive({ name: '', path: '', icon: '', sortOrder: 0 })
const rules = {
  name: [{ required: true, message: '名稱不可為空', trigger: 'blur' }],
  path: [{ required: true, message: '路徑不可為空', trigger: 'blur' }],
}

const openCreate = () => {
  editing.value = false
  editingId.value = null
  Object.assign(formData, { name: '', path: '', icon: '', sortOrder: 0 })
  dialogVisible.value = true
}

const openEdit = (row: any) => {
  editing.value = true
  editingId.value = row.id
  Object.assign(formData, { name: row.name, path: row.path, icon: row.icon || '', sortOrder: row.sortOrder || 0 })
  dialogVisible.value = true
}

const resetForm = () => {
  Object.assign(formData, { name: '', path: '', icon: '', sortOrder: 0 })
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
      await api.saveMenu(data)
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
  try { await api.deleteMenu(id); ElMessage.success('已刪除'); load() }
  catch { ElMessage.error('刪除失敗') }
}

const load = async () => {
  try { const res: any = await api.getMenus(); menus.value = res.data || [] }
  catch { /* 靜默 */ }
}
onMounted(load)
</script>