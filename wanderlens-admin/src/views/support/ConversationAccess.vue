<template>
  <div>
    <h3 class="font-semibold mb-4">溝通調閱與參與者管理</h3>
    <div class="flex gap-2 mb-4 items-center">
      <el-input v-model="conversationId" placeholder="輸入溝通室 ID" style="width: 200px" />
      <el-input v-model="reason" placeholder="調閱原因" style="width: 300px" />
      <el-button type="primary" @click="access">調閱</el-button>
    </div>

    <!-- 訊息歷史 -->
    <div v-if="messages.length > 0" class="mt-4">
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span>訊息歷史（{{ messages.length }} 則）</span>
            <el-tag :type="conversationStatus === 'READONLY' ? 'warning' : 'success'" size="small">
              {{ conversationStatus === 'READONLY' ? '唯讀' : conversationStatus === 'OPEN' ? '進行中' : conversationStatus }}
            </el-tag>
          </div>
        </template>
        <div class="max-h-[40vh] overflow-y-auto">
          <div v-for="msg in messages" :key="msg.id" class="mb-2">
            <span class="text-xs text-gray-400">{{ msg.createdAt }}</span>
            <span class="ml-2 font-semibold">{{ msg.senderId === 0 ? '系統' : '用戶' + msg.senderId }}:</span>
            <span class="ml-1">{{ msg.content || '[圖片]' }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 參與者管理 -->
    <div v-if="participants.length > 0" class="mt-4">
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span>參與者（{{ participants.length }} 人）</span>
            <el-button type="primary" size="small" @click="showAddDialog = true">新增參與者</el-button>
          </div>
        </template>
        <div v-for="p in participants" :key="p.id" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
          <div class="flex items-center gap-3">
            <el-tag :type="userTypeTagType(p.userType)" size="small">{{ userTypeLabel(p.userType) }}</el-tag>
            <span class="font-medium">用戶 #{{ p.userId }}</span>
            <span v-if="!p.isActive" class="text-xs text-gray-400">（已移除）</span>
            <span class="text-xs text-gray-400">{{ formatTime(p.joinedAt) }}加入</span>
            <span v-if="p.removedAt" class="text-xs text-red-400">{{ formatTime(p.removedAt) }}移除</span>
          </div>
          <el-button
            v-if="p.isActive && p.userType !== 'CONSUMER'"
            type="danger"
            size="small"
            text
            @click="removeParticipant(p.userId)"
          >移除</el-button>
        </div>
      </el-card>
    </div>

    <!-- 新增參與者對話框 -->
    <el-dialog v-model="showAddDialog" title="新增參與者" width="400px">
      <el-form label-width="80px">
        <el-form-item label="使用者 ID">
          <el-input v-model="newParticipantUserId" placeholder="輸入 user ID" />
        </el-form-item>
        <el-form-item label="身分">
          <el-select v-model="newParticipantUserType" placeholder="選擇身分">
            <el-option label="攝影師" value="PHOTOGRAPHER" />
            <el-option label="造型師" value="STYLIST" />
            <el-option label="消費者" value="CONSUMER" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addParticipant">確認新增</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'

const conversationId = ref('')
const reason = ref('')
const messages = ref<any[]>([])
const participants = ref<any[]>([])
const conversationStatus = ref('')
const showAddDialog = ref(false)
const newParticipantUserId = ref('')
const newParticipantUserType = ref('PHOTOGRAPHER')

const access = async () => {
  if (!conversationId.value || !reason.value) {
    ElMessage.warning('請輸入溝通室 ID 和調閱原因')
    return
  }
  try {
    const id = Number(conversationId.value)
    const res: any = await api.accessConversation(id, reason.value)
    messages.value = res.data || []
    // 同時載入對話狀態與參與者
    const convRes: any = await api.getConversation(id)
    conversationStatus.value = convRes.data?.status || ''
    const partRes: any = await api.getConversationParticipants(id)
    participants.value = partRes.data || []
    ElMessage.success('調閱成功（已記錄日誌）')
  } catch {
    ElMessage.error('調閱失敗')
  }
}

const addParticipant = async () => {
  const userId = Number(newParticipantUserId.value)
  if (!userId || !newParticipantUserType.value) {
    ElMessage.warning('請輸入使用者 ID 並選擇身分')
    return
  }
  try {
    await api.addConversationParticipant(Number(conversationId.value), userId, newParticipantUserType.value)
    ElMessage.success('已新增參與者')
    showAddDialog.value = false
    newParticipantUserId.value = ''
    // 重新載入參與者
    const partRes: any = await api.getConversationParticipants(Number(conversationId.value))
    participants.value = partRes.data || []
  } catch (err: any) {
    ElMessage.error(err?.response?.data?.message || '新增失敗')
  }
}

const removeParticipant = async (userId: number) => {
  try {
    await ElMessageBox.confirm(`確定要移除用戶 #${userId} 嗎？`, '移除參與者', { type: 'warning' })
    await api.removeConversationParticipant(Number(conversationId.value), userId)
    ElMessage.success('已移除參與者')
    // 重新載入參與者
    const partRes: any = await api.getConversationParticipants(Number(conversationId.value))
    participants.value = partRes.data || []
  } catch (err: any) {
    if (err !== 'cancel') ElMessage.error(err?.response?.data?.message || '移除失敗')
  }
}

const userTypeLabel = (type: string) => {
  const map: Record<string, string> = { CONSUMER: '消費者', PHOTOGRAPHER: '攝影師', STYLIST: '造型師' }
  return map[type] || type
}

const userTypeTagType = (type: string) => {
  const map: Record<string, string> = { CONSUMER: 'primary', PHOTOGRAPHER: 'success', STYLIST: 'warning' }
  return (map[type] || 'info') as any
}

const formatTime = (d: string) => {
  if (!d) return ''
  try { return new Date(d).toLocaleString('zh-TW') }
  catch { return d }
}
</script>