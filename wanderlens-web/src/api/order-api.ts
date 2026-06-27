import { useApi } from './request'

export const useOrderApi = () => {
  const api = useApi()

  return {
    create: (data: any) =>
      api.post('/orders', data),

    getById: (id: number) =>
      api.get(`/orders/${id}`),

    getByTradeNo: (tradeNo: string) =>
      api.get(`/orders/by-trade-no/${encodeURIComponent(tradeNo)}`),

    myOrders: (page?: number, size = 10) =>
      api.get('/orders/my', { params: page ? { page, size } : {} }),

    providerOrders: () =>
      api.get('/orders/provider'),

    cancel: (orderId: number, reason: string) =>
      api.post('/orders/cancel', null, { params: { orderId, reason } }),

    history: (orderId: number) =>
      api.get(`/orders/${orderId}/history`),
  }
}

export const usePaymentApi = () => {
  const api = useApi()

  return {
    ecpayCheckout: (orderId: number) =>
      api.get(`/payment/ecpay/checkout/${orderId}`),

    checkPayment: (orderNo: string) =>
      api.get(`/payment/check/${orderNo}`),

    applyCoupon: (orderNo: string, couponCode: string) =>
      api.post('/coupons/apply', { orderNo, couponCode }),
  }
}