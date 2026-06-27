export type ColorScheme = 'light' | 'dark'

const STORAGE_KEY = 'wl_theme'

function readStored(): ColorScheme {
  if (!import.meta.client) return 'light'
  const v = localStorage.getItem(STORAGE_KEY)
  return v === 'dark' ? 'dark' : 'light'
}

function applyScheme(scheme: ColorScheme) {
  if (!import.meta.client) return
  document.documentElement.classList.toggle('dark', scheme === 'dark')
  document.documentElement.dataset.theme = scheme
  localStorage.setItem(STORAGE_KEY, scheme)
}

export function useColorScheme() {
  const scheme = useState<ColorScheme>('wl-color-scheme', () => readStored())

  const isDark = computed(() => scheme.value === 'dark')

  const setScheme = (next: ColorScheme) => {
    scheme.value = next
    applyScheme(next)
  }

  const toggle = () => {
    setScheme(scheme.value === 'dark' ? 'light' : 'dark')
  }

  const init = () => {
    applyScheme(scheme.value)
  }

  return { scheme, isDark, setScheme, toggle, init }
}

export function initColorScheme() {
  applyScheme(readStored())
}
