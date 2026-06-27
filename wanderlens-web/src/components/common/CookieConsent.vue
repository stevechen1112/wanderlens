<template>
  <Transition name="fade">
    <div
      v-if="!accepted"
      class="fixed bottom-0 left-0 right-0 z-50 bg-text-primary text-white px-6 py-4 flex items-center justify-between gap-4"
    >
      <p class="text-sm">
        {{ $t('cookie.message') }}
        <NuxtLink to="/privacy-policy" class="underline text-secondary">{{ $t('cookie.learnMore') }}</NuxtLink>
      </p>
      <button @click="accept" class="wl-btn-primary whitespace-nowrap">
        {{ $t('cookie.accept') }}
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const accepted = ref(false)

onMounted(() => {
  accepted.value = localStorage.getItem('wl_cookie_accepted') === 'true'
})

const accept = () => {
  localStorage.setItem('wl_cookie_accepted', 'true')
  accepted.value = true
}
</script>