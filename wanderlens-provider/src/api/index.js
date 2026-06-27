import request from './request';
export default {
    login: (empno, password) => request.post('/auth/login', { empno, password }),
    me: () => request.get('/auth/me'),
    changePassword: (oldPassword, newPassword) => request.post('/auth/change-password', { oldPassword, newPassword, confirmPassword: newPassword }),
    // 攝影師資料
    getProvider: (id) => request.get(`/providers/${id}`),
    updateProvider: (data) => request.post('/providers', data),
    setLive: (providerId, live) => request.post('/providers/live', null, { params: { providerId, live } }),
    // 行事曆
    getSchedule: (providerId) => request.get(`/providers/${providerId}/schedule`),
    setSchedule: (data) => request.post('/providers/schedule', data),
    deleteSchedule: (sid) => request.delete(`/providers/schedule/${sid}`),
    // 服務地區
    getServiceArea: (providerId) => request.get(`/providers/service-area/${providerId}`),
    setServiceArea: (providerId, data) => request.post(`/providers/service-area/${providerId}`, data),
    // 匯款
    getBank: () => request.get('/providers/bank'),
    setBank: (data) => request.post('/providers/bank', data),
    // 特色
    getFeature: (providerId) => request.get(`/providers/feature/${providerId}`),
    setFeature: (data) => request.post('/providers/feature', data),
    // 作品集
    getWorks: (providerId) => request.get(`/providers/works/${providerId}`),
    deleteWork: (id) => request.delete(`/providers/works/${id}`),
    // 評價
    getRating: (providerId) => request.get(`/providers/rating/${providerId}`),
    // Phase 3: 作品集公開授權
    getPublicAlbums: (photographerId) => request.get(`/albums/public/photographer/${photographerId}`),
    requestPortfolioConsent: (albumId) => request.put(`/albums/${albumId}/consent/multi`, null, { params: { providerConsent: 'PORTFOLIO' } }),
    // 訂單
    getMyOrders: () => request.get('/orders/provider'),
    contactCustomer: (orderId) => request.post(`/orders/contact/${orderId}`),
    confirmReadyToShoot: (orderId) => request.post(`/orders/confirm-ready/${orderId}`),
    startShoot: (orderId) => request.post('/orders/shoot/start', null, { params: { orderId } }),
    endShoot: (orderId) => request.post('/orders/shoot/end', null, { params: { orderId } }),
    requestExtraTime: (orderId, minutes, fee) => request.post('/orders/shoot/extra-time', null, { params: { orderId, minutes, fee } }),
    // 溝通
    getConversations: () => request.get('/conversations'),
    getMessages: (id, page = 1, size = 50) => request.get(`/conversations/${id}/messages`, { params: { page, size } }),
    sendMessage: (id, content) => request.post(`/conversations/${id}/messages`, { content }),
    sendImage: (id, imageUrl) => request.post(`/conversations/${id}/messages/image`, null, { params: { imageUrl } }),
    markAsRead: (id) => request.post(`/conversations/${id}/read`),
    getConversation: (id) => request.get(`/conversations/${id}`),
    uploadConversationImage: (id, formData) => request.post(`/conversations/${id}/messages/image-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    // 通知
    getUnreadCount: () => request.get('/notify/unread'),
    getNotifications: (page = 1, size = 20) => request.get('/notify/page', { params: { page, size } }),
    markNotifyRead: (id) => request.post(`/notify/read/${id}`),
    // 通用上傳
    uploadFile: (usage, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return request.post(`/files/upload/${usage}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    // 媒體上傳 token
    getUploadToken: (orderId, assetType) => request.post('/media/upload-token', null, { params: { orderId, assetType } }),
    // 區域與 Geocoder
    getAreasTree: () => request.get('/areas/tree'),
    geocodeAddress: (address) => request.get('/google/maps/geocode', { params: { address } }),
};
//# sourceMappingURL=index.js.map