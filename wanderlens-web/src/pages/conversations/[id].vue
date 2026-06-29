<template>
  <div class="chat-page">
    <!-- Header -->
    <div class="chat-header">
      <NuxtLink to="/conversations" class="back-btn">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </NuxtLink>
      <div class="chat-header-info">
        <div class="chat-avatar" :class="conversation?.status === 'OPEN' ? 'online' : ''">
          <span>{{ conversation?.orderId ? '📋' : '💬' }}</span>
        </div>
        <div>
          <h2 class="chat-name">{{ conversation?.orderId ? '訂單 #' + conversation.orderId : '溝通室' }}</h2>
          <span class="chat-status" :class="conversation?.status === 'OPEN' ? 'text-success' : 'text-text-secondary'">
            {{ conversation?.status === 'OPEN' ? '● 進行中' : '○ 已結束' }}
          </span>
        </div>
      </div>
    </div>

    <!-- 訊息列表 -->
    <div ref="msgContainer" class="chat-messages">
      <div v-if="messages.length === 0" class="chat-empty">
        <span class="text-4xl opacity-30">💬</span>
        <p>尚無訊息，開始對話吧</p>
      </div>

      <div v-for="(msg, idx) in messages" :key="msg.id || idx">
        <!-- 系統訊息 -->
        <div v-if="msg.messageType === 'SYSTEM'" class="msg-system">
          <span>{{ msg.content }}</span>
        </div>
        <!-- 日期分隔 -->
        <div v-else-if="showDateSep(idx)" class="msg-date-sep">
          <span>{{ formatDate(msg.createdAt) }}</span>
        </div>
        <!-- 一般訊息 -->
        <div v-else class="msg-row" :class="msg.senderId === userId ? 'msg-mine' : 'msg-other'">
          <div class="msg-bubble" :class="msg.senderId === userId ? 'bubble-mine' : 'bubble-other'">
            <span v-if="msg.senderId !== userId && getSenderLabel(msg.senderId)" class="msg-sender-label">{{ getSenderLabel(msg.senderId) }}</span>
            <p v-if="msg.messageType === 'TEXT'">{{ msg.content }}</p>
            <img v-else-if="msg.messageType === 'IMAGE'" :src="msg.imageUrl" class="msg-image" loading="lazy" />
          </div>
          <span class="msg-time">{{ formatTime(msg.createdAt) }}</span>
        </div>
      </div>
    </div>

    <!-- 輸入區 -->
    <div class="chat-input-bar" v-if="conversation?.status === 'OPEN'">
      <div class="chat-input-wrap">
        <input v-model="inputText" @keyup.enter="send" type="text"
          placeholder="輸入訊息..." class="chat-input"
          :disabled="sending" />
        <button @click="send" :disabled="!inputText.trim() || sending" class="send-btn">
          <svg v-if="!sending" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
        </button>
      </div>
    </div>
    <div v-else class="chat-closed-bar">
      <span>🔒 此對話已結束，無法發送新訊息</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConversationApi } from '~/api/album-api'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const conversationApi = useConversationApi()
const userId = ref(0)

onMounted(() => { userId.value = Number(localStorage.getItem('wl_user_id') || 0) })

const conversation = ref<any>(null)
const messages = ref<any[]>([])
const participants = ref<any[]>([])
const inputText = ref('')
const sending = ref(false)
const msgContainer = ref<HTMLElement>()

const senderTypeMap = computed(() => {
  const map: Record<number, string> = {}
  for (const p of participants.value) {
    map[p.userId] = p.userType
  }
  return map
})

const getSenderLabel = (senderId: number) => {
  if (senderId === 0) return ''
  const type = senderTypeMap.value[senderId]
  if (type === 'CONSUMER') return '消費者'
  if (type === 'PHOTOGRAPHER') return '攝影師'
  if (type === 'STYLIST') return '造型師'
  if (type === 'ADMIN') return '站方'
  return ''
}

const scrollToBottom = async () => {
  await nextTick()
  if (msgContainer.value) msgContainer.value.scrollTop = msgContainer.value.scrollHeight
}

const send = async () => {
  if (!inputText.value.trim() || sending.value) return
  sending.value = true
  try {
    await conversationApi.sendMessage(Number(route.params.id), inputText.value)
    inputText.value = ''
    await loadMessages()
  } catch { /* silent */ }
  finally { sending.value = false }
}

