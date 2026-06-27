<template>
  <el-card v-loading="loading">
    <template v-if="loadError">
      <el-result icon="error" :title="t('conversation.loadFailed')">
        <template #extra>
          <el-button type="primary" @click="loadConversations">{{ t('order.myOrder.refresh') }}</el-button>
        </template>
      </el-result>
    </template>
    <template v-else-if="!loading && conversations.length === 0">
      <el-empty :description="t('conversation.empty')">
        <p class="text-sm text-gray-400">{{ t('conversation.emptyDesc') }}</p>
      </el-empty>
    </template>
    <div v-else class="wl-table-scroll">
      <el-table :data="conversations" @row-click="(row: any) => $router.push(`/conversations/${row.id}`)">
        <el-table-column :label="t('conversation.peer')" min-width="140">
          <template #default="{ row }">
            {{ row.peerName || (row.orderId ? t('conversation.orderPrefix') + row.orderId : row.conversationType) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('conversation.lastMessage')" min-width="200">
          <template #default="{ row }">
            <span class="text-gray-500 text-sm">{{ row.lastMessage || t('conversation.noMessage') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('conversation.unread')" width="80">
          <template #default="{ row }">
            <el-badge v-if="row.unreadCount" :value="row.unreadCount" />
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('conversation.status')" width="100" />
      </el-table>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import api from '@/api'

const { t } = useI18n()
const conversations = ref<any[]>([])
const loading = ref(false)
const loadError = ref(false)

const loadConversations = async () => {
  loading.value = true
  loadError.value = false
  try {
    const res: any = await api.getConversations()
    conversations.value = res.data || []
  } catch {
    loadError.value = true
    conversations.value = []
    ElMessage.error(t('conversation.loadFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(loadConversations)
</script>
