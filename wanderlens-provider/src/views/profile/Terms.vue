<template>
  <el-card class="max-w-4xl mx-auto">
    <template #header>
      <h2 class="text-xl font-bold">{{ t('termsPage.title') }}</h2>
      <p class="text-sm text-gray-400 mt-1">{{ t('termsPage.updatedAt') }}</p>
    </template>

    <div class="prose prose-sm max-w-none space-y-6">
      <section>
        <h3 class="text-lg font-semibold mb-2">{{ t('termsPage.s1Title') }}</h3>
        <p class="text-gray-600 leading-relaxed">{{ t('termsPage.s1Body') }}</p>
      </section>

      <section>
        <h3 class="text-lg font-semibold mb-2">{{ t('termsPage.s2Title') }}</h3>
        <ol class="list-decimal ml-6 space-y-2 text-gray-600">
          <li>{{ t('termsPage.s2Li1') }}</li>
          <li>{{ t('termsPage.s2Li2') }}</li>
          <li>{{ t('termsPage.s2Li3') }}</li>
          <li>{{ t('termsPage.s2Li4') }}</li>
          <li>{{ t('termsPage.s2Li5') }}</li>
        </ol>
      </section>

      <section>
        <h3 class="text-lg font-semibold mb-2">{{ t('termsPage.s3Title') }}</h3>
        <el-table :data="penaltyRules" border size="small">
          <el-table-column prop="level" :label="t('termsPage.colLevel')" width="120" />
          <el-table-column prop="action" :label="t('termsPage.colAction')" width="150" />
          <el-table-column prop="description" :label="t('termsPage.colDesc')" />
        </el-table>
      </section>

      <section>
        <h3 class="text-lg font-semibold mb-2">{{ t('termsPage.s4Title') }}</h3>
        <ul class="list-disc ml-6 space-y-2 text-gray-600">
          <li>{{ t('termsPage.s4Li1') }}</li>
          <li>{{ t('termsPage.s4Li2') }}</li>
          <li>{{ t('termsPage.s4Li3') }}</li>
          <li>{{ t('termsPage.s4Li4') }}</li>
        </ul>
      </section>

      <section>
        <h3 class="text-lg font-semibold mb-2">{{ t('termsPage.s5Title') }}</h3>
        <p class="text-gray-600 leading-relaxed">{{ t('termsPage.s5Body') }}</p>
      </section>

      <section>
        <h3 class="text-lg font-semibold mb-2">{{ t('termsPage.s6Title') }}</h3>
        <p class="text-gray-600 leading-relaxed">{{ t('termsPage.s6Body') }}</p>
      </section>

      <section>
        <h3 class="text-lg font-semibold mb-2">{{ t('termsPage.s7Title') }}</h3>
        <p class="text-gray-600 leading-relaxed">{{ t('termsPage.s7Body') }}</p>
      </section>
    </div>

    <el-divider />

    <div class="text-center">
      <el-button type="primary" @click="$router.back()">{{ t('termsPage.back') }}</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const penaltyRules = computed(() => [
  { level: t('termsPage.p1Level'), action: t('termsPage.p1Action'), description: t('termsPage.p1Desc') },
  { level: t('termsPage.p2Level'), action: t('termsPage.p2Action'), description: t('termsPage.p2Desc') },
  { level: t('termsPage.p3Level'), action: t('termsPage.p3Action'), description: t('termsPage.p3Desc') },
])
</script>
