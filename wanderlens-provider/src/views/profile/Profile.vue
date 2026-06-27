<template>
  <el-card class="max-w-xl">
    <el-form label-width="100px">
      <el-form-item :label="t('profilePage.avatar')">
        <el-upload :show-file-list="false" :http-request="uploadAvatar" accept="image/*">
          <el-avatar :size="64" :src="avatar" />
          <span class="ml-2 text-sm text-blue-500">{{ t('profilePage.uploadHint') }}</span>
        </el-upload>
      </el-form-item>
      <el-form-item :label="t('profilePage.name')"><el-input v-model="username" /></el-form-item>
      <el-form-item><el-button type="primary" @click="save">{{ t('profilePage.save') }}</el-button></el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()
const avatar = ref(authStore.avatar)
const username = ref(authStore.username)

const uploadAvatar = async (options: any) => {
  try {
    const res: any = await api.uploadFile('user_profile', options.file)
    avatar.value = res.data?.url
  } catch {
    ElMessage.error(t('profilePage.uploadFailed'))
  }
}

const save = async () => {
  try {
    await api.updateProvider({
      id: authStore.userId,
      nickName: username.value,
      avatar: avatar.value,
    })
    authStore.setUsername(username.value)
    authStore.setAvatar(avatar.value)
    ElMessage.success(t('profilePage.saveSuccess'))
  } catch {
    ElMessage.error(t('profilePage.saveFailed'))
  }
}
</script>
