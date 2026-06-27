<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <el-card class="w-[340px]" shadow="always" :body-style="{ padding: '32px' }">
      <div class="text-center mb-6">
        <h1 class="text-xl font-bold" style="color: var(--wl-primary)">WanderLens</h1>
        <p class="text-sm text-gray-500 mt-1">修圖工單系統登入</p>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules">
        <el-form-item prop="empno">
          <el-input v-model="form.empno" placeholder="帳號" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密碼" size="large" show-password />
        </el-form-item>
        <el-button type="primary" size="large" class="w-full" :loading="loading" @click="handleLogin">登入</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive({ empno: '', password: '' })
const rules = {
  empno: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
  password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }],
}

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res: any = await api.login(form.empno, form.password)
      if (res.data?.token) {
        authStore.setAuth(res.data.token, res.data.userId, res.data.companyName || res.data.username || '修圖公司', res.data.username || form.empno)
        ElMessage.success('登入成功')
        router.push('/jobs')
      } else {
        ElMessage.error('登入失敗：回應格式異常')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message
      ElMessage.error(msg || '帳號或密碼錯誤')
    } finally {
      loading.value = false
    }
  })
}
</script>