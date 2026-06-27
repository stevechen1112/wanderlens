/** 首頁 Hero 是否已滾出視窗 — 控制 Header 搜尋列顯示時機 */
export function useHomeHeader() {
  const heroPassed = useState('wl-hero-passed', () => false)
  return { heroPassed }
}
