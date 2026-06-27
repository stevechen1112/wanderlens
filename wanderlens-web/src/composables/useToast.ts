export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
}

const toasts = ref<ToastItem[]>([])
let nextId = 0

export function useToast() {
  const show = (message: string, type: ToastType = 'info', duration = 3200) => {
    if (!message) return
    const id = ++nextId
    toasts.value = [...toasts.value, { id, message, type }]
    if (import.meta.client) {
      window.setTimeout(() => {
        toasts.value = toasts.value.filter((t) => t.id !== id)
      }, duration)
    }
  }

  return {
    toasts: readonly(toasts),
    success: (message: string) => show(message, 'success'),
    error: (message: string) => show(message, 'error'),
    warning: (message: string) => show(message, 'warning'),
    info: (message: string) => show(message, 'info'),
  }
}
