<template>
  <el-card>
    <el-table :data="ratings" border>
      <el-table-column prop="author" :label="t('ratingPage.customer')" width="120" />
      <el-table-column :label="t('ratingPage.stars')" width="100">
        <template #default="{ row }">
          <span v-for="i in row.stars" :key="i" aria-hidden="true">⭐</span>
        </template>
      </el-table-column>
      <el-table-column prop="comments" :label="t('ratingPage.comments')" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()
const ratings = ref<any[]>([])

onMounted(async () => {
  try {
    const res: any = await api.getRating(authStore.userId!)
    ratings.value = res.data || []
  } catch {
    // silent
  }
})
</script>
