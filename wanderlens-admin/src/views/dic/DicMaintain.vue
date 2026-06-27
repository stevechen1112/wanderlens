<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <el-select v-model="dictType" placeholder="選擇字典類型" clearable filterable style="width: 200px" @change="loadData">
        <el-option v-for="t in dictTypes" :key="t" :label="t" :value="t" />
      </el-select>
      <el-button type="primary" :icon="Plus" @click="openAdd">新增字典</el-button>
    </div>

    <el-table :data="dictList" border stripe>
      <el-table-column prop="dictType" label="類型" width="150" />
      <el-table-column prop="dictKey" label="鍵" width="150" />
      <el-table-column prop="dictValue" label="值" />
      <el-table-column prop="sortOrder" label="排序" width="80" />
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

    <el-dialog v-model="showDialog" :title="editing ? '編輯字典' : '新增字典'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="類型" required>
          <el-input v-model="form.dictType" placeholder="例：service_status" />
        </el-form-item>
        <el-form-item label="鍵" required>
          <el-input v-model="form.dictKey" />
        </el-form-item>
        <el-form-item label="值" required>
          <el-input v-model="form.dictValue" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="save">確認</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import request from '@/api/request'

const dictList = ref<any[]>([])
const dictType = ref('')
const showDialog = ref(false)
const editing = ref(false)
const form = reactive<any>({ id: null, dictType: '', dictKey: '', dictValue: '', sortOrder: 0 })

const dictTypes = computed(() => [...new Set(dictList.value.map(d => d.dictType))])

const loadData = async () => {
  try {
    const res: any = await request.get('/dic', { params: { type: dictType.value || undefined } })
    dictList.value = res.data || []
  } catch { dictList.value = [] }
}

const openAdd = () => {
  editing.value = false
  Object.assign(form, { id: null, dictType: dictType.value || '', dictKey: '', dictValue: '', sortOrder: 0 })
  showDialog.value = true
}

const openEdit = (row: any) => {
  editing.value = true
  Object.assign(form, row)
  showDialog.value = true
}

const save = async () => {
  try {
    await request.post('/dic', form)
    ElMessage.success('已儲存')
    showDialog.value = false
    await loadData()
  } catch { ElMessage.error('儲存失敗') }
}

const remove = async (id: number) => {
  try {
    await request.delete(`/dic/${id}`)
    ElMessage.success('已刪除')
    await loadData()
  } catch { ElMessage.error('刪除失敗') }
}

onMounted(loadData)
</script>