<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block text-3xl font-extrabold wl-gradient-text mb-2">WanderLens</NuxtLink>
        <h1 class="text-2xl font-bold text-text-primary">{{ $t('auth.register') }}</h1>
        <p class="text-text-secondary text-sm mt-1">{{ $t('auth.registerDesc') }}</p>
      </div>

      <div class="wl-card p-8">
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-text-primary mb-1.5">{{ $t('auth.account') }}</label>
            <input v-model="form.empno" type="text" class="wl-input" :placeholder="$t('auth.accountPlaceholder')" required autocomplete="username" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-primary mb-1.5">{{ $t('auth.name') }}</label>
            <input v-model="form.username" type="text" class="wl-input" :placeholder="$t('auth.namePlaceholder')" required autocomplete="name" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-text-primary mb-1.5">{{ $t('auth.phone') }}</label>
              <input v-model="form.phone" type="tel" class="wl-input" :placeholder="$t('auth.phonePlaceholder')" required autocomplete="tel" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-text-primary mb-1.5">{{ $t('auth.email') }}</label>
              <input v-model="form.email" type="email" class="wl-input" :placeholder="$t('auth.emailPlaceholder')" autocomplete="email" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-primary mb-1.5">{{ $t('auth.password') }}</label>
            <input v-model="form.password" :type="showPw ? 'text' : 'password'" class="wl-input" :placeholder="$t('auth.passwordPlaceholder')" required autocomplete="new-password" />
            <div class="mt-1.5 flex gap-1">
              <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-colors" :class="passwordStrength >= i ? (i <= 2 ? 'bg-warning' : 'bg-success') : 'bg-border'" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-primary mb-1.5">{{ $t('auth.confirmPassword') }}</label>
            <input v-model="form.confirmPassword" type="password" class="wl-input" :class="{ 'error': form.confirmPassword && form.password !== form.confirmPassword }" :placeholder="$t('auth.confirmPasswordPlaceholder')" required autocomplete="new-password" />
            <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="text-danger text-xs mt-1">{{ $t('profile.passwordMismatch') }}</p>
          </div>

          <Transition name="fade">
            <div v-if="error" class="bg-danger/10 text-danger text-sm px-4 py-3 rounded-lg flex items-center gap-2">
              <span>⚠️</span> {{ error }}
            </div>
          </Transition>

          <button type="submit" class="wl-btn-primary w-full !py-3.5 !text-base" :disabled="loading || !isFormValid">
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              {{ $t('common.loading') }}
            </span>
            <span v-else>{{ $t('auth.register') }}</span>
          </button>
        </form>
      </div>

      <p class="text-center text-sm text-text-secondary mt-6">
        {{ $t('auth.haveAccount') }}
        <NuxtLink to="/login" class="text-primary font-bold hover:underline">{{ $t('auth.login') }}</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthApi } from '~/api/auth-api'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const authApi = useAuthApi()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')
const showPw = ref(false)

const form = reactive({
  empno: '',
  username: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const passwordStrength = computed(() => {
  const pw = form.password
  if (!pw) return 0
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) || /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  return Math.min(score, 4)
})

const isFormValid = computed(() =>
  form.empno && form.username && form.phone && form.password &&
  form.password === form.confirmPassword && form.password.length >= 6
)

const handleRegister = async () => {
  if (!isFormValid.value) return
  loading.value = true
  error.value = ''
  try {
    const res: any = await authApi.register({
      empno: form.empno,
      username: form.username,
      phone: form.phone,
      email: form.email,
      password: form.password,
    })
    if (res.data?.token) {
      authStore.setAuth(res.data.token, res.data)
      const tokenCookie = useCookie('wl_token', { maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' })
      tokenCookie.value = res.data.token
      await navigateTo('/')
    } else {
      error.value = res.message || t('auth.registerFailed')
    }
  } catch (err: any) {
    error.value = err?.message || t('common.loadError')
  } finally {
    loading.value = false
  }
}
</script>