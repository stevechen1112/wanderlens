<template>
  <div>
    <div class="wl-crud-header flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
      <div class="flex items-center gap-3 min-w-0">
        <h3 class="font-semibold text-lg truncate">{{ title }}</h3>
        <el-tag v-if="data.length > 0" type="info" size="small">{{ t('common.recordCount', { count: data.length }) }}</el-tag>
      </div>
      <div class="flex flex-col xs:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
        <el-input
          v-if="searchable"
          v-model="searchKeyword"
          :placeholder="t('crud.searchPlaceholder')"
          :prefix-icon="Search"
          class="wl-crud-search"
          clearable
        />
        <el-button type="primary" :icon="Plus" class="shrink-0" @click="openCreate">{{ t('crud.add') }}</el-button>
      </div>
    </div>

    <div v-loading="loading" class="min-h-[120px]">
      <el-empty v-if="!loading && filteredData.length === 0" :description="t('common.noData')" />

      <div v-else-if="filteredData.length > 0" class="wl-table-scroll">
        <el-table :data="pagedData" border stripe class="mb-4">
          <el-table-column type="index" label="#" width="50" align="center" />
          <el-table-column
            v-for="col in columns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :width="col.width"
            :formatter="col.formatter"
          >
            <template v-if="col.slot" #default="{ row }">
              <slot :name="col.slot" :row="row" />
            </template>
          </el-table-column>
          <el-table-column :label="t('common.actions')" width="180" fixed="right">
            <template #default="{ row }">
              <el-button text type="primary" :icon="Edit" @click="openEdit(row)">{{ t('common.edit') }}</el-button>
              <el-popconfirm
                :title="t('common.confirmDelete')"
                :confirm-button-text="t('common.confirmDeleteBtn')"
                :cancel-button-text="t('common.cancel')"
                confirm-button-type="danger"
                @confirm="remove(row.id)"
              >
                <template #reference>
                  <el-button text type="danger" :icon="Delete">{{ t('common.delete') }}</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div v-if="filteredData.length > pageSize" class="flex justify-center">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredData.length"
        layout="prev, pager, next, total"
        background
      />
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="editing ? t('common.editTitle', { title }) : t('common.createTitle', { title })"
      width="min(600px, 92vw)"
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item
          v-for="col in columns"
          :key="col.prop"
          :label="col.label"
          :prop="col.prop"
        >
          <el-input
            v-if="!col.type || col.type === 'text'"
            v-model="formData[col.prop]"
            :placeholder="t('common.inputPlaceholder', { field: col.label })"
          />
          <el-input-number
            v-else-if="col.type === 'number'"
            v-model="formData[col.prop]"
            :min="col.min ?? 0"
            :max="col.max"
            :precision="col.precision"
            :step="col.step ?? 1"
            class="!w-full"
          />
          <el-select
            v-else-if="col.type === 'select'"
            v-model="formData[col.prop]"
            :placeholder="t('common.selectPlaceholder', { field: col.label })"
            class="!w-full"
          >
            <el-option
              v-for="opt in col.options || []"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <el-date-picker
            v-else-if="col.type === 'date'"
            v-model="formData[col.prop]"
            type="date"
            value-format="YYYY-MM-DD"
            :placeholder="t('common.selectPlaceholder', { field: col.label })"
            class="!w-full"
          />
          <el-date-picker
            v-else-if="col.type === 'datetime'"
            v-model="formData[col.prop]"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
            :placeholder="t('common.selectPlaceholder', { field: col.label })"
            class="!w-full"
          />
          <el-switch
            v-else-if="col.type === 'switch'"
            v-model="formData[col.prop]"
            :active-value="col.activeValue ?? 'Y'"
            :inactive-value="col.inactiveValue ?? 'N'"
          />
          <el-input
            v-else-if="col.type === 'textarea'"
            v-model="formData[col.prop]"
            type="textarea"
            :rows="col.rows ?? 3"
            :placeholder="t('common.inputPlaceholder', { field: col.label })"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="saving" @click="submit">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

export interface CrudColumn {
  prop: string
  label: string
  width?: number
  type?: 'text' | 'number' | 'select' | 'date' | 'datetime' | 'switch' | 'textarea'
  options?: { label: string; value: any }[]
  min?: number
  max?: number
  precision?: number
  step?: number
  rows?: number
  activeValue?: any
  inactiveValue?: any
  formatter?: (row: any, column: any, value: any) => string
  slot?: string
  required?: boolean
}

const props = defineProps<{
  title: string
  load: () => Promise<any>
  save: (data: any) => Promise<any>
  delete: (id: number) => Promise<any>
  columns: CrudColumn[]
  searchable?: boolean
  pageSize?: number
}>()

const { t } = useI18n()

const data = ref<any[]>([])
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const editing = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const formRef = ref<FormInstance>()
const formData = reactive<Record<string, any>>({})
const editingId = ref<number | null>(null)

const pageSize = props.pageSize ?? 20

const filteredData = computed(() => {
  if (!searchKeyword.value) return data.value
  const kw = searchKeyword.value.toLowerCase()
  return data.value.filter(row =>
    props.columns.some(col =>
      String(row[col.prop] ?? '').toLowerCase().includes(kw)
    )
  )
})

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

const formRules = computed<FormRules>(() => {
  const rules: FormRules = {}
  for (const col of props.columns) {
    if (col.required) {
      rules[col.prop] = [{
        required: true,
        message: t('common.required', { field: col.label }),
        trigger: 'blur',
      }]
    }
  }
  return rules
})

const loadData = async () => {
  loading.value = true
  try {
    const res: any = await props.load()
    data.value = res.data || res || []
  } catch {
    ElMessage.error(t('common.loadFailed'))
    data.value = []
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editing.value = false
  editingId.value = null
  for (const col of props.columns) {
    formData[col.prop] = col.type === 'switch' ? (col.inactiveValue ?? 'N') : (col.type === 'number' ? 0 : '')
  }
  dialogVisible.value = true
}

const openEdit = (row: any) => {
  editing.value = true
  editingId.value = row.id
  for (const col of props.columns) {
    formData[col.prop] = row[col.prop] ?? ''
  }
  dialogVisible.value = true
}

const resetForm = () => {
  for (const col of props.columns) {
    formData[col.prop] = ''
  }
  editingId.value = null
  formRef.value?.resetFields()
}

const submit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    saving.value = true
    try {
      const submitData: any = { ...formData }
      if (editingId.value !== null) {
        submitData.id = editingId.value
      }
      await props.save(submitData)
      ElMessage.success(editing.value ? t('common.updateSuccess') : t('common.createSuccess'))
      dialogVisible.value = false
      await loadData()
    } catch {
      ElMessage.error(editing.value ? t('common.updateFailed') : t('common.createFailed'))
    } finally {
      saving.value = false
    }
  })
}

const remove = async (id: number) => {
  try {
    await props.delete(id)
    ElMessage.success(t('common.deleteSuccess'))
    await loadData()
  } catch {
    ElMessage.error(t('common.deleteFailed'))
  }
}

onMounted(loadData)
</script>

<style scoped>
.wl-crud-search {
  width: 100%;
}
@media (min-width: 640px) {
  .wl-crud-search {
    width: 240px;
  }
}
</style>
