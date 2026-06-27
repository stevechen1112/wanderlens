import { colors } from '@/theme/colors'

export const STATUS_LABELS: Record<string, string> = {
  Draft: '草稿',
  PendingPayment: '待付款',
  Paid: '已付款',
  WaitingProviderContact: '待聯繫',
  Confirmed: '已確認',
  ReadyToShoot: '待拍攝',
  ShootingStarted: '拍攝中',
  ShootingEnded: '拍攝結束',
  UploadingRaw: '上傳中',
  AiProcessing: 'AI處理中',
  Delivered: '已交付',
  Cancelled: '已取消',
  Closed: '已結案',
  Refunded: '已退款',
  Disputed: '爭議中',
  Rescheduled: '已改期',
}

export const STATUS_COLORS: Record<string, string> = {
  PendingPayment: colors.warning,
  Paid: colors.success,
  WaitingProviderContact: colors.warning,
  Confirmed: colors.secondary,
  ReadyToShoot: colors.primary,
  ShootingStarted: colors.primary,
  ShootingEnded: colors.secondary,
  Delivered: colors.success,
  Cancelled: colors.textSecondary,
  Closed: colors.textSecondary,
  Refunded: colors.textSecondary,
  Disputed: colors.danger,
}

export const ACTIVE_ORDER_STATUSES = [
  'WaitingProviderContact',
  'Confirmed',
  'ReadyToShoot',
  'ShootingStarted',
  'ShootingEnded',
  'UploadingRaw',
  'AiProcessing',
]

export const PENDING_TASK_STATUSES = ['WaitingProviderContact', 'ReadyToShoot', 'Paid', 'Confirmed']
