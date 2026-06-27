<template>
  <div>
    <el-card>
      <el-form label-width="80px">
        <el-form-item label="訊息">
          <el-input v-model="message" type="textarea" :rows="5" placeholder="輸入群發訊息" />
        </el-form-item>
        <el-form-item label="對象">
          <el-radio-group v-model="target">
            <el-radio label="photographer">攝影師</el-radio>
            <el-radio label="admin">管理員</el-radio>
            <el-radio label="all">全部</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-popconfirm title="確認群發？" @confirm="send">
            <template #reference><el-button type="success">LINE 群發</el-button></template>
          </el-popconfirm>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const message = ref('')
const target = ref('photographer')

const send = async () => {
  try { await api.sendLineNotify(target.value as any, message.value); ElMessage.success('群發成功') }
  catch { ElMessage.error('群發失敗') }
}
</script>