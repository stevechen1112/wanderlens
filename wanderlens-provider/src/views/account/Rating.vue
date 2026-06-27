<template>
  <el-card>
    <div v-if="summary" class="mb-4 text-sm text-gray-600">
      <span class="font-semibold text-lg text-gray-900">{{ summary.averageRating?.toFixed(1) || '—' }}</span>
      <span class="ml-2">共 {{ summary.totalCount || 0 }} 則評價</span>
    </div>
    <el-table :data="ratings" border>
      <el-table-column prop="consumerName" :label="t('ratingPage.customer')" width="120" />
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
const summary = ref<any>(null)
const ratings = ref<any[]>([])

onMounted(async () => {
  const pid = authStore.resolvedProviderId
  if (!pid) return
  try {
    const res: any = await api.getRating(pid)
    summary.value = res.data || null
    ratings.value = res.data?.recentRatings || []
  } catch {
    // silent
  }
})
</script>
