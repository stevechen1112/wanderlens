import client from './client'

export const authApi = {
  login: (empno: string, password: string) =>
    client.post('/auth/login', { empno, password }),

  me: () => client.get('/auth/me'),
}

export const albumApi = {
  myAlbums: () => client.get('/albums'),
  getAlbum: (id: number) => client.get(`/albums/${id}`),
  getPhotos: (id: number) => client.get(`/albums/${id}/photos`),
  download: (albumId: number, mediaAssetId: number) =>
    client.post(`/albums/${albumId}/download`, null, { params: { mediaAssetId } }),
  share: (id: number) => client.post(`/albums/${id}/share`),

  // Phase 3
  albumsByYear: (year: number) => client.get(`/albums/history/year/${year}`),
  albumsByLocation: (location: string) => client.get(`/albums/history/location/${location}`),
  favorite: (albumId: number, mediaAssetId: number) =>
    client.post(`/albums/${albumId}/favorite`, null, { params: { mediaAssetId } }),
  unfavorite: (albumId: number, mediaAssetId: number) =>
    client.delete(`/albums/${albumId}/favorite`, { params: { mediaAssetId } }),
  getFavorites: () => client.get('/albums/favorites'),
  setMultiLevelConsent: (albumId: number, consumerConsent?: string, providerConsent?: string, hasMinor?: boolean) =>
    client.put(`/albums/${albumId}/consent/multi`, null, { params: { consumerConsent, providerConsent, hasMinor } }),
  getConsent: (albumId: number) => client.get(`/albums/${albumId}/consent`),
  socialShare: (albumId: number, platform: string) =>
    client.post(`/albums/${albumId}/share/${platform}`),
}

export const retouchApi = {
  createJob: (orderId: number, consumerId: number, mediaAssetIds: string, spec?: string, fee?: number) =>
    client.post('/retouch/jobs', null, { params: { orderId, consumerId, mediaAssetIds, spec, fee } }),
  getJobs: (status?: string) => client.get('/retouch/jobs', { params: { status } }),
}

export const conversationApi = {
  myConversations: () => client.get('/conversations'),
  getConversation: (id: number) => client.get(`/conversations/${id}`),
  getMessages: (id: number, page = 1, size = 50) =>
    client.get(`/conversations/${id}/messages`, { params: { page, size } }),
  sendMessage: (id: number, content: string) =>
    client.post(`/conversations/${id}/messages`, { content }),
  sendImage: (id: number, imageUrl: string) =>
    client.post(`/conversations/${id}/messages/image`, null, { params: { imageUrl } }),
  uploadImage: (id: number, formData: FormData) =>
    client.post(`/conversations/${id}/messages/image-upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  markAsRead: (id: number) => client.post(`/conversations/${id}/read`),
  openCustomerService: (content?: string) =>
    client.post('/conversations/customer-service', content ? { content } : {}),
  getOrderConversation: (orderId: number, providerId?: number) =>
    client.get(`/conversations/order/${orderId}`, { params: providerId ? { providerId } : {} }),
  getParticipants: (id: number) => client.get(`/conversations/${id}/participants`),
  addParticipant: (id: number, userId: number, userType: string) =>
    client.post(`/conversations/${id}/participants`, { userId, userType }),
  removeParticipant: (id: number, userId: number) =>
    client.delete(`/conversations/${id}/participants/${userId}`),
}

export const bookingApi = {
  getServiceTypes: () => client.get('/search/service-types'),
  getConfigurations: () => client.get('/search/configurations'),
  searchProviders: (data: any) => client.post('/search/providers', data),
  searchMultiPool: (data: any) => client.post('/search/multi-pool', data),
  createOrder: (data: any) => client.post('/orders', data),
  myOrders: () => client.get('/orders/my'),
}

export const orderApi = {
  getOrder: (id: number) => client.get(`/orders/${id}`),
  getShootEvents: (orderId: number) => client.get(`/orders/${orderId}/shoot-events`),
  confirmExtraTime: (orderId: number) =>
    client.post('/orders/shoot/extra-time/confirm', null, { params: { orderId } }),
  submitRating: (data: { orderId: number; providerId: number; stars: number; comments?: string }) =>
    client.post('/providers/ratings', data),
}

export const paymentApi = {
  ecpayCheckout: (orderId: number) => client.get(`/payment/ecpay/checkout/${orderId}`),
  checkPayment: (orderNo: string) => client.get(`/payment/check/${orderNo}`),
}

export const googleApi = {
  autocompletePlaces: (input: string, lang = 'zh-TW') =>
    client.get('/google/places/autocomplete', { params: { input, lang } }),
  searchPlaces: (query: string, lang = 'zh-TW') =>
    client.get('/google/places/search', { params: { query, lang } }),
  geocode: (address: string) =>
    client.get('/google/maps/geocode', { params: { address } }),
}

export const notifyApi = {
  getUnread: () => client.get('/notify/unread'),
  getList: (page = 1, size = 20) => client.get('/notify/page', { params: { page, size } }),
  markRead: (id: number) => client.post(`/notify/read/${id}`),
  registerDeviceToken: (token: string, platform = 'EXPO', appType = 'CONSUMER') =>
    client.post('/notify/device-token', { token, platform, appType }),
  removeDeviceToken: (token: string) =>
    client.delete('/notify/device-token', { data: { token } }),
}

export const contentApi = {
  getAttractions: () => client.get('/attractions'),
  getInstagram: () => client.get('/instagram'),
  getPublicAlbums: () => client.get('/albums/public'),
  getBanners: (type: string) => client.get(`/banners/type/${type}`),
}

export const preferenceApi = {
  get: () => client.get('/consumer/preferences'),
  save: (data: {
    preferredServiceTypeIds?: number[]
    preferredCities?: string[]
    budgetMin?: number
    budgetMax?: number
    pushRecallEnabled?: boolean
  }) => client.put('/consumer/preferences', data),
}

export const recallApi = {
  getFeed: () => client.get('/recall/feed'),
}

export const matchApi = {
  getPublicStatus: () => client.get('/match/public/status'),
  createRequest: (data: {
    serviceTypeId: number
    shootingLocation: string
    shootingLat?: number
    shootingLng?: number
    city?: string
    durationHours: number
    startOffsetMinutes?: number
    customerName?: string
    customerPhone?: string
  }) => client.post('/match/request', data),
  getRequest: (id: number) => client.get(`/match/request/${id}`),
  cancelRequest: (id: number) => client.delete(`/match/request/${id}`),
  payAfterMatch: (id: number) => client.post(`/match/request/${id}/pay`),
}

export { providerApi } from './providerApi'
export type { ProviderPublicProfile } from './providerApi'
