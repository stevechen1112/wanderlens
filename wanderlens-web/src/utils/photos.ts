/**
 * WanderLens 照片素材工具
 * 使用 Pexels 免費圖庫的真實攝影作品
 */

const categoryPhotos: Record<number, string[]> = {
  1: [
    'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2204530/pexels-photo-2204530.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  2: [
    'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  3: [
    'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4262413/pexels-photo-4262413.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  4: [
    'https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2641095/pexels-photo-2641095.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  5: [
    'https://images.pexels.com/photos/3196534/pexels-photo-3196534.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6849526/pexels-photo-6849526.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  6: [
    'https://images.pexels.com/photos/1787235/pexels-photo-1787235.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1924951/pexels-photo-1924951.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  7: [
    'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  8: [
    'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  9: [
    'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  10: [
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  11: [
    'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/7146986/pexels-photo-7146986.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  12: [
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  13: [
    'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2386314/pexels-photo-2386314.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  14: [
    'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
}

const heroPhotos = [
  'https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/3019729/pexels-photo-3019729.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1600',
]

const locationPhotos: Record<string, string> = {
  '台北': 'https://images.pexels.com/photos/2086719/pexels-photo-2086719.jpeg?auto=compress&cs=tinysrgb&w=800',
  '101': 'https://images.pexels.com/photos/2086719/pexels-photo-2086719.jpeg?auto=compress&cs=tinysrgb&w=800',
  '台中': 'https://images.pexels.com/photos/2086721/pexels-photo-2086721.jpeg?auto=compress&cs=tinysrgb&w=800',
  '高雄': 'https://images.pexels.com/photos/2086722/pexels-photo-2086722.jpeg?auto=compress&cs=tinysrgb&w=800',
  '九份': 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=800',
  '日月潭': 'https://images.pexels.com/photos/2595938/pexels-photo-2595938.jpeg?auto=compress&cs=tinysrgb&w=800',
  '阿里山': 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800',
  '墾丁': 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
  '花蓮': 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800',
  '太魯閣': 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800',
  '清境': 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800',
  '淡水': 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=800',
  '西門': 'https://images.pexels.com/photos/2086719/pexels-photo-2086719.jpeg?auto=compress&cs=tinysrgb&w=800',
  '信義': 'https://images.pexels.com/photos/2086719/pexels-photo-2086719.jpeg?auto=compress&cs=tinysrgb&w=800',
  '高美': 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
  '花博': 'https://images.pexels.com/photos/2086719/pexels-photo-2086719.jpeg?auto=compress&cs=tinysrgb&w=800',
  '旗津': 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
}

const studioPhotos = [
  'https://images.pexels.com/photos/2123723/pexels-photo-2123723.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2007650/pexels-photo-2007650.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
]

const stylistPhotos = [
  'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3353816/pexels-photo-3353816.jpeg?auto=compress&cs=tinysrgb&w=800',
]

const stepPhotos = [
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600',
]

const recruitPhoto = 'https://images.pexels.com/photos/2123723/pexels-photo-2123723.jpeg?auto=compress&cs=tinysrgb&w=1200'

export const hotCategoryIds = [13, 2, 7, 1, 4, 3]

export const categoryBasePrices: Record<number, number> = {
  1: 800, 2: 900, 3: 1000, 4: 1200, 5: 1300, 6: 1100,
  7: 900, 8: 1500, 9: 1200, 10: 1800, 11: 2500, 12: 2000, 13: 1500,
}

export function getCategoryBasePrice(categoryId: number): number {
  return categoryBasePrices[categoryId] ?? 800
}

export const photoFallback = 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800'

export function onPhotoError(e: Event) {
  const img = e.target as HTMLImageElement | null
  if (!img || img.dataset.fallbackApplied) return
  img.dataset.fallbackApplied = '1'
  img.src = photoFallback.replace(/w=\d+/, `w=${img.width > 0 ? Math.min(img.width, 1200) : 800}`)
}

export function getCategoryPhoto(categoryId: number, index?: number, width = 800): string {
  const photos = categoryPhotos[categoryId]
  if (!photos?.length) {
    return photoFallback.replace(/w=\d+/, `w=${width}`)
  }
  const idx = index !== undefined ? index % photos.length : Math.floor(Math.random() * photos.length)
  return photos[idx].replace(/w=\d+/, `w=${width}`)
}

export function getHeroPhoto(index?: number, width = 1600): string {
  const idx = index !== undefined ? index % heroPhotos.length : 0
  return heroPhotos[idx].replace(/w=\d+/, `w=${width}`)
}

export function getLocationPhoto(location: string, width = 800): string {
  for (const [key, url] of Object.entries(locationPhotos)) {
    if (location.includes(key)) return url.replace(/w=\d+/, `w=${width}`)
  }
  return `https://images.pexels.com/photos/2595938/pexels-photo-2595938.jpeg?auto=compress&cs=tinysrgb&w=${width}`
}

export function getStudioPhoto(index?: number, width = 800): string {
  const idx = index !== undefined ? index % studioPhotos.length : 0
  return studioPhotos[idx].replace(/w=\d+/, `w=${width}`)
}

export function getStylistPhoto(index?: number, width = 800): string {
  const idx = index !== undefined ? index % stylistPhotos.length : 0
  return stylistPhotos[idx].replace(/w=\d+/, `w=${width}`)
}

export function getStepPhoto(index: number, width = 600): string {
  const url = stepPhotos[index % stepPhotos.length]
  return url.replace(/w=\d+/, `w=${width}`)
}

export function getRecruitPhoto(width = 1200): string {
  return recruitPhoto.replace(/w=\d+/, `w=${width}`)
}

/** 首頁作品牆 — Bento 馬賽克 */
export interface PortfolioTile {
  url: string
  span: 'normal' | 'wide' | 'tall' | 'large'
  label?: string
  categoryId?: number
}

const portfolioSources: Omit<PortfolioTile, 'url'>[] = [
  { span: 'large', label: '旅拍', categoryId: 13 },
  { span: 'tall', label: '情侶寫真', categoryId: 2 },
  { span: 'normal', label: '個人寫真', categoryId: 1 },
  { span: 'wide', label: '婚禮', categoryId: 7 },
  { span: 'normal', label: '全家福', categoryId: 3 },
  { span: 'tall', label: '孕婦寫真', categoryId: 5 },
  { span: 'wide', label: '寶寶寫真', categoryId: 4 },
  { span: 'normal', label: '畢業照', categoryId: 11 },
  { span: 'normal', label: '商業攝影', categoryId: 12 },
  { span: 'wide', label: '藝術寫真', categoryId: 6 },
  { span: 'tall', label: '運動攝影', categoryId: 9 },
  { span: 'normal', label: '寵物攝影', categoryId: 10 },
  { span: 'large', label: '美食攝影', categoryId: 14 },
  { span: 'normal', label: '生日派對', categoryId: 8 },
  { span: 'wide', label: '空間攝影', categoryId: 13 },
  { span: 'normal', label: '高規格婚禮', categoryId: 7 },
]

export function getPortfolioWall(width = 700): PortfolioTile[] {
  return portfolioSources.map((tile, i) => ({
    ...tile,
    url: getCategoryPhoto(tile.categoryId || ((i % 13) + 1), i % 3, width),
  }))
}

export const fallbackSpots = [
  { id: 901, name: '九份老街', area: '新北市瑞芳' },
  { id: 902, name: '台北 101', area: '台北市信義' },
  { id: 903, name: '日月潭', area: '南投縣魚池' },
  { id: 904, name: '墾丁白沙灣', area: '屏東縣恆春' },
  { id: 905, name: '太魯閣', area: '花蓮縣秀林' },
  { id: 906, name: '清境農場', area: '南投縣仁愛' },
  { id: 907, name: '淡水紅毛城', area: '新北市淡水' },
  { id: 908, name: '阿里山日出', area: '嘉義縣阿里山' },
  { id: 909, name: '高美濕地', area: '台中市清水' },
  { id: 910, name: '西門町', area: '台北市萬華' },
  { id: 911, name: '花博公園', area: '台北市中山' },
  { id: 912, name: '旗津海岸', area: '高雄市旗津' },
]

export const fallbackCategories = [
  { id: 1, name: '個人寫真' },
  { id: 2, name: '情侶寫真' },
  { id: 3, name: '全家福' },
  { id: 4, name: '寶寶寫真' },
  { id: 5, name: '孕婦寫真' },
  { id: 6, name: '個人藝術寫真' },
  { id: 7, name: '畢業寫真' },
  { id: 8, name: '企業形象照' },
  { id: 9, name: '活動紀錄' },
  { id: 10, name: '婚禮' },
  { id: 11, name: '高規格婚禮' },
  { id: 12, name: '婚紗攝影' },
  { id: 13, name: '空間攝影' },
]

export function mapCategoriesWithPhotos(types: typeof fallbackCategories = fallbackCategories) {
  return types.map((t, i) => ({
    ...t,
    photo: getCategoryPhoto(t.id, i % 3, 500),
  }))
}

const demoProviderSpecs = [
  { providerId: 9001, nickName: '小安 · 日系寫真', city: '台北市', rating: '5.0', categoryId: 1 },
  { providerId: 9002, nickName: '阿凱 · 旅拍達人', city: '台中市', rating: '4.9', categoryId: 13 },
  { providerId: 9003, nickName: 'Mina · 情侶專家', city: '高雄市', rating: '4.9', categoryId: 2 },
  { providerId: 9004, nickName: 'Jay · 婚禮紀錄', city: '新北市', rating: '5.0', categoryId: 10 },
  { providerId: 9005, nickName: 'Yuki · 全家福', city: '桃園市', rating: '4.8', categoryId: 3 },
  { providerId: 9006, nickName: 'Leo · 商業攝影', city: '台北市', rating: '4.9', categoryId: 8 },
  { providerId: 9007, nickName: 'Emma · 孕婦寫真', city: '台南市', rating: '5.0', categoryId: 5 },
  { providerId: 9008, nickName: 'Ryan · 活動紀錄', city: '新竹市', rating: '4.8', categoryId: 9 },
]

export function getDemoProviders() {
  return demoProviderSpecs.map((s, i) => ({
    ...s,
    _photo: getCategoryPhoto(s.categoryId, i % 3, 600),
  }))
}

export function getDemoStudios() {
  return [
    { id: 8001, name: '日光棚 · 台北', city: '台北市', studioType: '自然光', hourlyRate: 1200 },
    { id: 8002, name: '自然光棚 · 台中', city: '台中市', studioType: '自然光', hourlyRate: 1000 },
    { id: 8003, name: '復古場景棚', city: '高雄市', studioType: '場景棚', hourlyRate: 1500 },
    { id: 8004, name: 'TOP 商業棚', city: '台北市', studioType: '商業棚', hourlyRate: 2000 },
  ]
}

export function getDemoStylists() {
  return [
    { providerId: 7001, nickName: 'Mia · 新娘秘書', city: '台北市', rating: '5.0', unitPrice: 600 },
    { providerId: 7002, nickName: 'Luna · 韓系妝髮', city: '台中市', rating: '4.9', unitPrice: 550 },
    { providerId: 7003, nickName: 'Coco · 時尚造型', city: '高雄市', rating: '4.8', unitPrice: 500 },
    { providerId: 7004, nickName: 'Vivi · 活動妝髮', city: '台北市', rating: '5.0', unitPrice: 650 },
  ]
}

export function getAllCategoryPhotos(): Record<number, string> {
  const result: Record<number, string> = {}
  for (const [id, photos] of Object.entries(categoryPhotos)) {
    result[Number(id)] = photos[0]
  }
  return result
}

export { categoryPhotos, heroPhotos, locationPhotos, stepPhotos }
