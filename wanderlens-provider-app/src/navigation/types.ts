export type OrderStackParamList = {
  OrderList: undefined
  OrderDetail: { orderId: number }
}

export type ConversationStackParamList = {
  ConversationList: undefined
  ConversationRoom: { id: number; title?: string }
}

export type ProfileStackParamList = {
  ProfileMain: undefined
  AccountHub: undefined
  BasicInfo: undefined
  Features: undefined
  Works: undefined
  ServiceArea: undefined
  BankInfo: undefined
  Rating: undefined
  Notifications: undefined
}

export type HomeStackParamList = {
  HomeMain: undefined
  OrderDetail: { orderId: number }
}

export type TabParamList = {
  Home: undefined
  Schedule: undefined
  Orders: undefined
  Messages: undefined
  Earnings: undefined
  Profile: undefined
}

export type RootStackParamList = {
  MainTabs: undefined
}
