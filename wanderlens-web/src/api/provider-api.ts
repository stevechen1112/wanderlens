import { useApi } from './request'

export const useProviderApi = () => {
  const api = useApi()

  return {
    getPublicProfile: (uuid: string) =>
      api.get(`/providers/info/${uuid}/profile`),

    getInfo: (uuid: string) =>
      api.get(`/providers/info/${uuid}`),

    getWorks: (uuid: string) =>
      api.get(`/providers/info/${uuid}/works`),

    getRatings: (providerId?: number, page = 1, size = 10) =>
      api.get('/providers/ratings', { params: { providerId, page, size } }),

    submitRating: (data: {
      orderId: number
      providerId: number
      stars: number
      comments?: string
    }) =>
      api.post('/providers/ratings', data),
  }
}