import React, { useState } from 'react'
import {
  View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api'
import { radius, spacing, shadows, useColors, type AppColors } from '@/theme'
import Text from '@/components/Text'
import Button from '@/components/Button'
import { t } from '@/i18n'
import { haptics } from '@/utils/haptics'

export default function LoginScreen() {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const [empno, setEmpno] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState<'empno' | 'password' | null>(null)
  const { setAuth } = useAuthStore()

  const handleLogin = async () => {
    if (!empno.trim() || !password.trim()) {
      setError(t('auth.required'))
      haptics.warning()
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await authApi.login(empno.trim(), password)
      if (res.data) {
        const { token, userId, username, role, avatar } = res.data as {
          token: string; userId: number; username: string; role: string; avatar?: string
        }
        haptics.success()
        await setAuth(token, {
          userId,
          empno: empno.trim(),
          username,
          role,
          avatar: avatar || '',
        })
      } else {
        setError((res as { message?: string }).message || t('auth.loginError'))
        haptics.error()
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message
      setError(msg || t('auth.networkError'))
      haptics.error()
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.logoCircle}>
              <Ionicons name="camera" size={40} color={colors.white} />
            </View>
            <Text variant="display" color="primary" align="center">{t('auth.title')}</Text>
            <Text variant="body" muted align="center" style={styles.subtitle}>{t('auth.subtitle')}</Text>
          </View>

          <View style={styles.card}>
            <View style={[styles.inputWrap, focused === 'empno' && styles.inputFocused]}>
              <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.empno')}
                placeholderTextColor={colors.textSecondary}
                value={empno}
                onChangeText={setEmpno}
                onFocus={() => setFocused('empno')}
                onBlur={() => setFocused(null)}
                autoCapitalize="none"
                editable={!loading}
                accessibilityLabel={t('auth.empno')}
              />
            </View>

            <View style={[styles.inputWrap, focused === 'password' && styles.inputFocused]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.password')}
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                secureTextEntry={!showPassword}
                editable={!loading}
                accessibilityLabel={t('auth.password')}
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? '隱藏密碼' : '顯示密碼'}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text variant="bodySmall" color="danger" style={styles.flex}>{error}</Text>
              </View>
            ) : null}

            <Button
              label={t('auth.login')}
              onPress={handleLogin}
              loading={loading}
              size="lg"
              fullWidth
              style={styles.loginBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.xl },
  hero: { alignItems: 'center', marginBottom: spacing.xl },
  logoCircle: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  subtitle: { marginTop: spacing.xs },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.md,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceAlt,
  },
  inputFocused: { borderColor: colors.primary, backgroundColor: colors.surface },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: colors.textPrimary },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.dangerLight, padding: spacing.sm, borderRadius: radius.sm,
  },
  loginBtn: { marginTop: spacing.xs },
})
