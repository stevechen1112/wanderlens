import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColors, type AppColors, spacing } from '@/theme'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryInner extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info?.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return <ErrorFallback error={this.state.error} onReset={this.handleReset} />
  }
}

function ErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  const colors = useColors()
  const styles = makeStyles(colors)

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <View style={styles.iconBg} />
        <Ionicons name="warning-outline" size={48} color={colors.danger} />
      </View>
      <Text style={styles.title}>發生非預期錯誤</Text>
      <Text style={styles.subtitle}>App 遇到問題需要重新載入</Text>

      {__DEV__ && error ? (
        <ScrollView style={styles.errorScroll} contentContainerStyle={styles.errorContent}>
          <Text style={styles.errorText}>{error.message}</Text>
          {error.stack ? <Text style={styles.errorStack}>{error.stack}</Text> : null}
        </ScrollView>
      ) : null}

      <TouchableOpacity style={styles.btn} onPress={onReset} accessibilityRole="button" accessibilityLabel="重新載入">
        <Ionicons name="refresh-outline" size={18} color={colors.white} />
        <Text style={styles.btnText}>重新載入</Text>
      </TouchableOpacity>
    </View>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.background, padding: spacing.xl,
  },
  iconWrap: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
  iconBg: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.dangerLight,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' },
  errorScroll: {
    marginTop: spacing.lg, maxHeight: 200, width: '100%',
    backgroundColor: colors.surfaceAlt, borderRadius: 12,
  },
  errorContent: { padding: 12 },
  errorText: { fontSize: 13, color: colors.danger, fontWeight: '600' },
  errorStack: { fontSize: 11, color: colors.textSecondary, marginTop: 8 },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 12, marginTop: spacing.xl,
  },
  btnText: { fontSize: 16, fontWeight: '600', color: colors.white },
})

export default function ErrorBoundary({ children }: Props) {
  return <ErrorBoundaryInner>{children}</ErrorBoundaryInner>
}