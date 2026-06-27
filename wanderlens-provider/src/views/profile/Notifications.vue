<template>
  <el-card>
    <el-table :data="notifications" border>
      <el-table-column prop="message" :label="t('notify.message')" />
      <el-table-column prop="createdAt" :label="t('notify.time')" width="180" />
      <el-table-column :label="t('notify.actions')" width="100">
        <template #default="{ row }">
          <el-button v-if="!row.isRead" text type="primary" @click="markRead(row.id)">{{ t('notify.markRead') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/api'

const { t } = useI18n()
const notifications = ref<any[]>([])

const markRead = async (id: number) => {
  try {
    await api.markNotifyRead(id)
    notifications.value = notifications.value.map(n => n.id === id ? { ...n, isRead: true } : n)
  } catch {
    // 靜默
  }
}

onMounted(async () => {
  try {
    const res: any = await api.getNotifications()
    notifications.value = res.data || []
  } catch {
    // 靜默
  }
})
</script>
