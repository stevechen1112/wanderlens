<template>
  <el-card class="max-w-xl">
    <el-form :model="form" label-width="100px">
      <el-form-item label="帳號">
        <el-input v-model="form.empno" readonly />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="電話">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="saving" @click="save">儲存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const saving = ref(false)
const form = reactive<any>({ empno: '', username: '', email: '', phone: '' })

const save = async () => {
  saving.value = true
  try {
    await api.saveUser({ id: form.id, username: form.username, email: form.email, phone: form.phone })
    ElMessage.success('已儲存')
  } catch { ElMessage.error('儲存失敗') }
  finally { saving.value = false }
}

onMounted(async () => {
  try {
    const res: any = await api.me()
    Object.assign(form, res.data)
  } catch { /* 靜默 */ }
})
</script>