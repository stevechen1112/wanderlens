import request from './request'

export default {
  login: (empno: string, password: string) =>
    request.post('/auth/login', { empno, password }),

  me: () =>
    request.get('/auth/me'),

  updateProfile: (data: { username?: string; avatar?: string }) =>
    request.put('/auth/me', data),

  changePassword: (oldPassword: string, newPassword: string) =>
    request.post('/auth/change-password', { oldPassword, newPassword, confirmPassword: newPassword }),

  // 攝影師資料
  getProvider: (id: number) =>
    request.get(`/providers/${id}`),

  updateProvider: (data: any) =>
    request.post('/providers', data),

  setLive: (providerId: number, live: boolean) =>
    request.post('/providers/live', null, { params: { providerId, live } }),

  // 行事曆
  getSchedule: (providerId: number) =>
    request.get(`/providers/${providerId}/schedule`),

  setSchedule: (data: any) =>
    request.post('/providers/schedule', data),

  deleteSchedule: (sid: number, providerId: number) =>
    request.delete(`/providers/schedule/${sid}`, { params: { providerId } }),

  // 服務地區
  getServiceArea: (providerId: number) =>
    request.get(`/providers/service-area/${providerId}`),

  setServiceArea: (providerId: number, data: any) =>
    request.post(`/providers/service-area/${providerId}`, data),

  // 匯款
  getBank: () =>
    request.get('/providers/bank'),

  setBank: (data: any) =>
    request.post('/providers/bank', data),

  // 特色
  getFeature: (providerId: number) =>
    request.get(`/providers/feature/${providerId}`),

  setFeature: (data: any) =>
    request.post('/providers/feature', data),

  deleteFeature: (featureId: number, providerId: number) =>
    request.delete(`/providers/feature/${featureId}`, { params: { providerId } }),

  // 作品集
  getWorks: (providerId: number) =>
    request.get(`/providers/works/${providerId}`),

  addWork: (data: { providerId: number; fileUuid: string }) =>
    request.post('/providers/works', data),

  deleteWork: (id: number, providerId: number) =>
    request.delete(`/providers/works/${id}`, { params: { providerId } }),

  // 評價
  getRating: (providerId: number) =>
    request.get(`/providers/rating/${providerId}`),

  // Phase 3: 作品集公開授權
  getPublicAlbums: (photographerId: number) =>
    request.get(`/albums/public/photographer/${photographerId}`),

  requestPortfolioConsent: (albumId: number) =>
    request.put(`/albums/${albumId}/consent/multi`, null, { params: { providerConsent: 'PORTFOLIO' } }),

  // 訂單
  getMyOrders: () =>
    request.get('/orders/provider'),

  contactCustomer: (orderId: number) =>
    request.post(`/orders/contact/${orderId}`),

  confirmReadyToShoot: (orderId: number) =>
    request.post(`/orders/confirm-ready/${orderId}`),

  startShoot: (orderId: number) =>
    request.post('/orders/shoot/start', null, { params: { orderId } }),

  endShoot: (orderId: number) =>
    request.post('/orders/shoot/end', null, { params: { orderId } }),

  requestExtraTime: (orderId: number, minutes: number, fee: number) =>
    request.post('/orders/shoot/extra-time', null, { params: { orderId, minutes, fee } }),

  // 溝通
  getConversations: () =>
    request.get('/conversations'),

  getMessages: (id: number, page = 1, size = 50) =>
    request.get(`/conversations/${id}/messages`, { params: { page, size } }),

  sendMessage: (id: number, content: string) =>
    request.post(`/conversations/${id}/messages`, { content }),

  sendImage: (id: number, imageUrl: string) =>
    request.post(`/conversations/${id}/messages/image`, null, { params: { imageUrl } }),

  markAsRead: (id: number) =>
    request.post(`/conversations/${id}/read`),

  getConversation: (id: number) =>
    request.get(`/conversations/${id}`),

  uploadConversationImage: (id: number, formData: FormData) =>
    request.post(`/conversations/${id}/messages/image-upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // 通知
  getUnreadCount: () =>
    request.get('/notify/unread'),

  getNotifications: (page = 1, size = 20) =>
    request.get('/notify/page', { params: { page, size } }),

  markNotifyRead: (id: number) =>
    request.post(`/notify/read/${id}`),

  // 通用上傳
  uploadFile: (usage: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post(`/files/upload/${usage}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // 媒體上傳 token
  getUploadToken: (orderId: number, assetType: string) =>
    request.post('/media/upload-token', null, { params: { orderId, assetType } }),

  // 區域與 Geocoder
  getAreasTree: () => request.get('/areas/tree'),
  geocodeAddress: (address: string) =>
    request.get('/google/maps/geocode', { params: { address } }),
}