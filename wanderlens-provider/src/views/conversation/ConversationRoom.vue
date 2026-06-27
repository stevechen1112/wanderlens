<template>
  <el-card v-loading="loading" class="max-w-3xl mx-auto">
    <el-result v-if="loadError" icon="error" :title="t('conversation.loadFailed')">
      <template #extra>
        <el-button type="primary" @click="loadAll">{{ t('order.myOrder.refresh') }}</el-button>
      </template>
    </el-result>
    <template v-else>
      <div ref="msgContainer" class="h-[55vh] overflow-y-auto space-y-3 p-2">
        <div v-for="msg in messages" :key="msg.id">
          <div v-if="msg.messageType === 'SYSTEM'" class="text-center">
            <span class="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{{ msg.content }}</span>
          </div>
          <div v-else :class="['flex', msg.senderId === userId ? 'justify-end' : 'justify-start']">
            <div :class="[
              'max-w-[70%] rounded-lg px-4 py-2 text-sm overflow-hidden',
              msg.senderId === userId ? 'text-white' : 'bg-gray-100'
            ]" :style="msg.senderId === userId ? { background: 'var(--wl-primary)' } : {}">
              <p v-if="msg.messageType === 'TEXT'">{{ msg.content }}</p>
              <el-image v-else-if="msg.messageType === 'IMAGE'" :src="msg.imageUrl" class="rounded max-w-full" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="conversation?.status === 'OPEN'" class="flex gap-2 mt-4 items-end">
        <label class="cursor-pointer text-xl px-2" :title="t('conversation.sendImage')">📷
          <input type="file" accept="image/*" class="hidden" @change="onImagePick" />
        </label>
        <el-input v-model="inputText" :placeholder="t('conversation.inputPlaceholder')" @keyup.enter="send" class="flex-1" />
        <el-button type="primary" @click="send" :loading="sending">{{ t('conversation.send') }}</el-button>
      </div>
      <div v-else class="text-center text-sm text-gray-400 mt-4">{{ t('conversation.readonly') }}</div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import api from '@/api'

const { t } = useI18n()
const route = useRoute()
const userId = ref(Number(localStorage.getItem('wl_user_id') || 0))
const conversation = ref<any>(null)
const messages = ref<any[]>([])
const inputText = ref('')
const sending = ref(false)
const loading = ref(false)
const loadError = ref(false)
const msgContainer = ref<HTMLElement>()
let pollTimer: ReturnType<typeof setInterval> | undefined

const loadAll = async () => {
  const id = Number(route.params.id)
  loading.value = true
  loadError.value = false
  try {
    const [convRes, msgRes]: any[] = await Promise.all([
      api.getConversation(id),
      api.getMessages(id),
    ])
    conversation.value = convRes.data
    messages.value = msgRes.data || []
    await api.markAsRead(id)
    await nextTick()
    if (msgContainer.value) msgContainer.value.scrollTop = msgContainer.value.scrollHeight
  } catch {
    loadError.value = true
    ElMessage.error(t('conversation.loadFailed'))
  } finally {
    loading.value = false
  }
}

const send = async () => {
  if (!inputText.value.trim()) return
  sending.value = true
  try {
    await api.sendMessage(Number(route.params.id), inputText.value)
    inputText.value = ''
    await loadAll()
  } catch {
    ElMessage.error(t('conversation.sendFailed'))
  } finally {
    sending.value = false
  }
}

const onImagePick = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  sending.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    await api.uploadConversationImage(Number(route.params.id), formData)
    await loadAll()
  } catch {
    ElMessage.error(t('conversation.imageSendFailed'))
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  loadAll()
  pollTimer = setInterval(loadAll, 5000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<style scoped>
.hidden { display: none; }
</style>
