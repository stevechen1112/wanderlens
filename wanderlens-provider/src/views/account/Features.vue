<template>
  <el-card>
    <el-table :data="features" border>
      <el-table-column prop="language" :label="t('featuresPage.language')" width="80" />
      <el-table-column prop="featureType" :label="t('featuresPage.featureType')" width="120" />
      <el-table-column prop="featureContent" :label="t('featuresPage.content')" />
      <el-table-column :label="t('featuresPage.actions')" width="100">
        <template #default="{ row }">
          <el-button text type="primary" @click="edit(row)">{{ t('featuresPage.edit') }}</el-button>
          <el-button text type="danger" @click="remove(row.id)">{{ t('featuresPage.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" class="mt-4" @click="openAdd">{{ t('featuresPage.add') }}</el-button>

    <el-dialog v-model="showDialog" :title="editing ? t('featuresPage.editTitle') : t('featuresPage.addTitle')" width="500px">
      <el-form label-width="80px">
        <el-form-item :label="t('featuresPage.language')">
          <el-radio-group v-model="form.language">
            <el-radio label="tw">{{ t('featuresPage.langTw') }}</el-radio>
            <el-radio label="en">{{ t('featuresPage.langEn') }}</el-radio>
            <el-radio label="jp">{{ t('featuresPage.langJp') }}</el-radio>
            <el-radio label="kr">{{ t('featuresPage.langKr') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('featuresPage.featureType')">
          <el-select v-model="form.featureType" :placeholder="t('featuresPage.selectType')">
            <el-option :label="t('featuresPage.typeStyle')" value="style" />
            <el-option :label="t('featuresPage.typeService')" value="service" />
            <el-option :label="t('featuresPage.typeEquipment')" value="equipment" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('featuresPage.description')">
          <el-input v-model="form.featureContent" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="save">{{ t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()
const features = ref<any[]>([])
const showDialog = ref(false)
const editing = ref(false)
const form = reactive<any>({ language: 'tw', featureType: '', featureContent: '' })

const providerId = () => authStore.resolvedProviderId!

const openAdd = () => {
  Object.assign(form, { language: 'tw', featureType: '', featureContent: '', id: undefined })
  editing.value = false
  showDialog.value = true
}

const edit = (row: any) => {
  Object.assign(form, row)
  editing.value = true
  showDialog.value = true
}

const remove = async (id: number) => {
  try {
    await ElMessageBox.confirm(t('featuresPage.confirmDelete'), t('featuresPage.confirmTitle'), {
      type: 'warning',
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
    })
    await api.deleteFeature(id, providerId())
    features.value = features.value.filter((f) => f.id !== id)
    ElMessage.success(t('featuresPage.deleteSuccess'))
  } catch (err: any) {
    if (err !== 'cancel') ElMessage.error(t('featuresPage.deleteFailed'))
  }
}

const save = async () => {
  try {
    await api.setFeature({ ...form, providerId: providerId() })
    ElMessage.success(t('featuresPage.saveSuccess'))
    showDialog.value = false
    loadFeatures()
  } catch {
    ElMessage.error(t('featuresPage.saveFailed'))
  }
}

const loadFeatures = async () => {
  if (!providerId()) return
  try {
    const res: any = await api.getFeature(providerId())
    features.value = res.data || []
  } catch {
    // silent
  }
}

onMounted(loadFeatures)
</script>
