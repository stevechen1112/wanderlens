/**
 * 圖片懶載入 directive
 * 使用 IntersectionObserver 實作，僅在圖片進入視窗時才載入
 *
 * 使用方式：<img v-lazy-img="imageUrl" :data-src="imageUrl" />
 * 或在 img 標籤上加上 loading="lazy"（原生懶載入，現代瀏覽器支援）
 */

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const src = img.dataset.src
            if (src) {
              img.src = src
              img.removeAttribute('data-src')
            }
            observer.unobserve(img)
          }
        })
      },
      { rootMargin: '50px' }
    )

    nuxtApp.vueApp.directive('lazy-img', {
      mounted(el: HTMLImageElement, binding) {
        if (binding.value) {
          el.dataset.src = binding.value
          observer.observe(el)
        }
      },
      unmounted(el: HTMLImageElement) {
        observer.unobserve(el)
      },
    })
  }
})