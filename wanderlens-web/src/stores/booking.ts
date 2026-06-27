import { defineStore } from 'pinia'

export interface BookingData {
  photographerId: number | null
  photographerUuid: string
  photographerName: string
  secondPhotographerId: number | null
  secondPhotographerUuid: string
  secondPhotographerName: string
  secondAvailabilityId: number | null
  secondUnitPrice: number
  secondTransportationFee: number
  stylistId: number | null
  stylistName: string
  studioId: number | null
  studioName: string
  serviceTypeId: number | null
  configurationId: number | null
  shootLocation: string
  photographerCount: number
  needStylist: boolean
  shootingDate: string
  shootingTime: string
  shootingDuration: number
  shootingLocation: string
  shootingLat: number | null
  shootingLng: number | null
  adultNum: number
  childNum: number
  availabilityId: number | null
  unitPrice: number
  transportationFee: number
  studioFee: number
  stylistFee: number
  totalFee: number
}

const defaultData = (): BookingData => ({
  photographerId: null,
  photographerUuid: '',
  photographerName: '',
  secondPhotographerId: null,
  secondPhotographerUuid: '',
  secondPhotographerName: '',
  secondAvailabilityId: null,
  secondUnitPrice: 0,
  secondTransportationFee: 0,
  stylistId: null,
  stylistName: '',
  studioId: null,
  studioName: '',
  serviceTypeId: null,
  configurationId: null,
  shootLocation: 'OUTDOOR',
  photographerCount: 1,
  needStylist: false,
  shootingDate: '',
  shootingTime: '',
  shootingDuration: 1,
  shootingLocation: '',
  shootingLat: null,
  shootingLng: null,
  adultNum: 1,
  childNum: 0,
  availabilityId: null,
  unitPrice: 800,
  transportationFee: 0,
  studioFee: 0,
  stylistFee: 0,
  totalFee: 800,
})

export const useBookingStore = defineStore('booking', {
  state: () => ({
    currentStep: 1,
    data: defaultData(),
  }),

  getters: {
    totalFee: (state) => state.data.totalFee,
    needStudio: (state) =>
      state.data.shootLocation === 'STUDIO' || state.data.shootLocation === 'BOTH',
  },

  actions: {
    setStep(step: number) {
      this.currentStep = step
    },

    setData(data: Partial<BookingData>) {
      this.data = { ...this.data, ...data }
      this.calculateTotal()
    },

    calculateTotal() {
      const duration = this.data.shootingDuration
      const primaryFee = this.data.unitPrice * duration
      const secondFee =
        this.data.photographerCount >= 2 && this.data.secondPhotographerId
          ? this.data.secondUnitPrice * duration + (this.data.secondTransportationFee || 0)
          : 0

      this.data.totalFee =
        primaryFee +
        secondFee +
        this.data.transportationFee +
        (this.data.studioFee || 0) +
        (this.data.stylistFee || 0)
    },

    reset() {
      this.currentStep = 1
      this.data = defaultData()
    },
  },
})