const loadMessages = async () => {
  try {
    const res: any = await conversationApi.getMessages(Number(route.params.id))
    messages.value = res.data || []
    await scrollToBottom()
  } catch { /* silent */ }
}

const showDateSep = (idx: number) => {
  if (idx === 0) return false
  const prev = messages[idx - 1]
  const curr = messages[idx]
  if (!prev?.createdAt || !curr?.createdAt) return false
  return prev.createdAt.split('T')[0] !== curr.createdAt.split('T')[0]
}

const formatTime = (d: string) => {
  if (!d) return ''
  try { return new Date(d).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }) }
  catch { return '' }
}
const formatDate = (d: string) => {
  if (!d) return ''
  try { return new Date(d).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' }) }
  catch { return '' }
}

onMounted(async () => {
  try {
    const [convRes, msgRes, partRes]: any[] = await Promise.all([
      conversationApi.getConversation(Number(route.params.id)),
      conversationApi.getMessages(Number(route.params.id)),
      conversationApi.getParticipants(Number(route.params.id)),
    ])
    conversation.value = convRes.data
    messages.value = msgRes.data || []
    participants.value = partRes.data || []
    await scrollToBottom()
  } catch { /* 404 */ }
})
</script>

<style scoped>
.chat-page { display: flex; flex-direction: column; height: calc(100vh - 64px); max-width: 768px; margin: 0 auto; background: #f5f5f5; }

/* Header */
.chat-header { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: white; border-bottom: 1px solid #eee; position: sticky; top: 64px; z-index: 10; }
.back-btn { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #666; transition: background 0.2s; }
.back-btn:hover { background: #f0f0f0; }
.chat-header-info { display: flex; align-items: center; gap: 10px; }
.chat-avatar { width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #f0f0f0, #e0e0e0); display: flex; align-items: center; justify-content: center; font-size: 18px; position: relative; }
.chat-avatar.online::after { content: ''; position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; border-radius: 50%; background: #13CE66; border: 2px solid white; }
.chat-name { font-weight: 700; font-size: 15px; color: #1a1a2e; }
.chat-status { font-size: 12px; }

/* Messages */
.chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 4px; }
.chat-empty { text-align: center; padding: 60px 20px; color: #999; }

.msg-system { text-align: center; margin: 8px 0; }
.msg-system span { background: rgba(0,0,0,0.05); padding: 4px 14px; border-radius: 12px; font-size: 12px; color: #888; }

.msg-date-sep { text-align: center; margin: 16px 0 8px; }
.msg-date-sep span { background: white; padding: 4px 14px; border-radius: 12px; font-size: 12px; color: #888; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }

.msg-row { display: flex; flex-direction: column; max-width: 75%; margin-bottom: 4px; }
.msg-mine { align-self: flex-end; align-items: flex-end; }
.msg-other { align-self: flex-start; align-items: flex-start; }

.msg-bubble { padding: 10px 14px; border-radius: 18px; font-size: 14px; line-height: 1.5; word-break: break-word; }
.bubble-mine { background: linear-gradient(135deg, #F37A69, #D85A49); color: white; border-bottom-right-radius: 4px; }
.bubble-other { background: white; color: #333; border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.msg-image { max-width: 240px; border-radius: 12px; }

.msg-time { font-size: 11px; color: #aaa; margin-top: 2px; padding: 0 4px; }
.msg-sender-label { display: block; font-size: 11px; font-weight: 700; color: #F37A69; margin-bottom: 2px; }

/* Input */
.chat-input-bar { padding: 12px 16px; background: white; border-top: 1px solid #eee; position: sticky; bottom: 0; }
.chat-input-wrap { display: flex; align-items: center; gap: 8px; background: #f5f5f5; border-radius: 24px; padding: 4px 4px 4px 16px; }
.chat-input { flex: 1; border: none; background: transparent; padding: 8px 0; font-size: 14px; outline: none; }
.send-btn { width: 40px; height: 40px; border-radius: 50%; border: none; background: linear-gradient(135deg, #F37A69, #D85A49); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; flex-shrink: 0; }
.send-btn:hover:not(:disabled) { transform: scale(1.05); }
.send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.chat-closed-bar { padding: 16px; text-align: center; background: white; border-top: 1px solid #eee; font-size: 13px; color: #888; }
</style>