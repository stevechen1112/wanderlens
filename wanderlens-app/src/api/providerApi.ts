import client from './client'

export interface ProviderPublicProfile {
  provider: {
    id: number
    providerUuid: string
    nickName?: string
    name?: string
    city?: string
    districtName?: string
    intro?: string
    avatar?: string
    bannerImg?: string
    rating?: number
    career?: string
    experience?: number
    unitPrice?: number
    serviceItem?: string
  }
  serviceTypes?: Array<{ id: number; name: string }>
  serviceAreaNames?: string[]
  features?: Array<{
    id: number
    featureType: string
    featureContent: string
    language?: string
  }>
  works?: Array<{ id: number; imageUrl?: string }>
  ratingSummary?: {
    averageRating?: number
    totalCount?: number
  }
}

export const providerApi = {
  getPublicProfile: (uuid: string) =>
    client.get(`/providers/info/${uuid}/profile`) as Promise<{ data: ProviderPublicProfile }>,
}
