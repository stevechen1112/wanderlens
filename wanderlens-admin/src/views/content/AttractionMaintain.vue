<template>
  <GenericCrud
    title="景點文章"
    :load="api.getAttractions"
    :save="api.saveAttraction"
    :delete="api.deleteAttraction"
    :columns="columns"
    searchable
  />
</template>

<script setup lang="ts">
import api from '@/api'
import GenericCrud from '@/components/common/GenericCrud.vue'

const columns = [
  { prop: 'name', label: '景點名稱', type: 'text' as const, required: true },
  { prop: 'area', label: '區域', width: 100, type: 'text' as const, required: true },
  { prop: 'language', label: '語系', width: 80, type: 'select' as const, required: true, options: [
    { label: '繁中', value: 'zh' },
    { label: '英文', value: 'en' },
    { label: '日文', value: 'jp' },
    { label: '韓文', value: 'ka' },
  ]},
  { prop: 'description', label: '描述', type: 'textarea' as const, rows: 4 },
  { prop: 'imageUrl', label: '圖片 URL', type: 'text' as const },
  { prop: 'sortOrder', label: '排序', width: 80, type: 'number' as const, min: 0 },
  { prop: 'active', label: '啟用', width: 80, type: 'switch' as const, activeValue: 'Y', inactiveValue: 'N' },
]
</script>