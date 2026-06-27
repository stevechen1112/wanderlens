import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RootNavigator from '@/navigation/RootNavigator'
import LoginScreen from '@/screens/auth/LoginScreen'
import { useAuthStore } from '@/stores/authStore'
import { ThemeProvider, useTheme } from '@/theme'
import { LocaleProvider, restoreLocale, setLocaleModule } from '@/i18n'
import { registerPushNotifications } from '@/hooks/usePushNotifications'
import ErrorBoundary from '@/components/ErrorBoundary'

function AppInner() {
  const { isAuthenticated, isLoading, restoreAuth } = useAuthStore()
  const [localeReady, setLocaleReady] = useState(false)
  const { scheme, colors } = useTheme()

  useEffect(() => {
    restoreAuth()
    restoreLocale().then((loc) => {
      setLocaleModule(loc)
      setLocaleReady(true)
    })
  }, [restoreAuth])

  useEffect(() => {
    if (isAuthenticated) {
      registerPushNotifications().catch(() => {})
    }
  }, [isAuthenticated])

  const statusBarStyle = scheme === 'dark' ? 'light' : 'dark'

  if (isLoading || !localeReady) {
    return (
      <SafeAreaProvider>
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <StatusBar style={statusBarStyle} />
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <LocaleProvider>
        <StatusBar style={statusBarStyle} />
        {isAuthenticated ? <RootNavigator /> : <LoginScreen />}
      </LocaleProvider>
    </SafeAreaProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppInner />
      </ErrorBoundary>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
