import { useApi } from './request'

export const useContentApi = () => {
  const api = useApi()

  return {
    areaTree: () =>
      api.get('/areas/tree'),

    bannersByType: (type: string) =>
      api.get(`/banners/type/${type}`),

    newsOn: () =>
      api.get('/news/on'),

    faqs: () =>
      api.get('/faqs'),

    attractions: () =>
      api.get('/attractions'),

    instagram: () =>
      api.get('/instagram'),

    searchPlaces: (query: string, lang = 'zh-TW') =>
      api.get('/google/places/search', { params: { query, lang } }),
  }
}