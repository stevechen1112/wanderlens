<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="md:col-span-2 space-y-4">
      <h2 class="text-xl font-bold">{{ $t('checkout.title') }}</h2>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-semibold mb-1 block">{{ $t('checkout.name') }} *</label>
          <input v-model="form.customerName" type="text" class="wl-input" />
        </div>
        <div>
          <label class="text-sm font-semibold mb-1 block">{{ $t('checkout.phone') }} *</label>
          <input v-model="form.customerPhone" type="tel" class="wl-input" />
        </div>
      </div>

      <div>
        <label class="text-sm font-semibold mb-1 block">{{ $t('checkout.email') }}</label>
        <input v-model="form.email" type="email" class="wl-input" />
      </div>

      <div>
        <label class="text-sm font-semibold mb-1 block">{{ $t('checkout.contactTime') }}</label>
        <input v-model="form.contactTime" type="text" :placeholder="$t('checkout.contactTimePlaceholder')" class="wl-input" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-semibold mb-1 block">{{ $t('checkout.social') }}</label>
          <select v-model="form.social" class="wl-input">
            <option value="">{{ $t('checkout.socialNone') }}</option>
            <option value="LINE">LINE</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="WeChat">WeChat</option>
            <option value="Phone">{{ $t('checkout.phone') }}</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-semibold mb-1 block">{{ $t('checkout.socialAccount') }}</label>
          <input v-model="form.socialAccount" type="text" :placeholder="$t('checkout.socialAccountPlaceholder')" class="wl-input" />
        </div>
      </div>

      <div>
        <label class="text-sm font-semibold mb-1 block">{{ $t('checkout.customerCity') }}</label>
        <select v-model="form.customerCity" class="wl-input">
          <option value="taiwan">{{ $t('checkout.cityTaiwan') }}</option>
          <option value="overseas">{{ $t('checkout.cityOverseas') }}</option>
        </select>
      </div>

      <div>
        <label class="text-sm font-semibold mb-1 block">{{ $t('checkout.remark') }}</label>
        <textarea v-model="form.remark" rows="3" :placeholder="$t('checkout.remarkPlaceholder')" class="wl-input"></textarea>
      </div>

      <div>
        <label class="text-sm font-semibold mb-1 block">{{ $t('checkout.coupon') }}</label>
        <div class="flex gap-2">
          <input v-model="couponCode" type="text" class="flex-1 wl-input" />
          <button type="button" class="wl-btn-secondary" @click="applyCoupon">{{ $t('checkout.apply') }}</button>
        </div>
      </div>
    </div>

    <div class="wl-surface rounded-lg p-6 h-fit">
      <h3 class="font-semibold mb-4">{{ $t('checkout.summary') }}</h3>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-text-secondary">{{ $t('checkout.serviceFee') }}（{{ bookingStore.data.shootingDuration }}hr）</span>
          <span>${{ bookingStore.data.unitPrice * bookingStore.data.shootingDuration }}</span>
        </div>
        <div v-if="bookingStore.data.secondPhotographerId" class="flex justify-between">
          <span class="text-text-secondary">{{ $t('checkout.secondPhotographer') }}（{{ bookingStore.data.shootingDuration }}hr）</span>
          <span>${{ bookingStore.data.secondUnitPrice * bookingStore.data.shootingDuration }}</span>
        </div>
        <div v-if="bookingStore.data.transportationFee || bookingStore.data.secondTransportationFee" class="flex justify-between">
          <span class="text-text-secondary">{{ $t('checkout.transportation') }}</span>
          <span>${{ bookingStore.data.transportationFee + (bookingStore.data.secondTransportationFee || 0) }}</span>
        </div>
        <div v-if="bookingStore.data.studioFee" class="flex justify-between">
          <span class="text-text-secondary">{{ $t('checkout.studioFee') }}</span>
          <span>${{ bookingStore.data.studioFee }}</span>
        </div>
        <div v-if="bookingStore.data.stylistFee" class="flex justify-between">
          <span class="text-text-secondary">{{ $t('checkout.stylistFee') }}</span>
          <span>${{ bookingStore.data.stylistFee }}</span>
        </div>
        <div v-if="discount > 0" class="flex justify-between text-danger">
          <span>{{ $t('checkout.discount') }}</span>
          <span>-${{ discount }}</span>
        </div>
        <hr class="border-border" />
        <div class="flex justify-between font-bold text-lg">
          <span>{{ $t('booking.total') }}</span>
          <span class="text-primary">${{ total }}</span>
        </div>
      </div>

      <div class="mt-4 p-3 bg-bg rounded-lg text-xs text-text-secondary space-y-1">
        <p>{{ $t('checkout.policyTitle') }}</p>
        <p>{{ $t('checkout.policy1') }}</p>
        <p>{{ $t('checkout.policy2') }}</p>
        <p>{{ $t('checkout.policy3') }}</p>
      </div>

      <button type="button" class="wl-btn-primary w-full mt-4" :disabled="submitting" @click="submitOrder">
        {{ submitting ? $t('common.processing') : $t('checkout.pay') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookingStore } from '~/stores/booking'
import { useOrderApi, usePaymentApi } from '~/api/order-api'
import { useToast } from '~/composables/useToast'

const { t } = useI18n()
const toast = useToast()

const emit = defineEmits<{ completed: [orderId: number] }>()
const bookingStore = useBookingStore()
const orderApi = useOrderApi()
const paymentApi = usePaymentApi()

const form = reactive({
  customerName: '',
  customerPhone: '',
  email: '',
  contactTime: '',
  social: '',
  socialAccount: '',
  customerCity: 'taiwan',
  remark: '',
})
const couponCode = ref('')
const discount = ref(0)
const submitting = ref(false)
const createdOrderNo = ref('')
const total = computed(() => bookingStore.totalFee - discount.value)

const applyCoupon = async () => {
  if (!couponCode.value) return
  if (!createdOrderNo.value) {
    toast.warning(t('checkout.couponNeedOrder'))
    return
  }
  try {
    const res: any = await paymentApi.applyCoupon(createdOrderNo.value, couponCode.value)
    if (res.data?.valid) {
      discount.value = res.data.discount
      toast.success(t('checkout.couponSuccess'))
    } else {
      toast.error(res.data?.message || t('checkout.couponInvalid'))
    }
  } catch (err: any) {
    toast.error(err?.response?.data?.message || t('checkout.couponError'))
  }
}

const submitOrder = async () => {
  if (!form.customerName || !form.customerPhone) return
  if (!bookingStore.data.photographerId || !bookingStore.data.serviceTypeId || !bookingStore.data.configurationId) {
    toast.warning(t('checkout.incompleteBooking'))
    return
  }
  submitting.value = true
  try {
    const res: any = await orderApi.create({
      photographerId: bookingStore.data.photographerId,
      secondPhotographerId: bookingStore.data.secondPhotographerId,
      stylistId: bookingStore.data.stylistId,
      studioId: bookingStore.data.studioId,
      serviceTypeId: bookingStore.data.serviceTypeId,
      configurationId: bookingStore.data.configurationId,
      shootingDate: bookingStore.data.shootingDate,
      shootingTime: bookingStore.data.shootingTime,
      shootingDuration: bookingStore.data.shootingDuration,
      shootingLocation: bookingStore.data.shootingLocation,
      adultNum: bookingStore.data.adultNum,
      childNum: bookingStore.data.childNum,
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      email: form.email || undefined,
      remark: form.remark || undefined,
      couponCode: couponCode.value || undefined,
      availabilityId: bookingStore.data.availabilityId,
      secondAvailabilityId: bookingStore.data.secondAvailabilityId,
    })
    const orderId = res.data?.id
    if (orderId) {
      createdOrderNo.value = res.data?.orderNo || ''
      const payRes: any = await paymentApi.ecpayCheckout(orderId)
      const parser = new DOMParser()
      const doc = parser.parseFromString(payRes.data, 'text/html')
      const formEl = doc.querySelector('form')
      if (formEl) {
        const newForm = document.createElement('form')
        newForm.action = formEl.action
        newForm.method = formEl.method || 'POST'
        formEl.querySelectorAll('input').forEach((input: HTMLInputElement) => {
          const newInput = document.createElement('input')
          newInput.type = input.type
          newInput.name = input.name
          newInput.value = input.value
          newForm.appendChild(newInput)
        })
        document.body.appendChild(newForm)
        newForm.submit()
      } else {
        submitting.value = false
        toast.error(t('checkout.paymentFormError'))
      }
    }
  } catch {
    submitting.value = false
  }
}
</script>
