import { Platform } from 'react-native'

const ECPAY_HOSTS = ['ecpay.com.tw', 'payment-stage.ecpay.com.tw']

/** Expo Web：解析 HTML form 並 submit 至綠界（與 wanderlens-web CheckoutForm 相同） */
export function submitEcpayFormOnWeb(paymentForm: string): boolean {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return false
  }
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(paymentForm, 'text/html')
    const formEl = doc.querySelector('form')
    if (!formEl) return false

    const newForm = document.createElement('form')
    newForm.action = formEl.action
    newForm.method = formEl.method || 'POST'
    newForm.style.display = 'none'
    formEl.querySelectorAll('input').forEach((input) => {
      const el = document.createElement('input')
      el.type = input.type || 'hidden'
      el.name = input.name
      el.value = input.value
      newForm.appendChild(el)
    })
    document.body.appendChild(newForm)
    newForm.submit()
    return true
  } catch {
    return false
  }
}

export function isEcpayPaymentUrl(url: string): boolean {
  if (!url) return false
  const lower = url.toLowerCase()
  return ECPAY_HOSTS.some((h) => lower.includes(h))
}

export function isPaymentCompleteUrl(url: string): boolean {
  if (!url) return false
  const lower = url.toLowerCase()
  return lower.includes('thankyou')
    || lower.includes('payment-success')
    || lower.includes('/orders')
}
