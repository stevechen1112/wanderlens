import client from './client'

export interface ApiUser {
  userId: number
  providerId?: number | null
  empno: string
  username: string
  role: string
  avatar: string
}

export interface ScheduleSlot {
  id: number
  providerId: number
  scheduleDate: string
  slotStart: string
  slotEnd: string
  active: string
  lockedByOrderId?: number | null
}

export interface ProviderOrder {
  id: number
  orderNo: string
  status: string
  shootingDate?: string
  timeStart?: string
  timeEnd?: string
  location?: string
  consumerName?: string
  consumerPhone?: string
  totalFee?: number
  photographerProfit?: number
  serviceType?: string
  createdAt?: string
}

export interface ShootEvent {
  id: number
  eventType: string
  eventTime: string
  extraTimeMinutes?: number
  extraTimeFee?: number
}

export interface Conversation {
  id: number
  orderId?: number
  status: string
  lastMessage?: string
  unread?: number
  updatedAt?: string
}

export interface Message {
  id: number
  senderId: number
  content: string
  messageType?: string
  imageUrl?: string
  createdAt: string
}

export interface NotificationItem {
  id: number
  message: string
  isRead: boolean
  createdAt: string
}

export interface RatingSummary {
  averageRating?: number
  totalCount?: number
  distribution?: Record<string, number>
  recentRatings?: Array<{
    id: number
    stars: number
    comments?: string
    consumerName?: string
    createdAt: string
  }>
}

export interface ProviderEarnings {
  monthlyEarnings: number
  totalEarnings: number
  pendingSettlement: number
  withdrawable: number
  items: Array<{
    orderId: number
    orderNo: string
    status: string
    shootingDate: string
    amount: number
    settled: boolean
  }>
}

export interface MatchStats {
  todayAccepted?: number
  monthAccepted?: number
  online?: boolean
}

export const authApi = {
  login: (empno: string, password: string) =>
    client.post('/auth/login', { empno, password }),
  me: () => client.get('/auth/me'),
}

export const providerApi = {
  getProvider: (id: number) => client.get(`/providers/${id}`),
  updateProvider: (data: Record<string, unknown>) => client.post('/providers', data),
  getFeatures: (providerId: number) => client.get(`/providers/feature/${providerId}`),
  setFeature: (data: Record<string, unknown>) => client.post('/providers/feature', data),
  deleteFeature: (featureId: number, providerId: number) =>
    client.delete(`/providers/feature/${featureId}`, { params: { providerId } }),
  getWorks: (providerId: number) => client.get(`/providers/works/${providerId}`),
  addWork: (data: { providerId: number; fileUuid: string }) => client.post('/providers/works', data),
  deleteWork: (workId: number, providerId: number) =>
    client.delete(`/providers/works/${workId}`, { params: { providerId } }),
  uploadFile: (usage: string, formData: FormData) =>
    client.post(`/files/upload/${usage}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getServiceTypes: () => client.get('/service-types'),
  getServiceArea: (providerId: number) => client.get(`/providers/service-area/${providerId}`),
  setServiceArea: (providerId: number, data: { rootNodes: number[]; selectedNodes: number[] }) =>
    client.post(`/providers/service-area/${providerId}`, data),
  getBank: () => client.get('/providers/bank'),
  setBank: (data: Record<string, unknown>) => client.post('/providers/bank', data),
  getSchedule: (providerId: number) => client.get(`/providers/${providerId}/schedule`),
  setSchedule: (data: { providerId: number; dates: string[]; slotStart: string; slotEnd: string }) =>
    client.post('/providers/schedule', data),
  blockSchedule: (data: { providerId: number; dates: string[]; slotStart: string; slotEnd: string }) =>
    client.post('/providers/schedule/block', data),
  deleteSchedule: (slotId: number, providerId: number) =>
    client.delete(`/providers/schedule/${slotId}`, { params: { providerId } }),
  setLive: (providerId: number, live: boolean) =>
    client.post('/providers/live', null, { params: { providerId, live } }),
  getRating: (providerId: number) => client.get(`/providers/rating/${providerId}`),
  getEarnings: (providerId: number) => client.get(`/providers/${providerId}/earnings`),
}

export const orderApi = {
  providerOrders: () => client.get('/orders/provider'),
  getOrder: (id: number) => client.get(`/orders/${id}`),
  getShootEvents: (orderId: number) => client.get(`/orders/${orderId}/shoot-events`),
  contactCustomer: (orderId: number) => client.post(`/orders/contact/${orderId}`),
  startShoot: (orderId: number) => client.post('/orders/shoot/start', null, { params: { orderId } }),
  endShoot: (orderId: number) => client.post('/orders/shoot/end', null, { params: { orderId } }),
  requestExtraTime: (orderId: number, minutes: number, fee: number) =>
    client.post('/orders/shoot/extra-time', null, { params: { orderId, minutes, fee } }),
}

export const conversationApi = {
  list: () => client.get('/conversations'),
  getMessages: (id: number, page = 1, size = 50) =>
    client.get(`/conversations/${id}/messages`, { params: { page, size } }),
  sendMessage: (id: number, content: string) =>
    client.post(`/conversations/${id}/messages`, { content }),
  uploadImage: (id: number, formData: FormData) =>
    client.post(`/conversations/${id}/messages/image-upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  markAsRead: (id: number) => client.post(`/conversations/${id}/read`),
}

export const matchApi = {
  getPublicStatus: () => client.get('/match/public/status'),
  goOnline: (data?: { lat?: number; lng?: number; city?: string }) =>
    client.post('/match/online', data || {}),
  goOffline: () => client.post('/match/offline'),
  onlineStatus: () => client.get('/match/online/status'),
  acceptRequest: (id: number) => client.post(`/match/request/${id}/accept`),
  declineRequest: (id: number) => client.post(`/match/request/${id}/decline`),
  getStats: () => client.get('/match/stats'),
}

export const notifyApi = {
  getUnread: () => client.get('/notify/unread'),
  getList: (page = 1, size = 20) => client.get('/notify/page', { params: { page, size } }),
  markRead: (id: number) => client.post(`/notify/read/${id}`),
  registerDeviceToken: (token: string, platform = 'EXPO', appType = 'PROVIDER') =>
    client.post('/notify/device-token', { token, platform, appType }),
  removeDeviceToken: (token: string) =>
    client.delete('/notify/device-token', { data: { token } }),
}
