<template>
  <GenericCrud
    title="服務類型"
    :load="() => api.getServiceTypes()"
    :save="api.saveServiceType"
    :delete="api.deleteServiceType"
    :columns="columns"
    searchable
  />
</template>

<script setup lang="ts">
import api from '@/api'
import GenericCrud from '@/components/common/GenericCrud.vue'

const columns = [
  { prop: 'name', label: '類型名稱', type: 'text' as const, required: true },
  { prop: 'nameEn', label: '英文名稱', width: 120, type: 'text' as const },
  { prop: 'description', label: '描述', type: 'textarea' as const, rows: 3 },
  { prop: 'basePrice', label: '基礎價格', width: 120, type: 'number' as const, min: 0, required: true },
  { prop: 'duration', label: '預設時數', width: 100, type: 'number' as const, min: 1, max: 24 },
  { prop: 'sortOrder', label: '排序', width: 80, type: 'number' as const, min: 0 },
  { prop: 'active', label: '啟用', width: 80, type: 'switch' as const, activeValue: 'Y', inactiveValue: 'N' },
]
</script>