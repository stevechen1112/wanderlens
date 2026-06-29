import request from './request'

export default {
  // 認證
  login: (empno: string, password: string) => request.post('/auth/login', { empno, password }),
  me: () => request.get('/auth/me'),
  changePassword: (oldPassword: string, newPassword: string) =>
    request.post('/auth/change-password', { oldPassword, newPassword, confirmPassword: newPassword }),

  // 使用者
  getUsers: (params?: any) => request.get('/users', { params }),
  saveUser: (data: any) => request.post('/users', data),
  deleteUser: (id: number) => request.delete(`/users/${id}`),

  // 角色
  getRoles: () => request.get('/roles'),
  saveRole: (data: any) => request.post('/roles', data),
  deleteRole: (id: number) => request.delete(`/roles/${id}`),

  // 選單
  getMenus: () => request.get('/menus'),
  saveMenu: (data: any) => request.post('/menus', data),
  deleteMenu: (id: number) => request.delete(`/menus/${id}`),

  // 攝影師
  getProviders: (params?: any) => request.get('/providers', { params }),
  getProvider: (id: number) => request.get(`/providers/${id}`),
  updateProvider: (data: any) => request.post('/providers', data),
  setProviderLive: (providerId: number, live: boolean) =>
    request.post('/providers/live', null, { params: { providerId, live } }),
  getProviderSchedule: (providerId: number) => request.get(`/providers/${providerId}/schedule`),
  getProviderFeatures: (providerId: number) => request.get(`/providers/feature/${providerId}`),
  setProviderFeature: (data: any) => request.post('/providers/feature', data),
  deleteProviderFeature: (featureId: number, providerId: number) =>
    request.delete(`/providers/feature/${featureId}`, { params: { providerId } }),
  getProviderWorks: (providerId: number) => request.get(`/providers/works/${providerId}`),
  addProviderWork: (data: { providerId: number; fileUuid: string }) => request.post('/providers/works', data),
  deleteProviderWork: (workId: number, providerId: number) =>
    request.delete(`/providers/works/${workId}`, { params: { providerId } }),
  getAreasTree: () => request.get('/areas/tree'),
  getProviderServiceArea: (providerId: number) => request.get(`/providers/service-area/${providerId}`),
  setProviderServiceArea: (providerId: number, data: { rootNodes: number[]; selectedNodes: number[] }) =>
    request.post(`/providers/service-area/${providerId}`, data),

  // 客戶
  getCustomers: (params?: any) => request.get('/customers', { params }),

  // 訂單
  getOrders: (params?: any) => request.get('/orders/all', { params }),
  getOrder: (id: number) => request.get(`/orders/${id}`),
  getOrdersByStatus: (status: string) => request.get('/orders/all', { params: { status, page: 1, size: 100 } }),
  manualOrder: (data: any) => request.post('/orders/manual', data),
  cancelOrder: (orderId: number, reason: string) =>
    request.post('/orders/cancel', null, { params: { orderId, reason } }),
  getOrderHistory: (orderId: number) => request.get(`/orders/${orderId}/history`),

  // 金流
  refund: (orderId: number, reason: string) =>
    request.post('/payment/refund', null, { params: { orderId, reason } }),
  payout: (orderId: number, providerId: number) =>
    request.post(`/payment/payout/${orderId}`, null, { params: { providerId } }),
  getLedger: (orderId: number) => request.get(`/payment/ledger/entries/${orderId}`),

  // 媒體
  getMediaStatus: (orderId: number) => request.get(`/media/status/${orderId}`),
  approveRawVerify: (orderId: number, fileCount = 0, totalSize = 0) =>
    request.post(`/media/admin/verify/${orderId}/approve`, null, { params: { fileCount, totalSize } }),
  rejectRawVerify: (orderId: number, reason: string) =>
    request.post(`/media/admin/verify/${orderId}/reject`, null, { params: { reason } }),
  interveneMedia: (orderId: number, reason: string) =>
    request.post(`/media/intervene/${orderId}`, null, { params: { reason } }),

  // 溝通調閱
  getConversationAccessLog: (conversationId: number) =>
    request.get(`/conversations/${conversationId}/access-log`),
  accessConversation: (conversationId: number, reason: string) =>
    request.post(`/conversations/${conversationId}/access`, null, { params: { reason } }),

  getSupportConversations: () => request.get('/conversations/support'),
  getConversation: (id: number) => request.get(`/conversations/${id}`),
  getConversationMessages: (id: number, page = 1, size = 50) =>
    request.get(`/conversations/${id}/messages`, { params: { page, size } }),
  sendConversationMessage: (id: number, content: string) =>
    request.post(`/conversations/${id}/messages`, { content }),
  markConversationRead: (id: number) => request.post(`/conversations/${id}/read`),
  openAdminChannel: (targetUserId: number, initialMessage?: string) =>
    request.post('/conversations/admin-channel', { targetUserId, initialMessage }),

  // 參與者管理
  getConversationParticipants: (conversationId: number) =>
    request.get(`/conversations/${conversationId}/participants`),
  addConversationParticipant: (conversationId: number, userId: number, userType: string) =>
    request.post(`/conversations/${conversationId}/participants`, { userId, userType }),
  removeConversationParticipant: (conversationId: number, userId: number) =>
    request.delete(`/conversations/${conversationId}/participants/${userId}`),

  // 優惠券
  getCoupons: () => request.get('/coupons'),
  saveCoupon: (data: any) => request.post('/coupons', data),
  deleteCoupon: (id: number) => request.delete(`/coupons/${id}`),

  // 區域
  getAreas: () => request.get('/areas'),
  saveArea: (data: any) => request.post('/areas', data),
  deleteArea: (id: number) => request.delete(`/areas/${id}`),

  // 內容
  getBanners: () => request.get('/banners'),
  saveBanner: (data: any) => request.post('/banners', data),
  deleteBanner: (id: number) => request.delete(`/banners/${id}`),
  getNews: () => request.get('/news'),
  saveNews: (data: any) => request.post('/news', data),
  deleteNews: (id: number) => request.delete(`/news/${id}`),
  getFaqs: () => request.get('/faqs'),
  saveFaq: (data: any) => request.post('/faqs', data),
  deleteFaq: (id: number) => request.delete(`/faqs/${id}`),
  getAttractions: () => request.get('/attractions'),
  saveAttraction: (data: any) => request.post('/attractions', data),
  deleteAttraction: (id: number) => request.delete(`/attractions/${id}`),
  getInstagram: () => request.get('/instagram'),
  saveInstagram: (data: any) => request.post('/instagram', data),
  deleteInstagram: (id: number) => request.delete(`/instagram/${id}`),

  // 通知
  getUnreadCount: () => request.get('/notify/unread'),
  getNotifications: (page = 1, size = 20) => request.get('/notify/page', { params: { page, size } }),
  markNotifyRead: (id: number) => request.post(`/notify/read/${id}`),

  // LINE 群發（target 可為 userId 數字或群發對象字串：photographer / admin / all）
  sendLineNotify: (target: number | string, message: string) =>
    request.post('/line/notify', null, { params: { target, message } }),

  // 通用上傳
  uploadFile: (usage: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post(`/files/upload/${usage}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Phase 3: 內容營運
  getPublicAlbums: () => request.get('/albums/public'),
  getPublicAlbumsByType: (serviceTypeId: number) => request.get(`/albums/public/type/${serviceTypeId}`),
  getPublicAlbumsByLocation: (location: string) => request.get(`/albums/public/location/${location}`),
  getPublicAlbumsByPhotographer: (photographerId: number) => request.get(`/albums/public/photographer/${photographerId}`),

  // Phase 3: 公開授權審核
  setAlbumConsent: (albumId: number, consumerConsent?: string, providerConsent?: string, hasMinor?: boolean) =>
    request.put(`/albums/${albumId}/consent/multi`, null, { params: { consumerConsent, providerConsent, hasMinor } }),
  revokeAlbumConsent: (albumId: number) => request.post(`/albums/${albumId}/consent/revoke`),

  // 服務類型管理
  getServiceTypes: () => request.get('/service-types'),
  saveServiceType: (data: any) => request.post('/service-types', data),
  deleteServiceType: (id: number) => request.delete(`/service-types/${id}`),

  // 推廣員 (Affiliate)
  getAffiliates: (params?: any) => request.get('/affiliates', { params }),
  getAffiliate: (id: number) => request.get(`/affiliates/${id}`),
  saveAffiliate: (data: any) => request.post('/affiliates', data),
  deleteAffiliate: (id: number) => request.delete(`/affiliates/${id}`),

  // 市場訊號儀表板（Phase 5）
  getMarketSignalDashboard: (days = 30) =>
    request.get('/market-signals/dashboard', { params: { days } }),

  // 攝影師檔期總覽
  getAllSchedules: (month?: string) => request.get('/providers/schedules/all', { params: { month } }),
}