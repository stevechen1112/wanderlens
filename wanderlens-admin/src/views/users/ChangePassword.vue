<template>
  <el-card class="max-w-xl">
    <el-form :model="form" :rules="rules" label-width="120px" ref="formRef">
      <el-form-item label="舊密碼" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" show-password />
      </el-form-item>
      <el-form-item label="新密碼" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" show-password />
      </el-form-item>
      <el-form-item label="確認新密碼" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="saving" @click="save">變更密碼</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import api from '@/api'

const formRef = ref<FormInstance>()
const saving = ref(false)
const form = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })

const rules = {
  oldPassword: [{ required: true, message: '請輸入舊密碼', trigger: 'blur' }],
  newPassword: [{ required: true, message: '請輸入新密碼', trigger: 'blur' }, { min: 6, message: '密碼至少 6 碼', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '請確認新密碼', trigger: 'blur' }, {
    validator: (_rule: any, value: string, callback: any) => {
      if (value !== form.newPassword) callback(new Error('兩次密碼不一致'))
      else callback()
    }, trigger: 'blur'
  }],
}

const save = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    saving.value = true
    try {
      await api.changePassword(form.oldPassword, form.newPassword)
      ElMessage.success('密碼已變更')
      form.oldPassword = ''; form.newPassword = ''; form.confirmPassword = ''
    } catch { ElMessage.error('變更失敗') }
    finally { saving.value = false }
  })
}
</script>