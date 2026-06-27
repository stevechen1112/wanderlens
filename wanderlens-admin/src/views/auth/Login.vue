<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-primary-light/20 relative">
    <div class="absolute top-4 right-4">
      <WlLangSwitcher />
    </div>
    <div class="w-[380px]">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold" style="background: linear-gradient(135deg, #F37A69, #E85D4A); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">WanderLens</h1>
        <p class="text-gray-500 mt-2 text-sm">{{ t('auth.adminSubtitle') }}</p>
      </div>
      <el-card shadow="always" :body-style="{ padding: '36px' }">
        <el-form ref="formRef" :model="form" :rules="rules" size="large" @submit.prevent="handleLogin">
          <el-form-item prop="empno">
            <el-input
              v-model="form.empno"
              :placeholder="t('auth.account')"
              :prefix-icon="User"
              :aria-label="t('auth.account')"
              autocomplete="username"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              :placeholder="t('auth.password')"
              :prefix-icon="Lock"
              show-password
              :aria-label="t('auth.password')"
              autocomplete="current-password"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="w-full !h-11 !text-base" :loading="loading" native-type="submit">
              {{ loading ? t('auth.loggingIn') : t('auth.login') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <p class="text-center text-xs text-gray-400 mt-6">{{ t('auth.footer') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import WlLangSwitcher from '@/components/WlLangSwitcher.vue'
import api from '@/api'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive({ empno: '', password: '' })
const rules = computed(() => ({
  empno: [{ required: true, message: t('auth.accountRequired'), trigger: 'blur' }],
  password: [{ required: true, message: t('auth.passwordRequired'), trigger: 'blur' }],
}))

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res: any = await api.login(form.empno, form.password)
      if (res.data?.token) {
        authStore.setAuth(res.data.token, res.data.userId, res.data.username, res.data.role, res.data.avatar)
        ElMessage.success(t('auth.loginSuccess'))
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } }; message?: string }
      const msg = ax.response?.data?.message
      ElMessage.error(msg || (ax.response ? t('auth.loginFailed') : t('auth.networkError')))
    } finally {
      loading.value = false
    }
  })
}
</script>
