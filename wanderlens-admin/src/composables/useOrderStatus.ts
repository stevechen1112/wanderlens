import { useI18n } from 'vue-i18n'

type ElTagType = 'success' | 'primary' | 'warning' | 'info' | 'danger' | undefined

const TAG_TYPE_MAP: Record<string, ElTagType> = {
  PendingPayment: 'warning',
  Paid: 'success',
  WaitingProviderContact: 'warning',
  UploadingRaw: 'info',
  AiProcessing: 'info',
  Delivered: 'success',
  Closed: 'success',
  Cancelled: 'danger',
  Disputed: 'danger',
  Refunded: 'info',
}

export function useOrderStatus() {
  const { t } = useI18n()

  const statusLabel = (status: string) => t(`order.status.${status}`, status)

  const statusTagType = (status: string): ElTagType => TAG_TYPE_MAP[status] || 'info'

  return { statusLabel, statusTagType }
}
