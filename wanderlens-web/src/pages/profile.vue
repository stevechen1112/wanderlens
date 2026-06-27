<template>
  <div class="wl-container py-8 max-w-2xl">
    <div class="mb-8">
      <span class="wl-badge wl-badge-primary mb-2">{{ $t('profile.memberCenter') }}</span>
      <h1 class="text-3xl font-extrabold text-text-primary">{{ $t('nav.profile') }}</h1>
    </div>

    <div v-if="loading" class="space-y-4">
      <div class="wl-card p-6">
        <div class="flex items-center gap-4">
          <div class="wl-skeleton wl-skeleton-avatar !w-16 !h-16" />
          <div class="flex-1">
            <div class="wl-skeleton wl-skeleton-text !w-32" />
            <div class="wl-skeleton wl-skeleton-text-sm !w-24" />
          </div>
        </div>
      </div>
    </div>

    <template v-else>
      <div class="wl-card p-6 mb-6">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 rounded-2xl wl-gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {{ profile.username?.charAt(0) || '?' }}
          </div>
          <div>
            <p class="font-bold text-lg">{{ profile.username }}</p>
            <p class="text-text-secondary text-sm">{{ profile.empno }}</p>
            <span class="inline-block mt-1 px-2.5 py-0.5 bg-primary-light text-primary rounded-full text-xs font-semibold">{{ profile.role }}</span>
          </div>
        </div>

        <h2 class="font-bold text-text-primary mb-4">{{ $t('profile.basicInfo') }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-semibold text-text-primary mb-1.5 block">{{ $t('auth.phone') }}</label>
            <input v-model="profile.phone" class="wl-input" :placeholder="$t('auth.phonePlaceholder')" />
          </div>
          <div>
            <label class="text-sm font-semibold text-text-primary mb-1.5 block">{{ $t('auth.email') }}</label>
            <input v-model="profile.email" class="wl-input" :placeholder="$t('auth.emailPlaceholder')" />
          </div>
        </div>
        <button class="wl-btn-primary mt-5" :disabled="saving" @click="saveProfile">
          {{ saving ? $t('common.processing') : $t('profile.saveChanges') }}
        </button>
      </div>

      <div class="wl-card p-6 mb-6">
        <h2 class="font-bold text-text-primary mb-4">{{ $t('profile.changePassword') }}</h2>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-semibold text-text-primary mb-1.5 block">{{ $t('profile.oldPassword') }}</label>
            <input v-model="passwordForm.oldPassword" type="password" class="wl-input" :placeholder="$t('profile.oldPasswordPlaceholder')" />
          </div>
          <div>
            <label class="text-sm font-semibold text-text-primary mb-1.5 block">{{ $t('profile.newPassword') }}</label>
            <input v-model="passwordForm.newPassword" type="password" class="wl-input" :placeholder="$t('profile.newPasswordPlaceholder')" />
          </div>
          <div>
            <label class="text-sm font-semibold text-text-primary mb-1.5 block">{{ $t('auth.confirmPassword') }}</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="wl-input"
              :class="{ error: passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword }"
              :placeholder="$t('auth.confirmPasswordPlaceholder')"
            />
          </div>
          <p v-if="passwordError" class="text-danger text-sm">{{ passwordError }}</p>
          <button class="wl-btn-secondary" :disabled="changingPassword" @click="changePassword">
            {{ changingPassword ? $t('common.processing') : $t('profile.changePassword') }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <NuxtLink to="/orders" class="wl-card p-4 text-center wl-hover-lift wl-tap-active group">
          <div class="text-3xl mb-2">📋</div>
          <span class="text-sm font-semibold">{{ $t('nav.orders') }}</span>
        </NuxtLink>
        <NuxtLink to="/albums" class="wl-card p-4 text-center wl-hover-lift wl-tap-active group">
          <div class="text-3xl mb-2">🖼️</div>
          <span class="text-sm font-semibold">{{ $t('album.myAlbums') }}</span>
        </NuxtLink>
        <NuxtLink to="/conversations" class="wl-card p-4 text-center wl-hover-lift wl-tap-active group">
          <div class="text-3xl mb-2">💬</div>
          <span class="text-sm font-semibold">{{ $t('nav.conversations') }}</span>
        </NuxtLink>
        <button class="wl-card p-4 text-center wl-hover-lift wl-tap-active group" @click="handleLogout">
          <div class="text-3xl mb-2">🚪</div>
          <span class="text-sm font-semibold text-danger">{{ $t('nav.logout') }}</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuthApi } from '~/api/auth-api'
import { useToast } from '~/composables/useToast'

definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const authApi = useAuthApi()
const toast = useToast()

const loading = ref(true)
const saving = ref(false)
const changingPassword = ref(false)
const passwordError = ref('')

const profile = reactive({
  username: '',
  empno: '',
  role: '',
  phone: '',
  email: '',
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const loadProfile = async () => {
  try {
    const res: any = await authApi.me()
    Object.assign(profile, res.data)
  } catch {
    // ignore
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  saving.value = true
  try {
    await authApi.updateProfile({
      username: profile.username,
      phone: profile.phone,
      email: profile.email,
    })
    toast.success(t('profile.saveSuccess'))
  } catch {
    toast.error(t('profile.saveFailed'))
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  passwordError.value = ''
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = t('profile.passwordMismatch')
    return
  }
  if (passwordForm.newPassword.length < 6) {
    passwordError.value = t('profile.passwordTooShort')
    return
  }
  changingPassword.value = true
  try {
    await authApi.changePassword(passwordForm.oldPassword, passwordForm.newPassword)
    toast.success(t('profile.passwordChanged'))
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (err: any) {
    passwordError.value = err?.response?.data?.message || t('profile.changeFailed')
  } finally {
    changingPassword.value = false
  }
}

const handleLogout = async () => {
  try {
    await authApi.logout()
  } catch {
    // ignore
  }
  if (import.meta.client) {
    localStorage.removeItem('wl_token')
    localStorage.removeItem('wl_user_id')
  }
  navigateTo('/')
}

onMounted(loadProfile)
</script>
