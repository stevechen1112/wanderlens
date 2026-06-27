<template>
  <GenericCrud
    title="行政區域"
    :load="api.getAreas"
    :save="api.saveArea"
    :delete="api.deleteArea"
    :columns="columns"
    searchable
  />
</template>

<script setup lang="ts">
import api from '@/api'
import GenericCrud from '@/components/common/GenericCrud.vue'

const columns = [
  { prop: 'name', label: '區域名稱', type: 'text' as const, required: true },
  { prop: 'nameEn', label: '英文名稱', width: 120, type: 'text' as const },
  { prop: 'city', label: '城市', width: 100, type: 'text' as const, required: true },
  { prop: 'minHour', label: '最低時數', width: 100, type: 'number' as const, min: 1, max: 24 },
  { prop: 'zipCode', label: '郵遞區號', width: 100, type: 'text' as const },
  { prop: 'active', label: '啟用', width: 80, type: 'switch' as const, activeValue: 'Y', inactiveValue: 'N' },
]
</script>