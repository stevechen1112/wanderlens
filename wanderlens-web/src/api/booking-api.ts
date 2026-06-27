import { useApi } from './request'

export interface SearchMultiPoolPayload {
  serviceTypeId: number
  shootingDate: string
  timeStart: string
  timeEnd: string
  city?: string
  lat?: number
  lng?: number
  configurationId?: number | null
  photographerCount?: number
  needStylist?: boolean
  excludePhotographerId?: number
  adultNum?: number
  childNum?: number
}

export interface PlacePrediction {
  place_id: string
  name: string
  formatted_address?: string
  geometry?: {
    location: { lat: number; lng: number }
  }
}

const parseGooglePayload = (raw: unknown): Record<string, unknown> => {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as Record<string, unknown>
    } catch {
      return {}
    }
  }
  if (raw && typeof raw === 'object') return raw as Record<string, unknown>
  return {}
}

export const useBookingApi = () => {
  const api = useApi()

  return {
    getServiceTypes: () =>
      api.get('/search/service-types'),

    getSuggestedConfig: (id: number) =>
      api.get(`/search/service-types/${id}/suggested-config`),

    getConfigurations: () =>
      api.get('/search/configurations'),

    searchProviders: (data: SearchMultiPoolPayload) =>
      api.post('/search/providers', data),

    searchMultiPool: (data: SearchMultiPoolPayload) =>
      api.post('/search/multi-pool', data),

    autocompletePlaces: async (query: string, lang = 'zh-TW'): Promise<PlacePrediction[]> => {
      const res: any = await api.get('/google/places/search', { params: { query, lang } })
      const payload = parseGooglePayload(res?.data)
      const results = (payload.results as PlacePrediction[] | undefined) || []
      return results.slice(0, 8)
    },

    geocode: (address: string) =>
      api.get('/google/maps/geocode', { params: { address } }),

    lockSlot: (availabilityId: number, orderId: number) =>
      api.post('/search/booking/lock', null, { params: { availabilityId, orderId } }),

    unlockSlot: (availabilityId: number) =>
      api.post('/search/booking/unlock', null, { params: { availabilityId } }),
  }
}
