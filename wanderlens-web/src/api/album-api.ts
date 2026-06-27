import { useApi } from './request'

export const useAlbumApi = () => {
  const api = useApi()

  return {
    myAlbums: () =>
      api.get('/albums'),

    getAlbum: (id: number) =>
      api.get(`/albums/${id}`),

    getPhotos: (id: number) =>
      api.get(`/albums/${id}/photos`),

    download: (albumId: number, mediaAssetId: number) =>
      api.post(`/albums/${albumId}/download`, null, { params: { mediaAssetId } }),

    share: (id: number) =>
      api.post(`/albums/${id}/share`),

    setConsent: (id: number, consumerConsent?: string, providerConsent?: string) =>
      api.put(`/albums/${id}/consent`, null, { params: { consumerConsent, providerConsent } }),

    revokeConsent: (id: number) =>
      api.post(`/albums/${id}/consent/revoke`),

    publicAlbums: () =>
      api.get('/albums/public'),

    locationAlbums: (location: string) =>
      api.get(`/albums/location/${location}`),

    // ── Phase 3 ──
    publicAlbumsByLocationAndType: (location: string, serviceTypeId: number) =>
      api.get(`/albums/public/location/${location}/type/${serviceTypeId}`),

    publicAlbumsByType: (serviceTypeId: number) =>
      api.get(`/albums/public/type/${serviceTypeId}`),

    publicAlbumsByLocation: (location: string) =>
      api.get(`/albums/location/${location}`),

    publicAlbumsByPhotographer: (photographerId: number) =>
      api.get(`/albums/public/photographer/${photographerId}`),

    albumsByYear: (year: number) =>
      api.get(`/albums/history/year/${year}`),

    albumsByLocationForUser: (location: string) =>
      api.get(`/albums/history/location/${location}`),

    albumsByServiceType: (serviceTypeId: number) =>
      api.get(`/albums/history/type/${serviceTypeId}`),

    favorite: (albumId: number, mediaAssetId: number) =>
      api.post(`/albums/${albumId}/favorite`, null, { params: { mediaAssetId } }),

    unfavorite: (albumId: number, mediaAssetId: number) =>
      api.delete(`/albums/${albumId}/favorite`, { params: { mediaAssetId } }),

    getFavorites: () =>
      api.get('/albums/favorites'),

    getConsent: (albumId: number) =>
      api.get(`/albums/${albumId}/consent`),

    setMultiLevelConsent: (albumId: number, consumerConsent?: string, providerConsent?: string, hasMinor?: boolean) =>
      api.put(`/albums/${albumId}/consent/multi`, null, { params: { consumerConsent, providerConsent, hasMinor } }),

    socialShare: (albumId: number, platform: string) =>
      api.post(`/albums/${albumId}/share/${platform}`),
  }
}

export const useConversationApi = () => {
  const api = useApi()

  return {
    myConversations: () =>
      api.get('/conversations'),

    getConversation: (id: number) =>
      api.get(`/conversations/${id}`),

    getMessages: (id: number, page = 1, size = 50) =>
      api.get(`/conversations/${id}/messages`, { params: { page, size } }),

    sendMessage: (id: number, content: string) =>
      api.post(`/conversations/${id}/messages`, { content }),

    sendImage: (id: number, imageUrl: string) =>
      api.post(`/conversations/${id}/messages/image`, null, { params: { imageUrl } }),

    markAsRead: (id: number) =>
      api.post(`/conversations/${id}/read`),

    openCustomerService: (content?: string) =>
      api.post('/conversations/customer-service', content ? { content } : {}),

    uploadImage: (id: number, file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return api.post(`/conversations/${id}/messages/image-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },

    getOrderConversation: (orderId: number, providerId?: number) =>
      api.get(`/conversations/order/${orderId}`, { params: providerId ? { providerId } : {} }),
  }
}