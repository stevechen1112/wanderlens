<template>
  <div>
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane :label="t('accountDetail.tabBasic')" name="basic">
        <BasicInfo v-if="activeTab === 'basic'" />
      </el-tab-pane>
      <el-tab-pane :label="t('accountDetail.tabSchedule')" name="schedule" lazy>
        <Schedule v-if="activeTab === 'schedule'" />
      </el-tab-pane>
      <el-tab-pane :label="t('accountDetail.tabArea')" name="area" lazy>
        <ServiceArea v-if="activeTab === 'area'" />
      </el-tab-pane>
      <el-tab-pane :label="t('accountDetail.tabBank')" name="bank" lazy>
        <BankInfo v-if="activeTab === 'bank'" />
      </el-tab-pane>
      <el-tab-pane :label="t('accountDetail.tabFeature')" name="feature" lazy>
        <Features v-if="activeTab === 'feature'" />
      </el-tab-pane>
      <el-tab-pane :label="t('accountDetail.tabWorks')" name="works" lazy>
        <PhotoWorks v-if="activeTab === 'works'" />
      </el-tab-pane>
      <el-tab-pane :label="t('accountDetail.tabRating')" name="rating" lazy>
        <Rating v-if="activeTab === 'rating'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BasicInfo from './BasicInfo.vue'
import Schedule from './Schedule.vue'
import ServiceArea from './ServiceArea.vue'
import BankInfo from './BankInfo.vue'
import Features from './Features.vue'
import PhotoWorks from './PhotoWorks.vue'
import Rating from './Rating.vue'

const { t } = useI18n()
const activeTab = ref('basic')
</script>
