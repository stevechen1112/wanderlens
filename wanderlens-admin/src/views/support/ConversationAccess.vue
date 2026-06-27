<template>
  <div>
    <h3 class="font-semibold mb-4">溝通調閱</h3>
    <el-input v-model="conversationId" placeholder="輸入溝通室 ID" style="width: 200px" class="mb-4" />
    <el-input v-model="reason" placeholder="調閱原因" style="width: 300px" class="mb-4 ml-2" />
    <el-button type="primary" @click="access">調閱</el-button>

    <div v-if="messages.length > 0" class="mt-4">
      <el-card>
        <div v-for="msg in messages" :key="msg.id" class="mb-2">
          <span class="text-xs text-gray-400">{{ msg.createdAt }}</span>
          <span class="ml-2 font-semibold">{{ msg.senderId === 0 ? '系統' : '用戶' + msg.senderId }}:</span>
          <span class="ml-1">{{ msg.content || '[圖片]' }}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const conversationId = ref('')
const reason = ref('')
const messages = ref<any[]>([])

const access = async () => {
  if (!conversationId.value || !reason.value) {
    ElMessage.warning('請輸入溝通室 ID 和調閱原因')
    return
  }
  try {
    const res: any = await api.accessConversation(Number(conversationId.value), reason.value)
    messages.value = res.data || []
    ElMessage.success('調閱成功（已記錄日誌）')
  } catch {
    ElMessage.error('調閱失敗')
  }
}
</script>