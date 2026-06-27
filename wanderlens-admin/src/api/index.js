import request from './request';
export default {
    // 認證
    login: (empno, password) => request.post('/auth/login', { empno, password }),
    me: () => request.get('/auth/me'),
    changePassword: (oldPassword, newPassword) => request.post('/auth/change-password', { oldPassword, newPassword, confirmPassword: newPassword }),
    // 使用者
    getUsers: (params) => request.get('/users', { params }),
    saveUser: (data) => request.post('/users', data),
    deleteUser: (id) => request.delete(`/users/${id}`),
    // 角色
    getRoles: () => request.get('/roles'),
    saveRole: (data) => request.post('/roles', data),
    deleteRole: (id) => request.delete(`/roles/${id}`),
    // 選單
    getMenus: () => request.get('/menus'),
    saveMenu: (data) => request.post('/menus', data),
    deleteMenu: (id) => request.delete(`/menus/${id}`),
    // 攝影師
    getProviders: (params) => request.get('/providers', { params }),
    getProvider: (id) => request.get(`/providers/${id}`),
    setProviderLive: (providerId, live) => request.post('/providers/live', null, { params: { providerId, live } }),
    getProviderSchedule: (providerId) => request.get(`/providers/${providerId}/schedule`),
    // 客戶
    getCustomers: (params) => request.get('/customers', { params }),
    // 訂單
    getOrders: (params) => request.get('/orders/all', { params }),
    getOrder: (id) => request.get(`/orders/${id}`),
    getOrdersByStatus: (status) => request.get('/orders/all', { params: { status, page: 1, size: 100 } }),
    manualOrder: (data) => request.post('/orders/manual', data),
    cancelOrder: (orderId, reason) => request.post('/orders/cancel', null, { params: { orderId, reason } }),
    getOrderHistory: (orderId) => request.get(`/orders/${orderId}/history`),
    // 金流
    refund: (orderId, reason) => request.post('/payment/refund', null, { params: { orderId, reason } }),
    payout: (orderId, providerId) => request.post(`/payment/payout/${orderId}`, null, { params: { providerId } }),
    getLedger: (orderId) => request.get(`/payment/ledger/entries/${orderId}`),
    // 媒體
    getMediaStatus: (orderId) => request.get(`/media/status/${orderId}`),
    approveRawVerify: (orderId, fileCount = 0, totalSize = 0) => request.post(`/media/admin/verify/${orderId}/approve`, null, { params: { fileCount, totalSize } }),
    rejectRawVerify: (orderId, reason) => request.post(`/media/admin/verify/${orderId}/reject`, null, { params: { reason } }),
    interveneMedia: (orderId, reason) => request.post(`/media/intervene/${orderId}`, null, { params: { reason } }),
    // 溝通調閱
    getConversationAccessLog: (conversationId) => request.get(`/conversations/${conversationId}/access-log`),
    accessConversation: (conversationId, reason) => request.post(`/conversations/${conversationId}/access`, null, { params: { reason } }),
    getSupportConversations: () => request.get('/conversations/support'),
    getConversation: (id) => request.get(`/conversations/${id}`),
    getConversationMessages: (id, page = 1, size = 50) => request.get(`/conversations/${id}/messages`, { params: { page, size } }),
    sendConversationMessage: (id, content) => request.post(`/conversations/${id}/messages`, { content }),
    markConversationRead: (id) => request.post(`/conversations/${id}/read`),
    openAdminChannel: (targetUserId, initialMessage) => request.post('/conversations/admin-channel', { targetUserId, initialMessage }),
    // 優惠券
    getCoupons: () => request.get('/coupons'),
    saveCoupon: (data) => request.post('/coupons', data),
    deleteCoupon: (id) => request.delete(`/coupons/${id}`),
    // 區域
    getAreas: () => request.get('/areas'),
    saveArea: (data) => request.post('/areas', data),
    deleteArea: (id) => request.delete(`/areas/${id}`),
    // 內容
    getBanners: () => request.get('/banners'),
    saveBanner: (data) => request.post('/banners', data),
    deleteBanner: (id) => request.delete(`/banners/${id}`),
    getNews: () => request.get('/news'),
    saveNews: (data) => request.post('/news', data),
    deleteNews: (id) => request.delete(`/news/${id}`),
    getFaqs: () => request.get('/faqs'),
    saveFaq: (data) => request.post('/faqs', data),
    deleteFaq: (id) => request.delete(`/faqs/${id}`),
    getAttractions: () => request.get('/attractions'),
    saveAttraction: (data) => request.post('/attractions', data),
    deleteAttraction: (id) => request.delete(`/attractions/${id}`),
    getInstagram: () => request.get('/instagram'),
    saveInstagram: (data) => request.post('/instagram', data),
    deleteInstagram: (id) => request.delete(`/instagram/${id}`),
    // 通知
    getUnreadCount: () => request.get('/notify/unread'),
    getNotifications: (page = 1, size = 20) => request.get('/notify/page', { params: { page, size } }),
    markNotifyRead: (id) => request.post(`/notify/read/${id}`),
    // LINE 群發（target 可為 userId 數字或群發對象字串：photographer / admin / all）
    sendLineNotify: (target, message) => request.post('/line/notify', null, { params: { target, message } }),
    // 通用上傳
    uploadFile: (usage, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return request.post(`/files/upload/${usage}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    // Phase 3: 內容營運
    getPublicAlbums: () => request.get('/albums/public'),
    getPublicAlbumsByType: (serviceTypeId) => request.get(`/albums/public/type/${serviceTypeId}`),
    getPublicAlbumsByLocation: (location) => request.get(`/albums/public/location/${location}`),
    getPublicAlbumsByPhotographer: (photographerId) => request.get(`/albums/public/photographer/${photographerId}`),
    // Phase 3: 公開授權審核
    setAlbumConsent: (albumId, consumerConsent, providerConsent, hasMinor) => request.put(`/albums/${albumId}/consent/multi`, null, { params: { consumerConsent, providerConsent, hasMinor } }),
    revokeAlbumConsent: (albumId) => request.post(`/albums/${albumId}/consent/revoke`),
    // 服務類型管理
    getServiceTypes: () => request.get('/service-types'),
    saveServiceType: (data) => request.post('/service-types', data),
    deleteServiceType: (id) => request.delete(`/service-types/${id}`),
    // 推廣員 (Affiliate)
    getAffiliates: (params) => request.get('/affiliates', { params }),
    getAffiliate: (id) => request.get(`/affiliates/${id}`),
    saveAffiliate: (data) => request.post('/affiliates', data),
    deleteAffiliate: (id) => request.delete(`/affiliates/${id}`),
    // 市場訊號儀表板（Phase 5）
    getMarketSignalDashboard: (days = 30) => request.get('/market-signals/dashboard', { params: { days } }),
    // 攝影師檔期總覽
    getAllSchedules: (month) => request.get('/providers/schedules/all', { params: { month } }),
};
//# sourceMappingURL=index.js.map