<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block text-3xl font-extrabold wl-gradient-text mb-2">WanderLens</NuxtLink>
        <h1 class="text-2xl font-bold text-text-primary">{{ $t('nav.login') }}</h1>
        <p class="text-text-secondary text-sm mt-1">{{ $t('auth.loginDesc') }}</p>
      </div>

      <div class="wl-card p-8">
        <form class="space-y-5" @submit.prevent="handleLogin">
          <div>
            <label for="login-empno" class="block text-sm font-semibold text-text-primary mb-1.5">{{ $t('auth.account') }}</label>
            <input
              id="login-empno"
              v-model="form.empno"
              type="text"
              :placeholder="$t('auth.accountPlaceholder')"
              class="wl-input"
              autocomplete="username"
            />
          </div>

          <div>
            <label for="login-password" class="block text-sm font-semibold text-text-primary mb-1.5">{{ $t('auth.password') }}</label>
            <div class="relative">
              <input
                id="login-password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('auth.passwordPlaceholder')"
                class="wl-input !pr-10"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary text-sm"
                :aria-label="showPassword ? $t('auth.hidePassword') : $t('auth.showPassword')"
                :aria-pressed="showPassword"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? $t('auth.hidePassword') : $t('auth.showPassword') }}
              </button>
            </div>
          </div>

          <Transition name="fade">
            <div v-if="errorMsg" role="alert" class="bg-danger/10 text-danger text-sm px-4 py-3 rounded-lg flex items-center gap-2">
              <span aria-hidden="true">⚠️</span> {{ errorMsg }}
            </div>
          </Transition>

          <button type="submit" :disabled="loading" class="wl-btn-primary w-full !py-3.5 !text-base">
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              {{ $t('auth.loggingIn') }}
            </span>
            <span v-else>{{ $t('nav.login') }}</span>
          </button>
        </form>

        <div class="wl-divider-dot my-6">
          <span class="px-3 text-xs text-text-secondary">{{ $t('auth.orLoginWith') }}</span>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <button type="button" class="flex items-center justify-center gap-2 py-2.5 border-2 border-border rounded-xl text-sm font-semibold hover:border-primary hover:bg-primary-light/30 transition-all">
            LINE
          </button>
          <button type="button" class="flex items-center justify-center gap-2 py-2.5 border-2 border-border rounded-xl text-sm font-semibold hover:border-primary hover:bg-primary-light/30 transition-all">
            Google
          </button>
          <button type="button" class="flex items-center justify-center gap-2 py-2.5 border-2 border-border rounded-xl text-sm font-semibold hover:border-primary hover:bg-primary-light/30 transition-all">
            Facebook
          </button>
        </div>
      </div>

      <p class="text-center text-sm text-text-secondary mt-6">
        {{ $t('auth.noAccount') }}
        <NuxtLink to="/register" class="text-primary font-bold hover:underline">{{ $t('auth.register') }}</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthApi } from '~/api/auth-api'
import { useAuthStore } from '~/stores/auth'

const { t } = useI18n()
const authApi = useAuthApi()
const authStore = useAuthStore()
const route = useRoute()
const loading = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)

const form = reactive({ empno: '', password: '' })

const handleLogin = async () => {
  if (!form.empno || !form.password) {
    errorMsg.value = t('auth.credentialsRequired')
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    const res: any = await authApi.login(form.empno, form.password)
    if (res.data?.token) {
      authStore.setAuth(res.data.token, res.data)
      const tokenCookie = useCookie('wl_token', { maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' })
      tokenCookie.value = res.data.token
      const redirect = route.query.redirect as string
      const safeRedirect =
        redirect && typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
          ? redirect
          : '/'
      await navigateTo(safeRedirect)
    } else {
      errorMsg.value = res.message || t('auth.loginFailed')
    }
  } catch (err: any) {
    errorMsg.value = err?.message || t('common.loadError')
  } finally {
    loading.value = false
  }
}
</script>
