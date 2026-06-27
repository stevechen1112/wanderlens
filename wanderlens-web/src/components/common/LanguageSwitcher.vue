<template>
  <div class="relative">
    <select
      v-model="currentLocale"
      @change="changeLocale"
      class="text-sm border border-border rounded-lg px-3 py-1.5 bg-white dark:bg-[#171F27] dark:border-[#2C353F] dark:text-[#F3F4F6] cursor-pointer"
    >
      <option v-for="loc in locales" :key="loc.code" :value="loc.code">
        {{ loc.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const currentLocale = ref(locale.value)

const changeLocale = async () => {
  await setLocale(currentLocale.value)
}

const localeOptions = computed(() =>
  (locales.value as any[]).map(l => ({ code: l.code, name: l.name }))
)
</script>