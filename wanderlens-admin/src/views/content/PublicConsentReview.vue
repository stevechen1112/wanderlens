<template>
  <div>
    <h3 class="font-semibold mb-4">公開授權審核</h3>
    <p class="text-sm text-gray-500 mb-4">顯示已公開的相簿，可審核或下架</p>
    <el-table :data="albums" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="相簿標題" />
      <el-table-column prop="shootLocation" label="地點" width="120" />
      <el-table-column prop="albumType" label="類型" width="80" />
      <el-table-column prop="shootDate" label="拍攝日期" width="120" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-popconfirm title="確認通過公開授權？" @confirm="approve(row.id)">
            <template #reference><el-button text type="primary">通過公開</el-button></template>
          </el-popconfirm>
          <el-popconfirm title="確認下架？" @confirm="revoke(row.id)">
            <template #reference><el-button text type="danger">下架</el-button></template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const albums = ref<any[]>([])

const approve = async (id: number) => {
  try {
    // 同時設定消費者與攝影師授權為 PUBLIC
    await api.setAlbumConsent(id, 'PUBLIC', 'PORTFOLIO')
    ElMessage.success('已通過公開授權')
    load()
  } catch { ElMessage.error('操作失敗') }
}

const revoke = async (id: number) => {
  try {
    await api.revokeAlbumConsent(id)
    ElMessage.success('已下架')
    load()
  } catch { ElMessage.error('操作失敗') }
}

const load = async () => {
  try {
    const res: any = await api.getPublicAlbums()
    albums.value = res.data || []
  } catch { albums.value = [] }
}

onMounted(load)
</script>