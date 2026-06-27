<template>

  <NuxtLink to="/" class="wl-logo inline-flex items-center shrink-0" :class="sizeClass">

    <img

      :src="logoUrl"

      alt="WanderLens"

      class="wl-logo-img"

      :width="width"

      :height="height"

    />

  </NuxtLink>

</template>



<script setup lang="ts">

import logoUrl from '~/assets/images/logo.png'



const props = withDefaults(defineProps<{

  size?: 'sm' | 'md' | 'lg'

}>(), { size: 'md' })



const sizeMap = {

  sm: { width: 120, height: 36, cls: 'h-9' },

  md: { width: 148, height: 44, cls: 'h-11' },

  lg: { width: 180, height: 54, cls: 'h-14' },

}



const width = computed(() => sizeMap[props.size].width)

const height = computed(() => sizeMap[props.size].height)

const sizeClass = computed(() => sizeMap[props.size].cls)

</script>



<style scoped>

.wl-logo-img {

  height: 100%;

  width: auto;

  object-fit: contain;

  border-radius: 8px;

}

</style>


