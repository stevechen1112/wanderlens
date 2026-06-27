<template>
  <div class="wl-container py-8 max-w-2xl">
    <div class="mb-8">
      <span class="wl-badge wl-badge-primary mb-2">{{ $t('conversation.title') }}</span>
      <h1 class="text-3xl font-extrabold text-text-primary">{{ $t('conversation.title') }}</h1>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="n in 3" :key="n" class="wl-surface rounded-2xl p-4 flex items-center gap-4">
        <div class="wl-skeleton wl-skeleton-avatar !w-12 !h-12" />
        <div class="flex-1">
          <div class="wl-skeleton wl-skeleton-text !w-40" />
          <div class="wl-skeleton wl-skeleton-text-sm !w-24" />
        </div>
      </div>
    </div>

    <div v-else-if="conversations.length === 0" class="wl-empty">
      <div class="wl-empty-icon">💬</div>
      <div class="wl-empty-title">{{ $t('conversation.empty') }}</div>
      <div class="wl-empty-desc">{{ $t('conversation.emptyDesc') }}</div>
      <NuxtLink to="/search" class="wl-btn-primary mt-4 inline-block">{{ $t('home.bookNow') }}</NuxtLink>
    </div>

    <div v-else class="space-y-2">
      <NuxtLink
        v-for="conv in conversations"
        :key="conv.id"
        :to="`/conversations/${conv.id}`"
        class="conv-card group"
      >
        <div class="conv-avatar" :class="conv.status === 'OPEN' ? 'online' : ''">
          <span>{{ conv.orderId ? '📋' : '💬' }}</span>
        </div>
        <div class="conv-body">
          <div class="conv-top">
            <span class="conv-name">
              {{ conv.orderId ? `${$t('conversation.orderChannel')} #${conv.orderId}` : $t('conversation.channel') }}
            </span>
            <span class="conv-time">{{ conv.updatedAt || '' }}</span>
          </div>
          <div class="conv-bottom">
            <span class="conv-preview">{{ conv.lastMessage || $t('conversation.noMessage') }}</span>
            <span v-if="conv.unread > 0" class="conv-badge">{{ conv.unread > 9 ? '9+' : conv.unread }}</span>
            <span v-else class="conv-status">
              <span v-if="conv.status === 'OPEN'" class="status-open">{{ $t('conversation.statusOpen') }}</span>
              <span v-else class="status-closed">{{ $t('conversation.statusClosed') }}</span>
            </span>
          </div>
        </div>
        <svg class="conv-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConversationApi } from '~/api/album-api'

definePageMeta({ middleware: 'auth' })

const conversationApi = useConversationApi()
const conversations = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res: any = await conversationApi.myConversations()
    conversations.value = res.data || []
  } catch {
    conversations.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.conv-card {
  display: flex; align-items: center; gap: 14px;
  background: var(--wl-bg-card); border-radius: 16px; padding: 16px;
  text-decoration: none; color: inherit;
  transition: all 0.2s; cursor: pointer;
}
.conv-card:hover { background: var(--wl-bg); transform: translateX(4px); }
.conv-avatar {
  width: 48px; height: 48px; border-radius: 14px;
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
  display: flex; align-items: center; justify-content: center; font-size: 20px;
  position: relative; flex-shrink: 0;
}
.conv-avatar.online::after {
  content: ''; position: absolute; bottom: 0; right: 0;
  width: 12px; height: 12px; border-radius: 50%;
  background: #13CE66; border: 2px solid var(--wl-bg-card);
}
.conv-body { flex: 1; min-width: 0; }
.conv-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.conv-name { font-weight: 700; font-size: 15px; color: var(--wl-text-primary); }
.conv-time { font-size: 12px; color: var(--wl-text-secondary); }
.conv-bottom { display: flex; align-items: center; gap: 8px; }
.conv-preview { font-size: 13px; color: var(--wl-text-secondary); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.conv-badge { min-width: 20px; height: 20px; border-radius: 10px; background: #F37A69; color: white; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; padding: 0 6px; }
.conv-status { font-size: 12px; }
.status-open { color: #13CE66; }
.status-closed { color: var(--wl-text-secondary); }
.conv-arrow { width: 16px; height: 16px; color: #ccc; flex-shrink: 0; opacity: 0; transition: opacity 0.2s; }
.conv-card:hover .conv-arrow { opacity: 1; }
</style>
