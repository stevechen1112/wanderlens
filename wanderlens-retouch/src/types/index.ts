// WanderLens Retouch 型別定義

export interface RetouchJob {
  id: number
  orderId: number
  consumerId: number
  mediaAssetIds: string
  retouchCompanyId: number
  status: string
  spec: string
  fee: number
  deliveryDeadline: string
  createdAt: string
}