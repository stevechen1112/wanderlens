<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <el-select v-model="selectedFlow" placeholder="選擇流程" clearable filterable style="width: 200px" @change="loadSteps">
        <el-option v-for="f in flowList" :key="f.flowName" :label="f.flowName" :value="f.flowName" />
      </el-select>
      <el-button type="primary" :icon="Plus" @click="openAdd">新增流程步驟</el-button>
    </div>

    <el-table :data="steps" border stripe>
      <el-table-column prop="flowName" label="流程名稱" width="150" />
      <el-table-column prop="stepName" label="步驟名稱" width="150" />
      <el-table-column prop="stepOrder" label="順序" width="80" />
      <el-table-column prop="description" label="說明" />
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

    <el-dialog v-model="showDialog" :title="editing ? '編輯流程步驟' : '新增流程步驟'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="流程名稱" required>
          <el-input v-model="form.flowName" placeholder="例：order_flow" />
        </el-form-item>
        <el-form-item label="步驟名稱" required>
          <el-input v-model="form.stepName" />
        </el-form-item>
        <el-form-item label="順序">
          <el-input-number v-model="form.stepOrder" :min="1" />
        </el-form-item>
        <el-form-item label="說明">
          <el-input v-model="form.description" type="textarea" :rows="3" />
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

const allSteps = ref<any[]>([])
const selectedFlow = ref('')
const showDialog = ref(false)
const editing = ref(false)
const form = reactive<any>({ id: null, flowName: '', stepName: '', stepOrder: 1, description: '' })

const flowList = computed(() => {
  const flows: Record<string, { flowName: string }> = {}
  allSteps.value.forEach(s => {
    if (!flows[s.flowName]) flows[s.flowName] = { flowName: s.flowName }
  })
  return Object.values(flows)
})

const steps = computed(() => {
  if (!selectedFlow.value) return allSteps.value
  return allSteps.value.filter(s => s.flowName === selectedFlow.value)
})

const loadSteps = async () => {
  try {
    const res: any = await request.get('/flow')
    allSteps.value = res.data || []
  } catch { allSteps.value = [] }
}

const openAdd = () => {
  editing.value = false
  Object.assign(form, { id: null, flowName: selectedFlow.value || '', stepName: '', stepOrder: 1, description: '' })
  showDialog.value = true
}

const openEdit = (row: any) => {
  editing.value = true
  Object.assign(form, row)
  showDialog.value = true
}

const save = async () => {
  try {
    await request.post('/flow', form)
    ElMessage.success('已儲存')
    showDialog.value = false
    await loadSteps()
  } catch { ElMessage.error('儲存失敗') }
}

const remove = async (id: number) => {
  try {
    await request.delete(`/flow/${id}`)
    ElMessage.success('已刪除')
    await loadSteps()
  } catch { ElMessage.error('刪除失敗') }
}

onMounted(loadSteps)
</script>