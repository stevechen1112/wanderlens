<template>
  <GenericCrud
    title="IG 貼文"
    :load="api.getInstagram"
    :save="api.saveInstagram"
    :delete="api.deleteInstagram"
    :columns="columns"
    searchable
  />
</template>

<script setup lang="ts">
import api from '@/api'
import GenericCrud from '@/components/common/GenericCrud.vue'

const columns = [
  { prop: 'title', label: '標題', type: 'text' as const, required: true },
  { prop: 'igUrl', label: 'IG 連結', type: 'text' as const, required: true },
  { prop: 'imageUrl', label: '圖片 URL', type: 'text' as const },
  { prop: 'sortOrder', label: '排序', width: 80, type: 'number' as const, min: 0 },
  { prop: 'active', label: '啟用', width: 80, type: 'switch' as const, activeValue: 'Y', inactiveValue: 'N' },
]
</script>