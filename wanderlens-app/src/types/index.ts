// WanderLens App 型別定義

export interface User {
  userId: number
  empno: string
  username: string
  role: string
  avatar: string
}

export interface Album {
  id: number
  orderId: number
  consumerId: number
  photographerId: number
  title: string
  shootDate: string
  shootLocation: string
  city: string
  serviceTypeId: number
  albumType: string
}

export interface MediaAsset {
  id: number
  albumId: number
  orderId: number
  assetType: string
  fileUrl: string
  previewUrl: string
  thumbnailUrl: string
  status: string
}

export interface Conversation {
  id: number
  conversationType: string
  orderId: number
  status: string
}

export interface Message {
  id: number
  conversationId: number
  senderId: number
  messageType: string
  content: string
  imageUrl: string
  isRead: boolean
  createdAt: string
}