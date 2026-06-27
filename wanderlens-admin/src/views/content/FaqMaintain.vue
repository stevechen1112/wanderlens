<template>
  <GenericCrud
    title="FAQ"
    :load="api.getFaqs"
    :save="api.saveFaq"
    :delete="api.deleteFaq"
    :columns="faqColumns"
    searchable
  />
</template>

<script setup lang="ts">
import api from '@/api'
import GenericCrud from '@/components/common/GenericCrud.vue'

const faqColumns = [
  { prop: 'language', label: '語系', width: 80, type: 'select' as const, required: true, options: [
    { label: '繁中', value: 'zh' },
    { label: '英文', value: 'en' },
    { label: '日文', value: 'jp' },
    { label: '韓文', value: 'ka' },
  ]},
  { prop: 'question', label: '問題', type: 'text' as const, required: true },
  { prop: 'answer', label: '答案', type: 'textarea' as const, rows: 4, required: true },
  { prop: 'sortOrder', label: '排序', width: 80, type: 'number' as const, min: 0 },
]
</script>