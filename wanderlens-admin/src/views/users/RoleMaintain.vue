<template>
  <div>
    <el-button type="primary" class="mb-4" @click="openCreate">新增角色</el-button>
    <el-table :data="roles" border>
      <el-table-column prop="name" label="角色名稱" />
      <el-table-column prop="engName" label="英文名稱" />
      <el-table-column prop="description" label="說明" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button text type="primary" @click="editPermissions(row)">權限設定</el-button>
          <el-popconfirm title="確認刪除此角色？" confirm-button-text="確認刪除" cancel-button-text="取消" confirm-button-type="danger" @confirm="remove(row.id)">
            <template #reference>
              <el-button text type="danger">刪除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增角色對話框 -->
    <el-dialog v-model="dialogVisible" title="新增角色" width="500px" @closed="resetForm">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="角色名稱" prop="name">
          <el-input v-model="formData.name" placeholder="請輸入角色名稱" />
        </el-form-item>
        <el-form-item label="英文名稱" prop="engName">
          <el-input v-model="formData.engName" placeholder="請輸入英文名稱" />
        </el-form-item>
        <el-form-item label="說明" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="請輸入角色說明" />
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

const roles = ref<any[]>([])
const dialogVisible = ref(false)
const saving = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive({ name: '', engName: '', description: '' })
const rules = {
  name: [{ required: true, message: '角色名稱不可為空', trigger: 'blur' }],
  engName: [{ required: true, message: '英文名稱不可為空', trigger: 'blur' }],
}

const openCreate = () => {
  Object.assign(formData, { name: '', engName: '', description: '' })
  dialogVisible.value = true
}

const resetForm = () => {
  Object.assign(formData, { name: '', engName: '', description: '' })
  formRef.value?.resetFields()
}

const submit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    saving.value = true
    try {
      await api.saveRole(formData)
      ElMessage.success('新增成功')
      dialogVisible.value = false
      await load()
    } catch {
      ElMessage.error('新增失敗')
    } finally {
      saving.value = false
    }
  })
}

const editPermissions = (row: any) => {
  ElMessage.info(`權限設定功能開發中：${row.name}`)
}
const remove = async (id: number) => {
  try { await api.deleteRole(id); ElMessage.success('已刪除'); load() }
  catch { ElMessage.error('刪除失敗') }
}

const load = async () => {
  try { const res: any = await api.getRoles(); roles.value = res.data || [] }
  catch { /* 靜默 */ }
}

onMounted(load)
</script>