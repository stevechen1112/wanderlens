import React, { useEffect, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'
import RootNavigator from '@/navigation/RootNavigator'
import LoginScreen from '@/screens/auth/LoginScreen'
import { useAuthStore } from '@/stores/authStore'
import { registerPushNotifications } from '@/hooks/usePushNotifications'
import * as secureStorage from '@/utils/secureStorage'
import { LocaleProvider, restoreLocale, setLocaleModule } from '@/i18n'
import { ThemeProvider, useTheme } from '@/theme'
import ErrorBoundary from '@/components/ErrorBoundary'

function AppInner() {
  const { isAuthenticated, isLoading, restoreAuth } = useAuthStore()
  const [localeReady, setLocaleReady] = useState(false)
  const pushRegisteredRef = useRef(false)
  const { scheme, colors } = useTheme()

  useEffect(() => {
    restoreAuth()
    restoreLocale().then((loc) => {
      setLocaleModule(loc)
      setLocaleReady(true)
    })
  }, [])

  useEffect(() => {
    // 登入且已認證後，於 App 層一次性註冊推播；讀取使用者偏好 wl_push_enabled（預設啟用，僅 '0' 視為關閉）
    if (!isAuthenticated) {
      pushRegisteredRef.current = false
      return
    }
    if (pushRegisteredRef.current) return
    pushRegisteredRef.current = true
    secureStorage.getItemAsync('wl_push_enabled').then((v) => {
      if (v === '0') return
      registerPushNotifications('CONSUMER').catch(() => {})
    })
  }, [isAuthenticated])

  const statusBarStyle = scheme === 'dark' ? 'light' : 'dark'

  if (isLoading || !localeReady) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <StatusBar style={statusBarStyle} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <LocaleProvider>
      <StatusBar style={statusBarStyle} />
      {isAuthenticated ? <RootNavigator /> : <LoginScreen />}
    </LocaleProvider>
  )
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider>
        <ErrorBoundary>
          <AppInner />
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
