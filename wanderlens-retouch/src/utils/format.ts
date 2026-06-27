import dayjs from 'dayjs'

export function formatDate(date: string, format = 'YYYY-MM-DD HH:mm') {
  return dayjs(date).format(format)
}

export function formatPrice(amount: number) {
  return `$${amount.toLocaleString()}`
}