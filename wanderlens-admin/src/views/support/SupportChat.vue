<template>
  <div class="flex gap-4 h-[calc(100vh-120px)]">
    <el-card class="w-80 flex-shrink-0 overflow-auto">
      <div class="font-semibold mb-3">客服 / 管理通道</div>
      <el-button type="primary" size="small" class="mb-3 w-full" @click="loadList">重新整理</el-button>
      <div
        v-for="conv in conversations"
        :key="conv.id"
        class="p-3 rounded cursor-pointer mb-2 border"
        :class="activeId === conv.id ? 'border-primary bg-orange-50' : 'border-gray-100'"
        @click="selectConv(conv)"
      >
        <div class="font-medium text-sm">{{ conv.peerName || conv.conversationType }}</div>
        <div class="text-xs text-gray-400 truncate">{{ conv.lastMessage || '尚無訊息' }}</div>
        <el-badge v-if="conv.unreadCount" :value="conv.unreadCount" class="mt-1" />
      </div>
      <div v-if="!conversations.length" class="text-gray-400 text-sm text-center py-8">尚無對話</div>
    </el-card>

    <el-card class="flex-1 flex flex-col">
      <template v-if="activeId">
        <div class="font-semibold mb-2">{{ activeTitle }}</div>
        <div ref="msgBox" class="flex-1 overflow-y-auto space-y-2 mb-3 p-2 bg-gray-50 rounded min-h-[50vh]">
          <div v-for="msg in messages" :key="msg.id">
            <div v-if="msg.messageType === 'SYSTEM'" class="text-center text-xs text-gray-400">{{ msg.content }}</div>
            <div v-else :class="['flex', isStaffMsg(msg) ? 'justify-end' : 'justify-start']">
              <div :class="['max-w-[70%] rounded-lg px-3 py-2 text-sm', isStaffMsg(msg) ? 'bg-primary text-white' : 'bg-white border']">
                <p v-if="msg.messageType === 'TEXT'">{{ msg.content }}</p>
                <el-image v-else-if="msg.messageType === 'IMAGE'" :src="msg.imageUrl" class="max-w-full rounded" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeStatus === 'OPEN'" class="flex gap-2">
          <el-input v-model="inputText" placeholder="回覆訊息..." @keyup.enter="send" />
          <el-button type="primary" @click="send">發送</el-button>
        </div>
        <div v-else class="text-center text-sm text-gray-400">此通道已關閉或唯讀</div>
      </template>
      <div v-else class="flex-1 flex items-center justify-center text-gray-400">請選擇左側對話</div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const conversations = ref<any[]>([])
const messages = ref<any[]>([])
const activeId = ref<number | null>(null)
const activeTitle = ref('')
const activeStatus = ref('OPEN')
const inputText = ref('')
const msgBox = ref<HTMLElement>()
const activePeerId = ref(0)
let pollTimer: ReturnType<typeof setInterval> | undefined

const isStaffMsg = (msg: any) => msg.senderId !== activePeerId.value && msg.senderId !== 0

const loadList = async () => {
  try {
    const res: any = await api.getSupportConversations()
    conversations.value = res.data || []
  } catch {
    ElMessage.error('載入失敗')
  }
}

const selectConv = async (conv: any) => {
  activeId.value = conv.id
  activeTitle.value = conv.peerName || conv.conversationType
  activeStatus.value = conv.status
  activePeerId.value = conv.participantBId
  await loadMessages()
  await api.markConversationRead(conv.id)
}

const loadMessages = async () => {
  if (!activeId.value) return
  try {
    const res: any = await api.getConversationMessages(activeId.value)
    messages.value = res.data || []
    await nextTick()
    if (msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight
  } catch { /* silent */ }
}

const send = async () => {
  if (!activeId.value || !inputText.value.trim()) return
  try {
    await api.sendConversationMessage(activeId.value, inputText.value.trim())
    inputText.value = ''
    await loadMessages()
    await loadList()
  } catch {
    ElMessage.error('發送失敗')
  }
}

onMounted(() => {
  loadList()
  pollTimer = setInterval(async () => {
    if (activeId.value) {
      await loadMessages()
      try {
        const res: any = await api.getConversation(activeId.value)
        activeStatus.value = res.data?.status || activeStatus.value
      } catch { /* silent */ }
    }
    await loadList()
  }, 5000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<style scoped>
.bg-primary { background-color: #F37A69; }
.border-primary { border-color: #F37A69; }
</style>
