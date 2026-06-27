<template>
  <el-card>
    <template #header>
      <div class="flex items-center justify-between">
        <span class="font-semibold">造型師檔期管理</span>
        <el-tag type="warning">造型師專屬</el-tag>
      </div>
    </template>
    <p class="text-sm text-gray-500 mb-4">
      設定可接案時段。系統會依拍攝前後 90 分鐘緩衝自動計算可用性。
    </p>
    <Schedule />
  </el-card>
</template>

<script setup lang="ts">
import Schedule from '@/views/account/Schedule.vue'
</script>
