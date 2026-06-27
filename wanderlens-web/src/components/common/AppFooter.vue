<template>
  <footer class="bg-gray-900 text-white pt-12 pb-6 mt-16">
    <div class="wl-container-wide">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- 品牌 -->
        <div class="md:col-span-1">
          <h3 class="text-xl font-extrabold wl-gradient-text mb-3">WanderLens</h3>
          <p class="text-sm text-gray-400 leading-relaxed">{{ $t('footer.tagline') }}</p>
          <!-- 社群連結 -->
          <div class="flex gap-3 mt-4">
            <a href="#" class="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all" aria-label="Instagram">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all" aria-label="Facebook">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all" aria-label="LINE">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.365 9.863a.631.631 0 010 1.261H17.61v1.125h1.755a.63.63 0 110 1.259H16.98a.63.63 0 01-.63-.63V10.5a.63.63 0 01.63-.63h2.385v-.007zm-3.855 3.645a.63.63 0 01-.63.63.63.63 0 01-.63-.63V10.5a.63.63 0 011.26 0v3.008zm-2.52 0a.63.63 0 01-.63.63.63.63 0 01-.63-.63v-1.748l-1.41 1.89a.63.63 0 01-1.05 0l-1.41-1.89v1.748a.63.63 0 01-.63.63.63.63 0 01-.63-.63V10.5a.63.63 0 011.155-.39L9.6 12.6l1.845-2.49a.63.63 0 011.155.39v3.008h-.01zM24 12c0 5.19-5.37 9.39-12 9.39-.93 0-1.85-.09-2.73-.27l-3.15 1.89a.6.6 0 01-.9-.54l.09-2.85C2.1 17.85 0 15.12 0 12 0 6.81 5.37 2.61 12 2.61S24 6.81 24 12z"/></svg>
            </a>
          </div>
        </div>

        <!-- 服務 -->
        <div>
          <h4 class="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">{{ $t('footer.service') }}</h4>
          <ul class="space-y-2.5">
            <li><NuxtLink to="/photographer-list" class="text-sm text-gray-400 hover:text-white transition-colors">{{ $t('nav.photographers') }}</NuxtLink></li>
            <li><NuxtLink to="/faq" class="text-sm text-gray-400 hover:text-white transition-colors">{{ $t('nav.faq') }}</NuxtLink></li>
            <li><NuxtLink to="/privacy-policy" class="text-sm text-gray-400 hover:text-white transition-colors">{{ $t('nav.privacy') }}</NuxtLink></li>
          </ul>
        </div>

        <!-- 服務類型 -->
        <div>
          <h4 class="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">{{ $t('home.serviceTypes') }}</h4>
          <ul class="space-y-2.5">
            <li><NuxtLink to="/booking" class="text-sm text-gray-400 hover:text-white transition-colors">個人寫真</NuxtLink></li>
            <li><NuxtLink to="/booking" class="text-sm text-gray-400 hover:text-white transition-colors">婚禮紀錄</NuxtLink></li>
            <li><NuxtLink to="/booking" class="text-sm text-gray-400 hover:text-white transition-colors">全家福</NuxtLink></li>
            <li><NuxtLink to="/booking" class="text-sm text-gray-400 hover:text-white transition-colors">商業攝影</NuxtLink></li>
          </ul>
        </div>

        <!-- 聯絡 -->
        <div>
          <h4 class="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">{{ $t('footer.contact') }}</h4>
          <ul class="space-y-2.5">
            <li class="flex items-center gap-2 text-sm text-gray-400">
              <span>✉️</span> support@wanderlens.app
            </li>
            <li class="flex items-center gap-2 text-sm text-gray-400">
              <span>📞</span> 02-1234-5678
            </li>
            <li class="flex items-center gap-2 text-sm text-gray-400">
              <span>📍</span> 台北市信義區信義路五段 7 號
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部 -->
      <div class="pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-sm text-gray-500">© 2026 WanderLens. All rights reserved.</p>
        <div class="flex gap-4 text-sm text-gray-500">
          <NuxtLink to="/privacy-policy" class="hover:text-gray-300 transition-colors">隱私權政策</NuxtLink>
          <span>|</span>
          <NuxtLink to="/faq" class="hover:text-gray-300 transition-colors">服務條款</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>
