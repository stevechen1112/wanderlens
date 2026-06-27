<template>
  <el-card class="max-w-md">
    <el-form :model="form" label-width="100px">
      <el-form-item :label="t('changePasswordPage.oldPassword')">
        <el-input v-model="form.oldPassword" type="password" show-password autocomplete="current-password" />
      </el-form-item>
      <el-form-item :label="t('changePasswordPage.newPassword')">
        <el-input v-model="form.newPassword" type="password" show-password autocomplete="new-password" />
      </el-form-item>
      <el-form-item :label="t('changePasswordPage.confirmPassword')">
        <el-input v-model="form.confirmPassword" type="password" show-password autocomplete="new-password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">{{ t('changePasswordPage.submit') }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()
const form = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })

const submit = async () => {
  if (form.newPassword !== form.confirmPassword) {
    ElMessage.error(t('changePasswordPage.mismatch'))
    return
  }
  try {
    await api.changePassword(form.oldPassword, form.newPassword)
    ElMessage.success(t('changePasswordPage.success'))
    authStore.clearAuth()
    router.push('/login')
  } catch {
    ElMessage.error(t('changePasswordPage.failed'))
  }
}
</script>
