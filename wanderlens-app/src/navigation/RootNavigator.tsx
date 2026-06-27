import React from 'react'
import {
  NavigationContainer,
  createNavigationContainerRef,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from '@/navigation/TabNavigator'
import PaymentWebViewScreen from '@/screens/payment/PaymentWebViewScreen'
import InstantShootScreen from '@/screens/instant/InstantShootScreen'
import { useNotificationNavigation } from '@/hooks/useNotificationNavigation'
import { useTheme } from '@/theme'

export type RootStackParamList = {
  MainTabs: undefined
  InstantShoot: undefined
  PaymentWebView: {
    paymentForm?: string
    orderId?: number
    amount?: number
    title?: string
    successRoute?: string
  }
}

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

const Stack = createNativeStackNavigator<RootStackParamList>()

function NavigationRoot() {
  // 推播註冊已上移至 App 層（依 isAuthenticated 一次性註冊），此處僅處理通知導航
  useNotificationNavigation({ current: navigationRef }, true)
  const { scheme, colors } = useTheme()

  const navTheme = scheme === 'dark'
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.background, card: colors.surface, text: colors.textPrimary, border: colors.border, primary: colors.primary } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.background, card: colors.surface, text: colors.textPrimary, border: colors.border, primary: colors.primary } }

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="InstantShoot" component={InstantShootScreen} />
        <Stack.Screen
          name="PaymentWebView"
          component={PaymentWebViewScreen}
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function RootNavigator() {
  return <NavigationRoot />
}
