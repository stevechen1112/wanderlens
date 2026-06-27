<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-lg">通知管理</h3>
      <el-button @click="loadData">重新整理</el-button>
    </div>

    <el-table :data="notifications" border stripe>
      <el-table-column label="訊息" min-width="300">
        <template #default="{ row }">
          <a v-if="row.messageUrl" :href="row.messageUrl" target="_blank" class="text-blue-500 hover:underline">{{ row.message }}</a>
          <span v-else>{{ row.message }}</span>
          <p class="text-xs text-gray-400 mt-1">{{ row.createdAt }}</p>
        </template>
      </el-table-column>
      <el-table-column label="狀態" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.isRead === 'N'" type="warning" size="small">未讀</el-tag>
          <el-tag v-else type="info" size="small">已讀</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button v-if="row.isRead === 'N'" text type="primary" size="small" @click="markRead(row.id)">標記已讀</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁 -->
    <div class="flex justify-center mt-4" v-if="total > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next, total"
        background
        @current-change="loadData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const notifications = ref<any[]>([])
const currentPage = ref(1)
const pageSize = 20
const total = ref(0)

const loadData = async () => {
  try {
    const res: any = await api.getNotifications(currentPage.value, pageSize)
    const data = res.data
    notifications.value = Array.isArray(data) ? data : (data?.records || [])
    total.value = data?.total || notifications.value.length
  } catch {
    notifications.value = []
  }
}

const markRead = async (id: number) => {
  try {
    await api.markNotifyRead(id)
    ElMessage.success('已標記已讀')
    await loadData()
  } catch { ElMessage.error('操作失敗') }
}

onMounted(loadData)
</script>