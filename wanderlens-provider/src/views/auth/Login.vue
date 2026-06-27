<template>
  <div class="login-page min-h-screen flex items-center justify-center relative" style="background: linear-gradient(135deg, #f5f5f5, #e8f7fa)">
    <div class="absolute top-4 right-4">
      <WlLangSwitcher />
    </div>
    <el-card class="w-[340px]" shadow="always" :body-style="{ padding: '32px' }">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold mb-1" style="color: var(--wl-primary)">WanderLens</h1>
        <p class="text-sm text-gray-500">{{ t('auth.providerSubtitle') }}</p>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="0" @submit.prevent="handleLogin">
        <el-form-item prop="empno">
          <el-input
            v-model="form.empno"
            :placeholder="t('auth.empno')"
            :prefix-icon="User"
            size="large"
            :aria-label="t('auth.empno')"
            autocomplete="username"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            :placeholder="t('auth.password')"
            :prefix-icon="Lock"
            size="large"
            show-password
            :aria-label="t('auth.password')"
            autocomplete="current-password"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-button type="primary" size="large" class="w-full" :loading="loading" native-type="submit">
          {{ loading ? t('auth.loggingIn') : t('auth.login') }}
        </el-button>
      </el-form>
    </el-card>
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

const form = reactive({
  empno: '',
  password: '',
})

const rules = computed(() => ({
  empno: [{ required: true, message: t('auth.empnoRequired'), trigger: 'blur' }],
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
        authStore.setAuth(
          res.data.token,
          res.data.userId,
          res.data.empno,
          res.data.username,
          res.data.role,
          res.data.avatar,
          res.data.providerId,
        )
        try {
          const providerId = res.data.providerId ?? res.data.userId
          const providerRes: any = await api.getProvider(providerId)
          const pType = providerRes.data?.providerType || 'PHOTOGRAPHER'
          authStore.setProviderType(pType)
        } catch { /* 靜默 */ }
        ElMessage.success(t('auth.loginSuccess'))
        router.push(authStore.isStylist ? '/stylist-schedule' : '/account')
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
