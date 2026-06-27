import { defineStore } from 'pinia'

export interface SearchCondition {
  serviceTypeId: number | null
  shootingDate: string
  timeStart: string
  timeEnd: string
  city: string
  areaId: number | null
  lat: number | null
  lng: number | null
  shootingDuration: number
  adultNum: number
  childNum: number
  petInfo: string
}

export const useSearchStore = defineStore('search', {
  state: () => ({
    condition: {
      serviceTypeId: null,
      shootingDate: '',
      timeStart: '',
      timeEnd: '',
      city: '',
      areaId: null,
      lat: null,
      lng: null,
      shootingDuration: 1,
      adultNum: 1,
      childNum: 0,
      petInfo: '',
    } as SearchCondition,
  }),

  actions: {
    setCondition(condition: Partial<SearchCondition>) {
      this.condition = { ...this.condition, ...condition }
    },

    clearCondition() {
      this.condition = {
        serviceTypeId: null,
        shootingDate: '',
        timeStart: '',
        timeEnd: '',
        city: '',
        areaId: null,
        lat: null,
        lng: null,
        shootingDuration: 1,
        adultNum: 1,
        childNum: 0,
        petInfo: '',
      }
    },
  },
})