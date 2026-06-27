<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <h3 class="font-semibold text-lg">公告管理</h3>
        <el-tag v-if="newsList.length > 0" type="info" size="small">{{ newsList.length }} 筆</el-tag>
      </div>
      <div class="flex items-center gap-2">
        <el-input v-model="searchKeyword" placeholder="搜尋公告" :prefix-icon="Search" style="width: 240px" clearable />
        <el-button type="primary" :icon="Plus" @click="openCreate">新增公告</el-button>
      </div>
    </div>

    <!-- 載入中 -->
    <div v-if="loading" class="flex justify-center py-12">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
    </div>

    <el-table v-else :data="filteredNews" border stripe>
      <el-table-column prop="language" label="語系" width="80" />
      <el-table-column prop="topic" label="主題" min-width="150" />
      <el-table-column prop="status" label="狀態" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 'on' ? 'success' : 'info'">{{ row.status === 'on' ? '上架' : '下架' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sortOrder" label="排序" width="80" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button text type="primary" :icon="Edit" @click="openEdit(row)">編輯</el-button>
          <el-popconfirm title="確認刪除？" confirm-button-text="確認" cancel-button-text="取消" @confirm="remove(row.id)">
            <template #reference><el-button text type="danger" :icon="Delete">刪除</el-button></template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/編輯對話框 -->
    <el-dialog v-model="dialogVisible" :title="editing ? '編輯公告' : '新增公告'" width="700px" @closed="resetForm">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="語系" prop="language">
          <el-select v-model="formData.language" class="!w-full">
            <el-option label="繁中" value="zh" />
            <el-option label="英文" value="en" />
            <el-option label="日文" value="jp" />
            <el-option label="韓文" value="ka" />
          </el-select>
        </el-form-item>
        <el-form-item label="主題" prop="topic">
          <el-input v-model="formData.topic" placeholder="請輸入主題" />
        </el-form-item>
        <el-form-item label="內容" prop="content">
          <RichTextEditor v-model="formData.content" />
        </el-form-item>
        <el-form-item label="狀態" prop="status">
          <el-select v-model="formData.status" class="!w-full">
            <el-option label="上架" value="on" />
            <el-option label="下架" value="off" />
          </el-select>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { Search, Plus, Edit, Delete, Loading } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance } from 'element-plus'
import api from '@/api'
import RichTextEditor from '@/components/common/RichTextEditor.vue'

const loading = ref(false)
const saving = ref(false)
const newsList = ref<any[]>([])
const searchKeyword = ref('')
const dialogVisible = ref(false)
const editing = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const formData = reactive({
  language: 'zh',
  topic: '',
  content: '',
  status: 'on',
  sortOrder: 0,
})

const rules = {
  language: [{ required: true, message: '語系不可為空', trigger: 'change' }],
  topic: [{ required: true, message: '主題不可為空', trigger: 'blur' }],
  content: [{ required: true, message: '內容不可為空', trigger: 'blur' }],
}

const filteredNews = computed(() => {
  if (!searchKeyword.value) return newsList.value
  const kw = searchKeyword.value.toLowerCase()
  return newsList.value.filter(n =>
    n.topic?.toLowerCase().includes(kw) || n.language?.toLowerCase().includes(kw)
  )
})

const loadData = async () => {
  loading.value = true
  try {
    const res: any = await api.getNews()
    newsList.value = res.data || []
  } catch {
    ElMessage.error('載入失敗')
    newsList.value = []
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editing.value = false
  editingId.value = null
  Object.assign(formData, { language: 'zh', topic: '', content: '', status: 'on', sortOrder: 0 })
  dialogVisible.value = true
}

const openEdit = (row: any) => {
  editing.value = true
  editingId.value = row.id
  Object.assign(formData, {
    language: row.language || 'zh',
    topic: row.topic || '',
    content: row.content || '',
    status: row.status || 'on',
    sortOrder: row.sortOrder || 0,
  })
  dialogVisible.value = true
}

const resetForm = () => {
  Object.assign(formData, { language: 'zh', topic: '', content: '', status: 'on', sortOrder: 0 })
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
      await api.saveNews(data)
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
    await api.deleteNews(id)
    ElMessage.success('已刪除')
    await loadData()
  } catch {
    ElMessage.error('刪除失敗')
  }
}

onMounted(loadData)
</script>