<template>
  <el-card class="max-w-xl">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item :label="t('bankPage.bankCode')" prop="bankCode">
        <el-input v-model="form.bankCode" :placeholder="t('bankPage.bankCodePlaceholder')" maxlength="3" />
      </el-form-item>
      <el-form-item :label="t('bankPage.bankName')" prop="bankName">
        <el-input v-model="form.bankName" :placeholder="t('bankPage.bankNamePlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('bankPage.bankBranch')" prop="bankBranch">
        <el-input v-model="form.bankBranch" :placeholder="t('bankPage.bankBranchPlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('bankPage.accountName')" prop="accountName">
        <el-input v-model="form.accountName" :placeholder="t('bankPage.accountNamePlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('bankPage.accountNo')" prop="accountNo">
        <el-input v-model="form.accountNo" :placeholder="t('bankPage.accountNoPlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('bankPage.note')">
        <el-input v-model="form.note" type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="saving" @click="save">{{ t('bankPage.save') }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import api from '@/api'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const saving = ref(false)
const form = reactive<any>({})

const rules = computed(() => ({
  bankCode: [{ required: true, message: t('bankPage.bankCodeRequired'), trigger: 'blur' }],
  bankName: [{ required: true, message: t('bankPage.bankNameRequired'), trigger: 'blur' }],
  accountName: [{ required: true, message: t('bankPage.accountNameRequired'), trigger: 'blur' }],
  accountNo: [{ required: true, message: t('bankPage.accountNoRequired'), trigger: 'blur' }],
}))

const save = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    saving.value = true
    try {
      await api.setBank(form)
      ElMessage.success(t('bankPage.saveSuccess'))
    } catch {
      ElMessage.error(t('bankPage.saveFailed'))
    } finally {
      saving.value = false
    }
  })
}

onMounted(async () => {
  try {
    const res: any = await api.getBank()
    Object.assign(form, res.data)
  } catch {
    // silent
  }
})
</script>
