<template>
  <GenericCrud
    title="Banner"
    :load="api.getBanners"
    :save="api.saveBanner"
    :delete="api.deleteBanner"
    :columns="bannerColumns"
    searchable
  />
</template>

<script setup lang="ts">
import api from '@/api'
import GenericCrud from '@/components/common/GenericCrud.vue'

const bannerColumns = [
  { prop: 'language', label: '語系', width: 80, type: 'select' as const, required: true, options: [
    { label: '繁中', value: 'zh' },
    { label: '英文', value: 'en' },
    { label: '日文', value: 'jp' },
    { label: '韓文', value: 'ka' },
  ]},
  { prop: 'imageUsage', label: '用途', width: 150, type: 'select' as const, required: true, options: [
    { label: '首頁主視覺', value: 'home_hero' },
    { label: '拍攝類型頁', value: 'service_banner' },
    { label: '地點靈感頁', value: 'location_banner' },
    { label: '促銷活動', value: 'campaign' },
  ]},
  { prop: 'imageUrl', label: '圖片 URL', type: 'text' as const, required: true },
  { prop: 'linkUrl', label: '連結 URL', type: 'text' as const },
  { prop: 'sortOrder', label: '排序', width: 80, type: 'number' as const, min: 0 },
  { prop: 'active', label: '啟用', width: 80, type: 'switch' as const, activeValue: 'Y', inactiveValue: 'N' },
]
</script>